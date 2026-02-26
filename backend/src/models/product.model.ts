import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  description?: string;
  category?: string;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    category: String,
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }  // 해당 사용자가 맞는지 확인
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;