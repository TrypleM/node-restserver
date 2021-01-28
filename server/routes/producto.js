const express = require('express');
const _ = require('underscore');
const { verificaToken } = require('../middlewares/autenticacion');

let Producto = require('../models/producto');
let app = express();

// Obtener todos los productos

app.get('/producto', verificaToken, (req, res) => {
    // trae todos los productos con populate usuarios categoria
    // Paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .skip(desde)
        .limit(limite)
        .sort('nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: err
                });
            }

            Producto.countDocuments((err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        message: err
                    });
                }

                res.json({
                    ok: true,
                    cuantos: conteo,
                    productos
                });
            });
        });

});

// Obtener un producto por ID

app.get('/producto/:id', (req, res) => {
    // trae todos los productos con populate usuarios categoria
    let id = req.params.id;

    Producto.findById(id, (err, productoBD) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: err
                });
            }

            if (!productoBD) {
                return res.status(400).json({
                    ok: false,
                    message: 'Producto no encontrado'
                });
            }

            res.json({
                ok: true,
                producto: productoBD
            });
        }).populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion');

});


// Buscar productos

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    // trae todos los productos con populate usuarios categoria
    // Paginado
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');


    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .sort('nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: err
                });
            }
            res.json({
                ok: true,
                productos
            });

        });

});

// Crear un producto

app.post('/producto', verificaToken, (req, res) => {
    // grabar usuario y categoria
    let body = req.body;
    let usuario = req.usuario._id;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario
    });

    producto.save((err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: err
            })
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                message: 'No se pudo realizar la inserción del producto'
            });
        }

        res.json({
            ok: true,
            producto: productoBD
        });
    });
});

// Actualizar el producto

app.put('/producto/:id', verificaToken, (req, res) => {
    // grabar usuario y categoria
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'descripcion', 'precioUni', 'disponible']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, productoBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: err
            });
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                message: 'El producto no existe'
            });
        }

        res.json({
            ok: true,
            producto: productoBD
        });
    });
});

// Borrar un producto

app.delete('/producto/:id', verificaToken, (req, res) => {
    // disponible = false
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: err
            });
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                message: 'El producto no existe'
            });
        }

        res.json({
            ok: true,
            producto: productoBD
        });

    });
});


module.exports = app;