import { useRuntimeConfig } from "nitropack/runtime"

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const openApiSpec = {
        openapi: '3.0.0',
        info: {
            title: 'School Hub API',
            version: '1.0.0',
            description: 'A comprehensive REST API for managing students, classes, and class assignments in a school management system.',
            contact: {
                name: 'School Hub API Support',
                email: 'support@schoolhub.com'
            }
        },
        servers: [
            {
                url: 'https://schoolhub-project-production.up.railway.app',
                description: 'Production Server',
            },
            {
                url: 'http://localhost:8000',
                description: 'Local Server',
            },
            {
                url: process.env.BACKEND_URL,
                description: 'Env Variable Server',
            }
        ],
        tags: [
            {
                name: 'Students',
                description: 'Operations related to student management'
            },
            {
                name: 'Classes',
                description: 'Operations related to class management'
            },
            {
                name: 'Assignments',
                description: 'Operations for managing student-class assignments'
            }
        ],
        paths: {
            '/api/v1/students': {
                get: {
                    tags: ['Students'],
                    summary: 'Get all students',
                    description: 'Retrieve a list of all students with their assigned classes',
                    responses: {
                        200: {
                            description: 'List of students retrieved successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            data: {
                                                type: 'array',
                                                items: { $ref: '#/components/schemas/Student' }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        500: { $ref: '#/components/responses/InternalServerError' }
                    }
                },
                post: {
                    tags: ['Students'],
                    summary: 'Create a new student',
                    description: 'Create a new student with first name and last name',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/CreateStudentRequest' }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: 'Student created successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            data: { $ref: '#/components/schemas/Student' }
                                        }
                                    }
                                }
                            }
                        },
                        400: { $ref: '#/components/responses/BadRequest' },
                        500: { $ref: '#/components/responses/InternalServerError' }
                    }
                }
            },
            '/api/v1/students/{id}': {
                get: {
                    tags: ['Students'],
                    summary: 'Get student by ID',
                    description: 'Retrieve a specific student by their unique identifier',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            description: 'Unique identifier of the student',
                            schema: { type: 'string', format: 'uuid' }
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Student retrieved successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            data: { $ref: '#/components/schemas/Student' }
                                        }
                                    }
                                }
                            }
                        },
                        404: { $ref: '#/components/responses/NotFound' },
                        500: { $ref: '#/components/responses/InternalServerError' }
                    }
                },
                put: {
                    tags: ['Students'],
                    summary: 'Update a student',
                    description: 'Update student information by ID',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            description: 'Unique identifier of the student',
                            schema: { type: 'string', format: 'uuid' }
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/UpdateStudentRequest' }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Student updated successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            data: { $ref: '#/components/schemas/Student' }
                                        }
                                    }
                                }
                            }
                        },
                        400: { $ref: '#/components/responses/BadRequest' },
                        404: { $ref: '#/components/responses/NotFound' },
                        500: { $ref: '#/components/responses/InternalServerError' }
                    }
                },
                delete: {
                    tags: ['Students'],
                    summary: 'Delete a student',
                    description: 'Delete a student by ID. This will also remove all class assignments for this student.',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            description: 'Unique identifier of the student',
                            schema: { type: 'string', format: 'uuid' }
                        }
                    ],
                    responses: {
                        204: { description: 'Student deleted successfully' },
                        404: { $ref: '#/components/responses/NotFound' },
                        500: { $ref: '#/components/responses/InternalServerError' }
                    }
                }
            },
            '/api/v1/students/{studentId}/assign-class': {
                post: {
                    tags: ['Assignments'],
                    summary: 'Assign student to class',
                    description: 'Assign a student to a specific class',
                    parameters: [
                        {
                            name: 'studentId',
                            in: 'path',
                            required: true,
                            description: 'Unique identifier of the student',
                            schema: { type: 'string', format: 'uuid' }
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        classId: {
                                            type: 'string',
                                            format: 'uuid',
                                            description: 'Unique identifier of the class to assign the student to'
                                        }
                                    },
                                    required: ['classId']
                                }
                            }
                        }
                    },
                    responses: {
                        204: { description: 'Student assigned to class successfully' },
                        400: { $ref: '#/components/responses/BadRequest' },
                        404: { $ref: '#/components/responses/NotFound' },
                        500: { $ref: '#/components/responses/InternalServerError' }
                    }
                }
            },
            '/api/v1/students/{studentId}/classes/{classId}': {
                delete: {
                    tags: ['Assignments'],
                    summary: 'Remove student from class',
                    description: 'Remove a student from a specific class',
                    parameters: [
                        {
                            name: 'studentId',
                            in: 'path',
                            required: true,
                            description: 'Unique identifier of the student',
                            schema: { type: 'string', format: 'uuid' }
                        },
                        {
                            name: 'classId',
                            in: 'path',
                            required: true,
                            description: 'Unique identifier of the class',
                            schema: { type: 'string', format: 'uuid' }
                        }
                    ],
                    responses: {
                        204: { description: 'Student removed from class successfully' },
                        404: { $ref: '#/components/responses/NotFound' },
                        500: { $ref: '#/components/responses/InternalServerError' }
                    }
                }
            },
            '/api/v1/classes': {
                get: {
                    tags: ['Classes'],
                    summary: 'Get all classes',
                    description: 'Retrieve a list of all classes',
                    responses: {
                        200: {
                            description: 'List of classes retrieved successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            data: {
                                                type: 'array',
                                                items: { $ref: '#/components/schemas/Class' }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        500: { $ref: '#/components/responses/InternalServerError' }
                    }
                },
                post: {
                    tags: ['Classes'],
                    summary: 'Create a new class',
                    description: 'Create a new class with name and optional description',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/CreateClassRequest' }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: 'Class created successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            data: { $ref: '#/components/schemas/Class' }
                                        }
                                    }
                                }
                            }
                        },
                        400: { $ref: '#/components/responses/BadRequest' },
                        500: { $ref: '#/components/responses/InternalServerError' }
                    }
                }
            },
            '/api/v1/classes/{id}': {
                get: {
                    tags: ['Classes'],
                    summary: 'Get class by ID',
                    description: 'Retrieve a specific class by its unique identifier',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            description: 'Unique identifier of the class',
                            schema: { type: 'string', format: 'uuid' }
                        }
                    ],
                    responses: {
                        200: {
                            description: 'Class retrieved successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            data: { $ref: '#/components/schemas/Class' }
                                        }
                                    }
                                }
                            }
                        },
                        404: { $ref: '#/components/responses/NotFound' },
                        500: { $ref: '#/components/responses/InternalServerError' }
                    }
                },
                put: {
                    tags: ['Classes'],
                    summary: 'Update a class',
                    description: 'Update class information by ID',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            description: 'Unique identifier of the class',
                            schema: { type: 'string', format: 'uuid' }
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/UpdateClassRequest' }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: 'Class updated successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            data: { $ref: '#/components/schemas/Class' }
                                        }
                                    }
                                }
                            }
                        },
                        400: { $ref: '#/components/responses/BadRequest' },
                        404: { $ref: '#/components/responses/NotFound' },
                        500: { $ref: '#/components/responses/InternalServerError' }
                    }
                },
                delete: {
                    tags: ['Classes'],
                    summary: 'Delete a class',
                    description: 'Delete a class by ID. This will also remove all student assignments to this class.',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            description: 'Unique identifier of the class',
                            schema: { type: 'string', format: 'uuid' }
                        }
                    ],
                    responses: {
                        204: { description: 'Class deleted successfully' },
                        404: { $ref: '#/components/responses/NotFound' },
                        500: { $ref: '#/components/responses/InternalServerError' }
                    }
                }
            },
            '/api/v1/classes/{id}/students': {
                get: {
                    tags: ['Classes', 'Assignments'],
                    summary: 'Get students in a class',
                    description: 'Retrieve all students assigned to a specific class',
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            description: 'Unique identifier of the class',
                            schema: { type: 'string', format: 'uuid' }
                        }
                    ],
                    responses: {
                        200: {
                            description: 'List of students in the class retrieved successfully',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            data: {
                                                type: 'array',
                                                items: { $ref: '#/components/schemas/Student' }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        404: { $ref: '#/components/responses/NotFound' },
                        500: { $ref: '#/components/responses/InternalServerError' }
                    }
                }
            }
        },
        components: {
            schemas: {
                Student: {
                    type: 'object',
                    description: 'Student entity with personal information and class assignments',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Unique identifier for the student',
                            example: '550e8400-e29b-41d4-a716-446655440000'
                        },
                        firstName: {
                            type: 'string',
                            description: 'Student\'s first name',
                            example: 'John'
                        },
                        lastName: {
                            type: 'string',
                            description: 'Student\'s last name',
                            example: 'Doe'
                        },
                        classIds: {
                            type: 'array',
                            description: 'List of class IDs the student is assigned to',
                            items: { type: 'string', format: 'uuid' },
                            example: ['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002']
                        }
                    },
                    required: ['id', 'firstName', 'lastName', 'classIds']
                },
                Class: {
                    type: 'object',
                    description: 'Class entity with name and description',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            description: 'Unique identifier for the class',
                            example: '550e8400-e29b-41d4-a716-446655440001'
                        },
                        name: {
                            type: 'string',
                            description: 'Name of the class',
                            example: 'Mathematics 101'
                        },
                        description: {
                            type: 'string',
                            description: 'Optional description of the class',
                            example: 'Introduction to algebra and basic mathematical concepts'
                        }
                    },
                    required: ['id', 'name']
                },
                CreateStudentRequest: {
                    type: 'object',
                    description: 'Request payload for creating a new student',
                    properties: {
                        firstName: {
                            type: 'string',
                            minLength: 1,
                            maxLength: 64,
                            description: 'Student\'s first name',
                            example: 'John'
                        },
                        lastName: {
                            type: 'string',
                            minLength: 1,
                            maxLength: 64,
                            description: 'Student\'s last name',
                            example: 'Doe'
                        }
                    },
                    required: ['firstName', 'lastName']
                },
                UpdateStudentRequest: {
                    type: 'object',
                    description: 'Request payload for updating a student',
                    properties: {
                        firstName: {
                            type: 'string',
                            minLength: 1,
                            maxLength: 64,
                            description: 'Updated first name (optional)',
                            example: 'Jane'
                        },
                        lastName: {
                            type: 'string',
                            minLength: 1,
                            maxLength: 64,
                            description: 'Updated last name (optional)',
                            example: 'Smith'
                        }
                    }
                },
                CreateClassRequest: {
                    type: 'object',
                    description: 'Request payload for creating a new class',
                    properties: {
                        name: {
                            type: 'string',
                            minLength: 1,
                            maxLength: 128,
                            description: 'Name of the class',
                            example: 'Physics 101'
                        },
                        description: {
                            type: 'string',
                            description: 'Optional description of the class',
                            example: 'Introduction to classical mechanics and basic physics principles'
                        }
                    },
                    required: ['name']
                },
                UpdateClassRequest: {
                    type: 'object',
                    description: 'Request payload for updating a class',
                    properties: {
                        name: {
                            type: 'string',
                            minLength: 1,
                            maxLength: 128,
                            description: 'Updated class name (optional)',
                            example: 'Advanced Physics'
                        },
                        description: {
                            type: 'string',
                            description: 'Updated class description (optional)',
                            example: 'Advanced topics in physics including quantum mechanics'
                        }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    description: 'Standard error response format',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Error type or category',
                            example: 'Bad Request'
                        },
                        message: {
                            type: 'string',
                            description: 'Human-readable error message',
                            example: 'Invalid request data'
                        },
                        details: {
                            type: 'array',
                            description: 'Additional error details (for validation errors)',
                            items: {
                                type: 'object',
                                properties: {
                                    field: { type: 'string', example: 'firstName' },
                                    message: { type: 'string', example: 'First name is required' }
                                }
                            }
                        }
                    },
                    required: ['error', 'message']
                }
            },
            responses: {
                BadRequest: {
                    description: 'Invalid request data',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                NotFound: {
                    description: 'Resource not found',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                },
                InternalServerError: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ErrorResponse' }
                        }
                    }
                }
            }
        }
    }

    return openApiSpec
})
