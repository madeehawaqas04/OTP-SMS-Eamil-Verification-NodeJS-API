import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
    {
        phoneNumber: {
            type: String,
            // required: true,
        },
        email: {
            type: String,
            // required: true,
        },
        otp: {
            type: String,
            required: true,
        },
        otpExpiration: {
            type: Date,
            default: Date.now,
            get: (otpExpiration) => (otpExpiration).getTime(), //millisec
            set: (otpExpiration) => new Date(otpExpiration)
        },
       
    },
    { timestamps: true }
);

export default mongoose.model("User", UserSchema);
