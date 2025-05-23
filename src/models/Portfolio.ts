import mongoose, { Document, Schema } from 'mongoose';

export interface IPortfolio extends Document {
  title: string;
  description: string;
  imageUrl: string;
  publicId: string;
  createdBy: mongoose.Types.ObjectId;
}

const portfolioSchema = new Schema<IPortfolio>(
  {
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IPortfolio>('Portfolio', portfolioSchema);
