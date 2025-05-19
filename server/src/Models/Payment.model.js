import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        upiId: {
            type: String,
            required: [true, 'UPI ID is required'],
            trim: true,
        },
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
            required: [true, 'Event ID is required'],
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending',
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
        },
    },
    {
        timestamps: true,
    }
);

paymentSchema.index({ eventId: 1 });
paymentSchema.index({ upiId: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment; 