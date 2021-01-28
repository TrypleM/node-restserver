// =======================
// Puerto
// =======================

process.env.PORT = process.env.PORT || 3000;


// =======================
// Entorno
// =======================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// =======================
// Vencimiento del token
// =======================
// 60 seg 60 min 24 horas 30 días

process.env.CADUCIDAD_TOKEN = '48h';


// =======================
// Semilla del token
// =======================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// =======================
// Google clientID
// =======================

process.env.CLIENT_ID = process.env.CLIENT_ID || '1010810090302-2jipakgner4urouinmvk01ii7iqo6002.apps.googleusercontent.com';

// =======================
// Base de datos
// =======================

let urlDB = process.env.MONGO_URI;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;