const express = require('express');
const router = express.Router();

const pool = require('../db/connection');


// =====================================================
// GET - TODOS LOS ESTUDIANTES
// =====================================================

router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT
                e.id_estudiante,
                e.codigo_estudiante,
                e.nombres,
                e.apellidos,
                e.documento,
                e.fecha_nacimiento,
                e.contacto,
                td.nombre AS tipo_discapacidad
            FROM estudiantes e
            LEFT JOIN tipos_discapacidad td
                ON e.id_tipo_discapacidad = td.id_tipo_discapacidad
            ORDER BY e.id_estudiante;
        `);

        res.json(resultado.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error consultando estudiantes',
            error: error.message
        });
    }
});


// =====================================================
// GET - ESTUDIANTES CON DISCAPACIDAD Y PLAN DE APOYO
// =====================================================

router.get('/discapacidad', async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT
                e.id_estudiante,
                e.codigo_estudiante,
                e.nombres || ' ' || e.apellidos AS estudiante,
                td.nombre AS discapacidad,
                p.nombre AS programa,
                per.nombre AS periodo,
                pa.id_plan,
                pa.objetivo_general AS plan_apoyo,
                pa.estado AS estado_plan
            FROM estudiantes e

            INNER JOIN tipos_discapacidad td
                ON e.id_tipo_discapacidad = td.id_tipo_discapacidad

            LEFT JOIN matriculas m
                ON e.id_estudiante = m.id_estudiante

            LEFT JOIN programas p
                ON m.id_programa = p.id_programa

            LEFT JOIN periodos_academicos per
                ON m.id_periodo = per.id_periodo

            LEFT JOIN planes_apoyo pa
                ON e.id_estudiante = pa.id_estudiante
                AND m.id_periodo = pa.id_periodo

            ORDER BY e.id_estudiante;
        `);

        res.json(resultado.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error consultando estudiantes con discapacidad',
            error: error.message
        });
    }
});


module.exports = router;