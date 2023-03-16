const livresModel = require('../models/livres');
const userModel = require('../models/userModel');
const nodemailer = require('nodemailer');

// Create and Save a new BOOK
exports.create = async (req, res) => {
    const { titre, auteur, catégorie, note, disponible } = req.body;

    if (!titre) {
        res.status(400).send({ message: "livres title can not be empty!" });
        return;
    }

    const livres = new livresModel({
        titre, auteur, catégorie, note, disponible
    });

    try {
        const savedlivres = await livres.save();

        const users = await userModel.find({ email: { $ne: null, $ne: '' } });
        for (const user of users) {
            await sendEmail(user.email);
        }

        res.status(201).json({
            message: "livres created successfully!!",
            livres: savedlivres
        });
    } catch (error) {
        res.status(500).json({ message: error.message || "Some error occurred while creating livres" });
    }
};

function sendEmail(email) {
    return new Promise((resolve, reject) => {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'hamelchanel10@gmail.com',
                pass: 'fejtefyrhywmcukg'
            }
        })
        const mail_configs = {
            from: 'hamelchanel10@gmail.com',
            to: email,
            subject: 'Nouveau livre ajouté',
            text: 'Bonjour lecteur il y a un nouveau livre '
        }
        transporter.sendMail(mail_configs, function (error, info) {
            if (error) {
                console.log(error)
                return reject({ message: 'an error has occured' })
            }
            return resolve({ message: "Email sent succesfuly" })
        })
    })
}





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
  
  exports.searchLivres = async (req, res) => {
    try {
      const { catégorie, auteur, note, emprunts } = req.query;
      const searchCriteria = {};
      if (catégorie) {
        searchCriteria.catégorie = catégorie;
      }
      if (auteur) {
        searchCriteria.auteur = auteur;
      }
      if (note && !isNaN(parseInt(note)) && parseInt(note) >= 0 && parseInt(note) <= 5) {
        searchCriteria.note = { $gte: parseInt(note) };
      }
      if (emprunts && !isNaN(parseInt(emprunts)) && parseInt(emprunts) >= 0) {
        searchCriteria.emprunts = { $gte: parseInt(emprunts) };
      }
      const books = await livresModel.find(searchCriteria);
      if (books.length === 0) {
        res.status(404).send('No results found');
      } else {
        res.send(books);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  };
  