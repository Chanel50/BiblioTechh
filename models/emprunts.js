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
            ref: 'livresModel'
        },
        id_utilisateur: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'userModel'
        },
       
    
      
});

var empruntsModel = mongoose.model('emprunts', empruntsSchema);
module.exports = empruntsModel;