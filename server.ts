import "module-alias/register";
import express from "express";
import dotenv from "dotenv";
import apiVersionRouter from "@routes/api/apiVersionRouter";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";

const app = express();

// Serve the Swagger API documentation
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, "swagger.json"), "utf8"),
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ type: "application/json" }));

dotenv.config();
const port = process.env.PORT;

app.use("/api", apiVersionRouter);

app.listen(port, () => {
  console.log(`Listening On Port ${port}`);
});
