import mongoose from "mongoose";
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { type:String, required: true},
    password: { type:String, required: true},
    createdAt: {type: Date, default: Date.now},
    firstName: String,
    lastName: String,
    dob: Date,
    gender: String,
    avatar: {type:String, default:"https://cdn-icons-png.flaticon.com/512/21/21104.png"},
    isVerified: { type:Boolean, default: false},
    passcode: Number,
    contact: {
        address: String,
        city: String,
        state: String,
        ZIP: String,
        mobile: String
    }
});

export default mongoose.model('Account')