const express=require('express')
const userRouter=express.Router()
const userModel=require('../models/userModel')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const verifyToken=require('../utils/verifyToken')

function generateToken(username,role){
    let data={
        "username":username,
        "role":role
    }
    const token=jwt.sign(data,'secretkeyforcreatingjsonwebtokenforauthentication')
    return token
}

//registering a user
userRouter.post('/register',async(req,res)=>{
    if(req.body.username&&req.body.email&&req.body.password){
        const salt=await bcrypt.genSalt(Number(10))
        const hashPassword=await bcrypt.hash(req.body.password,salt)
        try {

            let regexpemail=/^(\w+([\.-]?\w+))@([a-zA-Z0-9\-]+)\.([a-z]{2,3})(.[a-z]{2,3})?$/; 
            let regexppwd=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
            if(regexpemail.test(req.body.email)&&regexppwd.test(req.body.password)){
                let user=await userModel.findOne({username:req.body.username})
                let email=await userModel.findOne({email:req.body.email})
                if(!user&&!email){
                    const newUser=userModel({
                        username:req.body.username,
                        email:req.body.email,
                        password:hashPassword,
                        role:'user'            
                    })
                    const result=await newUser.save() 
                    res.status(200).json(result)
                }
                else{
                    res.status(406).json({message:"username already taken or email exists"})
                }
            }
            else{
                res.status(401).json({message:"check password or email validation"})
            }
            
        } catch (error) {
            console.log(error)
           res.status(500).json({message:"internel server error"}) 
        }
    }
})

//user login
userRouter.post('/login',async(req,res)=>{
    if(req.body.username && req.body.password){
        const login=await userModel.findOne({username:req.body.username})
         if(login){
        let result=await bcrypt.compare(req.body.password,login.password)
        if(result){
            let token=generateToken(login.username,login.role)
            const data={
                token:token,
                user:login.role,
                message:'login Successful'
            }
            res.status(200).send(data)   
        }
        else{
            res.status(401).json({message:"password mismatch"})
        }
         }
         else{
             res.status(404).json({message:"no user found"})
         }
    }
    else{
        res.status(406).json({message:"not acceptable"})
    }
})



module.exports=userRouter