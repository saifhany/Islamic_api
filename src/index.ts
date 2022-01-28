import express ,{Application,Request,Response} from 'express';


const PORT=3000
// create instance server
const app:Application = express();

app.get('/',(req:Request, res:Response)=>{
    res.json({
        message:'hello'
    })
})
// start express server
app.listen(PORT,()=>{
    console.log(`Server is starting at port:${PORT}`)
});

export default app;