import express from "express";
const Router = express.Router();
import mongoose from "mongoose";
import Auth from './auth.js';

import Product from "../models/product.js";
import Category from "../models/category.js";
import Brand from "../models/brand.js";
import Company from "../models/company.js";


//=================== HELPER FUNCTIONS ===================

//======================== BRANDS ========================
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
//===================== CATEGORIES =====================
/**
 * @swagger
 * definitions:
 *  Category:
 *   type: object
 *   properties:
 *    categoryName:
 *     type: string
 *     description: The name of the category
 *     example: computers
 */
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
//===================== PRODUCTS ===========================
/**
 * @swagger
 * definitions:
 *  Product:
 *   type: object
 *   properties:
 *    productName:
 *     type: string
 *     description: The name of the product
 *     example: Amiga 1000
 *    productImage:
 *     type: array
 *     items:
 *      type: object
 *      properties:
 *       imageSource:
 *        type: string
 *        description: The image url of the product
 *        example: https://upload.wikimedia.org/wikipedia/commons/e/e8/Amiga_1000_PAL.jpg
 *    companyId:
 *     type: objectId
 *     description: The ID of the company that sells the product
 *     example: 87
 *    categoryId:
 *     type: objectId
 *     description: The ID of a category of the product
 *     example: 12
 *    brandId:
 *     type: objectId
 *     description: The ID of a brand associated with the product
 *     example: 25
 *    productPrice:
 *     type: number
 *     description: The price of the product
 *     example: 400
 *    productDescription:
 *     type: string
 *     description: A description of the product
 *     example: a personal computer from the Amiga line of computers
 *    unitInStock:
 *     type: number
 *     description: The number of units in stock
 *     example: 100
 *    reviews:
 *     type: array
 *     items:
 *      type: object
 *      properties:
 *       rating:
 *        type: number
 *        description: How highly is the product rated out of 10
 *        example: 8
 *       title:
 *        type: string
 *        description: The title of the review
 *        example: Awesome!
 *       comments:
 *        type: string
 *        description: The review itself
 *        example: This computer rules!
 *    ageRange:
 *     type: object
 *     properties:
 *      minAge:
 *       type: number
 *       description: The minumum age requirement
 *       example: 6
 *      maxAge:
 *       type: number
 *       description: The maximum age requirement
 *       example: 120
 *    tags:
 *     type: array
 *     items:
 *      type: object
 *      properties:
 *       tag:
 *        type: string
 *        description: A keyword associated with the product
 *        example: computers
 */
/**
 * @swagger
 * /api/product/create_new_product:
 *  post:
 *   summary: Creates a product
 *   description: Use this endpoint to create a new product
 *   tags: [Products]
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Product'
 *   responses:
 *    200: 
 *     description: Successfully created a new product
 *    500:
 *     description: ERROR was found
 */
Router.post('/create_new_product', async(req,res) => {
    const id = mongoose.Types.ObjectId();
    const {
        companyId,categoryId,brandId,
        productName,productPrice,productDescription,
        unitInStock, productImage, tags, ageRange
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
        reviews: [],
        tags: tags,
        ageRange: ageRange,
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
 * definitions:
 *  Criteria:
 *   type: object
 *   properties:
 *    budget:
 *     type: number
 *     description: The maximum price
 *     example: 1000
 *    gender:
 *     type: string
 *     description: The gender of the gift receiver
 *     example: male
 *    events:
 *     type: array
 *     items:
 *      type: object
 *      properties:
 *       event:
 *        type: string
 *        description: An event the gift fits
 *        example: Birthday
 *    interests:
 *     type: array
 *     items:
 *      type: object
 *      properties:
 *       interest:
 *        type: string
 *        description: An interest the gift fulfills
 *        example: stationery
 *    age:
 *     type: number
 *     description: The age of the gift receiver
 *     example: 26
 *    intimacy:
 *     type: number
 *     description: The closeness of the gifter and the receiver
 *     example: 4
 *    location:
 *     type: object
 *     properties:
 *      latitude: 
 *       type: string
 *       description: The latitude of the gifter
 *       example: -4.322447
 *      longitude:
 *       type: string
 *       description: The longtitude of the gifter
 *       example: 15.307045
 *      maxRange:
 *       type: number
 *       description: The maximum range of stores close to the gifter
 *       example: 15
 */
/**
 * @swagger
 * /api/product/get_relevent_gifts:
 *  get:
 *   summary: Returns a list of every gift from the products in the database that is relevent to the criteria in the header
 *   tags: [Products]
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Criteria'
 *   responses:
 *    200: 
 *     description: Returns a list of all the relevent products
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *    500:
 *     description: ERROR was found
 *   
 */
Router.get("/get_relevent_gifts", async(req,res) => {
    const { location, events, budget, gender, age, intimacy, interests} = req.body;
    Product.find()
    .then(async products =>{
        if (products){
            //after all products returned, filter out irrlevent gifts
            const releventProducts = products.filter(product => 
                (product.ageRange.minAge <= age &&
                product.ageRange.maxAge >= age &&
                product.tags.includes({tag: intimacy}) &&
                product.productPrice <= budget &&
                product.tags.includes({tag: gender}) &&
                product.tags.some(interest => interests.includes(interest.tag)) &&
                product.tags.some(event => events.includes(event.tag))));
            const companiesID = new Set();
            for (var i=0; i<releventProducts.length;i++){ companies.add(releventProducts[i].companyId); }
            

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
Router.get("/get_all_products", async(req,res) => {
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