const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'School Payments API',
    description: 'REST API for managing transactions and payments',
  },
  host: 'https://edviron-gateway-backend.vercel.app', // change if deployed
  schemes: ['https'],
//   host: 'localhost:8080',
//   schemes: ['https'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./index.js']; // entry file where routes are registered

swaggerAutogen(outputFile, endpointsFiles, doc);
