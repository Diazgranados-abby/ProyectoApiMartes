const swaggerUi = require('swagger-ui-express');

const swaggerDocument = {
    openapi: '3.0.0',

    info: {
        title: 'API PIAI',
        version: '1.0.0',
        description: 'API REST para la gestión de estudiantes con discapacidad, planes de apoyo, ajustes y seguimientos.'
    },

    servers: [
        {
            url: 'http://localhost:3000'
        }
    ],

    tags: [
        {
            name: 'Estudiantes',
            description: 'Operaciones relacionadas con estudiantes con discapacidad'
        },
        {
            name: 'Planes de apoyo',
            description: 'Gestión de planes de apoyo'
        },
        {
            name: 'Ajustes',
            description: 'Gestión de ajustes de los planes de apoyo'
        },
        {
            name: 'Seguimientos',
            description: 'Seguimiento y cumplimiento de los ajustes'
        }
    ],

    paths: {

        // =====================================================
        // ESTUDIANTES
        // =====================================================

        '/api/estudiantes': {
            get: {
                tags: ['Estudiantes'],
                summary: 'Consultar todos los estudiantes',
                responses: {
                    200: {
                        description: 'Lista de estudiantes'
                    },
                    500: {
                        description: 'Error consultando estudiantes'
                    }
                }
            }
        },

        '/api/estudiantes/discapacidad': {
            get: {
                tags: ['Estudiantes'],
                summary: 'Consultar estudiantes con discapacidad y plan de apoyo',
                responses: {
                    200: {
                        description: 'Lista de estudiantes con discapacidad'
                    },
                    500: {
                        description: 'Error consultando estudiantes con discapacidad'
                    }
                }
            }
        },


        // =====================================================
        // PLANES DE APOYO
        // =====================================================

        '/api/planes-apoyo': {

            get: {
                tags: ['Planes de apoyo'],
                summary: 'Consultar todos los planes de apoyo',
                responses: {
                    200: {
                        description: 'Lista de planes de apoyo'
                    },
                    500: {
                        description: 'Error consultando planes de apoyo'
                    }
                }
            },

            post: {
                tags: ['Planes de apoyo'],
                summary: 'Crear un plan de apoyo',

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',

                                required: [
                                    'id_estudiante',
                                    'id_periodo',
                                    'objetivo_general',
                                    'estado',
                                    'fecha_inicio',
                                    'fecha_fin'
                                ],

                                properties: {
                                    id_estudiante: {
                                        type: 'integer',
                                        example: 1
                                    },

                                    id_periodo: {
                                        type: 'integer',
                                        example: 4
                                    },

                                    objetivo_general: {
                                        type: 'string',
                                        example: 'Fortalecer el acceso y participación de la estudiante en las actividades académicas mediante estrategias de apoyo.'
                                    },

                                    estado: {
                                        type: 'string',
                                        example: 'ACTIVO'
                                    },

                                    fecha_inicio: {
                                        type: 'string',
                                        format: 'date',
                                        example: '2026-08-25'
                                    },

                                    fecha_fin: {
                                        type: 'string',
                                        format: 'date',
                                        example: '2026-12-15'
                                    }
                                }
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description: 'Plan de apoyo creado correctamente'
                    },
                    500: {
                        description: 'Error creando el plan de apoyo'
                    }
                }
            }
        },


        '/api/planes-apoyo/{id}': {

            get: {
                tags: ['Planes de apoyo'],
                summary: 'Consultar detalle de un plan de apoyo',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'integer'
                        },
                        example: 6
                    }
                ],

                responses: {
                    200: {
                        description: 'Detalle del plan de apoyo'
                    },
                    404: {
                        description: 'Plan de apoyo no encontrado'
                    },
                    500: {
                        description: 'Error consultando el detalle'
                    }
                }
            }
        },


        // =====================================================
        // AJUSTES
        // =====================================================

        '/api/plan-ajustes': {

            get: {
                tags: ['Ajustes'],
                summary: 'Consultar todos los ajustes',

                responses: {
                    200: {
                        description: 'Lista de ajustes'
                    },
                    500: {
                        description: 'Error consultando ajustes'
                    }
                }
            },

            post: {
                tags: ['Ajustes'],
                summary: 'Crear un ajuste para un plan de apoyo',

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',

                                required: [
                                    'id_plan',
                                    'id_tipo_ajuste',
                                    'descripcion',
                                    'responsable_usuario',
                                    'estado'
                                ],

                                properties: {
                                    id_plan: {
                                        type: 'integer',
                                        example: 6
                                    },

                                    id_tipo_ajuste: {
                                        type: 'integer',
                                        example: 1
                                    },

                                    descripcion: {
                                        type: 'string',
                                        example: 'Entregar materiales académicos en formatos accesibles y digitales.'
                                    },

                                    responsable_usuario: {
                                        type: 'integer',
                                        example: 1
                                    },

                                    estado: {
                                        type: 'string',
                                        example: 'EN_PROCESO'
                                    }
                                }
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description: 'Ajuste creado correctamente'
                    },
                    500: {
                        description: 'Error creando el ajuste'
                    }
                }
            }
        },


        // =====================================================
        // SEGUIMIENTOS
        // =====================================================

        '/api/seguimientos': {

            get: {
                tags: ['Seguimientos'],
                summary: 'Consultar todos los seguimientos',

                responses: {
                    200: {
                        description: 'Lista de seguimientos'
                    },
                    500: {
                        description: 'Error consultando seguimientos'
                    }
                }
            },

            post: {
                tags: ['Seguimientos'],
                summary: 'Crear seguimiento de un ajuste',

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',

                                required: [
                                    'id_plan_ajuste',
                                    'id_usuario',
                                    'porcentaje_cumplimiento',
                                    'estado',
                                    'observacion',
                                    'fecha_seguimiento'
                                ],

                                properties: {
                                    id_plan_ajuste: {
                                        type: 'integer',
                                        example: 1
                                    },

                                    id_usuario: {
                                        type: 'integer',
                                        example: 1
                                    },

                                    porcentaje_cumplimiento: {
                                        type: 'number',
                                        example: 85
                                    },

                                    estado: {
                                        type: 'string',
                                        example: 'EN_PROCESO'
                                    },

                                    observacion: {
                                        type: 'string',
                                        example: 'Los materiales accesibles están siendo utilizados en las actividades académicas.'
                                    },

                                    fecha_seguimiento: {
                                        type: 'string',
                                        format: 'date',
                                        example: '2026-08-25'
                                    }
                                }
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description: 'Seguimiento creado correctamente'
                    },
                    500: {
                        description: 'Error creando el seguimiento'
                    }
                }
            }
        }
    }
};

module.exports = {
    swaggerUi,
    swaggerDocument
};