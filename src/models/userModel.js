const mongoose=require('mongoose')

const userSchema= mongoose.Schema({
username:{type:String,unique:true},
email:{type:String,unique:true},
password:String,
role:String
})






module.exports=mongoose.model('user',userSchema)