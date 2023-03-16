// Importer les modèles requis
const empruntsModel = require('../models/emprunts');
const livresModel = require('../models/livres');
const userModel = require('../models/userModel');

// Endpoint pour obtenir tous les emprunts
exports.getEmprunts = async (req, res) => {
  try {
    const emprunts = await empruntsModel.find().populate('id_livres').populate('id_utilisateur').populate('dateRetour');
    res.status(200).json({ emprunts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting emprunts' });
  }
};



// Endpoint pour emprunter un livre
exports.emprunterLivre = async (req, res) => {
const { id_livres, id_utilisateur,dateRetour } = req.body;
try {
// Vérifiez si l'utilisateur a déjà emprunté 3 livres ce mois-ci
const now = new Date();
const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
const empruntsCount = await empruntsModel.countDocuments({
id_utilisateur,
date_emprunt: { $gte: monthStart, $lte: now }
});
if (empruntsCount >= 3) {
return res.status(400).json({ message: "Vous avez déjà emprunté 3 livres ce mois-ci." });
}
// Vérifiez si le livre est disponible
const livres = await livresModel.findById(id_livres);
if (livres.disponible==0) {
return res.status(400).json({ message: "Ce livre n'est pas disponible." });
}
// Créez un nouvel emprunt
const newEmprunt = new empruntsModel({
id_livres: id_livres,
id_utilisateur: id_utilisateur,
dateRetour: dateRetour,

});
await newEmprunt.save();

// add numEmprunt +1



// Mettez à jour le statut de disponibilité du livre
livres.disponible = false;
await livres.save();
res.status(201).json({ message: "Livre emprunté avec succès." });
} catch (err) {
res.status(500).json({ message: err.message });
}
};

// Endpoint pour retourner un livre
exports.rendreLivre = async (req, res) => {
const { id_emprunt } = req.params;
try {
// Trouvez l'emprunt correspondant
const emprunt = await empruntsModel.findById(id_emprunt);
if (!emprunt) {
return res.status(400).json({ message: "Cet emprunt n'existe pas." });
}
// Mettez à jour le statut de disponibilité du livre correspondant
const livre = await livresModel.findById(emprunt.id_livres);
livre.disponible = true;
await livre.save();
// Supprimez l'emprunt
await empruntsModel.findByIdAndDelete(id_emprunt);
res.status(200).json({ message: "Livre retourné avec succès." });
} catch (err) {
res.status(500).json({ message: err.message });
}
};
    
 // Controller pour renouveler un prêt unique
exports.renouvelerEmprunt = async (req, res) => {
    try {
      const emprunt = await empruntsModel.findById(req.params.id);
      if (!emprunt) {
        return res.status(404).json({ error: 'Emprunt not found' });
      }
      // Vérifier si l'utilisateur a déjà renouvelé ce prêt
      if (emprunt.rendu === true) {
        return res.status(400).json({ error: 'This emprunt has already been returned' });
      }
      // Vérifier si l'utilisateur a déjà renouvelé ce prêt
      if (emprunt.renouvele) {
        return res.status(400).json({ error: 'This emprunt has already been renewed' });
      }
      // Vérifier si l'utilisateur a dépassé la date limite de retour
      if (emprunt.dateRetour < Date.now()) {
        const dateSuspension = new Date();
        dateSuspension.setDate(dateSuspension.getDate() + (10*24*60*60*1000));
        emprunt.dateSuspension = dateSuspension;
        await emprunt.save();
        return res.status(400).json({ error: 'This emprunt is already overdue and suspended' });
      }
      // Renouveler l'emprunt
      emprunt.dateRetour.setDate(emprunt.dateRetour.getDate() + 7);
      emprunt.renouvele = true;
      await emprunt.save();
      res.json({ message: 'Emprunt renewed successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };   
 