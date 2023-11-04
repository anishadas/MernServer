import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';
import dotenv from 'dotenv';
// import { OAuth2Client } from 'google-auth-library';
// import { JsonWebTokenError } from 'jsonwebtoken';


// initialize
const app = express();
dotenv.config();
app.use(bodyParser.json({limit:"30mb",extended:true}))

app.use(express.json())
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}))

// app.use(express.urlencoded())
app.use(cors());
app.use('/posts', postRoutes);
app.use('/users',userRoutes);


// console.log(process.env.CONNECTION_URL)
// const CONNECTION_URL = 'mongodb+srv://Memories:hellbound10@cluster0.d3ekvmd.mongodb.net/?retryWrites=true&w=majority';
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
    .catch(err => console.log(err.message))

// mongoose.set('useFindAndModify',false);
