const express = require('express');
const router = express.Router();

const postController = require('../controllers/posts');

const fileUpload = require('../middleware/fileUpload');
const checkAuth = require('../middleware/check-auth');

router.post('', checkAuth, fileUpload.single('image'), postController.createPost);
router.get('', postController.getPosts);
router.get('/:id', postController.getPost);
router.put('/:id', checkAuth, fileUpload.single('image'), postController.updatePost);
router.delete('/:id', checkAuth, postController.deletePost);


module.exports = router;