require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());



app.get('/', (req, res) => {
    res.send('Hola Mundo!');
});

app.get('/usuarios', (req, res) => {
    res.send('Get Todos los Usuarios!');
});

app.get('/usuario/:id', (req, res) => {
    let id = req.params.id;
    res.send(`Get Usuario! ${ id }`);
});

app.post('/usuario', (req, res) => {

    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es obligatorio.'
        });
    } else {
        res.json({
            persona: body
        });
    }

});

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id;
    res.send(`Put Usuario! ${ id }`);
});

app.delete('/usuario/:id', (req, res) => {
    let id = req.params.id;
    res.send(`Delete Usuario! ${ id }`);
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando peticiones en el puerto ${ process.env.PORT }`);
});