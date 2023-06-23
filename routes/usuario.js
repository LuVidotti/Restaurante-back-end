const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
require('../models/Usuario');
const Usuario = mongoose.model('usuarios');
const bcrypt = require('bcryptjs');


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
                    senha : hash
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

module.exports = router;


