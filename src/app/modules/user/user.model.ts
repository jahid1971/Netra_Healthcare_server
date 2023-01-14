import { model, Schema } from "mongoose";
import { IUser } from "./user.interface";




const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: [true, "name is required"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    phone: {
        type: String,
        required: [true, "phone is required"],
    },
    address: {
        type: String,
        required: [true, "address is required"],
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
}, {
    timestamps: true,
})

const User = model<IUser>("User", userSchema);

export default User;