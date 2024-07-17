const jwt = require("jsonwebtoken");

module.exports = function(req, res, next){
    const token = req.header("Authorization").replace("Bearer ", "");

    if (!token) {
        console.log("No token provided"); 
        return res.status(401).json({msg: "No token, authorization denied"});
    }

    try {
        const decoded = jwt.verify(token, "mysecretkey");
        req.user = decoded.user;
        console.log("Token decoded, user:", req.user);
        next();

    }catch (err) {
        console.error("Token verification failed:", err.message);
        res.status(401).json({msg: "Token is not valid"});
    }
};