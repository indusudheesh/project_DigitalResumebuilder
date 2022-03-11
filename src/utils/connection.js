var mongoose=require('mongoose')

const connection=()=>{
    try {
        mongoose.connect('mongodb://localhost:27017/dbResume',{UseNewUrlParser:true,UseUnifiedTopology:true})
        console.log('database connected')
    } catch (err) {
        console.log('error to connect database')
    }
}

module.exports=connection