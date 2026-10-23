const router = require('express').Router();
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { sendMessageSchema } = require('./message.validation');
const { send, inbox } = require('./message.controller');

router.use(auth);

router.post('/', validate(sendMessageSchema), send);
router.get('/', inbox);

module.exports = router;