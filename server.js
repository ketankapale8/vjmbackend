import {app} from './app.js';
import Razorpay from 'razorpay';

import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';

// import cloudinary from 'cloudinary';
dotenv.config({
    path:'./config/config.env'
});

export const instance = new Razorpay({
     key_id : process.env.RAZORPAY_API_KEY,
     key_secret : process.env.RAZOR_PAY_SECRET
})


// app.use(cors());

// cloudinary.config({
//     cloud_name : process.env.CLOUD_NAME,
//     api_key: process.env.CLOUD_API_KEY,
//     api_secret:process.env.CLOUD_API_SECRET
// });
connectDatabase();



app.listen(process.env.PORT , ()=>{
    console.log(`Server running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`)
})