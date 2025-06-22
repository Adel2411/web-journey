import express from 'express'
import routes from './routes/posts.js'
import logger from './middleware/logger.js';
const app = express();
app.use(express.json());
const PORT = 8000 ;

app.use(logger);
app.use('/posts' , routes );

app.listen( PORT , () => {
    console.log('sevrer is running');
})