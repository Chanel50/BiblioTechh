const express = require('express');
const router = express.Router();
const verifyRole = require('../middleware/verifyRole'); // Import the verifyRole middleware
const statistiquesController = require('../controllers/statistiques');

router.get('/statistiques', statistiquesController.getStatistiques);

module.exports = router;


