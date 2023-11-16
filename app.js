import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import UserRouter from './routes/User.js';
import PaymentRouter from './routes/payment.js'

export const app = express();
app.use(express.json())
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
// app.use(fileUpload({
//     limits:{
//         fileSize : 50 * 1024 * 1024
//     },
//     useTempFiles: true
// }))


app.use(cors({
    methods : ["GET" ,"POST" ,"PUT" ,"PATCH","DELETE"],
    allowedHeaders : 'X-Requested-With ,Content-Type ,Authorization , Authorization',
    // origin: process.env.FRONT_END_URL,
    origin : '*',
    credentials : true
}))

app.use('/api/v1', UserRouter);
app.use('/api/v1',PaymentRouter);
app.get('/api/v1/getkey', (req, res)=> {
    res.status(200).json({key:process.env.RAZORPAY_API_KEY})
})
// app.use('/api/v1', NotificationRouter);
// app.use('/api/v1', ServiceRouter);
// app.use('/api/v1', PayRouter);
// app.use('/api/v1', OrderRouter);


app.get('/',(req,res)=>{
    res.send('VJM Backend Running..')
    
    // console.log(`VJM Backend running on ${process.env.PORT}`)
})