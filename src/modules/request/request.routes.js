const router = require('express').Router();
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { createRequestSchema, respondSchema } = require('./request.validation');
const { create, list, respond } = require('./request.controller');

router.use(auth);

router.post('/', validate(createRequestSchema), create);
router.get('/', list);
router.patch('/:id', validate(respondSchema), respond);

module.exports = router;