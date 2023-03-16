const express = require('express');
const router = express.Router();
const empruntsController = require('../controllers/emprunts');
// Endpoint pour emprunter un livre
router.post('/emprunts', empruntsController.emprunterLivre);
// Endpoint pour obtenir tous les emprunts
router.get('/emprunts', empruntsController.getEmprunts);



// Endpoint pour retourner un livre
router.delete('/emprunts/:id_emprunt', empruntsController.rendreLivre);



// Endpoint pour renouveler un prêt unique
router.post('/emprunts/:id/renouveler', empruntsController.renouvelerEmprunt);




module.exports = router;
