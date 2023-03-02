var mongoose = require('mongoose');

var livresSchema = new mongoose.Schema({
  
    titre: {
        type: String,
        required: true
    },
    auteur: {
        type: String,
        required: true
    },
    catégorie: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: true
    },
    disponible: {
        type: Number,
        required: true
    },
});

var livresModel = mongoose.model('livres', livresSchema);
module.exports = livresModel;