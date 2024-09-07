import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "", // by default: '1.0.0'
    title: "", // by default: 'REST API'
    description: "", // by default: ''
  },
  servers: [
    {
      url: "http://localhost:8000", // by default: 'http://localhost:3000'
      description: "", // by default: ''
    },
    // { ... }
  ],
  tags: [
    // by default: empty Array
    {
      name: "", // Tag name
      description: "", // Tag description
    },
    // { ... }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

const outputFile = "./swagger.json";
const routes = ["./src/routes/api/*.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, routes, doc);

// swaggerAutogen()(outputFile, routes, doc).then(async () => {
//     await import('./server'); // Your project's root file
//   });
