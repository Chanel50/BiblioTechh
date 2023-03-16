const commentairesModel = require('../models/commentaires');

// Create and Save a new commentaires
exports.create = async (req, res) => {
    const { commentaires: commentairesText, id_utilisateur, id_livres } = req.body;
    
    if (!commentairesText) {
        res.status(400).send({ message: "commentaires  can not be empty!" });
        return;
    }
    
    const commentairesObject = new commentairesModel({
        commentaires: commentairesText,
        id_utilisateur,
        id_livres
    });
    
    try {
        const savedcommentaires = await commentairesObject.save();
        res.status(201).json({
            message:"commentaires created successfully!!",
            commentaires: savedcommentaires
        });
    } catch(error) {
        res.status(500).json({ message: error.message || "Some error occurred while creating commentaires" });
    }
};

// Retrieve all commentaires from the database.
exports.findAll = async (req, res) => {
    try {
        const commentaires = await commentairesModel.find();
        res.status(200).json(commentaires);
    } catch(error) {
        res.status(500).json({ message: error.message || "Some error occurred while retrieving commentaires" });
    }
};

// Find a single commentaires with an id
exports.findOne = async (req, res) => {
    const id = req.params.id;
    
    try {
        const commentaires = await commentairesModel.findById(id);
        if (commentaires) {
            res.status(200).json(commentaires);
        } else {
            res.status(404).json({ message: "commentaires not found" });
        }
    } catch(error) {
        res.status(500).json({ message: error.message || "Some error occurred while retrieving commentaires" });
    }
};

// Update a commentaires by the id in the request
exports.update = async (req, res) => {
    if(!req.body) {
        res.status(400).send({ message: "Data to update can not be empty!" });
        return;
    }
    
    const id = req.params.id;
    
    try {
        const updatedcommentaires = await commentairesModel.findByIdAndUpdate(id, req.body, { useFindAndModify: false, new: true });
        if (updatedcommentaires) {
            res.status(200).json({ message: "commentaires updated successfully", commentaires: updatedcommentaires });
        } else {
            res.status(404).json({ message: "commentaires not found" });
        }
    } catch(error) {
        res.status(500).json({ message: error.message || "Some error occurred while updating commentaires" });
    }
};

// Delete a commentaires with the specified id

exports.destroy = async (req, res) => {
    const id = req.params.id;
    
    try {
        const deletedcommentairess = await commentairessModel.findByIdAndRemove(id);
        
        if (deletedcommentairess) {
            res.status(200).json({ message: "commentairess deleted successfully" });
        } else {
            res.status(404).json({ message: "commentairess not found" });
        }
    } catch(error) {
        res.status(500).json({ message: error.message || "Some error occurred while deleting commentairess" });
    }
};

