import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://front-v.s3-website.ap-northeast-2.amazonaws.com"
  ],
  credentials: true
}));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", routes);

export default app;