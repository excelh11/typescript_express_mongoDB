# TypeScript Express + MongoDB 웹 서비스

React SPA 프론트엔드와 Node.js/Express 백엔드, MongoDB(Mongoose)를 사용한 풀스택 웹 서비스입니다.

---

## 기술 스택


| 구분           | 기술                                           |
| ------------ | -------------------------------------------- |
| **Frontend** | React, TypeScript, Vite, React Router, Axios |
| **Backend**  | Node.js, Express, TypeScript                 |
| **DB**       | MongoDB, Mongoose                            |
| **인증**       | JWT, bcrypt                                  |
| **배포**       | AWS (Elastic Beanstalk + S3), Netlify(선택)    |


---

## 프로젝트 구조

```
deploy/
├── backend/                 # API 서버
│   ├── src/
│   │   ├── config/         # DB 연결
│   │   ├── controllers/    # 비즈니스 로직
│   │   ├── middleware/     # 인증 미들웨어
│   │   ├── models/         # Mongoose 스키마
│   │   ├── routes/         # 라우터
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/                # React SPA
│   ├── src/
│   │   ├── api/            # API 클라이언트
│   │   ├── components/     # 공통 컴포넌트
│   │   ├── context/        # 전역 상태 (Auth)
│   │   ├── pages/          # 페이지 컴포넌트
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

---

# Backend 구조 및 플로우

## 1. 진입점 및 앱 구성

- **server.ts**: `dotenv` 로드 → `connectDB()` → `http.createServer(app)` → `listen(PORT)`
- **app.ts**: CORS, `express.json()`, `GET /health`, `app.use("/api", routes)`
- **routes/index.ts**: `/api/auth`, `/api/products`, `/api/videos` 로 라우터 분기

## 2. 구조 다이어그램 (Backend)

```mermaid
flowchart TB
    subgraph Entry["진입점"]
        A[server.ts] --> B[config/db.ts connectDB]
        A --> C[app.ts]
    end

    subgraph App["Express 앱"]
        C --> D[cors]
        C --> E[express.json]
        C --> F[GET /health]
        C --> G["/api → routes"]
    end

    subgraph Routes["라우터"]
        G --> H["/auth → authRouter"]
        G --> I["/products → productRouter"]
        G --> J["/videos → videoRouter"]
    end

    subgraph Auth["인증 API"]
        H --> K["POST /register → register"]
        H --> L["POST /login → login"]
        K --> M[auth.controller]
        L --> M
        M --> N[User Model]
    end

    subgraph Products["상품 API (Private)"]
        I --> O[authMiddleware]
        O --> P[productRouter]
        P --> Q[createProduct]
        P --> R[getProducts]
        P --> S[updateProduct]
        P --> T[deleteProduct]
        Q --> U[product.controller]
        R --> U
        S --> U
        T --> U
        U --> V[Product Model]
    end

    subgraph Videos["비디오 API"]
        J --> W["POST / → authMiddleware → createVideo"]
        J --> X["GET /search → searchVideos"]
        W --> Y[video.controller]
        X --> Y
        Y --> Z[Video Model]
    end

    subgraph DB["데이터"]
        N --> DB[(MongoDB)]
        V --> DB
        Z --> DB
    end
```



## 3. Backend 호출 관계 요약


| 경로                       | Route         | Middleware     | Controller                        | Model   |
| ------------------------ | ------------- | -------------- | --------------------------------- | ------- |
| POST /api/auth/register  | auth.route    | -              | auth.controller.register          | User    |
| POST /api/auth/login     | auth.route    | -              | auth.controller.login             | User    |
| POST /api/products       | product.route | authMiddleware | product.controller.createProduct  | Product |
| GET /api/products        | product.route | authMiddleware | product.controller.getProducts    | Product |
| GET /api/products/:id    | product.route | authMiddleware | product.controller.getProductById | Product |
| PUT /api/products/:id    | product.route | authMiddleware | product.controller.updateProduct  | Product |
| DELETE /api/products/:id | product.route | authMiddleware | product.controller.deleteProduct  | Product |
| POST /api/videos         | video.route   | authMiddleware | video.controller.createVideo      | Video   |
| GET /api/videos/search   | video.route   | -              | video.controller.searchVideos     | Video   |


## 4. Backend 시퀀스 (로그인 예시)

```mermaid
sequenceDiagram
    participant Client
    participant app
    participant authRouter
    participant authController
    participant User
    participant bcrypt
    participant jwt
    participant MongoDB

    Client->>app: POST /api/auth/login
    app->>authRouter: POST /login
    authRouter->>authController: login(req, res)
    authController->>User: findOne({ email })
    User->>MongoDB: query
    MongoDB-->>authController: user
    authController->>bcrypt: compare(password, user.password)
    bcrypt-->>authController: true/false
    authController->>jwt: sign({ userId, email, role })
    jwt-->>authController: token
    authController-->>Client: { token, user }
