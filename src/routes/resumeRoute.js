const express=require('express')
const resumeRouter=express.Router()
const resumeModel=require('../models/resumeModel')
const templateModel=require('../models/templateModel')
const fs=require('fs')
const { verifyToken } = require('../utils/verifyToken')


//Adding resume details
resumeRouter.post('/addResume',verifyToken,async(req,res)=>{
 
    if(Object.keys(req.body).length!=0 && req.body.name){

        var st = req.body.dob;
        var pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
        var dt = new Date(st.replace(pattern,'$3-$2-$1'));
        const dob=new Date(dt).getTime()
        const user=await resumeModel.findOne({username:req.username})
      if(!user){
        try {
            const resume=resumeModel({
                username:req.username,
                name:req.body.name,
                dob:dob,
                address:req.body.address?req.body.address:null,
                phNo:req.body.phNo?req.body.phNo:null,
                gender:req.body.gender?req.body.gender:null,
                maritalStatus:req.body.maritalStatus?req.body.maritalStatus:null,
                nationality:req.body.nationality?req.body.nationality:null,
                email:req.body.email?req.body.email:null,
                bio:req.body.bio?req.body.bio:null,
                skillSet:req.body.skillSet?req.body.skillSet:null,
                qualifications:req.body.qualifications?req.body.qualifications:null,
                academicProjects:req.body.academicProjects?req.body.academicProjects:null,
                awards:req.body.awards?req.body.awards:null,
                languages:req.body.languages?req.body.languages:null,
                functionalSkills:req.body.functionalSkills?req.body.functionalSkills:null,
                experience:req.body.experience?req.body.experience:null,
                internships:req.body.internships?req.body.internships:null,
                workshops:req.body.workshops?req.body.workshops:null,
                seminars:req.body.seminars?req.body.seminars:null,
                hobbies:req.body.hobbies?req.body.hobbies:null,
                careerGoals:req.body.careerGoals?req.body.careerGoals:null,

            })

            const resp=await resume.save()
            res.status(200).json(resp) 
        } catch (error) {
            console.log(error)
            res.status(500).json({message:'Internal server error'})
        }
    }
    else{
        res.status(401).json({message:"record exists try to edit"})
    }
         

    }
    else{
        res.status(406).json({message:"not acceptable"})
    }
})

//update resume details
resumeRouter.put('/editResume',verifyToken,async(req,res)=>{
    var st = req.body.dob;
        var pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
        var dt = new Date(st.replace(pattern,'$3-$2-$1'));
        const dob=new Date(dt).getTime()
    try {
        const updatedResume={
                name:req.body.name,
                dob:dob,
                address:req.body.address?req.body.address:null,
                phNo:req.body.phNo?req.body.phNo:null,
                gender:req.body.gender?req.body.gender:null,
                maritalStatus:req.body.maritalStatus?req.body.maritalStatus:null,
                nationality:req.body.nationality?req.body.nationality:null,
                email:req.body.email?req.body.email:null,
                bio:req.body.bio?req.body.bio:null,
                skillSet:req.body.skillSet?req.body.skillSet:null,
                qualifications:req.body.qualifications?req.body.qualifications:null,
                academicProjects:req.body.academicProjects?req.body.academicProjects:null,
                awards:req.body.awards?req.body.awards:null,
                languages:req.body.languages?req.body.languages:null,
                functionalSkills:req.body.functionalSkills?req.body.functionalSkills:null,
                experience:req.body.experience?req.body.experience:null,
                internships:req.body.internships?req.body.internships:null,
                workshops:req.body.workshops?req.body.workshops:null,
                seminars:req.body.seminars?req.body.seminars:null,
                hobbies:req.body.hobbies?req.body.hobbies:null,
                careerGoals:req.body.careerGoals?req.body.careerGoals:null,
        }

        const result=await resumeModel.findOneAndUpdate({username:req.username},{$set:updatedResume},{ new: true, useFindAndModify: false })
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    }
})

//get users resume details
resumeRouter.get('/getResume',verifyToken,async(req,res)=>{
    console.log(req.username)
    try {
        const result=await resumeModel.findOne({username:req.username})
        if(result){
            const d = new Date(result.dob);
            const resume={
                name:result.name,
                dob:`${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`,
                address:result.address,
                phNo:result.phNo,
                gender:result.gender,
                maritalStatus:result.maritalStatus,
                nationality:result.nationality,
                email:result.email,
                bio:result.bio,
                skillSet:result.skillSet,
                qualifications:result.qualifications,
                academicProjects:result.academicProjects,
                awards:result.awards,
                languages:result.languages,
                functionalSkills:result.functionalSkills,
                experience:result.experience,
                internships:result.internships,
                workshops:result.workshops,
                seminars:result.seminars,
                hobbies:result.hobbies,
                careerGoals:result.careerGoals,
            }
        res.status(200).json(resume)
        }
        else
        res.status(404).json({message:"resume not found"})
        
    } catch (error) {
      res.status(500).json({message:"Internal server error"})  
    }
})

//delete a resume
resumeRouter.delete('/deleteResume',verifyToken,async(req,res)=>{
    console.log(req.body.username)
    if(req.body.username){

    try {
        const result=await resumeModel.findOneAndDelete({username:req.body.username})
        console.log(result)
        if(result){
        let data={
            status:"deleted",
            result,
        }
        res.status(200).json(data)
    }
    else{
        res.status(404).json({message:"no resume found"})
    }
    } catch (error) {
        res.status(500).json({message:"internal server error"})
    }
}
else{
    res.status(406).json({message:"not acceptable"})
}
})


//adding or editing image
resumeRouter.put('/addImage',verifyToken,async(req,res)=>{
    if(req.files){
    try {
        let image=req.files.image;
            image.mv(`./public/${req.username}_${image.name}`)    
            let data={
                imgUrl:`http://192.168.43.51:8080/public/${req.username}_${image.name}`
            }

            const result=await resumeModel.findOneAndUpdate({username:req.username},{$set:data},{new:true})
            res.status(200).json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"internal server error"})
    }
}
else{
    
    res.status(406).json({message:"not acceptable"})
}
})

//deleting image
resumeRouter.delete('/deleteImage',verifyToken,async(req,res)=>{
if(req.username){
    try {

        let resume=await resumeModel.findOne({username:req.username})
        if(resume.imgUrl!=null){
        let text = resume.imgUrl;
        const myArray = text.split("public/");
            fs.unlink(`./public/${myArray[1]}`,(err)=>{
                if(err)
                console.log(error)
            })    
            let data={
                imgUrl:null
            }

    const result=await resumeModel.findOneAndUpdate({username:req.username},{$set:data},{new:true})
            res.status(200).json(result) 
        }
        else{
            res.status(404).json({message:"No image found"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"internal server error"})
    }
}
else{
    
    res.status(406).json({message:"not acceptable"})
}
}
)

//get a template
resumeRouter.get('/getTemplate',verifyToken,async(req,res)=>{
    if(req.body.templateName){
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
        
            }
            else{
                res.status(406).json({message:"not acceptable"})
            }
})

//get all templates
resumeRouter.get('/getAllTemplates',verifyToken,async(req,res)=>{
    var arr=[]    
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
    
})

module.exports=resumeRouter
