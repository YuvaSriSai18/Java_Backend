const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const authHeader = req.header('Authorization');
    console.log(`Req body in verify token : ${JSON.stringify(req.body)}`)
    if (!authHeader) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'
    if (!token) {
        return res.status(401).json({ message: 'Invalid Token Format' });
    }  

    console.log(`JWT Token is being verified`)

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or Expired Token' });
        }

        req.user = decoded; // Attach full decoded token to req
        console.log(`req.user : ${JSON.stringify(req.user)}`)
        req.body.createdBy = decoded.uid; // Append uid from token as createdBy
        // console.log(`req.body.createdBy : ${req.body.createdBy}`)
        console.log(`req.body after all : ${JSON.stringify(req.body)}`)
        next();
    });
}

module.exports = verifyToken;
