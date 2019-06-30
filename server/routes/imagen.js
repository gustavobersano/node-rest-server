const express = require('express');

const path = require('path');
const fs = require('fs');

const { verificaTokenImg } = require('../middlewares/autenticacion');

const app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    const tipo = req.params.tipo;
    const img = req.params.img;

    const pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        const pathNoImage = path.resolve(__dirname, '../assets/img/no-image.jpg')
        res.sendFile(pathNoImage);
    }

});



module.exports = app;