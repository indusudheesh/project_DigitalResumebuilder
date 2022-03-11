const jwt=require('jsonwebtoken')

//token varification


module.exports.verifyToken=(req,res,next)=>{
    let authHeader=req.headers.authorization
    if(authHeader==undefined)
        res.status(401).json({message:'no token provided'})
        let token=authHeader.split(' ')[1]
        jwt.verify(token,'secretkeyforcreatingjsonwebtokenforauthentication',(err)=>{
            if(err)
            res.status(500).json({error:"Authentication failed"})
            else{
                let decode=JSON.parse(atob(req.headers.authorization.split('.')[1]))
                req.username=decode.username
                req.role=decode.role
                next()
            }
        })
    
}