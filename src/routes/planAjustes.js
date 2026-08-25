const express = require('express');
const router = express.Router();

const pool = require('../db/connection');


// =====================================================
// POST - CREAR AJUSTE EN UN PLAN DE APOYO
// =====================================================

router.post('/', async (req, res) => {
    try {

        const {
            id_plan,
            id_tipo_ajuste,
            descripcion,
            responsable_usuario,
            estado
        } = req.body;

        const resultado = await pool.query(`
            INSERT INTO plan_ajustes (
                id_plan,
                id_tipo_ajuste,
                descripcion,
                responsable_usuario,
                estado
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING
                id_plan_ajuste,
                id_plan,
                id_tipo_ajuste,
                descripcion,
                responsable_usuario,
                estado;
        `, [
            id_plan,
            id_tipo_ajuste,
            descripcion,
            responsable_usuario,
            estado
        ]);

        res.status(201).json({
            mensaje: 'Ajuste creado correctamente',
            ajuste: resultado.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error creando el ajuste',
            error: error.message
        });
    }
});


// =====================================================
// GET - CONSULTAR TODOS LOS AJUSTES
// =====================================================

router.get('/', async (req, res) => {
    try {

        const resultado = await pool.query(`
            SELECT
                pla.id_plan_ajuste,
                pla.id_plan,
                ta.nombre AS tipo_ajuste,
                pla.descripcion,
                pla.responsable_usuario,
                pla.estado
            FROM plan_ajustes pla
            INNER JOIN tipos_ajuste ta
                ON pla.id_tipo_ajuste = ta.id_tipo_ajuste
            ORDER BY pla.id_plan_ajuste;
        `);

        res.json(resultado.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error consultando ajustes',
            error: error.message
        });
    }
});


module.exports = router;