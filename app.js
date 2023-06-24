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
const usuarios = require('./routes/usuario');
const passport = require('passport');
require('./config/auth')(passport);

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

        app.use(passport.initialize());
        app.use(passport.session());
        app.use(flash());


    //midlewares
        app.use((req,res,next) => {
            res.locals.success_msg = req.flash('success_msg');
            res.locals.error_msg = req.flash('error_msg');
            res.locals.error = req.flash('error');
            res.locals.user = req.user || null;
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
app.use('/usuarios', usuarios);

app.get('/', (req,res) => {
    res.render('home');
})

app.listen(port, () => {
    console.log('Servidor rodando na porta 3000!!!');
})