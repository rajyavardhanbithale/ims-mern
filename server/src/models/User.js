import mongoose from "mongoose";

// user schema
const UserScheme = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    public: { type: Boolean, default: true },
    pic: { type: String, default: "https://avatar.iran.liara.run/public/boy?username=Ash" },
    contact: { type: Number, default: 0 },
    bio: { type: String, default: "" },
    country: { type: String, default: "nda" },
    isActive: { type: Boolean, default: true }
}, {
    versionKey: false
})

export default mongoose.model('User', UserScheme, 'users');