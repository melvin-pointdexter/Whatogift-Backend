import express from "express";
const Router = express.Router();
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Auth from './auth.js';

import Product from "../models/product.js";
import Category from "../models/category.js";
import Brand from "../models/brand.js";

Router.post("/createProduct", Auth, async(req,res)=>{
    const {name} = req.body;
    const product = await Product.find({productName: name});
    if(product.length > 0){
        return res.status(200).json({
            status: false,
            message: 'Product exists'
        });
    } else {
        const id = mongoose.Types.ObjectId();
        const { categoryId, companyId} = req.body;
        const _product = new Product({
            _id: id,
            productName: name,
            categoryId: categoryId,
            companyId: companyId,
        });
        _product.save()
        .then(product_created => {
            return res.status(200).json({
                status: true,
                message: product_created
            });
        })
        .catch(error => {
            return res.status(500).json({
                status: false,
                message: error.message
            });
        })
    }

});

Router.post("/create_new_brand", Auth, async(req,res) => {

});
Router.post("/get_all_categories", Auth, async(req,res) => {
    Category.findAll()
    .then(async categories =>{
        if (categories){
            return res.status(200).json({
                status: true,
                overview: categories
            });
        }
        else{
            return res.status(500).json({
                status: false,
                message: "No categories exist."
            });
        }
    })
    .catch(err =>{
        return res.status(500).json({
            status: false,
            message: err
        });
    })
});
Router.post("/create_new_category", Auth, async(req,res) => {

});
Router.post("/get_all_products", Auth, async(req,res) => {
    Product.findAll()
    .then(async products =>{
        if (products){
            return res.status(200).json({
                status: true,
                overview: products
            });
        }
        else{
            return res.status(500).json({
                status: false,
                message: "No products exist."
            });
        }
    })
    .catch(err =>{
        return res.status(500).json({
            status: false,
            message: err
        });
    })
});

export default Router;