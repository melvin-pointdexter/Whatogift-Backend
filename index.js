import express from "express";
import bp from "body-parser";
import mongoose from "mongoose";

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

const app = express();

app.use(bp.urlencoded({extended:false}));
app.use(bp.json());

const mongourl = 'mongodb+srv://smith:QHa4nDmgE9tGO470@cluster0.ueydepz.mongodb.net/dataB?retryWrites=true&w=majority';

const options = {
    definition:{
        openapi: "3.0.0",
        info: {
            title: "What2Gift API Backend",
            version: "0.5.5"
        },
        servers: [
            {
                url: "http://localhost:9001"
            }
        ]
    },
    apis: ["./controllers/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpec));

//============================= Begin routes =====================================
import accountRoute from './controllers/account.js';
app.use('/api/account',accountRoute);

import companiesRoute from './controllers/company.js';
app.use('/api/company',companiesRoute);

import productRoute from './controllers/product.js';
app.use('/api/product',productRoute);
//============================== End routes ======================================

mongoose.connect(mongourl)
.then(results=>{
    console.log(results);
    const port = 9001;
    app.listen(port, function(){
        console.log(`Server is running via port ${port}`);
    });
})
.catch(error => {console.log(error.message)})

