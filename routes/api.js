//Rotas da API

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Sobremesa');
const Sobremesa = mongoose.model('sobremesas');
require('../models/PratoPrincipal');
const PratoPrincipal = mongoose.model('pratosPrincipais');
require('../models/Pedido');
const Pedido = mongoose.model('pedidos');
require('../models/Usuario');
const Usuario = mongoose.model('usuarios');

//Sobremesas

router.get('/sobremesas', (req,res) => {
    Sobremesa.find().then((sobremesas) => {
        res.status(200).json(sobremesas);
    }).catch((erro) => {
        res.status(500).json({erro: 'Houve um erro'});
    })
})

router.post('/sobremesas', (req,res) => {
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
        res.status(400).json(erros);
    } else {
        const novaSobremesa = {
            nome: req.body.nome,
            descricao: req.body.descricao
        }

        new Sobremesa(novaSobremesa).save().then(() => {
            res.status(201).json({message: 'Sobremesa adicionada com sucesso!!!', novaSobremesa:novaSobremesa});
        }).catch((erro) => {
            res.status(500).json({erro: 'Houve um erro'});
        })
    }
    
})

router.put('/sobremesas/:id', (req,res) => {
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
        res.status(400).json(erros);
    } else {
        Sobremesa.findOne({_id: req.params.id}).then((sobremesa) => {
            sobremesa.nome = req.body.nome;
            sobremesa.descricao = req.body.descricao;

            sobremesa.save().then(() => {
                res.status(201).json({message: 'Sobremesa editada com sucesso!!!', sobremesa:sobremesa});
            }).catch((erro) => {
                res.status(500).json({erro: 'Houve um erro'});
            })
        })
    }
})

router.delete('/sobremesas/:id', (req,res) => {
    Sobremesa.deleteOne({_id:req.params.id}).then((sobremesa) => {
        res.status(200).json({message: 'Sobremesa deletada com sucesso!!!', sobremesa:sobremesa});
    }).catch((erro) => {
        res.status(500).json({erro: 'Houve um erro'});
    })
})



module.exports = router;