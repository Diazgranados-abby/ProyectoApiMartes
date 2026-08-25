const express = require('express');
const router = express.Router();

const pool = require('../db/connection');


// =====================================================
// POST - CREAR PLAN DE APOYO
// =====================================================

router.post('/', async (req, res) => {
    try {
        const {
            id_estudiante,
            id_periodo,
            objetivo_general,
            estado,
            fecha_inicio,
            fecha_fin
        } = req.body;

        const resultado = await pool.query(`
            INSERT INTO planes_apoyo (
                id_estudiante,
                id_periodo,
                objetivo_general,
                estado,
                fecha_inicio,
                fecha_fin
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING
                id_plan,
                id_estudiante,
                id_periodo,
                objetivo_general,
                estado,
                fecha_inicio,
                fecha_fin;
        `, [
            id_estudiante,
            id_periodo,
            objetivo_general,
            estado,
            fecha_inicio,
            fecha_fin
        ]);

        res.status(201).json({
            mensaje: 'Plan de apoyo creado correctamente',
            plan: resultado.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error creando el plan de apoyo',
            error: error.message
        });
    }
});


// =====================================================
// GET - CONSULTAR TODOS LOS PLANES DE APOYO
// =====================================================

router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT
                pa.id_plan,
                e.nombres || ' ' || e.apellidos AS estudiante,
                td.nombre AS discapacidad,
                per.nombre AS periodo,
                pa.objetivo_general,
                pa.estado,
                pa.fecha_inicio,
                pa.fecha_fin
            FROM planes_apoyo pa
            INNER JOIN estudiantes e
                ON pa.id_estudiante = e.id_estudiante
            INNER JOIN tipos_discapacidad td
                ON e.id_tipo_discapacidad = td.id_tipo_discapacidad
            INNER JOIN periodos_academicos per
                ON pa.id_periodo = per.id_periodo
            ORDER BY pa.id_plan;
        `);

        res.json(resultado.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error consultando planes de apoyo',
            error: error.message
        });
    }
});


// =====================================================
// GET - CONSULTAR DETALLE DE UN PLAN
// =====================================================

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // -------------------------------------------------
        // Información principal del plan
        // -------------------------------------------------

        const planResultado = await pool.query(`
            SELECT
                pa.id_plan,
                e.id_estudiante,
                e.codigo_estudiante,
                e.nombres || ' ' || e.apellidos AS estudiante,
                td.nombre AS discapacidad,
                p.nombre AS programa,
                per.nombre AS periodo,
                pa.objetivo_general,
                pa.estado,
                pa.fecha_inicio,
                pa.fecha_fin
            FROM planes_apoyo pa
            INNER JOIN estudiantes e
                ON pa.id_estudiante = e.id_estudiante
            INNER JOIN tipos_discapacidad td
                ON e.id_tipo_discapacidad = td.id_tipo_discapacidad
            INNER JOIN matriculas m
                ON e.id_estudiante = m.id_estudiante
                AND m.id_periodo = pa.id_periodo
            INNER JOIN programas p
                ON m.id_programa = p.id_programa
            INNER JOIN periodos_academicos per
                ON pa.id_periodo = per.id_periodo
            WHERE pa.id_plan = $1;
        `, [id]);

        if (planResultado.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Plan de apoyo no encontrado'
            });
        }


        // -------------------------------------------------
        // Ajustes asociados al plan
        // -------------------------------------------------

        const ajustesResultado = await pool.query(`
            SELECT
                pla.id_plan_ajuste,
                ta.nombre AS tipo_ajuste,
                pla.descripcion,
                pla.responsable_usuario,
                pla.estado,
                s.porcentaje_cumplimiento,
                s.estado AS estado_seguimiento,
                s.observacion,
                s.fecha_seguimiento
            FROM plan_ajustes pla
            INNER JOIN tipos_ajuste ta
                ON pla.id_tipo_ajuste = ta.id_tipo_ajuste
            LEFT JOIN seguimientos s
                ON pla.id_plan_ajuste = s.id_plan_ajuste
            WHERE pla.id_plan = $1
            ORDER BY pla.id_plan_ajuste;
        `, [id]);


        // -------------------------------------------------
        // Respuesta
        // -------------------------------------------------

        res.json({
            plan: planResultado.rows[0],
            ajustes: ajustesResultado.rows
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: 'Error consultando el detalle del plan de apoyo',
            error: error.message
        });
    }
});


module.exports = router;