const express = require('express');
const router = express.Router();

const pool = require('../db/connection');


// =====================================================
// POST - CREAR SEGUIMIENTO DE UN AJUSTE
// =====================================================

router.post('/', async (req, res) => {
    try {

        const {
            id_plan_ajuste,
            id_usuario,
            porcentaje_cumplimiento,
            estado,
            observacion,
            fecha_seguimiento
        } = req.body;

        const resultado = await pool.query(`
            INSERT INTO seguimientos (
                id_plan_ajuste,
                id_usuario,
                porcentaje_cumplimiento,
                estado,
                observacion,
                fecha_seguimiento
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING
                id_seguimiento,
                id_plan_ajuste,
                id_usuario,
                porcentaje_cumplimiento,
                estado,
                observacion,
                fecha_seguimiento;
        `, [
            id_plan_ajuste,
            id_usuario,
            porcentaje_cumplimiento,
            estado,
            observacion,
            fecha_seguimiento
        ]);

        res.status(201).json({
            mensaje: 'Seguimiento creado correctamente',
            seguimiento: resultado.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error creando el seguimiento',
            error: error.message
        });
    }
});


// =====================================================
// GET - CONSULTAR TODOS LOS SEGUIMIENTOS
// =====================================================

router.get('/', async (req, res) => {
    try {

        const resultado = await pool.query(`
            SELECT
                s.id_seguimiento,
                s.id_plan_ajuste,
                s.id_usuario,
                s.porcentaje_cumplimiento,
                s.estado,
                s.observacion,
                s.fecha_seguimiento
            FROM seguimientos s
            ORDER BY s.id_seguimiento;
        `);

        res.json(resultado.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error consultando seguimientos',
            error: error.message
        });
    }
});


module.exports = router;