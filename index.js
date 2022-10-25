import express from "express";
import bp from "body-parser";
import mongoose from "mongoose";

const app = express();

app.use(bp.urlencoded({extended:false}));
app.use(bp.json());

const mongourl = '';

const port = 9001;
app.listen(port, function(){
    console.log(`Server is running via port ${port}`);
});