const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const page = +req.query.page;
    const postQuery = Post.find();
    let posts;
    if (page && pageSize) {
        postQuery.skip(pageSize * (page - 1)).limit(pageSize)
    }
    postQuery.then(fetchedPosts => {
        console.log(fetchedPosts);
        posts = fetchedPosts;
        return Post.count()
            .then(count => {
                console.log(count);
                res.status(200).json({
                    message: 'Posts Fetched Successfully.',
                    totalPosts: count,
                    posts
                });
            });
    }).catch(error => {
        res.status(500).json({
            message: "Failed to fetch the posts."
        })
    })
}

exports.getPost = (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({
                message: 'Post not found.'
            })
        }
    }).catch(error => {
        res.status(500).json({
            message: "Failed to fetch the post."
        })
    })
}

exports.createPost = (req, res, next) => {
    console.log(req.userData);
    console.log(req.body);
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename,
        creator: req.userData.id
    });
    post.save()
        .then(createdPost => {
            console.log(createdPost);
            res.status(201).json({
                message: "Post Created Successfully.",
                post: {
                    ...createdPost,
                    id: createdPost._id
                }
            })
        }).catch(error => {
            res.status(500).json({
                message: "Failed to create the post."
            })
        })
}

exports.updatePost = (req, res, next) => {
    let imgPath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        imgPath = url + '/images/' + req.file.filename;
    }
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imgPath,
        creator: req.userData.id
    })
    Post.updateOne({ _id: req.params.id, creator: req.userData.id }, post).then(result => {
        if (result.n > 0) {
            res.status(200).json({
                message: 'Post Updated Successfully.'
            })
        } else {
            res.status(401).json({
                message: 'Not Authorized.'
            })
        }
    }).catch(error => {
        res.status(500).json({
            message: "Failed to update the post."
        })
    })
}

exports.deletePost = (req, res, next) => {
    Post.deleteOne({ _id: req.params.id, creator: req.userData.id }).then(result => {
        if (result.n > 0) {
            res.status(200).json({
                message: "Post Deleted Successfully."
            })
        } else {
            res.status(401).json({
                message: "Not Authorized."
            })
        }
    }).catch(error => {
        res.status(500).json({
            message: "Failed to delete the post."
        })
    })
}