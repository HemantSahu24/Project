import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import postRoutes from './routes/posts.js';
import dotenv from 'dotenv';


const app = express();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use('/posts', postRoutes);
dotenv.config();

const con_url = 'mongodb+srv://My-proj:vLdrF9ZcEHqeSaG@myproj.bqul5.mongodb.net/QuickShare?retryWrites=true&w=majority'
const PORT = process.env.PORT || 8000

if(process.env.NODE_ENV=="production"){
    app.use(express.static("client/build"));
}
mongoose.connect(process.env.con_url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true

    }).then(() => app.listen(PORT, () => console.log(`Connected at port ${PORT}`)))
    .catch((error) => console.log(error.message))

mongoose.set('useFindAndModify', false);