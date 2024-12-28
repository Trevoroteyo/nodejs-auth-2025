const jwt = require("jsonwebtoken")

//checks if user is authenticated
const authMiddleware = (req,res,next)=>{

    const authHeader = req.headers['authorization']
    console.log(authHeader);
    const token = authHeader && authHeader.split(" ")[1]
    if(!token){
       return res.status(401).json({
            success : false , 
            message : 'Access denied. No token provided. Please login to continue'
        })
    }

    //decode the token
    try {
        const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.userInfo = decodedTokenInfo;

    next();
    } catch (error) {
       return res.status(500).json({
            success : false , 
            message : 'Access denied. No token provided. Please login to continue'
        })
    }
    
}

module.exports = authMiddleware;