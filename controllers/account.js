import express from "express";
const Router = express.Router();
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Auth from './auth.js';

//MODELS
import Account from "../models/account.js";

/**
 * @swagger
 * definitions:
 *  Account:
 *   type: object
 *   properties:
 *    email:
 *     type: string
 *     description: The email adress for the account
 *     example: smormu@hotmail.com
 *    password:
 *     type: string
 *     description: The password for the account
 *     example: smormu1986
 *    firstName:
 *     type: string
 *     description: The first name of the user
 *     example: "Smormu"
 *    lastName:
 *     type: string
 *     description: The last name of the user
 *     example: "Carter"
 *    dob:
 *     type: Date
 *     description: The date of birth of the user
 *     example: 21/2/1986
 *    gender:
 *     type: String
 *     description: The gender of the user
 *     example: "Male"
 *    avatar:
 *     type: String
 *     description: The avatar of the user
 *     example: https://cdn-icons-png.flaticon.com/512/21/21104.png
 *    contact:
 *     type: object
 *     properties:
 *      address:
 *       type: String
 *       description: The address of the user
 *       example: "612 wharf avenue"
 *      city:
 *       type: String
 *       description: The city the user lives in
 *       example: "Red Bank"
 *      state:
 *       type: String
 *       description: The state the user lives in
 *       example: "New jersey"
 *      ZIP:
 *       type: String
 *       description: The ZIP code of the user
 *       example: "872231"
 *      mobile:
 *       type: String
 *       description: The phone number of the user
 *       example: "98-271-4889"
 */

/**
 * @swagger
 * /api/account/signup:
 *  post:
 *   summary: Creates an account
 *   description: Use this endpoint to create a new account
 *   tags: [Account]
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Account'
 *   responses:
 *    200: 
 *     description: Successfully created an account
 *    500:
 *     description: ERROR was found
 */
Router.post("/signup", async(req,res) => {
    //get user register data
    //check if user exists
    //store user in db
    //send verification code
    const id = mongoose.Types.ObjectId();
    const {firstName, lastName, email,password} = req.body;
    console.log(email);
    Account.findOne({where: {email: email}})
    .then(async accounts =>{
        console.log(accounts);
        if (accounts){
            return res.status(500).json({
                status: false,
                message: "User with that email already exists"
            });
        }
        else if (email==undefined || email==null || password==undefined || password==null){
            return res.status(500).json({
                status: false,
                message: "Insufficient data"
            });
        }
        else{
            const code =Math.floor(Math.random()*9000)+1000;
            const hash = await bcryptjs.hash(password,10);
            const _account = new Account({
                _id: id,
                associateId: id,
                email: email,
                password: hash,
                firstName: firstName,
                lastName: lastName,
                passcode: code,
            })
            _account.save()
            .then(results => {
                return res.status(200).json({
                    status: true,
                    message: "Verify the created user\n" + results,
                    code: code
                });
            })
            .catch(err => {
                return res.status(500).json({
                    status: false,
                    message: err
                });
            })
        }
    })
    .catch(err => {
        return res.status(501).json({
            message: err
        });
    })

});

/**
 * @swagger
 * /api/product/verify:
 *  post:
 *   summary: Verifies an account
 *   description: Use this endpoint to verify an account
 *   tags: [Account]
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Account'
 *   responses:
 *    200: 
 *     description: Successfully verified an account
 *    500:
 *     description: ERROR was found
 */
Router.post("/verify", async(req,res) => {
    //get code + email
    //check if code match
    //update db true or false
    const {email,passcode} = req.body;
    console.log(email+"\n"+passcode);
    Account.findOne({where: {email: email, passcode: passcode}})
    .then( accounts =>{
        if (accounts){
            accounts.isVerified= true;
            accounts.save()
            .then(update => {
                return res.status(200).json({
                    status: true,
                    message: "Account verified!"
                });
            })
            .catch(err =>{
                return res.status(500).json({
                    status: false,
                    message: err
                });
            })
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
 * /api/product/login:
 *  post:
 *   summary: Logs onto an account by returning a webtoken upon a successful login
 *   description: Use this endpoint to log into an account
 *   tags: [Account]
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Account'
 *   responses:
 *    200: 
 *     description: Success, returns a webtoken
 *    500:
 *     description: ERROR was found
 */
Router.post("/login", async(req,res) => {
    //get user login data
    //check if user exists and password match
    //generate JWT token
    //res
    const {email, password} = req.body;
    Account.findOne({where: {email: email}})
    .then(async accounts =>{
        if (accounts){
            
            if (await bcryptjs.compare(password,accounts.password) && accounts.isVerified){

                const data = {_id: accounts._id ,email: accounts.email};
                const token=await jwt.sign(data,'cqu9unweap82');

                return res.status(200).json({
                    status: true,
                    message: "Successfully logged in!",
                    token: token
                });
            }
            else{
                return res.status(500).json({
                    status: false,
                    message: "Wrong password/haven't activated account"
                });
            }
        }
        else{
            return res.status(500).json({
                status: false,
                message: "No such user exists. if not then check if you verified it."
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

//update account
Router.put("/updateAccount", Auth,async(req,res) => {
    //complete
    
});


Router.get('/getOverview', Auth, async (req, res) => {
    return res.status(200).json({
        message: `Hello ${req.user.firstName} ${req.user.lastName}`
    });
})


/*Router.get("/getOverview", async(req,res) => {
    // ===
    const {email} = req.body;
    Account.findOne({where: {email: email}})
    .then(async accounts =>{
        if (accounts){
            return res.status(200).json({
                status: true,
                overview: accounts
            });
        }
        else{
            return res.status(500).json({
                status: false,
                message: "No such user exists."
            });
        }
    })
    .catch(err =>{
        return res.status(500).json({
            status: false,
            message: err
        });
    })
});*/

export default Router;

/*
Router.get('/greeting',async(req,res)=>{
    return res.status(200).json({
        message:"Hello from whatogift app"
    });
})
*/