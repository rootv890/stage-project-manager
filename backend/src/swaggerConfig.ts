import swaggerJSDoc from "swagger-jsdoc";
import "dotenv/config";
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Stage Course Manager API",
      version: "1.0.0",
      description: "API documentation for the Stage Course Manager project",
    },
    servers: [{ url: process.env.BACKEND_API_URL }],
  },
  apis: ["src/routes/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
