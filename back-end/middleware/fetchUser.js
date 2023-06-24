var jwt = require('jsonwebtoken');

//const JWT_SECRET = "vaidikkumar";
const { JWT_SECRET } = require('../config/keys');

const fetchuser = (req, res, next) => {

    //get the user from jwt token and add it to req obj
    const token = req.header('auth-token');
    if (!token) {
        return res.status(400).json({ error: "please authenticate using valid token" });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();

    } catch (error) {
        console.log(error);
        res.status(400).send({ error: "Please authenticate the valid token 2" });
    }

}
module.exports = fetchuser;