// const Prêt = require('../models/prêt');

// module.exports = {
//   createprêt: async (req, res) => {
//     const {id_livres , id_utilisateur } = req.body;
//     const prêt = new Prêt({ id_livres, id_utilisateur });
//     await prêt.save();
//     res.json(prêt);
//   },

//   getprêtsByID: async (req, res) => {
//     const id_utilisateur = req.params.id_utilisateur;
//     const prêts = await Prêt.find({ id_utilisateur });
//     res.json(prêts);
//   }
// };

