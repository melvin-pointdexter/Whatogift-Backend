import mongoose from "mongoose";
const Schema = mongoose.Schema;

const brandSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    createdAt: {type: Date, default: Date.now},
    brandName: {type: String, required: true},
    brandLogo: String
})

export default mongoose.model("Brand", brandSchema);