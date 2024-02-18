// 3 middlewares  
//for authentication 
//for student
//for admin

const jwt=require("jsonwebtoken");
require("dotenv").config();

exports.auth=(req,res,next)=>{
    try{
        //extract jwt token
        const token=req.body.token;
        // || req.cookie.token
        if(!token){
            return res.status(401).json({
                success:false,
                message:'Token Missing',
            });
        }

        //We have token let's varify it
        try{
            const payload=jwt.verify(token,process.env.JWT_SECRET);
            console.log("Printing decode");
            console.log(payload);

            //because we have to use the role for checking the student and admin authorization in next middleware
            req.user=payload;

        }
        catch(err){
            return res.status(401).json({
                success:false,
                message:"Token is inValid",
            });
        }
        next();
    
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:"Something went wrong while varify token"

        })
    }
}

exports.isStudent=(res,req,next)=>{
    try{
        if(req.user.role!=="Student"){
            return res.status(401).json({
                success:false,
                message:"This is Protected route for Student",
        });
    }
    next();
}
    catch(error){
        return res.status(500).json({
            success:false,
            message:"User role can't be varified",
        })
    }

}



exports.isAdmin=(res,req,next)=> {
    try{
        if(req.user.role!=="Admin"){
            return res.status(401).json({
                success:false,
                message:"This is Protected route for Admin",
            });
        }
        next();
    }
        catch(error){
            return res.status(500).json({
                success:false,
                message:"User role can't be varified",
            })
        }

}