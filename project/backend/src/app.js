import express from 'express' ;
import cors from 'cors';
import dotenv from 'dotenv';
import notesRoute from "./routes/notes.js";
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express()
const port = process.env.PORT || 5000

//Express server allows requests from the React frontend
app.use(cors({
    origin: "http://localhost:5173",  //url vite frontend
    credentials: true,
}));
app.use(express.json());
app.use("/api/notes", notesRoute);
app.use(errorHandler);

app.get('/', (req,res)=>{
    res.send("welcome to notes app ")
})

//error handling ---
app.use((err, req ,res, next)=>{
    console.error(err.stack);
    res.status(500).json({error: 'Something was wrong!'})
})

app.listen(port, ()=>{
    console.log(`CollabNote is running on http://localhost:${port}`);
    
})
