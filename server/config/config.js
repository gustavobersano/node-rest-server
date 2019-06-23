// ========================================
//         Puerto
// ========================================
process.env.PORT = process.env.PORT || 3000;

// ========================================
//         Entorno
// ========================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ========================================
//         Vencimiento del Token
// ========================================
// 60 segundos
// 60 minutos
// 24 horas
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24;

// ========================================
//         SEED de autentificación
// ========================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ========================================
//         Base de Datos
// ========================================
let urlDB;

if ( process.env.NODE_ENV === 'dev' ) {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// ========================================
//         Google Client ID
// ========================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '62964194035-fj6hqboou04bgt8k8es7teosfhq9toel.apps.googleusercontent.com';