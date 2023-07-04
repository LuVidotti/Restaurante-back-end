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
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRETUSER = 'user';
const SECRETADMIN = 'admin';

const listaDeTokens = [];

function verificaJWTadmin(req,res,next) {
    const token = req.headers['authorization'];
    const index = listaDeTokens.findIndex((t) => t == token);  //Verifica se o token ja sofreu logout

    if(index != -1) {
        return res.status(400).end();
    }

    jwt.verify(token, SECRETADMIN, (erro,decoded) => {
        if(erro) {
            return res.status(500).json({auth: false, message: 'Token invalido, voce nao e admin'})
        }

        Usuario.findOne({_id: decoded.id}).then((user) => {
            if(!user) {
                return res.status(400).json({auth: false, message: 'Usuário não encontrado'});
            }

            if(user.eAdmin != 1) {
                return res.status(400).json({auth: false, message: 'Apenas administradores podem entrar aqui'});
            }

            req.user = user;
            next();
        }).catch((erro) => {
            res.status(500).json(erro);
        })
    })
}

function verificaJwt(req,res,next) {
    const token = req.headers['authorization']
    const index = listaDeTokens.findIndex((t) => t == token);  //Verifica se o token ja sofreu logout

    if(index != -1) {
        return res.status(400).end();
    }
   
    jwt.verify(token, SECRETUSER, (erro, decoded) => {
        if(erro) {
            return res.status(500).json({auth: false, message: 'Token invalido, precisa estar logado'})
        }

        Usuario.findOne({_id: decoded.id}).then((user) => {
            if(!user) {
                return res.status(400).json({auth: false, message: 'Usuário não encontrado'});
            }

            req.user = user;
            next();
        }).catch((erro) => {
            res.status(500).json(erro);
        })
    })
}

//Sobremesas

router.get('/sobremesas', verificaJWTadmin, (req,res) => {
    Sobremesa.find().then((sobremesas) => {
        res.status(200).json(sobremesas);
    }).catch((erro) => {
        res.status(500).json({erro: 'Houve um erro'});
    })
})

router.post('/sobremesas', verificaJWTadmin, (req,res) => {
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

router.put('/sobremesas/:id', verificaJWTadmin, (req,res) => {
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

router.delete('/sobremesas/:id', verificaJWTadmin, (req,res) => {
    Sobremesa.deleteOne({_id:req.params.id}).then((sobremesa) => {
        res.status(200).json({message: 'Sobremesa deletada com sucesso!!!', sobremesa:sobremesa});
    }).catch((erro) => {
        res.status(500).json({erro: 'Houve um erro'});
    })
})




//Pratos Principais

router.get('/pratos-principais', verificaJWTadmin, (req,res) => {
    PratoPrincipal.find().then((pratosPrincipais) => {
        res.status(200).json(pratosPrincipais);
    }).catch((erro) => {
        res.status(500).json({erro: 'Houve um erro'});
    })
})

router.post('/pratos-principais', verificaJWTadmin, (req,res) => {
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

router.put('/pratos-principais/:id', verificaJWTadmin, (req,res) => {
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

router.delete('/pratos-principais/:id', verificaJWTadmin, (req,res) => {
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

router.post('/pedidos', verificaJwt, (req,res) => {
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

router.put('/pedidos/:id', verificaJwt, (req,res) => {
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

router.delete('/pedidos/:id', verificaJwt, (req,res) => {
    Pedido.deleteOne({_id:req.params.id}).then((pedido) => {
        res.status(201).json({message: 'Pedido deletado com sucesso!!!', pedido:pedido})
    }).catch((erro) => {
        res.status(500).json({erro: 'Houve um erro'});
    })
})

//Usuarios

router.get('/usuarios', verificaJWTadmin, (req,res) => {
    Usuario.find().then((usuarios) => {
        res.status(200).json(usuarios);
    }).catch((erro) => {
        res.status(500).json(erro);
    })
});

//Registro pessoal

router.post('/usuarios/registro', (req,res) => {
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
        res.status(400).json(erros);
    } else {
        Usuario.findOne({email:req.body.email}).then((usuario) => {
            if(usuario) {
                return res.status(400).json({message: 'Erro, ja existe um usuario com este email'});
            }

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(req.body.senha, salt);

            const novoUsuario = {
                nome: req.body.nome,
                email: req.body.email,
                senha: hash
            }

            new Usuario(novoUsuario).save().then(() => {
                res.status(201).json({message: 'Usuario registrado com sucesso!!!', novoUsuario:novoUsuario});
            }).catch((erro) => {
                res.status(500).json(erro);
            })
        })
    }
})

//Login com jwt

router.post('/usuarios/login', (req,res) => {
    Usuario.findOne({email:req.body.email}).then((usuario) => {
        if(!usuario) {
            return res.status(400).json({message: 'Não há um usuário com este e-mail'})
        }

        bcrypt.compare(req.body.senha, usuario.senha, (erro, batem) => {
            if(erro) {
                return res.status(400).json(erro);
            }

            if(batem) { 
                if(usuario.eAdmin == 0) {
                    const token = jwt.sign({id: usuario._id}, SECRETUSER, {expiresIn: '1 hr'});
                    res.json({auth:true, token:token});
                }

                if(usuario.eAdmin == 1) {
                    const token = jwt.sign({id: usuario._id}, SECRETADMIN, {expiresIn: '1 hr'});
                    res.json({auth: true, token:token});
                }
                
            } else {
                return res.status(400).json({message: 'Senha incorreta'});
            }
        })
    })
})

router.post('/usuarios/logout', (req,res) => {
    listaDeTokens.push(req.headers['authorization']);
    res.end();
})

module.exports = router;