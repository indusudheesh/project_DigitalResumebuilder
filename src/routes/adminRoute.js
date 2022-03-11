const express=require('express')
const { verifyToken } = require('../utils/verifyToken')
const userModel=require('../models/userModel')
const resumeModel=require('../models/resumeModel')
const templateModel=require('../models/templateModel')
const adminRoute=express.Router()

//delete a user
adminRoute.delete('/deleteUser',verifyToken,async(req,res)=>{
    if(req.body.username){
        const user=await userModel.findOne({username:req.body.username})
         if(user){
          if(req.role==='admin'){
                   
            const resultResume=await resumeModel.findOneAndDelete({username:req.body.username})
            const resultUser=await userModel.findOneAndDelete({username:req.body.username}) 
            let data={
                userDeleted:resultUser,
                resume:resultResume?resultResume:'no resume exist for this user'
            }
             res.status(200).json(data)
          }
          else{
              res.status(401).json({message:"unauthorized request"})
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

//Adding a template
adminRoute.post('/addTemplate',verifyToken,async(req,res)=>{
if(req.body.template && req.body.templateName){
    const data=await templateModel.findOne({templateName:req.body.templateName})
if(!data){
    if(req.role=='admin'){
try {
    let template=templateModel({
        template:req.body.template,
        templateName:req.body.templateName,
        createdOn:new Date(Date.now()).getTime()
    })

    let newTemplate=await template.save()
    res.status(200).json(newTemplate)
} catch (error) {
    console.log(error)
    res.status(500).json({message:"internel server error"})
}
    }
    else{
        res.status(401).json({message:"authentication failed"})
    }
}
else{
    res.status(401).json({message:"template name should be unique"})
}
}
else{
    res.status(406).json({message:'not acceptable'})
}
})

//get all template
adminRoute.get('/getAllTemplates',verifyToken,async(req,res)=>{
    var arr=[]
    if(req.username=='admin'){
        let templates=await templateModel.find({})
        if(templates){
           try {
            for(let i=0;i<templates.length;i++){
                const d = new Date(templates[i].createdOn)
                let data={
                    templateName:templates[i].templateName,
                    template:templates[i].template,
                    createdOn:`${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}::${d.getHours()}.${d.getMinutes()}.${d.getSeconds()}`
                }
                arr.push(data)
            }
            res.status(200).json(arr)
           } catch (error) {
               res.status(500).json({message:"internel server error"})
           }
            
        }else{
            res.status(404).json({message:"no templates"})
        }
    }else{
        res.status(401).json({message:"authentication failed"})
    }
})

//edit a template
adminRoute.put('/editTemplate',verifyToken,async(req,res)=>{
    if(req.body.template && req.body.templateName){
if(req.role=='admin'){
    try {
        let temp={
            template:req.body.template
        }
        const result=await templateModel.findOneAndUpdate({templateName:req.body.templateName},{$set:temp},{new:true})
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({message:"internel server error"})
    }
    

}else{
    res.status(401).json({message:"authentication failed"})
}
    }else{
        res.status(406).json({message:"not acceptable"})
    }
})

//delete a template
adminRoute.delete('/deleteTemplate',verifyToken,async(req,res)=>{
    if(req.body.templateName){
        if(req.role=='admin'){
            try {
                const temp=await templateModel.findOneAndDelete({templateName:req.body.templateName})
            if(temp){
            let data={
                status:"template deleted",
                template:temp
            }
            res.status(200).json(data)
        }else{
            res.status(404).json({message:"no such template"})
        }
            } catch (error) {
             res.status(500).json({message:"internel server error"})   
            }
            
        }else{
            res.status(401).json({message:"authentication failed"})
        }
    }else{
        res.status(406).json({message:"not acceptable"})
    }
})

//get a single template with template name
adminRoute.get('/getTemplate',verifyToken,async(req,res)=>{
    if(req.body.templateName){
if(req.role=='admin'){
try {
    const temp=await templateModel.findOne({templateName:req.body.templateName})
    if(temp){
        const d = new Date(temp.createdOn)
                let data={
                    templateName:temp.templateName,
                    template:temp.template,
                    createdOn:`${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}::${d.getHours()}.${d.getMinutes()}.${d.getSeconds()}`
                }
            
            res.status(200).json(data)
    }else{
        res.status(404).json({message:"template not found"})
    }
} catch (error) {
    
}
}else{
    res.status(401).json({message:"authentication failed"})
}
    }
    else{
        res.status(406).json({message:"not acceptable"})
    }
})




module.exports=adminRoute