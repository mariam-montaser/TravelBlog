const jwt = require('jsonwebtoken');

const generateToken = (id, email) => {
    const token = jwt.sign({ id, email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    return token;
}