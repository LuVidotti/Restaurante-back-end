const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
require('../models/Usuario');
const Usuario = mongoose.model('usuarios');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {eUser} = require('../helpers/eUser');


router.get('/registro', (req,res) => {
    res.render('usuario/registro');
})

router.post('/registro', (req,res) => {
    var erros = [];

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({texto: 'nome inválido'})
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({texto: 'E-mail inválido'});
    }

    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        erros.push({texto: 'senha inválida'});
    }

    if(req.body.senha.length < 4) {
        erros.push({texto: 'senha muito curta'});
    }

    if(req.body.senha != req.body.senha2) {
        erros.push({texto: 'As senhas devem coincidir'});
    }

    if(erros.length > 0) {
        res.render('usuario/registro', {erros:erros});
    } else {
        Usuario.findOne({email:req.body.email}).then((usuario) => {
            if(usuario) {
                req.flash('error_msg', 'Já existe uma conta registrada com este e-mail, tente novamente');
                res.redirect('/usuarios/registro');
            } else {
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(req.body.senha, salt);

                const novoUsuario = {
                    nome : req.body.nome,
                    email : req.body.email,
                    senha : hash,
                }

                new Usuario(novoUsuario).save().then(() => {
                    req.flash('success_msg', 'Usuario cadastrado com sucesso!!!');
                    res.redirect('/');
                }).catch((erro) => {
                    req.flash('error_msg', 'Erro ao cadastrar usuario');
                    res.redirect('/');
                })
            }
        }).catch((erro) => {
            req.flash('error_msg', 'Houve um erro interno, erro: '+erro);
            res.redirect('/');
        })
    }
})

router.get('/login', (req,res) => {
    res.render('usuario/login');
})

router.post('/loginpage', (req,res,next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/usuarios/login',
        failureFlash: true
    })(req,res,next);
})

router.get('/logout', (req,res) => {
    req.logout((erro) => {
        req.flash('success_msg', 'Deslogado com sucesso!!!');
        res.redirect('/');
    })
})

router.get('/perfil', eUser, (req,res) => {
    res.render('usuario/perfil', {usuario: req.user});
})

router.get('/edit/:id', eUser, (req,res) => {
    Usuario.findOne({_id:req.params.id}).lean().then((usuario) => {
        res.render('usuario/editusuario', {usuario:usuario});
    }).catch((erro) => {
        req.flash('error_msg', 'Erro ao encontrar usuario, erro: '+erro);
        res.redirect('/usuarios/perfil');
    })
})

router.post('/edit', eUser, (req,res) => {
    var erros = [];

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({texto: 'nome inválido'})
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({texto: 'E-mail inválido'});
    }

    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        erros.push({texto: 'senha inválida'});
    }

    if(req.body.senha.length < 4) {
        erros.push({texto: 'senha muito curta'});
    }

    if(req.body.senha != req.body.senha2) {
        erros.push({texto: 'As senhas devem coincidir'});
    }

    if(erros.length > 0) {
        res.render('admin/editusuarios', {erros:erros});
    } else {
        Usuario.findOne({_id:req.body.id}).then((usuario) => {
            usuario.nome = req.body.nome;
            usuario.email = req.body.email
    
            if(req.body.senha) {
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(req.body.senha, salt);
                usuario.senha = hash;
            }
    
            usuario.save().then(() => {
                req.flash('success_msg', 'Usuário editado com sucesso!!!');
                res.redirect('/usuarios/perfil');
            }).catch((erro) => {
                req.flash('error_msg', 'Erro ao salvar usuário editado, erro: '+erro);
                res.redirect('/usuarios/perfil');
            })
        }).catch((erro) => {
            req.flash('error_msg', 'Erro ao fornecer id do usuario, erro: '+erro);
            res.redirect('/usuarios/perfil');
        })
    }
})

router.get('/numero', (req,res) => {
    res.render('usuario/numero', {usuario:req.user});
})

module.exports = router;


