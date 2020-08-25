const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, "This_is_the_secret_key_for_jsonwebtoken");
        req.userData = { email: decode.email, id: decode.id };
        next();
    } catch (error) {
        res.status(401).json({
            message: 'Not Authenticated.'
        })
    }
}