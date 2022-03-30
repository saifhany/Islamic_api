import express ,{Application,json,Request,Response} from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import RateLimit from 'express-rate-limit';
import errorMiddleware from './middleware/error.middleware';
import config from './config';
import routes from './routes';
import cronjobs from './utils/utils';
const PORT = config.port || 3000;
// create instance server
const app:Application = express();
// HTTP request logger middleware
app.use(morgan('comman'));
// HTTP security middleware
app.use(helmet());
// middleware parse incoming request
app.use(express.json());
// apply the rate limiting middleware to all requests
app.use(
    RateLimit({
        windowMs: 60 * 60 * 1000, // 15 minutes
        max: 30, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        message: 'el3b b3ed ya ro7 mama',
    })
)
app.use('/api',routes);  

app.get('/',(req:Request, res:Response)=>{
    res.json({
        message:'hello World! ✔😊',
    })
})


app.use(errorMiddleware);
app.use((_req:Request, res:Response)=>{
    res.status(404).json({
        message: 'ohh you are lost,read the API documentation to find your way back home 😂🤷‍♀️'
    })
})
// start express server
app.listen(PORT,()=>{
    console.log(`Server is starting at port:${PORT} 🥰🔥`)
    cronjobs();
});

export default app;