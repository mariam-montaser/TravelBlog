const path = require('path');

const express = require('express');
const mongoose = require('mongoose');

const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');

const app = express();

mongoose.connect(`mongodb+srv://mariammontaser:${process.env.MONGO_ATLAS_PASS}@cluster0.kfbwz.mongodb.net/blog?retryWrites=true&w=majority`).then(() => {
    console.log('connected');
}).catch(error => {
    console.log('Failed', error);
})

app.use(express.json());
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, OPTIONS, GET, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization ,X-Requested-With, Origin, Accept, Content-Type');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})

app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);


module.exports = app;