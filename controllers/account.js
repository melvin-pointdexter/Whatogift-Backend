import express from "express";
const Router = express.Router();

Router.get('/greeting',async(req,res)=>{
    return res.status(200).json({
        message:"Hello from whatogift app"
    });
})

export default Router;