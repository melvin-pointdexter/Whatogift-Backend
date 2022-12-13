import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    companyId: {type: mongoose.Schema.Types.ObjectId, ref: "Company"},
    categoryId: {type: mongoose.Schema.Types.ObjectId, ref: "Category"},
    brandId: {type: mongoose.Schema.Types.ObjectId, ref: "Brand"},
    productName: {type:String, required: true},
    productImage: [
        {
            imageSource: String
        }
    ],
    productPrice: Number,
    productDescription: String,
    unitInStock: Number,
    reviews:[
        {
            associateId: {type: mongoose.Schema.Types.ObjectId, ref: "Account"},
            rating: Number,
            createdAt: {type: Date, default: Date.now},
            comments: String,
            title: String
        }
    ],
    createdAt: {type: Date, default: Date.now},
    
    ageRange:{
        minAge: Number,
        maxAge: Number
    },
    tags:[
        {
            tag: String
        }
    ],
})

//logo: {type:String, default: "https://cdn.logo.com/hotlink-ok/logo-social.png"},

export default mongoose.model("Product", productSchema);