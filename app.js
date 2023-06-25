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
require('./models/PratoPrincipal');
const PratoPrincipal = mongoose.model('pratosPrincipais');
require('./models/Sobremesa');
const Sobremesa = mongoose.model('sobremesas');
require('./models/Pedido');
const Pedido = mongoose.model('pedidos');
const {eUser} = require('./helpers/eUser');

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
    Pedido.find().populate('pratoPrincipal').populate('sobremesa').sort({data: 'desc'}).lean().then((pedidos) => {
        res.render('home', {pedidos:pedidos});
    })
})

app.get('/pedidos/cad', eUser, (req,res) => {
    PratoPrincipal.find().lean().then((pratosPrincipais) => {
        Sobremesa.find().lean().then((sobremesas) => {
            res.render('cadpedidos', {pratosPrincipais:pratosPrincipais, sobremesas:sobremesas});
        }).catch((erro) => {
            req.flash('error_msg', 'Erro ao encontrar sobremesas, erro: '+erro);
            res.redirect('/');
        })
    }).catch((erro) => {
        req.flash('error_msg', 'Erro ao encontrar pratos principais, erro: '+erro);
        res.redirect('/');
    })
})

app.post('/pedidos/novo', eUser, (req,res) => {
    var erros = [];

    if(!req.body.mesa || typeof req.body.mesa == undefined || req.body.mesa == null) {
        erros.push({texto:'Número de mesa inválido'});
    }

    if(req.body.mesa < 1) {
        erros.push({texto: 'Não existem mesas com número menor que 1'});
    }

    if(!req.body.pratoPrincipal || typeof req.body.pratoPrincipal == undefined || req.body.pratoPrincipal == null) {
        erros.push({texto:'Prato principal inválido'});
    }

    if(!req.body.sobremesa || typeof req.body.sobremesa == undefined || req.body.sobremesa == null) {
        erros.push({texto:'Sobremesa inválida'});
    }

    if(erros.length > 0) {
        res.render('cadpedidos', {erros:erros});
    } else {
        const novoPedido = {
            mesa: req.body.mesa,
            pratoPrincipal: req.body.pratoPrincipal,
            sobremesa: req.body.sobremesa,
            observacao:req.body.observacao
        }

        new Pedido(novoPedido).save().then(() => {
            req.flash('success_msg', 'Pedido cadastrado com sucesso!!!');
            res.redirect('/');
        }).catch((erro) => {
            req.flash('error_msg', 'Erro ao salvar novo pedido, erro: '+erro);
            res.redirect('/');
        })
    }
})

app.get('/pedidos/edit/:id', eUser, (req,res) => {
    Pedido.findOne({_id:req.params.id}).lean().then((pedido) => {
        PratoPrincipal.find().lean().then((pratosPrincipais) => {
            Sobremesa.find().lean().then((sobremesas) => {
                res.render('editpedidos', {pedido:pedido, pratosPrincipais:pratosPrincipais, sobremesas:sobremesas});
            })
        }).catch((erro) => {
            req.flash('error_msg', 'Erro ao encontrar pratos principais, erro: '+erro);
            res.redirect('/');
        })
    }).catch((erro) => {
        req.flash('error_msg', 'Erro ao encontrar id do pedido, erro: '+erro);
        res.redirect('/');
    })
})

app.post('/pedidos/edit', eUser, (req,res) => {
    var erros = [];

    if(!req.body.mesa || typeof req.body.mesa == undefined || req.body.mesa == null) {
        erros.push({texto:'Número de mesa inválido'});
    }

    if(req.body.mesa < 1) {
        erros.push({texto: 'Não existem mesas com número menor que 1'});
    }

    if(!req.body.pratoPrincipal || typeof req.body.pratoPrincipal == undefined || req.body.pratoPrincipal == null) {
        erros.push({texto:'Prato principal inválido'});
    }

    if(!req.body.sobremesa || typeof req.body.sobremesa == undefined || req.body.sobremesa == null) {
        erros.push({texto:'Sobremesa inválida'});
    }

    if(erros.length > 0) {
        res.render('editpedidos', {erros:erros});
    } else {
        Pedido.findOne({_id:req.body.id}).then((pedido) => {
            pedido.mesa = req.body.mesa;
            pedido.pratoPrincipal = req.body.pratoPrincipal;
            pedido.sobremesa = req.body.sobremesa;
            pedido.observacao = req.body.observacao;
            pedido.data = Date.now();

            pedido.save().then(() => {
                req.flash('success_msg', 'Pedido editado com sucesso!!!');
                res.redirect('/');
            }).catch((erro) => {
                req.flash('error_msg', 'Erro ao editar pedido, erro: '+erro);
                res.redirect('/');
            })
        }).catch((erro) => {
            req.flash('error_msg', 'Erro ao receber id do pedido, erro: '+erro);
            res.redirect('/');
        })
    }
    
})

app.post('/pedidos/deletar', eUser, (req,res) => {
    Pedido.deleteOne({_id:req.body.id}).then(() => {
        req.flash('success_msg', 'Pedido deletado com sucesso!!!');
        res.redirect('/');
    }).catch((erro) => {
        req.flash('error_msg', 'Erro ao deletar pedido, erro: '+erro);
        res.redirect('/');
    })
})

app.listen(port, () => {
    console.log('Servidor rodando na porta 3000!!!');
})