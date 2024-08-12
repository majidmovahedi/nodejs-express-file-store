import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Express File Store API',
        version: '1.0.0',
        description: 'Node.js API',
      },
    },

      apis: ['**/*.ts'],
  };

  export const specs = swaggerJsdoc(options);
