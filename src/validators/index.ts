import { NextFunction } from 'express';
import { validationResult }  from 'express-validator';

const runValidation = (req: Request, res: Response, next: NextFunction): Promise<any> | undefined => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        // @ts-ignore
         return res.json({
            status: 'failed',
            message: errors.array()[0].msg,
          })     
         }
    next();
}

export default runValidation;