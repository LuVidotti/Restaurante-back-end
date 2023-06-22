const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const handlebars = require('express-handlebars');
const flash = require('connect-flash');
const port = 3000;
const app = express();
const path = require('path');
const admin = require('./routes/admin');
const bodyParser = require('body-parser');

//config
    //mongoose
        mongoose.connect('mongodb://127.0.0.1:27017/restaurante').then(() => {
            console.log('Conectado com banco de dados');
        }).catch((erro) => {
            console.log('Erro ao conectar ao banco, erro: '+erro);
        })


    //session
        app.use(session({
            secret: '221203',
            resave: true,
            saveUninitialized: true
        }))

        app.use(flash());


    //midlewares
        app.use((req,res,next) => {
            res.locals.success_msg = req.flash('success_msg');
            res.locals.error_msg = req.flash('error_msg');
            next();
        })

    //handlebars
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}));
        app.set('view engine', 'handlebars');

    //public
        app.use(express.static(path.join(__dirname, 'public')));

    //body-parser
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());


//rotas

app.use('/admin', admin);

app.get('/', (req,res) => {
    res.send('teste');
})

app.listen(port, () => {
    console.log('Servidor rodando na porta 3000!!!');
})