const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const User = require('../models/user');

exports.login = (req, res, next) => {
    let user;
    User.findOne({ email: req.body.email }).then(fetchedUser => {
        if (!fetchedUser) {
            return res.status(401).json({
                message: 'User not found'
            });
        }
        user = fetchedUser;
        return bcrypt.compare(req.body.password, fetchedUser.password)
    }).then(same => {
        if (!same) {
            return res.status(401).json({
                message: 'Authentication Faild.'
            });
        }
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({
            token: token,
            expiresIn: 3600,
            userId: user._id
        });
    }).catch(error => {
        return res.status(401).json({
            message: 'Authentication Faild.'
        });
    })
}

exports.siginup = (req, res, next) => {
    bcrypt.hash(req.body.password, 11).then(hashed => {
        const user = new User({
            email: req.body.email,
            password: hashed
        });
        user.save().then(user => {
            res.status(201).json({
                message: "User Created",
                user
            })
        }).catch(error => {
            res.status(500).json({
                message: "Faild",
                error: error
            })
        })
    })

}
