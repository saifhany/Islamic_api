import {Request , Response,NextFunction} from 'express';
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const {  timeToEnd , title , numberOfJuzz } = req.body;
      // @ts-ignore
    const id =  req.user.id  as number;
    try {
      const result = await prisma.post.create({
        data: {
          timeToEnd,
          title,
          numberOfJuzz,
          publisherId: id
           }    
    })
        res.json({
          status: 'success',
          data: result,
          message: 'Post created successfully 👀',
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
			const posts = await prisma.post.findMany({ 
        include:{
          publisher:{
            select:{
              name:true,
              email:true
            }
          }
        },               
        skip:skip,
        take:take 
      });

      res.json({
        status: 'success',
        data: posts,
        message: 'posts retrieved successfully 😉👅',
      })
    } catch (err) {
      next(err)
    }
  }
  
  export const join = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
              // @ts-ignore
        const  id = req.user.id as number;
        // @ts-ignore
        const post_id = req.params.post_id ;
        const post = await prisma.post.findUnique({
          where: {
            id: Number(post_id)
          },
        })
        let array = post?.joined;
        // @ts-ignore
        array.filter((pos)=>{
            if( pos === id){
              return res.status(401).json("user already submitted");
            }
        })
      const updatedPost = await prisma.post.update({
        where: {
          id: Number(post_id),
        },
        data: {
          joined: {
            push: Number(id)
          },
        },
      })
      res.json({
        status: 'success',
        data: updatedPost,
        message: 'User retrieved successfully',
      })
    } catch (err) {
      next(err)
    }
  }

  export const submit = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
              // @ts-ignore
        const  id = req.user.id as number;
        // @ts-ignore
        const post_id = req.params.post_id ;

        const post = await prisma.post.findUnique({
          where: {
            id: Number(post_id)
          },
        })
        let array = post?.submittedUsers;
        // @ts-ignore
        array.filter((pos)=>{
            if( pos === id){
              return res.status(401).json("user already submitted");
            }
        })
      const updatedPost = await prisma.post.update({
        where: {
          id: Number(post_id),
        },
        data: {
          submittedUsers: {
            push: Number(id)
          },
        },
      })
      res.json({
        status: 'success',
        data: updatedPost,
        message: 'User retrieved successfully',
      })
    } catch (err) {
      next(err)
    }
  }


  export const updatePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
              // @ts-ignore
        const  id = req.user.id as number;
        // @ts-ignore
        const post_id = req.params.post_id ;
        const {done} = req.body;
        const post = await prisma.post.findUnique({
          where: {
            id: Number(post_id)
          },
        })
       if (post?.publisherId !== id){
          return res.json({ status: 404, message:"you are not a publisher of that post yala 3ndaha yala😡"})
       }

      const updatedPost = await prisma.post.update({
        where: {
          id: Number(post_id),
        },
        data: {
          done:done
        },
      })
      res.json({
        status: 'success',
        data: updatedPost,
        message: 'User retrieved successfully',
      })
    } catch (err) {
      next(err)
    }
  }
  


  export const deletePost  = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
        // @ts-ignore
        const { post_id} = req.body;

  
      const deletedPost = await prisma.post.delete({
        where: {
          id: Number(post_id),
        }
      })
      res.json({
        status: 'success',
        data: deletedPost,
        message: 'Post deleted successfully',
      })
    } catch (err) {
      next(err)
    }
  }

 