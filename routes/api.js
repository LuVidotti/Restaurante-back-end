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

            sobremesa.save().then((sobremesaAtt) => {
                res.status(201).json({message: 'Sobremesa editada com sucesso!!!', sobremesa:sobremesaAtt});
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




//Pratos Principais

router.get('/pratos-principais', (req,res) => {
    PratoPrincipal.find().then((pratosPrincipais) => {
        res.status(200).json(pratosPrincipais);
    }).catch((erro) => {
        res.status(500).json({erro: 'Houve um erro'});
    })
})

router.post('/pratos-principais', (req,res) => {
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
        const novoPrato = {
            nome: req.body.nome,
            descricao: req.body.descricao
        }

        new PratoPrincipal(novoPrato).save().then(() => {
            res.status(201).json({message: 'Prato principal cadastrado com sucesso!!!', novoPrato:novoPrato})
        }).catch((erro) => {
            res.status(500).json({erro: 'Houve um erro'});
        })
    }
})

router.put('/pratos-principais/:id', (req,res) => {
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
        PratoPrincipal.findOne({_id: req.params.id}).then((pratoPrincipal) => {
            pratoPrincipal.nome = req.body.nome;
            pratoPrincipal.descricao = req.body.descricao;

            pratoPrincipal.save().then((prato) => {
                res.status(201).json({message: 'Prato principal editado com sucesso!!!', prato:prato});
            }).catch((erro) => {
                res.status(500).json({erro: 'Houve um erro'});
            })
        })
    }
})

router.delete('/pratos-principais/:id', (req,res) => {
    PratoPrincipal.deleteOne({_id:req.params.id}).then((pratoPrincipal) => {
        res.status(201).json({message: 'Prato principal deletado com sucesso!!!', pratoPrincipal:pratoPrincipal});
    }).catch((erro) => {
        res.status(500).json({erro: 'Houve um erro'});
    })
})

//Pedidos

router.get('/pedidos', (req,res) => {
    Pedido.find().populate('pratoPrincipal').populate('sobremesa').then((pedidos) => {
        res.status(200).json(pedidos);
    }).catch((erro) => {
        res.status(500).json({erro: 'Houve um erro'});
    })
})

router.post('/pedidos', (req,res) => {
    let erros = [];

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
        res.status(400).json(erros);
    } else {
        const novoPedido = {
            mesa: req.body.mesa,
            pratoPrincipal: req.body.pratoPrincipal,
            sobremesa: req.body.sobremesa,
            observacao:req.body.observacao
        }

        new Pedido(novoPedido).save().then(() => {
            res.status(201).json({message: 'Pedido adicionado com sucesso!!!', novoPedido:novoPedido});
        }).catch((erro) => {
            res.status(500).json({erro: 'Houve um erro'});
        })
    }
})

router.put('/pedidos/:id', (req,res) => {
    let erros = [];

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
        res.status(400).json(erros);
    } else {
        Pedido.findOne({_id: req.params.id}).then((pedido) => {
            pedido.mesa = req.body.mesa
            pedido.pratoPrincipal = req.body.pratoPrincipal;
            pedido.sobremesa = req.body.sobremesa;
            pedido.observacao = req.body.observacao;
            pedido.data = Date.now();

            pedido.save().then((pedidoAtt) => {
                res.status(201).json({message: 'Pedido editado com sucesso!!!', pedido:pedidoAtt});
            }).catch((erro) => {
                res.status(500).json({erro: 'Houve um erro'});
            })
        })
    }
})

router.delete('/pedidos/:id', (req,res) => {
    Pedido.deleteOne({_id:req.params.id}).then((pedido) => {
        res.status(201).json({message: 'Pedido deletado com sucesso!!!', pedido:pedido})
    }).catch((erro) => {
        res.status(500).json({erro: 'Houve um erro'});
    })
})

module.exports = router;