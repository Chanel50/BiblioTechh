var mongoose = require('mongoose');

var empruntsSchema = new mongoose.Schema({
  
   
       
        date_emprunt: {
          type: Date,
          default : ()=>{
            return new Date();
          }
        },
        id_livres:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'livres'
        },
        id_utilisateur: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
         dateRetour: { 
          type: Date, 
          required: true 
        },
         
        rendu: {
          type: Boolean,
          default: false
        }
    
      
});

var empruntsModel = mongoose.model('emprunts', empruntsSchema);
module.exports = empruntsModel;