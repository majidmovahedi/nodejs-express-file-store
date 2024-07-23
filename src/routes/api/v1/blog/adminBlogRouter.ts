import { Router , Request , Response } from "express";
const router = Router();

router.get('/', (req : Request , res : Response)=>{
    res.json('Welcome to Api v1 - admin blog')
});


export default router;
