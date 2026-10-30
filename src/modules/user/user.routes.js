const router = require('express').Router();
const auth = require('../../middlewares/auth');
const upload = require('../../pkg/upload');
const { uploadAvatar } = require('./user.controller');

router.use(auth);

router.patch('/me/avatar', upload.single('avatar'), uploadAvatar);

module.exports = router;