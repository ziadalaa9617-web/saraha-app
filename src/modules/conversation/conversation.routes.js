const router = require('express').Router();
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { sendSchema } = require('./conversation.validation');
const { list, send, messages } = require('./conversation.controller');

router.use(auth);

router.get('/', list);
router.post('/:id/messages', validate(sendSchema), send);
router.get('/:id/messages', messages);

module.exports = router;