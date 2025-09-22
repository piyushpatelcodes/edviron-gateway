const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'School Payments API',
    description: 'REST API for managing transactions and payments',
  },
  host: 'localhost:8080', // change if deployed
  schemes: ['http'],
//   host: 'localhost:8080',
//   schemes: ['https'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./index.js']; // entry file where routes are registered

swaggerAutogen(outputFile, endpointsFiles, doc);
