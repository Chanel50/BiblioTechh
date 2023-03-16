//Requiring all the necessary files and libraries
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const isAuthenticated = require('../middleware/auth');

//Creating express router
const route = express.Router();
//Importing userModel
const userModel = require('../models/userModel');

//Creating register route
route.post("/register", async (req, res) => {

    try {
        const { name, email, password, roles } = req.body;
        //Check emptyness of the incoming data
        if (!name || !email || !password || !roles) {
            return res.json({ message: 'Please enter all the details' })
        }

        //Check if the user already exist or not
        const userExist = await userModel.findOne({ email: req.body.email });
        if (userExist) {
            return res.json({ message: 'User already exist with the given emailId' })
        }
        //Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashPassword;
        const user = new userModel(req.body);
        await user.save();
        const users = await userModel.find({ email: { $ne: null, $ne: '' } });
        for (const user of users) {
            await sendEmail(user.email);
        }
        
        const token =  jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRE,
        });
        return res.cookie("token", token).json({ success: true, message: 'User registered successfully', data: user ,token})
    } catch (error) {
        return res.json({ error: error });
    }

})

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
};
//Creating login routes
route.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        //Check emptyness of the incoming data
        if (!email || !password) {
            return res.json({ message: 'Please enter all the details' })
        }
        //Check if the user already exist or not
        const userExist = await userModel.findOne({ email: req.body.email });
        if (!userExist) {
            return res.json({ message: 'Wrong credentials' })
        }
        //Check password match
        const isPasswordMatched = await bcrypt.compare(password, userExist.password);
        if (!isPasswordMatched) {
            return res.json({ message: 'Wrong credentials pass' });
        }
        const token =  jwt.sign({ id: userExist._id , role: userExist.roles }, process.env.SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRE,
        });
        
        return res.cookie("token",token).json({ success: true, message: 'LoggedIn Successfully', token: token })
    } catch (error) {
        return res.json({ error: error });
    }

})

//Creating user routes to fetch users data
route.get('/user', isAuthenticated, async (req, res) => {
    try {
        const user = await userModel.find();
        if (!user) {
            return res.json({ message: 'No user found' })
        }
        return res.json({ user: user })
    } catch (error) {
        return res.json({ error: error });
    }
})

module.exports = route;