```



---

# Frontend 구조 및 플로우

## 1. 진입점 및 앱 구성

- **main.tsx**: `createRoot` → `App` 렌더링, `index.css` 로드
- **App.tsx**: `AuthProvider`로 감싼 뒤 `BrowserRouter` + `Routes` 설정
- **라우트**: `/login`, `/register`는 공개, `/`, `/products`, `/videos`는 `PrivateRoute`로 보호

## 2. 구조 다이어그램 (Frontend)

```mermaid
flowchart TB
    subgraph Entry["진입점"]
        A[index.html] --> B[main.tsx]
        B --> C[App.tsx]
    end

    subgraph App["앱 루트"]
        C --> D[AuthProvider]
        D --> E[BrowserRouter]
        E --> F[Routes]
    end

    subgraph Routes["라우팅"]
        F --> G["/login → Login"]
        F --> H["/register → Register"]
        F --> I["/ → Navigate to /products"]
        F --> J[PrivateRoute]
        J --> K["/products → Products"]
        J --> L["/videos → VideoSearch"]
    end

    subgraph PrivateRoute["PrivateRoute"]
        J --> M[useAuth]
        M --> N{token?}
        N -->|없음| O[Navigate to /login]
        N -->|있음| P[Outlet → 자식 라우트]
    end

    subgraph Auth["인증 컨텍스트"]
        D --> Q[AuthContext]
        Q --> R[user, token, login, logout, isReady]
        R --> G
        R --> H
        R --> J
        R --> K
    end

    subgraph Pages["페이지"]
        G --> S[Login.tsx]
        H --> T[Register.tsx]
        K --> U[Products.tsx]
        L --> V[VideoSearch.tsx]
    end

    subgraph API["API 레이어"]
        S --> W[api/client.ts]
        T --> W
        U --> W
        V --> W
        W --> X[auth.ts]
        W --> Y[product.ts]
        W --> Z[video.ts]
    end

    subgraph Backend["백엔드"]
        X --> BE[(Express API)]
        Y --> BE
        Z --> BE
    end
```



## 3. Frontend 파일별 역할


| 파일/폴더                       | 역할                               |
| --------------------------- | -------------------------------- |
| main.tsx                    | React 마운트, App 렌더링               |
| App.tsx                     | AuthProvider, Router, Route 정의   |
| context/AuthContext.tsx     | 로그인 상태, login/logout, token 보관   |
| components/PrivateRoute.tsx | token 없으면 /login으로 리다이렉트         |
| api/client.ts               | Axios 인스턴스, 토큰 헤더, 401 시 로그아웃 처리 |
| api/auth.ts                 | register, login API 호출           |
| api/product.ts              | Product CRUD API 호출              |
| api/video.ts                | Video 검색/등록 API 호출               |
| pages/Login.tsx             | 로그인 폼, useAuth().login 호출        |
| pages/Register.tsx          | 회원가입 폼, auth.register 호출         |
| pages/Products.tsx          | 상품 목록/추가/삭제, 본인 상품만 삭제 버튼 표시     |
| pages/VideoSearch.tsx       | 비디오 등록 폼, 검색 폼 및 결과              |


## 4. Frontend 시퀀스 (로그인 플로우)

```mermaid
sequenceDiagram
    participant User
    participant Login
    participant useAuth
    participant AuthContext
    participant apiClient
    participant Backend

    User->>Login: 이메일/비밀번호 입력 후 로그인 클릭
    Login->>useAuth: login(email, password)
    useAuth->>AuthContext: login()
    AuthContext->>apiClient: POST /auth/login
    apiClient->>apiClient: Authorization 헤더 (없음)
    apiClient->>Backend: POST /api/auth/login
    Backend-->>apiClient: { token, user }
    apiClient-->>AuthContext: data
    AuthContext->>AuthContext: localStorage.setItem("token")
    AuthContext->>AuthContext: setToken, setUser
    AuthContext-->>Login: 완료
    Login->>Login: navigate("/products")
```



## 5. Frontend 시퀀스 (Private 라우트 접근)

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant PrivateRoute
    participant useAuth
    participant AuthContext
    participant Products

    User->>Browser: /products 접속
    Browser->>PrivateRoute: 렌더 시도
    PrivateRoute->>useAuth: useAuth()
    useAuth->>AuthContext: token, isReady
    AuthContext-->>PrivateRoute: token 있음 / 없음
    alt token 없음
        PrivateRoute->>Browser: Navigate to /login
    else token 있음
        PrivateRoute->>Products: Outlet → Products 렌더
        Products->>Products: getProducts() → apiClient
    end
```



---

## 로컬 실행 방법

### 백엔드

```bash
cd backend
npm install
# .env 설정: PORT, MONGODB_URI, JWT_SECRET
npm run dev
```

### 프론트엔드

```bash
cd frontend
npm install
# .env: VITE_API_URL=http://localhost:4000
npm run dev
```

- 백엔드: [http://localhost:4000](http://localhost:4000)  
- 프론트: [http://localhost:5173](http://localhost:5173)

---

## 환경 변수

### backend/.env


| 변수          | 설명              |
| ----------- | --------------- |
| PORT        | 서버 포트 (기본 4000) |
| MONGODB_URI | MongoDB 연결 문자열  |
| JWT_SECRET  | JWT 서명용 시크릿     |


### frontend/.env


| 변수           | 설명                                                              |
| ------------ | --------------------------------------------------------------- |
| VITE_API_URL | 백엔드 API URL (예: [http://localhost:4000](http://localhost:4000)) |


---

## 배포

- **백엔드**: AWS Elastic Beanstalk (Node.js)
- **프론트엔드**: AWS S3 정적 웹사이트 호스팅
- **DB**: MongoDB Atlas

프론트와 백엔드 모두 HTTP인 경우 Mixed Content를 피하려면 같은 프로토콜(예: S3 HTTP + EB HTTP)로 맞추거나, HTTPS를 적용해 사용합니다.