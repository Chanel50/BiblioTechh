// Importation de votre base de données ou d'un module d'accès aux données
const empruntsModel = require('../models/emprunts');
const livresModel = require('../models/livres');
const userModel = require('../models/userModel');

exports.getStatistiques = async (req, res) => {
  try {
    // Récupération des statistiques à partir de votre base de données
    const nombre_prets = await empruntsModel.count();
    const lecteurs = await userModel.find({roles: 'user'});
    const nombre_lecteurs = await userModel.countDocuments({roles: 'user'});
    const livres_empruntes = await empruntsModel.aggregate([
      { $group: { _id: '$livres_id', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }, // récupère les 10 livres les plus empruntés
      {
        $lookup: {
          from: 'livres', // nom de la collection des livres
          localField: 'livres_id',
          foreignField: 'livres_id',
          as: 'livres',
        },
      },
      { $unwind: '$livres' },
      { $project: { 'livres.titre': 1, count: 1 } },
    ]);

    const stats = {
      nombre_prets: nombre_prets,
      nombre_lecteurs: nombre_lecteurs,
      livres_empruntes: livres_empruntes,
    };

    // Envoi des statistiques sous forme de réponse JSON
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
  }
};


