const mongoose=require('mongoose')

const templateSchema= mongoose.Schema({
templateName:String,
template:String,
createdOn:Number
})






module.exports=mongoose.model('template',templateSchema)