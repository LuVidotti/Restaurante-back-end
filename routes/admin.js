const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Sobremesa');
const Sobremesa = mongoose.model('sobremesas');
require('../models/PratoPrincipal');
const PratoPrincipal = mongoose.model('pratosPrincipais');
const {eAdmin} = require('../helpers/eAdmin');
require('../models/Usuario');
const Usuario = mongoose.model('usuarios');
const bcrypt = require('bcryptjs');

router.get('/', eAdmin, (req,res) => {
    res.render('admin/index');
})

router.get('/sobremesas', eAdmin, (req,res) => {
    Sobremesa.find().lean().then((sobremesas) => {
        res.render('admin/sobremesas', {sobremesas:sobremesas});
    })
    
    
})

router.get('/sobremesas/cad', eAdmin, (req,res) => {
    res.render('admin/cadsobremesas');
})

router.post('/sobremesas/nova', eAdmin, (req,res) => {
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

router.get('/sobremesas/edit/:id', eAdmin, (req,res) => {
    Sobremesa.findOne({_id:req.params.id}).lean().then((sobremesa) => {
        res.render('admin/editsobremesas', {sobremesa:sobremesa});
    }).catch((erro) => {
        req.flash('error_msg', 'Sobremesa não encontrada, erro: '+erro);
        res.redirect('/admin/sobremesas');
    })
})

router.post('/sobremesas/edit', eAdmin, (req,res) => {
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

router.post('/sobremesas/deletar', eAdmin, (req,res) => {
    Sobremesa.deleteOne({_id:req.body.id}).then(() => {
        req.flash('success_msg', 'Sobremesa deletada com sucesso!!!');
        res.redirect('/admin/sobremesas');
    }).catch((erro) => {
        req.flash('error_msg', 'Erro ao deletar sobremesa, erro: '+erro);
        res.redirect('/admin/sobremesas');
    })
})

router.get('/pratos-principais', eAdmin, (req,res) => {
    PratoPrincipal.find().lean().then((pratosPrincipais) => {
        res.render('admin/pratosPrincipais', {pratosPrincipais:pratosPrincipais});
    }).catch((erro) => {
        req.flash('error_msg', 'Erro ao carregar pratos, erro: '+erro);
        res.redirect('/admin');
    })
})

router.get('/pratos-principais/cad', eAdmin, (req,res) => {
    res.render('admin/cadpratosPrincipais');
})

router.post('/pratos-principais/novo', eAdmin, (req,res) => {
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
        res.render('admin/cadpratosPrincipais', {erros:erros});
    } else {
        const novoPrato = {
            nome: req.body.nome,
            descricao: req.body.descricao
        }

        new PratoPrincipal(novoPrato).save().then(() => {
            req.flash('success_msg', 'Prato principal cadastrado com sucesso!!!');
            res.redirect('/admin/pratos-principais');
        }).catch((erro) => {
            req.flash('error_msg', 'Erro ao cadastrar novo prato principal, erro: '+erro);
            res.redirect('/admin/pratos-principais');
        })
    }
})

router.get('/pratos-principais/edit/:id', eAdmin, (req,res) => {
    PratoPrincipal.findOne({_id:req.params.id}).lean().then((pratoPrincipal) => {
        res.render('admin/editpratosPrincipais', {pratoPrincipal:pratoPrincipal});
    }).catch((erro) => {
        req.flash('error_msg', 'Erro ao encontrar id do prato, erro: '+erro);
        res.redirect('/admin/pratos-principais');
    })
}) 

router.post('/pratos-principais/edit', eAdmin, (req,res) => {
    PratoPrincipal.findOne({_id:req.body.id}).then((pratoPrincipal) => {
        pratoPrincipal.nome = req.body.nome;
        pratoPrincipal.descricao = req.body.descricao;

        pratoPrincipal.save().then(() => {
            req.flash('success_msg', 'Prato principal editado com sucesso!!!');
            res.redirect('/admin/pratos-principais');
        }).catch((erro) => {
            req.flash('error_msg', 'Erro ao salvar prato editado, erro: '+erro);
            res.redirect('/admin/pratos-principais');
        })
    }).catch((erro) => {
        req.flash('error_msg', 'Erro ao editar prato principal, erro: '+erro);
        res.redirect('/admin/pratos-principais');
    })
})

router.post('/pratos-principais/deletar', eAdmin, (req,res) => {
    PratoPrincipal.deleteOne({_id:req.body.id}).then(() => {
        req.flash('success_msg', 'Prato deletado com sucesso!!!');
        res.redirect('/admin/pratos-principais');
    }).catch((erro) => {
        req.flash('error_msg', 'Erro ao deletar prato principal, erro: '+erro);
        res.redirect('/admin/pratos-principais');
    })
})

router.get('/usuarios', eAdmin, (req,res) => {
    Usuario.find().lean().then((usuarios) => {
        res.render('admin/usuarios', {usuarios:usuarios});
    }).catch((erro) => {
        req.flash('error_msg', 'Erro ao listar usuarios, erro: '+erro);
        res.redirect('/admin');
    })
})

router.get('/registro', eAdmin, (req,res) => {
    res.render('admin/registro');
})

router.post('/registro', eAdmin, (req,res) => {
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
        res.render('admin/registro', {erros:erros});
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
                    eAdmin: 1
                }

                new Usuario(novoUsuario).save().then(() => {
                    req.flash('success_msg', 'Administrador cadastrado com sucesso!!!');
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