const express = require('express');
const cors = require('cors');

const pool = require('./db/connection');

const estudiantesRoutes = require('./routes/estudiantes');
const planesApoyoRoutes = require('./routes/planesApoyo');
const planAjustesRoutes = require('./routes/planAjustes');
const seguimientosRoutes = require('./routes/seguimientos');
const { swaggerUi, swaggerDocument } = require('../swagger');
const app = express();


// =====================================================
// MIDDLEWARES
// =====================================================

app.use(cors());

// Permite recibir JSON desde Thunder Client, frontend, etc.
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// =====================================================
// RUTA PRINCIPAL
// =====================================================

app.get('/', (req, res) => {
    res.json({
        mensaje: 'API PIAI funcionando correctamente'
    });
});


// =====================================================
// PRUEBA DE CONEXIÓN CON POSTGRESQL
// =====================================================

app.get('/api/prueba-db', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT NOW()');

        res.json({
            mensaje: 'Conexión con PostgreSQL exitosa',
            fecha_servidor: resultado.rows[0].now
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error conectando con PostgreSQL',
            error: error.message
        });
    }
});


// =====================================================
// RUTAS DE LA API
// =====================================================

app.use('/api/estudiantes', estudiantesRoutes);

app.use('/api/planes-apoyo', planesApoyoRoutes);

app.use('/api/plan-ajustes', planAjustesRoutes);

app.use('/api/seguimientos', seguimientosRoutes);

// =====================================================
// INICIAR SERVIDOR
// =====================================================

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`API ejecutándose en http://localhost:${PORT}`);
});