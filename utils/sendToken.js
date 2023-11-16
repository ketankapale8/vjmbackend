export const sendToken = (res,user, statusCode,message ) =>{

    const token = user.getJWTToken();

    const options = {
        httpOnly:true,
        sameSite : process.env.NODE_ENV == "Development" ? "lax": "none",
        secure : process.env.NODE_ENV == "Development" ? false : true,
        expires : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES *24 *60 *600 * 1000)
    }

    const userData = {
        _id: user._id,
        name : user.name,
        email : user.email,
        // verified : user.verified
    }

    res.cookie("jwt", token , options)
    
    res.status(statusCode)
    .cookie("token", token , options)
    .json({success: true , message, user: userData})
    

}