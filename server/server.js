require('./config/config');
const express = require('express');
const app = express();

const bodyParser = require('body-parser')

const port = process.env.PORT;
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/usuario', function(req, res) {
    res.json('Get usuario');
});

app.post('/usuario', function(req, res) {
    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            message: 'El nombre es necesario'
        });
    } else {
        res.json({
            usuario: body
        });
    }
});

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    res.json({
        id
    });
});

app.delete('/usuario/:id', function(req, res) {
    res.json('Delete usuario');
});


app.listen(port, () => {
    console.log('Escuchando en el puerto ', port);
});