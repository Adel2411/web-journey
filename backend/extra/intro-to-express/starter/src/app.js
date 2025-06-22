import express from 'express'
import routes from './routes/post.js'
import logger from './middlware/logger.js';
const app = express();
app.use(express.json());
const PORT = 8000 ;

app.use(logger);
app.use('/posts' , routes );

app.listen( PORT , () => {
    console.log('sevrer is running');
})