const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Sobremesa');
const Sobremesa = mongoose.model('sobremesas');

router.get('/', (req,res) => {
    res.render('admin/index');
})

router.get('/sobremesas', (req,res) => {
    Sobremesa.find().lean().then((sobremesas) => {
        res.render('admin/sobremesas', {sobremesas:sobremesas});
    })
    
    
})

router.get('/sobremesas/cad', (req,res) => {
    res.render('admin/cadsobremesas');
})

router.post('/sobremesas/nova', (req,res) => {
    var erros = [];
    
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({texto: 'Erro, nome inválido'});
    }

    if(req.body.nome.length < 3) {
        erros.push({texto: 'Erro, nome muito pequeno'});
    }

    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null) {
        erros.push({texto: 'Erro, descrição inválida'});
    }

    if(erros.length > 0) {
        res.render('admin/cadsobremesas', {erros:erros});
    } else {
        const novaSobremesa = {
            nome: req.body.nome,
            descricao: req.body.descricao,
        }

        new Sobremesa(novaSobremesa).save().then(() => {
            req.flash('success_msg', 'Sobremesa cadastrada com sucesso!!!');
            res.redirect('/admin/sobremesas');
        }).catch((erro) => {
            req.flash('error_msg', 'Erro ao cadastrar sobremesa, erro: '+erro);
            res.redirect('/admin/sobremesas');
        })
    }
})

router.get('/sobremesas/edit/:id', (req,res) => {
    Sobremesa.findOne({_id:req.params.id}).lean().then((sobremesa) => {
        res.render('admin/editsobremesas', {sobremesa:sobremesa});
    }).catch((erro) => {
        req.flash('error_msg', 'Sobremesa não encontrada, erro: '+erro);
        res.redirect('/admin/sobremesas');
    })
})

router.post('/sobremesas/edit', (req,res) => {
    var erros = [];
    
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({texto: 'Erro, nome inválido'});
    }

    if(req.body.nome.length < 3) {
        erros.push({texto: 'Erro, nome muito pequeno'});
    }

    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null) {
        erros.push({texto: 'Erro, descrição inválida'});
    }

    if(erros.length > 0) {
        res.render('admin/editsobremesas', {erros:erros});
    } else {
        Sobremesa.findOne({_id:req.body.id}).then((sobremesa) => {
            sobremesa.nome = req.body.nome;
            sobremesa.descricao = req.body.descricao;

            sobremesa.save().then(() => {
                req.flash('success_msg', 'Sobremesa editada com sucesso!!!');
                res.redirect('/admin/sobremesas');
            })
        }).catch((erro) => {
            req.flash('error_msg', 'Erro ao editar sobremesa, erro: '+erro);
            res.redirect('/admin/sobremesas');
        })
    }
})

router.post('/sobremesas/deletar', (req,res) => {
    Sobremesa.deleteOne({_id:req.body.id}).then(() => {
        req.flash('success_msg', 'Sobremesa deletada com sucesso!!!');
        res.redirect('/admin/sobremesas');
    }).catch((erro) => {
        req.flash('error_msg', 'Erro ao deletar sobremesa, erro: '+erro);
        res.redirect('/admin/sobremesas');
    })
})

module.exports = router;