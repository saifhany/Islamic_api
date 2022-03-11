import { Request, Response, NextFunction } from 'express'

const admin = ( req: Request,res: Response,next: NextFunction) => {
    
    // @ts-ignore
    if (req.user && req.user.role === "ADMIN") {
        next();
    } else {
        res.status(401);
        throw new Error("Not authorized, admin only");
    }
  };

export default admin;  