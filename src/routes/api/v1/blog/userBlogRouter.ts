import { Router , Request , Response } from "express";
const router = Router();

router.get('/', (req : Request , res : Response)=>{
    res.json('Welcome to Api v1 - user blog')
});


export default router;
