import mongoose from 'mongoose';

const EnquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ['New', 'In Progress', 'Resolved', 'Spam'], default: 'New' },
    adminResponse: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);
