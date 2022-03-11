const mongoose=require('mongoose')

const resumeSchema=mongoose.Schema({
    username:{
        type:String,
        required:[true, "Please provide a username"]
    },
    name:{type:String,required:[true,'enter a name']},
    dob:{type:Number,required:[true,'enter date of birth']},
    address:[],
    imgUrl:String,
    phNo:[],
    nationality:String,
    email:[],
    bio:String,
    skillSet:[{
        heading:String,
        skill:[]
    }],
    qualifications:[{
        title:String,
        institution:String,
        place:String,
        period:String,
        percentageorcgpa:String
    }],
    academicProjects:[
        {
            title:String,
            description:String,
            year:String,
            organization:String
        }
    ],
    awards:[{
        year:String,
        title:String,
        description:String
    }],
    languages:[{
        langname:String,
        read:Boolean,
        write:Boolean,
        speak:Boolean
    }],
    functionalSkills:[],
    experience:[{
        organization:String,
        duration:[],
        designation:String,
        workObjective:String
    }],
    internships:[{
        organization:String,
        duration:String,
        projectDescription:String
    }],
    workshops:[{
        title:String,
        description:String
    }],
    seminars:[{
        title:String,
        description:String
    }],
    hobbies:[],
    careerGoals:[]
})

module.exports=mongoose.model('resume',resumeSchema)