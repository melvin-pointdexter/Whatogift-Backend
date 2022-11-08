import express from "express";
const Router = express.Router();

Router.post("/createCompany", async(req,res)=>{
    //check if company exists under the associated id(!)

});

Router.post("/updateCompany", async(req,res)=>{
    //update existing company
    
});

Router.get('/greeting',async(req,res)=>{
    return res.status(200).json({
        message:"Hello from whatogift app"
    });
});

export default Router;