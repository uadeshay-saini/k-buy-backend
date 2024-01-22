import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { Cart } from "../models/cart.model.js";
import { Electronics } from "../models/electronics.model.js";
import { Misc } from "../models/misc.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";


const addProductToCart = asyncHandler(async (req, res) =>{
    try {


        const {userId, productsAdded  } = req.body

        if (
         !(userId && productsAdded)
           ) {
                    throw new ApiError(400, "All fields are required")
                }

                const cart = await Cart.create({
                    userId,
                    productsAdded
                        })

            const createdCart = await Cart.findById(cart._id)
            if (!createdCart) {
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
                    cart
                },
                "Product added to Cart successfully"
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



export {
    addProductToCart,
    fetchAllClothingProducts,
    fetchSingleClothingProduct
}