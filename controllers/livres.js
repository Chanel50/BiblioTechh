const livresModel = require('../models/livres');

// Create and Save a new category
exports.create = async (req, res) => {
    const { titre,auteur,catégorie,note,disponible } = req.body;
    
    if (!titre) {
        res.status(400).send({ message: "livres title can not be empty!" });
        return;
    }
    
    const livres = new livresModel({
        titre,auteur,catégorie,note,disponible
    });
    
    try {
        const savedlivres = await livres.save();
        res.status(201).json({
            message:"livres created successfully!!",
            livres: savedlivres
        });
    } catch(error) {
        res.status(500).json({ message: error.message || "Some error occurred while creating livres" });
    }
};

// Retrieve all livres from the database.
exports.findAll = async (req, res) => {
    try {
        const livres = await livresModel.find();
        res.status(200).json(livres);
    } catch(error) {
        res.status(500).json({ message: error.message || "Some error occurred while retrieving livres" });
    }
};

// Find a single livres with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;
    
    try {
        const livres = await livresModel.findById(id);
        if (livres) {
            res.status(200).json(livres);
        } else {
            res.status(404).json({ message: "livres not found" });
        }
    } catch(error) {
        res.status(500).json({ message: error.message || "Some error occurred while retrieving livres" });
    }
};

// Update a livres by the id in the request
exports.update = async (req, res) => {
    if(!req.body) {
        res.status(400).send({ message: "Data to update can not be empty!" });
        return;
    }
    
    const id = req.params.id;
    
    try {
        const updatedlivres = await livresModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false, new: true });
        if (updatedlivres) {
            res.status(200).json({ message: "livres updated successfully", livres: updatedlivres });
        } else {
            res.status(404).json({ message: "livres not found" });
        }
    } catch(error) {
        res.status(500).json({ message: error.message || "Some error occurred while updating livres" });
    }
};

// Delete a livres with the specified id in the request
exports.destroy = async (req, res) => {
    const id = req.params.id;
    
    try {
        const deletedlivres = await livresModel.findByIdAndRemove(id);
        if (deletedlivres) {
            res.status(200).json({ message: "livres deleted successfully" });
        } else {
            res.status(404).json({ message: "livres not found" });
        }
    } catch(error) {
        res.status(500).json({ message: error.message || "Some error occurred while deleting livres" });
    }
};





// Récupérer tous les livres
exports.getAllLivres = async (req, res) => {
    try {
        
        const livres = await livresModel.find();
        res.send(livres);
    } catch (error) {
        res.status(400).json(error)
    }
  };
  
  // Rechercher des livres en fonction des critères spécifiés
  exports.searchLivres = async (req, res) => {
    const { catégorie, auteur, note, emprunts } = req.query;
    const searchCriteria = {};
    if (catégorie) {
      searchCriteria.catégorie = catégorie;
    }
    if (auteur) {
      searchCriteria.auteur = auteur;
    }
    if (note) {
      searchCriteria.note = { $gte: parseInt(note) };
    }
    if (emprunts) {
      searchCriteria.emprunts = { $gte: parseInt(emprunts) };
    }
    const livres = await livresModel.find(searchCriteria);
    res.send(livres);
  };
  