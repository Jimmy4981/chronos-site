import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import configRouter from './routes/config.js';
import stripeRouter from './routes/stripe.js';
import usersRouter  from './routes/users.js';

const app = express();
app.use(cors());
app.use('/api/stripe', stripeRouter);
app.use(express.json());

app.use('/api/config', configRouter);

// Mount our new Users routes
app.use('/api/users', usersRouter);


const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`API listening on ${port}`));
