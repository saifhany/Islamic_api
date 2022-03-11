import {Request , Response,NextFunction} from 'express';
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const {  title } = req.body;
    const juzzs = [
        { id:1 ,juzz: 'الاول' , done:"false" },
        { id:2 ,juzz: 'الثاني' , done:"false" },
        { id:3 ,juzz: 'الثالث' , done:"false" },
        {id:4 , juzz: 'الرابع' , done:"false" },
        {id:5 , juzz: 'الخامس' , done:"false" },
        {id:6 , juzz: 'السادس' , done:"false" },
        {id:7 , juzz: 'السابع' , done:"false" },
        {id:8 , juzz: 'الثامن' , done:"false" },
        {id:9 , juzz: 'التاسع' , done:"false" },
        {id:10, juzz: 'العاشر' , done:"false" },
        {id:11 , juzz: 'الحادي عشر' , done:"false" },
        {id:12 , juzz: 'الثاني عشر' , done:"false" },
        {id:13 , juzz: 'الثالث عشر' , done:"false" },
        {id:14 , juzz: 'الرابع عشر' , done:"false" },
        {id:15 , juzz: 'الخامس عشر' , done:"false" },
        {id:16 , juzz: 'السادس عشر' , done:"false" },
        {id:17 , juzz: 'السابع عشر' , done:"false" },
        {id:18 , juzz: 'الثامن عشر' , done:"false" },
        {id:19 , juzz: 'التاسع عشر' , done:"false" },
        {id:20 , juzz: 'العشرون' , done:"false" },
        {id:21 , juzz: 'الحادي وعشرون' , done:"false" },
        {id:22 , juzz: 'الثاني وعشرون' , done:"false" },
        {id:23 , juzz: 'الثالث وعشرون' , done:"false" },
        {id:24 , juzz: 'الرابع وعشرون' , done:"false" },
        {id:25 , juzz: 'الخامس وعشرون' , done:"false" },
        {id:26 , juzz: 'السادس وعشرون' , done:"false" },
        {id:27 , juzz: 'السابع وعشرون' , done:"false" },
        {id:28 , juzz: 'الثامن وعشرون' , done:"false" },
        {id:29 , juzz: 'التاسع وعشرون' , done:"false" },
        { id:30 , juzz: 'الثلاثون' , done:"false" },
          // @ts-ignore
      ] as Prisma.JsonArray
      
      // @ts-ignore
    const id =  req.user.id  as number;
    try {
      const result = await prisma.khatma.create({
        data: {
          title,
          juzzs:juzzs,
          publisherId: Number(id)
           }    
    })
        res.json({
          status: 'success',
          data: result,
          message: 'khatma created successfully  البقاء لله يروحي👀',
        })          
      
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
       //@ts-ignore
		const khatmas = await prisma.khatma.findMany({ 
        include:{
          publisher:{
            select:{
              name:true,
              email:true,
            }
          }
        },               
        skip:skip,
        take:take 
      });

      res.json({
        status: 'success',
        data: khatmas,
        message: 'posts retrieved successfully 😉👅',
      })
    } catch (err) {
      next(err)
    }
  }
  export const updateKhatma = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
        const khatma_id = req.params.khatma_id ;
        // const {done} = req.body;
        const juzzNumber = req.body.juzzNumber;
        
        const khatma = await prisma.khatma.findUnique({
            where: {
              id: Number(khatma_id)
            },
          })
          // @ts-ignore
          const array = khatma?.juzzs as Array<>;
          // @ts-ignore
        const objIndex = array.findIndex((juz => juz.id == juzzNumber));
          // @ts-ignore
        array[objIndex].done = "true";

        const updatedKhatma = await prisma.khatma.update({
            where: {
              id: Number(khatma_id),
            },
            data: {
              juzzs:array
            }
          })
      res.json({
        status: 'success',
        data: updatedKhatma,
        message: 'User retrieved successfully',
      })
    } catch (err) {
      next(err)
    }
  }
 