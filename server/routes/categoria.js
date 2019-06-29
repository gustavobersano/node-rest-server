const express = require('express');

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const app = express();

const Categoria = require('../models/categoria');

// ========================================
// Categoria - GET - Obtiene listado de
// Categorias
// ========================================
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    of: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });

        });

});
// ========================================
// Categoria - GET - Obtiene una categoria
// ========================================
app.get('/categoria/:id', verificaToken, (req, res) => {

    const id = req.params.id;

    Categoria.findById(id, (err, categoria) => {

        if (err) {
            return res.status(500).json({
                of: false,
                err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                of: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria
        });

    });

});
// ========================================
// Categoria - POST - Crea una categoria
// ========================================
app.post('/categoria', [verificaToken, verificaAdminRole], (req, res) => {

    const body = req.body;
    const usuarioId = req.usuario._id;

    const categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: usuarioId
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                of: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            categoria: categoriaDB
        });

    });

});
// ========================================
// Categoria - PUT - Modifica una categoria
// ========================================
app.put('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {

    const id = req.params.id;
    const body = req.body;
    const payload = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, payload, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                of: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });


});
// ========================================
// Categoria - DELETE - Elimina una categoria
// ========================================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {

    const id = req.params.id;

    Categoria.findByIdAndDelete(id, (err, categoriaBorrada) => {

        if (err) {
            return res.status(500).json({
                of: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                of: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada
        });

    });
});

module.exports = app;