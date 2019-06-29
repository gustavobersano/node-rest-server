const express = require('express');

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const app = express();

const Producto = require('../models/producto');

// ========================================
// Producto - GET - Obtiene listado de
// Productos Paginado
// ========================================
app.get('/producto', verificaToken, (req, res) => {

    const pagina = Number(req.query.pagina || 0);
    const limite = Number(req.query.limite || 5);

    const condicion = { disponible: true };

    Producto.find(condicion)
        .skip(pagina * limite)
        .limit(limite)
        .populate('usuario')
        .populate('categoria')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    of: false,
                    err
                });
            }
            Producto.countDocuments(condicion, (err, total) => {
                res.json({
                    ok: true,
                    total,
                    productos
                });
            });

        });

});
// ========================================
// Productos - GET - Obtiene un producto
// ========================================
app.get('/producto/:id', verificaToken, (req, res) => {

    const id = req.params.id;

    Producto.findById(id, (err, producto) => {

        if (err) {
            return res.status(500).json({
                of: false,
                err
            });
        }

        if (!producto) {
            return res.status(400).json({
                of: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto
        });

    });

});
// ========================================
// Productos - GET - Busca roductos por Nombre
// ========================================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    const termino = req.params.termino;
    const regex = new RegExp(termino, 'i');

    const condicion = {
        nombre: regex
    };

    Producto.find(condicion)
        .populate('categoria')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    of: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });

        });
});
// ========================================
// Producto - POST - Crea un producto
// ========================================
app.post('/producto', [verificaToken, verificaAdminRole], (req, res) => {

    const body = req.body;
    const usuarioId = req.usuario._id;

    const producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: usuarioId
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                of: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    });

});
// ========================================
// Producto - PUT - Modifica un producto
// ========================================
app.put('/producto/:id', [verificaToken, verificaAdminRole], (req, res) => {

    const id = req.params.id;
    const body = req.body;
    const usuarioId = req.usuario._id;

    const payload = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: usuarioId
    };

    Producto.findByIdAndUpdate(id, payload, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                of: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });


});
// ========================================
// Producto - DELETE - Elimina un producto
// ========================================
app.delete('/producto/:id', [verificaToken, verificaAdminRole], (req, res) => {

    const id = req.params.id;

    const payload = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, payload, { new: true }, (err, productoBorrado) => {

        if (err) {
            return res.status(500).json({
                of: false,
                err
            });
        }

        if (!productoBorrado) {
            return res.status(400).json({
                of: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: productoBorrado
        });

    });
});

module.exports = app;