import jwt from "jsonwebtoken";

export  const authMiddleware = (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({error: "No authorization header found"})
        }
        const token = authHeader.split(" ")[1];
        if(!token){
            return res.status(401).json({error: "No token found"})
        }
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.id = decoded.id;
            req.role = decoded.role;
            next()
        }catch(error){
            return res.status(401).json({error: "Invalid token"})
        }
       
    }catch(error){
        return res.status(500).json({message: "Internal server error from guardAuth"})
    }
}