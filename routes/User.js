import express from 'express';
import { register , verify, login, logout,myProfile,updateProfile, 
        updatePassword, forgetPassword, 
        resettingPassword , allUsers} from '../controllers/users.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.post("/register" , register);
router.post("/verify", isAuthenticated,verify);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", isAuthenticated, myProfile);
router.put("/updateprofile", isAuthenticated,updateProfile );
router.put("/updatepassword", isAuthenticated, updatePassword);
router.post("/forgetpassword", forgetPassword);
router.put("/resetpassword", resettingPassword);
router.get('/allusers', allUsers)







export default router;

