import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { Clothing } from "../models/clothing.model.js";
import { Electronics } from "../models/electronics.model.js";
import { Misc } from "../models/misc.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";




// const clothingProductsc = asyncHandler( async (req, res) => {
//     // get user details from frontend
//     // validation - not empty
//     // check if user already exists: username, email
//     // check for images, check for avatar
//     // upload them to cloudinary, avatar
//     // create user object - create entry in db
//     // remove password and refresh token field from response
//     // check for user creation
//     // return res


//     const {fullName, email, username, password } = req.body
//     //console.log("email: ", email);

//     if (
//         [fullName, email, username, password].some((field) => field?.trim() === "")
//     ) {
//         throw new ApiError(400, "All fields are required")
//     }

//     const existedUser = await User.findOne({
//         $or: [{ username }, { email }]
//     })

//     if (existedUser) {
//         throw new ApiError(409, "User with email or username already exists")
//     }
//     console.log(req.files);

//     // const avatarLocalPath = req.files?.avatar[0]?.path;
//     // // const coverImageLocalPath = req.files?.coverImage[0]?.path;

//     // let coverImageLocalPath;
//     // if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
//     //     coverImageLocalPath = req.files.coverImage[0].path
//     // }
    

//     // if (!avatarLocalPath) {
//     //     throw new ApiError(400, "Avatar file is required")
//     // }

//     const avatar = ""/*await uploadOnCloudinary(avatarLocalPath)*/
//     const coverImage = ""/*await uploadOnCloudinary(coverImageLocalPath)*/

//     // if (!avatar) {
//     //     throw new ApiError(400, "Avatar file is required")
//     // }
   

//     const user = await User.create({
//         fullName,
//         avatar: avatar?.url || "",
//         coverImage: coverImage?.url || "",
//         email, 
//         password,
//         username: username.toLowerCase()
//     })

//     const createdUser = await User.findById(user._id).select(
//         "-password -refreshToken"
//     )

//     if (!createdUser) {
//         throw new ApiError(500, "Something went wrong while registering the user")
//     }

//     return res.status(201).json(
//         new ApiResponse(200, createdUser, "User registered Successfully")
//     )

// } )

const addClothingProducts = asyncHandler(async (req, res) =>{
    try {


        const {tag, gender, type, colorQuantityImages, title, description, fullDescription, brand, price } = req.body

        if (
         !(tag && gender && type && colorQuantityImages && title && description && fullDescription && brand && price)
           ) {
                    throw new ApiError(400, "All fields are required")
                }

                const products = await Clothing.create({
                    tag, 
                    gender, 
                    type, 
                    colorQuantityImages, 
                    title, 
                    description, 
                    fullDescription, 
                    brand,
                    price
                        })

            const createdProduct = await Clothing.findById(products._id)
            if (!createdProduct) {
                        throw new ApiError(500, "Something went wrong while registering the product")
                    }

        const options = {
            httpOnly: true,
            secure: true
        }
    
        return res
        .status(201)
        .json(
            new ApiResponse(
                201, 
                {
                    products
                },
                "Product created successfully"
            )
        )
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }


    

})
const fetchAllClothingProducts = asyncHandler(async (req, res) =>{
    try {
        const page = req.query.page || 1; // Get the requested page from query parameters
        const limit = 10; // Number of products to return in one page

        const skip = (page - 1) * limit;

        const products = await Clothing.find()
            .skip(skip)
            .limit(limit);

        const options = {
            httpOnly: true,
            secure: true
        }
    
        return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                {
                    products
                },
                "Products fetched successfully"
            )
        )
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }


    

})

const fetchSingleClothingProduct = asyncHandler(async (req, res) =>{
    try {
        const { _id } = req.body
        if (
            !(_id)
              ) {
                       throw new ApiError(400, "All fields are required")
                   }

        const productDetails = await Clothing.findById(_id)


        const options = {
            httpOnly: true,
            secure: true
        }
    
        return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                {
                    productDetails
                },
                "Product fetched successfully"
            )
        )
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }


    

})

