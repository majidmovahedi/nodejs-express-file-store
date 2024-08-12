import 'module-alias/register';
import express from "express";
import dotenv from "dotenv";
import apiVersionRouter from "@routes/api/apiVersionRouter";
import swaggerUi from "swagger-ui-express";
import { specs } from "./swagger";

const app = express();
app.use(express.urlencoded({ extended : true }));
app.use(express.json({ type: 'application/json' }));

dotenv.config();
const port = process.env.PORT;

app.use('/api', apiVersionRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen( port , ()=>{
    console.log(`Listening On Port ${port}`)
})
