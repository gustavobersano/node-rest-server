const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const app = express();

app.get('/usuarios', verificaToken, (req, res) => {

    const pagina = Number(req.query.pagina | 0);
    const limite = Number(req.query.limite | 5);

    const condicion = { estado: true };

    Usuario.find(condicion, 'nombre email img role estado google')
        .skip(pagina * limite)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(500).json({
                    of: false,
                    err
                });
            }
            Usuario.countDocuments(condicion, (err, total) => {
                res.json({
                    ok: true,
                    total,
                    usuarios
                });
            });

        });

});

app.get('/usuario/:id', verificaToken, (req, res) => {
    
    const id = req.params.id;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                of: false,
                err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                of: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuario
        });

    });
    
});

app.post('/usuario', [verificaToken, verificaAdminRole], (req, res) => {

    const body = req.body;
    const usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                of: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

});

app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                of: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });
});

app.delete('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    const id = req.params.id;
    
    // Usuario.findByIdAndDelete(id, (err, usuarioBorrado) => {

    const body = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                of: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                of: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });
});

module.exports = app;