const addElectronicsProducts = asyncHandler(async (req, res) =>{
    try {


        const {tag, type, colorQuantityImages, title, description, fullDescription, brand, price } = req.body

        if (
         !(tag  && type && colorQuantityImages && title && description && fullDescription && brand && price)
           ) {
                    throw new ApiError(400, "All fields are required")
                }

                const products = await Electronics.create({
                    tag,  
                    type, 
                    colorQuantityImages, 
                    title, 
                    description, 
                    fullDescription, 
                    brand,
                    price
                        })

            const createdProduct = await Electronics.findById(products._id)
            if (!createdProduct) {
                        throw new ApiError(500, "Something went wrong while registering the product")
                    }

        const options = {
            httpOnly: true,
            secure: true
        }
    
        return res
        .status(201)
        .json(
            new ApiResponse(
                201, 
                {
                    products
                },
                "Product created successfully"
            )
        )
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }


    

})
const fetchAllElectronicsProducts = asyncHandler(async (req, res) =>{
    try {
        const page = req.query.page || 1; // Get the requested page from query parameters
        const limit = 10; // Number of products to return in one page

        const skip = (page - 1) * limit;

        const products = await Electronics.find()
            .skip(skip)
            .limit(limit);

        const options = {
            httpOnly: true,
            secure: true
        }
    
        return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                {
                    products
                },
                "Products fetched successfully"
            )
        )
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }


    

})

const fetchSingleElectronicsProduct = asyncHandler(async (req, res) =>{
    try {
        const { _id } = req.body
        if (
            !(_id)
              ) {
                       throw new ApiError(400, "All fields are required")
                   }

        const productDetails = await Electronics.findById(_id)


        const options = {
            httpOnly: true,
            secure: true
        }
    
        return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                {
                    productDetails
                },
                "Product fetched successfully"
            )
        )
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }


    

})

const addMiscProducts = asyncHandler(async (req, res) =>{
    try {


        const {tag, type, colorQuantityImages, title, description, fullDescription, brand, price } = req.body

        if (
         !(tag  && type && colorQuantityImages && title && description && fullDescription && brand && price)
           ) {
                    throw new ApiError(400, "All fields are required")
                }

                const products = await Misc.create({
                    tag,  
                    type, 
                    colorQuantityImages, 
                    title, 
                    description, 
                    fullDescription, 
                    brand,
                    price
                        })

            const createdProduct = await Misc.findById(products._id)
            if (!createdProduct) {
                        throw new ApiError(500, "Something went wrong while registering the product")
                    }

        const options = {
            httpOnly: true,
            secure: true
        }
    
        return res
        .status(201)
        .json(
            new ApiResponse(
                201, 
                {
                    products
                },
                "Product created successfully"
            )
        )
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }


    

})
const fetchAllMiscProducts = asyncHandler(async (req, res) =>{
    try {
        const page = req.query.page || 1; // Get the requested page from query parameters
        const limit = 10; // Number of products to return in one page

        const skip = (page - 1) * limit;

        const products = await Misc.find()
            .skip(skip)
            .limit(limit);

        const options = {
            httpOnly: true,
            secure: true
        }
    
        return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                {
                    products
                },
                "Products fetched successfully"
            )
        )
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }


    

})

const fetchSingleMiscProduct = asyncHandler(async (req, res) =>{
    try {
        const { _id } = req.body
        if (
            !(_id)
              ) {
                       throw new ApiError(400, "All fields are required")
                   }

        const productDetails = await Misc.findById(_id)


        const options = {
            httpOnly: true,
            secure: true
        }
    
        return res
        .status(200)
        .json(
            new ApiResponse(
                200, 
                {
                    productDetails
                },
                "Product fetched successfully"
            )
        )
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }


    

})

export {
    addClothingProducts,
    fetchAllClothingProducts,
    fetchSingleClothingProduct,
    addElectronicsProducts,
    fetchAllElectronicsProducts,
    fetchSingleElectronicsProduct,
    addMiscProducts,
    fetchAllMiscProducts,
    fetchSingleMiscProduct
}