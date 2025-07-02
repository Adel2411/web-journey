import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import notesRouter from './routes/notes.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.get('/api/',(req,res)=>{
    res.json({message: "Running !"});
});

app.use("/api/notes", notesRouter);


app.listen(PORT, ()=>{
    console.log(`Server is runnnig on ${PORT}`);
})
