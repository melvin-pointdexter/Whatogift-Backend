import mongoose from "mongoose";
const Schema = mongoose.Schema;

const companySchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    associateId:{type:mongoose.Schema.Types.ObjectId, ref: "Account"},
    companyName: {type:String, required:true},
    contact: {
        address: String,
        city: String,
        state: String,
        ZIP: String,
        mobile: String,
        longitude: String,
        latitude: String
    },
    logo: {type:String, default:"https://cdn-icons-png.flaticon.com/512/21/21104.png"},
    bio: String,
    createdAt: {type: Date, default: Date.now},
})