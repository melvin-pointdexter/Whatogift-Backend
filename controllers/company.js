import express from "express";
const Router = express.Router();

Router.post("/createCompany", async(req,res)=>{
    const user = req.user;
    const company = await Company.find({associateId: user._id});
    if(company.length > 0){
        return res.status(200).json({
            status: false,
            message: 'Company exist'
        });
    } else {
        const id = mongoose.Types.ObjectId();
        const {companyName,contact} = req.body;
        const _company = new Company({
            _id: id,
            associateId: user._id,
            companyName: companyName,
            contact: contact,
            bio: ''
        });
        _company.save()
        .then(company_created => {
            return res.status(200).json({
                status: true,
                message: company_created
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

Router.post("/updateCompany", async(req,res)=>{
    //update existing company
    
});

Router.get('/greeting',async(req,res)=>{
    return res.status(200).json({
        message:"Hello from whatogift app"
    });
});

export default Router;