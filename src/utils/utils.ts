import config from "../config";
import bcrypt from "bcrypt";
import { PrismaClient } from '@prisma/client'
import cron  from 'node-cron';


const prisma = new PrismaClient()


export const hashPassword = (password: string) => {
    const salt = parseInt(config.salt as string, 10)
    return bcrypt.hashSync(`${password}${config.pepper}`, salt)
}

export const comparePassword = (password:string, hashed:any) => {
    return bcrypt.compareSync( `${password}${config.pepper}`, hashed);
  };
 
//   @ts-ignore


function recurring() {  
    cron.schedule('59 23 * * *', async () => {     
         await prisma.post.deleteMany({})
    });
}

function ff() {  
    cron.schedule('* * * * *', function() {
        console.log('running a task every minute');
      });
}

ff();
recurring();