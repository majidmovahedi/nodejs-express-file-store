import express, { Router } from "express";
import dotenv from "dotenv";
import apiVersionRouter from "./src/routes/api/apiVersionRouter";

const app = express();
app.use(express.urlencoded({ extended : true }));
app.use(express.json({ type: 'application/json' }));

dotenv.config();
const port = process.env.PORT;

app.use('/api', apiVersionRouter);


app.listen( port , ()=>{
    console.log(`Listening On Port ${port}`)
})
