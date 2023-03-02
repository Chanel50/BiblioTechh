// Importer les modèles requis
const empruntsModel = require('../models/emprunts');
const livresModel = require('../models/livres');
const userModel = require('../models/userModel');

// Endpoint pour obtenir tous les emprunts
exports.getEmprunts = async (req, res) => {
try {
    
const emprunts = await empruntsModel.find().populate('id_livres id_utilisateur');
res.status(200).json({ emprunts });
} catch (err) {
res.status(500).json({ message: err.message });
}
};

// Endpoint pour emprunter un livre
exports.emprunterLivre = async (req, res) => {
const { id_livres, id_utilisateur } = req.body;
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
});
await newEmprunt.save();
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
    
    