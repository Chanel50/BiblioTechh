const express = require('express')
const UserControllers = require('../controllers/livres')


const router = express.Router();

router.get('/', UserControllers.findAll);
router.get('/allLivres', UserControllers.getAllLivres);
router.get('/searchLivres', UserControllers.searchLivres);
router.get('/:id', UserControllers.findOne);
router.post('/', UserControllers.create);
router.patch('/:id', UserControllers.update);
router.delete('/:id', UserControllers.destroy);

module.exports = router;