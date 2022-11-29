import express from "express";
const Router = express.Router();
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Auth from './auth.js';

//MODELS
import Account from "../models/account.js";

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


router.get('/getOverview', Auth, async (req, res) => {
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