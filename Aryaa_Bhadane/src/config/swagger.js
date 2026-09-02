const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Library Management REST API',
      version: '1.0.0',
      description:
        'Comprehensive RESTful API for a Library Management System built with Express, JWT, bcrypt, and Firebase Firestore.',
      contact: {
        name: 'Aryaa Bhadane'
      }
    },
    servers: [
      {
        url: '/',
        description: 'Current Environment Server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>'
        }
      }
    }
  },
  apis: [path.join(__dirname, '../routes/*.js'), path.join(__dirname, '../../docs/swagger.yaml')]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
