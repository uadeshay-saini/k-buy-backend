import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
console.log(userId)
        // const refreshToken = user.generateRefreshToken()

        // user.refreshToken = refreshToken
        // await user.save({ validateBeforeSave: false })

        return accessToken


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

try {
    

    const {fullName, email, username, password } = req.body
    //console.log("email: ", email);

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    console.log(req.files);

    // const avatarLocalPath = req.files?.avatar[0]?.path;
    // // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    // let coverImageLocalPath;
    // if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    //     coverImageLocalPath = req.files.coverImage[0].path
    // }
    

    // if (!avatarLocalPath) {
    //     throw new ApiError(400, "Avatar file is required")
    // }

    const avatar = ""/*await uploadOnCloudinary(avatarLocalPath)*/
    const coverImage = ""/*await uploadOnCloudinary(coverImageLocalPath)*/

    // if (!avatar) {
    //     throw new ApiError(400, "Avatar file is required")
    // }
   
console.log(fullName)
    const user = await User.create({
        fullName,
        avatar: avatar?.url || "",
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} catch (error) {
    if (error instanceof ApiError) {
      // Send an error response with the status code and message
      res.status(error.statusCode).json({ success: false, statusCode: error.statusCode, message: error.message, errors: error.errors });
    } else {
      // Handle other types of errors
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
} )

const loginUser = asyncHandler(async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie
try{
    const {email, username, password} = req.body
    console.log(email);

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    
    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
        
    // }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

//    const isPasswordValid = await user.isPasswordCorrect(password)
const isPasswordValid = await bcrypt.compare(password, user.password)


   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }


if(isPasswordValid){

    const accessToken = await generateAccessAndRefereshTokens(user._id)
    
    // const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    }
    
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    // .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                // user: loggedInUser,
                accessToken
                
            },
            "User logged In Successfully"
            )
            )
            
        }
    } catch (error) {
        if (error instanceof ApiError) {
          // Send an error response with the status code and message
          res.status(error.statusCode).json({ success: false, statusCode: error.statusCode, message: error.message, errors: error.errors });
        } else {
          // Handle other types of errors
          console.error(error);
          res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
})


const checkIfUserLoggedIn = asyncHandler(async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie
try{
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        console.log(req.cookies?.accessToken);
        if (!token) {
            throw new ApiError(404, "User Is Not LoggedIn")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            
            throw new ApiError(404, "User Is Not LoggedIn")
        }
    
  
        // const user = req.user._id
        // const userId = user.toString()
        // if (!(userId)) {
        //   throw new ApiError(400, "User Is Not LoggedIn");
        // }
    
   console.log(user._id);

    const isUserRegistered = await User.findOne({ _id: user._id })

    if (!isUserRegistered) {
        throw new ApiError(404, "User Is Not LoggedIn")
    }
    
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    }
    
    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            {
                user: "User is LoggedIn"
                
            },
            "User is LoggedIn"
            )
            )
            
        
    } catch (error) {
        if (error instanceof ApiError) {
          // Send an error response with the status code and message
          res.status(error.statusCode).json({ success: false, statusCode: error.statusCode, message: error.message, errors: error.errors });
        } else {
          // Handle other types of errors
          console.error(error);
          res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
})

const logoutUser = asyncHandler(async(req, res) => {
    // await User.findByIdAndUpdate(
    //     req.user._id,
    //     {
    //         $unset: {
    //             refreshToken: 1 // this removes the field from document
    //         }
    //     },
    //     {
    //         new: true
    //     }
    // )
try {
    

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User logged Out Successfully"))

} catch (error) {
    if (error instanceof ApiError) {
        // Send an error response with the status code and message
        res.status(error.statusCode).json({ success: false, statusCode: error.statusCode, message: error.message, errors: error.errors });
      } else {
        // Handle other types of errors
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
      }
}
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    
    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }
    
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
            )
            
            const user = await User.findById(decodedToken?._id)
            
            if (!user) {
                throw new ApiError(401, "Invalid refresh token")
            }
            
            if (incomingRefreshToken !== user?.refreshToken) {
                throw new ApiError(401, "Refresh token is expired or used")
                
            }
            
            const options = {
                httpOnly: true,
                secure: true
            }
            
            const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
            
            return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200, 
                    {accessToken, refreshToken: newRefreshToken},
                    "Access token refreshed"
                    )
                    )
                } catch (error) {
                    throw new ApiError(401, error?.message || "Invalid refresh token")
                }
                
            })
            
            const changeCurrentPassword = asyncHandler(async(req, res) => {
                const {oldPassword, newPassword} = req.body

    

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})






const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body

    if (fullName && !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        {new: true}
        
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});

const updateUserAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    //TODO: delete old image - assignment

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")
        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    )
})

const updateUserCoverImage = asyncHandler(async(req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing")
    }

    //TODO: delete old image - assignment


    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on avatar")
        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage: coverImage.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Cover image updated successfully")
    )
})





export {
    registerUser,
    loginUser,
    checkIfUserLoggedIn,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage
}