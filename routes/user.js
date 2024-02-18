const express=require("express");
const router=express.Router();

const {login,signUp}=require("../controller/Auth");
const {auth,isStudent,isAdmin}=require("../middlewares/auth");


router.post("/login",login);
router.post("/signup",signUp);
 
// Testing Route for single middleware
router.get("/test",auth,(req,res)=>{
    res.json({
        success:true,
        message:"Welcome to Protecred route for Test",
    });
})
//Protected Route
router.get("/student",auth,isStudent,(req,res)=>{
    res.json({
        success:true,
        message:"Welcome to Protecred route for Student",
    });
});


router.get("/admin",auth,isAdmin,(req,res)=>{
    res.json({
        success:true,
        message:"Welcome to Protecred route for Admin",
    });
});
module.exports=router