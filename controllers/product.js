import express from "express";
const Router = express.Router();
//import bcryptjs from "bcryptjs";
//import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Auth from './auth.js';

import Product from "../models/product.js";
import Category from "../models/category.js";
import Brand from "../models/brand.js";



//===================== BRANDS ===========================
/**
 * @swagger
 * definitions:
 *  Brand:
 *   type: object
 *   properties:
 *    brandName:
 *     type: string
 *     description: The name of the brand
 *     example: hewlett packard
 *    brandLogo:
 *     type: string
 *     description: Copy and paste image url
 *     example: hp_logo.png
 */
/**
 * @swagger
 * /api/product/create_new_brand:
 *  post:
 *   summary: Creates a brand
 *   description: Use this endpoint to create a new brand
 *   tags: [Products]
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Brand'
 *   responses:
 *    200: 
 *     description: Successfully created a new brand
 *    500:
 *     description: ERROR was found
 */
Router.post('/create_new_brand',  async(req,res) => {
    const {brandName,brandLogo} = req.body;
    const id = mongoose.Types.ObjectId();
    const _brand = new Brand({
        _id:id,
        brandName:brandName,
        brandLogo: brandLogo
    });
    _brand.save()
    .then(brand_created => {
        return res.status(200).json({ status: true, message:brand_created})
    })
    .catch(error => {return res.status(500).json({status: false, message: error.message})})
});

/**
 * @swagger
 * /api/product/get_all_brands:
 *  get:
 *   summary: Returns a list of all of the brands in the database
 *   tags: [Products]
 *   responses:
 *    200: 
 *     description: This is a list of all of the brands
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *    500:
 *     description: ERROR was found
 */
Router.get('/get_all_brands', async(req,res) => {
    Brand.find()
    .then(brands => {
        return res.status(200).json({
            status: true,
            message: brands
        })
    })
    .catch(error => { return res.status(500).json({status: false, message: error.message})})
});

/**
 * @swagger
 * /api/product/get_brand_by_id/{id}:
 *  get:
 *   summary: Returns a single brand with the id specified from the database
 *   tags: [Products]
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *   responses:
 *    200: 
 *     description: A single brand object
 *    500:
 *     description: ERROR was found
 */
Router.get('/get_brand_by_id/:id', async(req,res) => {
    Brand.findById(req.params.id)
    .then(brand => {
        return res.status(200).json({
            status: true,
            message: brand
        })
    })
    .catch(error => { return res.status(500).json({status: false, message: error.message})})
});
Router.delete('/delete_brand', async(req,res) => {});
//===================== CATEGORIES ===========================
/**
 * @swagger
 * /api/product/get_all_categories:
 *  get:
 *   summary: Returns a list of all of the categories in the database
 *   tags: [Products]
 *   responses:
 *    200: 
 *     description: This is a list of all of the categories
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *    500:
 *     description: ERROR was found
 */
Router.post("/get_all_categories", async(req,res) => {
    Category.find()
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
Router.post('/create_new_category', async(req,res) => {
    const categoryName = req.body.categoryName;
    const id = mongoose.Types.ObjectId();
    const _category = new Category({
        _id:id,
        categoryName: categoryName
    });
    _category.save()
    .then(category_created => {
        return res.status(200).json({status: true, message:category_created})
    })
    .catch(error => {return res.status(500).json({status: false, message: error.message})})
});
Router.delete('/delete_category', async(req,res) => {});
//===================== CATEGORIES ===========================

Router.post('/create_new_product', async(req,res) => {
    const id = mongoose.Types.ObjectId();
    const {
        companyId,categoryId,brandId,
        productName,productPrice,productDescription,
        unitInStock, productImage
    } = req.body;
    const _product = new Product({
        _id: id,
        companyId: companyId,
        categoryId: categoryId,
        brandId: brandId,
        productName: productName,
        productImage: [{imageSource: productImage}],
        productPrice: productPrice,
        productDescription: productDescription,
        unitInStock: unitInStock,
        reviews: []
    });
    _product.save()
    .then(product_created => {
        return res.status(200).json({
            status: true,
            message: product_created
        })
    })
    .catch(error => {
        return res.status(500).json({
            status: false,
            message: error.message
        })
    })
});

/*Router.post("/createProduct", Auth, async(req,res)=>{
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

});*/

/**
 * @swagger
 * /api/product/get_all_products:
 *  get:
 *   summary: Returns a list of all of the products in the database
 *   tags: [Products]
 *   responses:
 *    200: 
 *     description: This is a list of all of the products
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *    500:
 *     description: ERROR was found
 */
Router.post("/get_all_products", async(req,res) => {
    Product.find()
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
Router.delete('/delete_product', async(req,res) => {});

export default Router;