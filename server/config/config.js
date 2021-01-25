// =======================
// Puerto
// =======================
process.env.PORT = process.env.PORT || 3000;


// =======================
// Entorno
// =======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// =======================
// Base de datos
// =======================

let urlDB = 'mongodb+srv://TrypleM:wZeJuaPgq3D6b7U@cluster0.ypy7r.mongodb.net/cafe';

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://TrypleM:wZeJuaPgq3D6b7U@cluster0.ypy7r.mongodb.net/cafe';
}

process.env.URLDB = urlDB;