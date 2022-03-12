import {Request , Response,NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import {comparePassword, hashPassword} from "../utils/utils";
import { PrismaClient } from '@prisma/client';
import  client  from 'twilio';
let Client =client( config.ACCOUNT_SID as string, config.AUTH_TOKEN as string,{lazyLoading:true});

const prisma = new PrismaClient()

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const {name , email , password , phone } = req.body;
    try {
      const getuser = await prisma.user.findUnique({
        where: {
          email:email,
        },
        select: {
          email: true
      }
      });
      if(getuser){
        res.json({
          status: 'failed',
          message: 'User Already exists',
        })   
      } else{
        const UUser = await prisma.user.create({
         
          data: {  
            name:name,
            email:email,
            password: hashPassword(password),
            phone:phone
          }
        })
        res.json({
          status: 'success',
          data: UUser,
          message: 'User created successfully',
        })          
      }
    } catch (err) {
      next(err)
    }
  }
 
  export const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const {otp , phone , newPassword } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: {
          phone:phone,
        },
        select: {
          email: true,
          password:true,
          otp:true,
          id:true
      }
      });
      
      if(user){
        const UUser = await prisma.user.update({
          where: {
            id:user.id,
          },
          data: {  
            password: hashPassword(newPassword),
            otp:0
          }
        })
        res.json({
          status: 'success',
          data: UUser,
          message: 'User created successfully',
        })          
      }else{
        res.json({
          status: 'Failed',
          message: 'user not found ro7 3ndha yala ya kdab',
        })
      }
    } catch (err) {
      next(err)
    }
  }
  
  export const getMany = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const query = req.query;
      //@ts-ignore
      const skip = parseInt(query.page) || 0;
      //@ts-ignore
      const take = parseInt(query.limit) || 2;
			const users = await prisma.user.findMany({ 
        where: {isHidden:false},
        select: {password:false,name:true,email:true,lastPage:true,phone:true,finishedPage:true}, 
        skip:skip,
        take:take 
      });
      res.json({
        status: 'success',
        data: users,
        message: 'User retrieved successfully',
      })
    } catch (err) {
      next(err)
    }
  }
  
  export const userConnected = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      //@ts-ignore
        const userId = req.user.id as string;

      const userFriends =  await prisma.user.findUnique({
        where: {
          id: Number(userId)
        },
        select: {
          usercontacts: {
            select: {
              phone: true,
            },
          },
          phone: true,
          email: true,
          finishedPage:true,
          lastPage:true
        },
      })
      // @ts-ignore
      
      console.log(userFriends?.usercontacts);
			const users = await prisma.user.findMany({
        select: {
          phone:true,
          email:true,
          finishedPage:true,
          lastPage:true,
        }, 
      });
      var result = users.filter((o1): any =>
          {
          return userFriends?.usercontacts.some((o2): boolean => {
            return o1.phone === o2.phone;
          });
        });
          console.log(result);

      
      res.json({
        status: 'success',
        data: result,
        message: 'User retrieved successfully',
      })
    } catch (err) {
      next(err)
    }
  }
  
  export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email , password  } = req.body;
      // check if our db has user with that email 
      const userr = await  prisma.user.findUnique({
        where: {
          email:email
        },
        select: {
          email: true,
          password:true,
          id:true
      }
      });
      if(!userr){
        return res.json({status: 'Failed', message: 'user not exists'})
      } 
      // check password
      
      const match =  comparePassword(password , userr.password);
      if(!match) {
        return res.json({status: 'Failed', message: 'password is incorrect'})
      }  
      // create signed JWT
      const  token = jwt.sign({id:userr.id},config.tokenSecret as unknown as string,{
        expiresIn:"7d"
      });
      res.json({
        status: 'success',
        data: {...userr ,token},
        message: 'User retrieved successfully',
      })
    } catch (err) {
      next(err)
    }
  }

  export const forgetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {  phone   } = req.body;
      let val = Math.floor(1000 + Math.random() * 9000); 
      // check if our db has user with that email 
      const userr = await  prisma.user.findUnique({
        where: {
          phone:phone
        },
        select: {
          email: true,
          id:true
      }
      });
      if(userr){

        const user = await prisma.user.update({
         where: { id: userr.id },
         data: { otp: val },
         select: {otp:true,phone:true,email:true}
          })
            
      await    Client.messages.create({
              body: `your otp ${user.otp}`,
             from: '+13194698785',
            to: `${phone}`
  }).then((message:any): void => console.log(message.sid));
      }
      res.json({
        status: 'success',
        data: {...userr},
        message: 'User retrieved successfully',
      })
    } catch (err) {
      next(err)
    }
  }

  export const updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
            const { isHidden} = req.body;
            // @ts-ignore
            const id =  req.user.id as unknown as string
      // const user = await userModel.getOne(req.params.id as unknown as string)
      const user = await prisma.user.update({
                    // @ts-ignore
        where: { id: id },
        data: { isHidden: isHidden },
      })
      res.json({
        status: 'success',
        data: user,
        message: 'User retrieved successfully',
      })
    } catch (err) {
      next(err)
    }
  }

  export const updatePage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
            const { finishedPage,lastPage} = req.body;
            // @ts-ignore
            const id =  req.user.id as unknown as string
      // const user = await userModel.getOne(req.params.id as unknown as string)
      const user = await prisma.user.update({
          // @ts-ignore
        where: { id: id },
        data: { finishedPage: finishedPage , lastPage:lastPage },
      })
      res.json({
        status: 'success',
        data: user,
        message: 'User retrieved successfully',
      })
    } catch (err) {
      next(err)
    }
  }


  export const updateRole = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
        const { email , role } = req.body;

      const user = await prisma.user.update({
        where: { email: email },
        data: { role: role },
      })
      res.json({
        status: 'success',
        data: user,
        message: 'User updated successfully',
      })
    } catch (err) {
      next(err)
    }
  }

  export const addcontacts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {

        const { contacts } = req.body;
        const existsusers = await prisma.user.findMany({
          where: {
            role:"USER"
          },
          select: {
            phone: true
          }
        })
        console.log(existsusers);
        var result = existsusers.filter((o1): any =>
            // @ts-ignore
            contacts.some((o): boolean => o1.phone === o.phone));
        // @ts-ignore
       const id =  req.user.id as string
      const user = await prisma.user.update({
        where: { id: Number(id) },
          // @ts-ignore
          data: {
            usercontacts: {
              create: 
              result
            },
          },
      })
      
      res.json({
        status: 'success',
        data: result,
        message: 'User updated successfully',
      })
    } catch (err) {
      next(err)
    }
  }
 
 
  