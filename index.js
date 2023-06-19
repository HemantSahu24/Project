import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import postRoutes from './routes/posts.js';
import dotenv from 'dotenv';
import userRouter from "./routes/users.js";

const app = express();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
// app.use(cors());
const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions)); 
app.use('/posts', postRoutes);
app.use("/user", userRouter);
dotenv.config();


const PORT = process.env.PORT || 7000


mongoose.connect("mongodb+srv://My-proj:vLdrF9ZcEHqeSaG@myproj.bqul5.mongodb.net/TempProj?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true

    }).then(() => app.listen(PORT, () => console.log(`Connected at port ${PORT}`)))
    .catch((error) => console.log(error.message))

mongoose.set('useFindAndModify', false);