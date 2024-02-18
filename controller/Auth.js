const bcrypt=require("bcrypt");
const User=require("../Model/User");
const jwt = require("jsonwebtoken")
require("dotenv").config();


//SignUp Route handler
exports.signUp=async (req,res)=>{
    try{
        //get the data
        const {name,email,password,role}=req.body;

        //Check if user already exist
        const existingUser=await User.findOne({email});
        
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exist",
            });
        }

        //secure password(user not exist in database) 
        //create new user inside database
        let hashedPassword;
        try{
          hashedPassword=await bcrypt.hash(password,10);
        }
        catch(err){
            res.status(500).json({
                success:false,
                message:"Error in hashing password"
            })
        }

        //Create entry for user in database
        const user=await User.create({
            name,
            email,
            //replace the original password with hashed password
            password:hashedPassword,
            role
        })
        return res.status(200).json({
            success:true,
            message:"User created successfully"
        })
    }
    catch(err){
        //console.error(err);
        return res.status(500).json({
            success:false,
            message:"User can't be register Try Again"
        })
    }
}

//for login

exports.login=async(req,res)=>{
    try{
        //data fetch
        const {email,password}=req.body;

        //validation on email and password
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Please fill all the details carefully",
            })
        }

        //check for registred user
        let user=await User.findOne({email});
        // console.log("Printing the value of user");
        // console.log(user);

        //if not a register user
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered Please Sign Up",
            });
        }

        const payload={
            email:user.email,
            id:user._id,
            // password:user.password
            role:user.role,
        }
        // console.log("Printing the payload data");
        // console.log(payload);

        //varify password & generate a JWT tokens
        if(await bcrypt.compare(password,user.password)){
            //password match(create token using jwt.sign() method
            // it takes two arguments first one is payload and second one is secret key)
            let token=jwt.sign(payload,process.env.JWT_SECRET,
            {
                expiresIn:"2h",
            });
            // console.log("Before converting into object")
            // console.log(user);
            user=user.toObject();


            // console.log("After converting into object")
            // console.log(user);
            
            //set the value of token inside user and hide the password inside user 
            user.token=token;
            user.password=undefined


            // console.log("When set the value of token inside user and make password undefined")
            // console.log(user);

            
            const options={
                expirexpiresIn:new Date(Date.now(),3*24*60*60*1000),
                httpOnly:true,
            }

            res.cookie("Onkar's_Cookie",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"User Logged successfully"
            })
        }
        else{
            //password do not match
            res.status(403).json({
                success:false,
                message:"Password Incorrect"
            })
        }
    }
    catch(err){
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"Failure"
        })
        
    }
}