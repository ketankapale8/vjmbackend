import jwt from 'jsonwebtoken';
import { User } from '../models/users.js';

export const isAuthenticated = async(req ,res ,next) =>{
       try{
           const {token} = req.cookies;

           if(!token){
               res.status(401).json({success:false, msg: "No token provided , Login First"})
           }

           const decoded = jwt.verify(token , process.env.JWT_SECRET)
           req.user = await User.findById(decoded._id);
           console.log(req.user)
           next()
           
       }catch(err){
           res.status(500).json({success: false,msg:err.message})
       }

}