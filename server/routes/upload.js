const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const path = require('path');
const fs = require('fs');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function (req, res) {

    const tipo = req.params.tipo;
    const id = req.params.id;

    if (Object.keys(req.files).length == 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo'
                }
            });
    }

    let archivo = req.files.archivo;

    // Se valida el tipo
    let tiposValidos = ['producto', 'usuario'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    tipo,
                    message: 'Los tipos permitidos son ' + tiposValidos.join(', ')
                }
            });
    }


    // Se valida la extensión
    let nombreSpliteado = archivo.name.split('.');
    let extension = nombreSpliteado[nombreSpliteado.length - 1];

    // Extensiones válidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    extension,
                    message: 'Las extensiones permitidas son ' + extensionesValidas.join(', ')
                }
            });
    }

    // Cambiar el nombre del archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                of: false,
                err
            });

        switch (tipo) {
            case 'usuario':
                imagenUsuario(id, res, nombreArchivo);
                break;
            case 'producto':
                imagenProducto(id, res, nombreArchivo);
                break;
        }

    });
});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            borrarArchivo(nombreArchivo, 'usuario');
            return res.status(500).json({
                of: false,
                err
            });
        }

        if (!usuario) {
            borrarArchivo(nombreArchivo, 'usuario');
            return res.status(400).json({
                of: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        borrarArchivo(usuario.img, 'usuario');

        usuario.img = nombreArchivo;

        usuario.save((err, usuarioDB) => {

            if (err) {
                return res.status(500).json({
                    of: false,
                    err
                });
            }

            res.status(201).json({
                ok: true,
                usuario: usuarioDB
            });

        });

    });

}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, producto) => {

        if (err) {
            borrarArchivo(nombreArchivo, 'producto');
            return res.status(500).json({
                of: false,
                err
            });
        }

        if (!producto) {
            borrarArchivo(nombreArchivo, 'producto');
            return res.status(400).json({
                of: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        borrarArchivo(producto.img, 'producto');

        producto.img = nombreArchivo;

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
}

function borrarArchivo(nombreArchivo, tipo) {

    const pathArchivo = path.resolve(__dirname, `../../uploads/${tipo}/${nombreArchivo}`);
    if (fs.existsSync(pathArchivo)) {
        fs.unlinkSync(pathArchivo);
    }

}

module.exports = app;