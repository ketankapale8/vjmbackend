// Business Logic //

import { User } from "../models/users.js";
// import { sendMail } from "../utils/sendMail.js";
import { sendToken } from "../utils/sendToken.js";
// import cloudinary from 'cloudinary';
// import fs from 'fs';

//register//
export const register = async (req, res) => {
  try {
    const { name, email, password ,address , country , state , city , pincode, gender} = req.body;
    // const avatar = req.files.avatar.tempFilePath;
    
    let user = await User.findOne({ email });


    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const otp = Math.floor(Math.random() * 1000000);
    // const mycloud = await cloudinary.v2.uploader.upload(avatar, {
    //   folder: "backend"
    // });


    // fs.rmSync("./tmp", { recursive: true});

    user = await User.create({
      name  , 
      email ,
      password,
      address  , state , city , pincode, gender,
      country,
    
     
      // avatar: {
      //   public_id: mycloud.public_id,
      //   url: mycloud.secure_url,
      // },
      otp,
      otp_expiry: new Date(Date.now() + process.env.OTP_EXPIRY * 60 * 60* 10000),
    });

    // res.send({success : true })

    // await sendMail(
    //   email,
    //   "Please verify your account for Credimotion",
    //   `Your OTP is ${otp}`
    // );

    return sendToken(
      res,
      user,
      201,
      "User Created..."
    );
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, msg: err.message });
  }
};

// verify //
export const verify = async (req, res) => {
  try {
    const otp = Number(req.body.otp);

    const user = await User.findById(req.user._id);
    if (user.otp !== otp || user.otp_expiry < Date.now()) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    user.verified = true;
    user.otp = null;
    user.otp_expiry = null;

    await user.save();

    sendToken(res, user, 200, "Account Verified");
  } catch (err) {
    console.log(err);
    // res.status(500).json({success: false, msg:err.message})
  }
};

// login //
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res
        .status(400)
        .json({ msg: "Please enter all fields before submitting" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesnt exists or invalid email or password",
      });
    }

    const isMatched = await user.comparePassword(password);
    if (!isMatched) {
      res
        .status(404)
        .json({ msg: "Wrong password , please enter the correct one" });
    }
    sendToken(res, user, 200, "Login Successful");
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//logout //
export const logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, { 
      expires: new Date(Date.now() - 1) ,
      sameSite : process.env.NODE_ENV == "Development" ? "lax": "none",
      secure : process.env.NODE_ENV == "Development" ? false : true,
  })

      .json({ success: true, msg: "Loggedout Successfully.." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// getMyProfile //
export const myProfile = async (req, res) => {
  try {
    let user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, msg: "No user exists , Login first" });
    }
    
    sendToken(res, user, 200);
  } catch (err) {
    console.log(err);
    // res.status(500).json({ success: false, message: err.message });
  }
};

//update profile//
export const updateProfile = async (req, res) => {
  try {
    const {       name  , 
      email ,
      address  , state , city , pincode, gender,
      occupation , profession , dikshit , volunteer,
      country,} = req.body;

    // const {avatar} = req.files;
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = name;
      user.email = email;
      user.address = address;
      user.state = state;
      user.city = city;
      user.country = country;
      user.pincode = pincode;
      user.gender = gender;
      user.occupation = occupation;
      user.profession = profession;
      user.dikshit = dikshit;
      user.volunteer = volunteer;
    }
    // user.carType = carType;
    // user.carModelNo = carModelNo;
    // user.noOfMilesRan = noOfMilesRan;
    // user.SSN = SSN;
    // user.mob = mob;
    // user.alt_mob = alt_mob;

    
    //  if(avatar){
      
      //  }
      await user.save();
      return res.status(200).json({ success: true, msg: "profile updated" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    const isMatched = await user.comparePassword(oldPassword);
    if (!isMatched) {
      res
        .status(404)
        .json({ msg: "Password doesnt match , please enter the correct one" });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({ success: true, msg: "Password Updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const forgetPassword = async (req,res) =>{
  try{
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user){
          res.status(404).json({success:false, msg: "User doesn't exists , Please Signup"})
        }
        const otp = Math.floor(Math.random() * 1000000);
        user.resetPasswordOTP = otp;
        user.resetPasswordOTPExpiry = new Date(Date.now()+ 10 *60*10000)
        await user.save();

        // await sendMail(email , "Password Reset Request for VJM App" , `OTP for resetting password:  ${otp}`)
        res.status(200).json({msg: `OTP Sent to ${email}`})
  }catch(err){
    res.status(500).json({ success: false, message: err.message });
  }
}

export const resettingPassword = async(req, res)=>{
  try{
        const {otp , newPassword} = req.body;
        const user =await User.findOne({resetPasswordOTP: otp , resetPasswordOTPExpiry : {$gt : Date.now()}}).select("+password")
        if(!user){
          res.status(404).json({success:false, msg: "Incorrect OTP or it has been expired"})
        }
        user.resetPasswordOTP = null;
        user.resetPasswordOTPExpiry = null;
        user.password = newPassword;
        await user.save();
        res.status(200).json({success:true , msg: "Password reset successful"})

  }catch(err){
    res.status(500).json({ success: false, message: err.message });

  }
}

export const allUsers = async (req , res) =>{
  try{
    const all = await User.find();
    if(all){
      res.status(200).json({msg: 'All Users', users : all})
    }
  }catch(err){
    res.status(404).json({err: err})
  }
}










