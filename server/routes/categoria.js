const express = require('express');
let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
const _ = require('underscore');
const Categoria = require('../models/categoria');

let app = express();


// Mostrar todas las categorías

app.get('/categoria', verificaToken, (req, res) => {


    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: err
                });
            }

            res.json({
                ok: true,
                cuantas: categorias.length,
                categorias
            });
        });
});

// Mostrar una categoría por id

app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;


    Categoria.findById(id, (err, categoriaBD) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            });
        }

        if (!categoriaBD) {
            return res.status(500).json({
                ok: false,
                message: 'No se encontró la categoria'
            })
        }


        res.json({
            ok: true,
            categoria: categoriaBD
        });
    }).populate('usuario', 'nombre email');
});

// Crear una nueva categoría

app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: err
            })
        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                message: 'No se pudo crear la categoria'
            })
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        })
    });
});

app.put('/categoria/:id', verificaToken, (req, res) => {
    //Actualizar el nombre de la categoría

    let usuario = req.usuario;
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);

    console.log(usuario);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, categoriaBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: err
            });
        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                message: 'No existe la categoria'
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        });

    });

});

app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    // Eliminación total de la categoría Categoria.findByIdAndRemove
    let usuario = req.usuario;
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBD) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            });
        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                message: 'Categoria no encontrada'
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        });

    });

});




module.exports = app;