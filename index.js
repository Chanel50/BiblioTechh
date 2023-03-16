const cookieParser = require('cookie-parser');
const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();


//Configure dotenv files above using any other library and files

require('./config/conn');
//Creating an app from express
const app = express();
const route = require('./routes/userRoute');
const categoryRoute = require('./routes/category')
const commentairesRoute = require('./routes/commentaires')
const replyRoute = require('./routes/reply')
//const prêtRoute = require('./routes/prêt')
const livresRoute = require('./routes/livres')
const empruntsRouter = require('./routes/emprunts');
const statistiquesRouter = require('./routes/statistiques');

function sendEmail()
{
    return new Promise((resolve,reject)=>{
        var transporter= nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:'hamelchanel10@gmail.com',
                pass: 'fejtefyrhywmcukg'
            }
        })
        const mail_configs={
            from: 'hamelchanel10@gmail.com',
            to: 'hamelchanel10@gmail.com',
            subject: 'Nouveau livre ajouté',
            text: 'Bonjour lecteur il y a un nouveau livre '
        }
        transporter.sendMail(mail_configs, function(error, info){
            if(error){
                console.log(error)
                return reject({ message:'an error has occured'})
            }
            return resolve({message: "Email sent succesfuly"})
        })
    })
}

app.get('/',(req,res)=> {
sendEmail()
.then(response=> res.send(response.message))
.catch(error=> res.status(500).send(error.message))
})

app.get('/',(req,res)=> {
    verifyRole()
    .then(response=> res.send(response.message))
    .catch(error=> res.status(500).send(error.message))
    })
    


//Using express.json to get request of json data
app.use(cookieParser());
app.use(express.json());

app.use('/category',categoryRoute)
app.use('/commentaires',commentairesRoute)
app.use('/reply',replyRoute)
//app.use('/prêt',prêtRoute)
app.use('/livres',livresRoute)
app.use('/emprunts', empruntsRouter);
app.use('/statistiques', statistiquesRouter);

//Using routes
app.use('/api', route);

//listening to the server
app.listen(process.env.PORT,()=>{
    console.log(`Server is listening at ${process.env.PORT}`);
})
