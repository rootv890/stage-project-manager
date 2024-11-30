export const config = () => {
  const PORT = process.env.PORT || 1337;
  return {
    port: process.env.PORT || 1337,
    baseUrl: `http://localhost:${PORT}`,
    baseApi: `http://localhost:${PORT}/api`,
    corsOptions: {
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  };
};
