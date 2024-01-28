import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Cart } from "../models/cart.model.js";
import { Electronics } from "../models/electronics.model.js";
import { Misc } from "../models/misc.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";



//this contoller   addProductToCart    is used to create a CART if already not present in the database
//if already present in the database it will check whether the product to be added to database is already present in the databse
//if the product is already there it will only change the QUANTITY of the product that is requested from the client
//if the CART is already there, but product is not there, then it will automatically Append CONCAT the requested product to the existing array of products present in the database
//    :)
//we can use it to vary any amount of quantity, we can INCREASE DECREASE QUANTITY as we like
const addProductToCart = asyncHandler(async (req, res) => {
  try {
    const { userId, productsAdded } = req.body;

    if (!(userId && productsAdded)) {
      throw new ApiError(400, "All fields are required");
    }

    const foundCart = await Cart.findOne({ userId: userId });

    //create a new cart if there is no cart already present in the database
    if (!foundCart) {
      const cart = await Cart.create({
        userId,
        productsAdded,
      });

      const createdCart = await Cart.findById(cart._id);
      if (!createdCart) {
        throw new ApiError(
          500,
          "Something went wrong while creating and adding the product to the cart"
        );
      }

      const options = {
        httpOnly: true,
        secure: true,
      };

      return res.status(201).json(
        new ApiResponse(
          201,
          {
            cart,
          },
          "cart created and Product added to Cart successfully"
        )
      );
    } 
    
      //it will check if there is a CART ALREADY CREATED in the database, if so it will only modify the arrys of products
    else if (foundCart) {

        // it will check if the request from the client contains any CLOTHING product ehich has to be added to acrt, if NOT it will skip this whole if statement
      if (productsAdded.clothing) {
        let alreadyFoundTheExistingProductInTheCart = false;
        for (const item of foundCart.productsAdded.clothing) {
          if (
            item._Id_OfProduct.toString() === productsAdded.clothing[0]._Id_OfProduct &&
            item.size.toString() === productsAdded.clothing[0].size &&
            item.color.toString() === productsAdded.clothing[0].color
          ) {
            // Update the quantity only as the product is already there 
            item.quantity = productsAdded.clothing[0].quantity;

            alreadyFoundTheExistingProductInTheCart = true;
            break;
          }
        }
        //if a product is already in NOT in the array of productsAdded it will add this product to the existing array and concatenate it to the cart productsAdded array in the end
        if (!alreadyFoundTheExistingProductInTheCart) {
          foundCart.productsAdded.clothing = foundCart.productsAdded.clothing.concat(productsAdded.clothing || []);
        }
      }
// it will check if the request from the client contains any ELECTRONICS product ehich has to be added to acrt, if NOT it will skip this whole if statement
      if (productsAdded.electronics) {
        let alreadyFoundTheExistingProductInTheCart = false;
        for (const item of foundCart.productsAdded.electronics) {
          if (
            item._Id_OfProduct.toString() ===
            productsAdded.electronics[0]._Id_OfProduct
          ) {
            // Update the fields based on req.body
            item.quantity = productsAdded.electronics[0].quantity;

            alreadyFoundTheExistingProductInTheCart = true;
            break;
          }
        }

        if (!alreadyFoundTheExistingProductInTheCart) {
          foundCart.productsAdded.electronics =
            foundCart.productsAdded.electronics.concat(
              productsAdded.electronics || []
            );
        }
      }
        // it will check if the request from the client contains any MISC product which has to be added to CART, if NOT it will skip this whole if statement
      if (productsAdded.misc) {
        let alreadyFoundTheExistingProductInTheCart = false;
        for (const item of foundCart.productsAdded.misc) {
          if (
            item._Id_OfProduct.toString() ===
            productsAdded.misc[0]._Id_OfProduct
          ) {
            // Update the fields based on req.body
            item.quantity = productsAdded.misc[0].quantity;

            alreadyFoundTheExistingProductInTheCart = true;
            break;
          }
        }

        if (!alreadyFoundTheExistingProductInTheCart) {
          foundCart.productsAdded.misc = foundCart.productsAdded.misc.concat(
            productsAdded.misc || []
          );
        }
      }

      foundCart.updatedAt = new Date();
      await foundCart.save();

      const updatedCart = await Cart.findById(foundCart._id);
      if (!updatedCart) {
        throw new ApiError(500, "Something went wrong while updating the Cart");
      }

      const options = {
        httpOnly: true,
        secure: true,
      };

      return res.status(201).json(
        new ApiResponse(
          201,
          {
            updatedCart,
          },
          "Product added to Cart successfully"
        )
      );
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DELETE the product from the cart
const deleteProductToCart = asyncHandler(async (req, res) => {
    try {
        const { userId, productsAdded } = req.body;
    
        if (!(userId && productsAdded)) {
          throw new ApiError(400, "All fields are required");
        }
    
        const foundCart = await Cart.findOne({ userId: userId });
    
        //create a new cart if there is no cart already present in the database
        if (!foundCart) {

          const options = {
            httpOnly: true,
            secure: true,
          };
    
          return res.status(404).json(
            new ApiResponse(
              404,
              {
               response: "Cart with this User doesnt exist"
              },
              "cart doesnt exist"
            )
          );
        } 
        
          //it will check if there is a CART ALREADY CREATED in the database, if so it will only modify the arrys of products
        else if (foundCart) {
    
            // it will check if the request from the client contains any CLOTHING product ehich has to be added to acrt, if NOT it will skip this whole if statement
          if (productsAdded.clothing) {
            let lengthOfFoundCartArrayBeforeFiltering = foundCart.productsAdded.clothing.length
             foundCart.productsAdded.clothing = await foundCart.productsAdded.clothing.filter(
                (item) => (
                  item._Id_OfProduct.toString() !== productsAdded.clothing[0]._Id_OfProduct &&
                  item.size.toString() !== productsAdded.clothing[0].size &&
                  item.color.toString() !== productsAdded.clothing[0].color
                  )
                  );
            let lengthOfFoundCartArrayAfterFiltering = foundCart.productsAdded.clothing.length
            // it will check the length of clothing array before and after filtering if their array lengths remains same it means there is no deletion of product
            // as that product does not exist in this array
            // so it will check whether this filtering has deleted any product object or not 
             if(lengthOfFoundCartArrayAfterFiltering === lengthOfFoundCartArrayBeforeFiltering){
                const options = {
                    httpOnly: true,
                    secure: true,
                  };
            
                  return res.status(404).json(
                    new ApiResponse(
                      404,
                      {
                       response: "Product ID in this CART with this User doesnt exist"
                      },
                      "PRODUCT doesnt exist"
                    )
                  )
            }
          }
    // it will check if the request from the client contains any ELECTRONICS product ehich has to be added to acrt, if NOT it will skip this whole if statement
          if (productsAdded.electronics) {
            let lengthOfFoundCartArrayBeforeFiltering = foundCart.productsAdded.electronics.length
             foundCart.productsAdded.electronics = await foundCart.productsAdded.electronics.filter(
                (item) => (
                  item._Id_OfProduct.toString() !== productsAdded.electronics[0]._Id_OfProduct &&
                  item.size.toString() !== productsAdded.electronics[0].size &&
                  item.color.toString() !== productsAdded.electronics[0].color
                  )
                  );
            let lengthOfFoundCartArrayAfterFiltering = foundCart.productsAdded.electronics.length
            // it will check the length of clothing array before and after filtering if their array lengths remains same it means there is no deletion of product
            // as that product does not exist in this array
            // so it will check whether this filtering has deleted any product object or not 
             if(lengthOfFoundCartArrayAfterFiltering === lengthOfFoundCartArrayBeforeFiltering){
                const options = {
                    httpOnly: true,
                    secure: true,
                  };
            
                  return res.status(404).json(
                    new ApiResponse(
                      404,
                      {
                       response: "Product ID in this CART with this User doesnt exist"
                      },
                      "PRODUCT doesnt exist"
                    )
                  )
            }
          }
            // it will check if the request from the client contains any MISC product which has to be added to CART, if NOT it will skip this whole if statement
          if (productsAdded.misc) {
            let lengthOfFoundCartArrayBeforeFiltering = foundCart.productsAdded.misc.length
             foundCart.productsAdded.misc = await foundCart.productsAdded.misc.filter(
                (item) => (
                  item._Id_OfProduct.toString() !== productsAdded.misc[0]._Id_OfProduct &&
                  item.size.toString() !== productsAdded.misc[0].size &&
                  item.color.toString() !== productsAdded.misc[0].color
                  )
                  );
            let lengthOfFoundCartArrayAfterFiltering = foundCart.productsAdded.misc.length
            // it will check the length of clothing array before and after filtering if their array lengths remains same it means there is no deletion of product
            // as that product does not exist in this array
            // so it will check whether this filtering has deleted any product object or not 
             if(lengthOfFoundCartArrayAfterFiltering === lengthOfFoundCartArrayBeforeFiltering){
                const options = {
                    httpOnly: true,
                    secure: true,
                  };
            
                  return res.status(404).json(
                    new ApiResponse(
                      404,
                      {
                       response: "Product ID in this CART with this User doesnt exist"
                      },
                      "PRODUCT doesnt exist"
                    )
                  )
            }
          }
    
          foundCart.updatedAt = new Date();
          await foundCart.save();
    
          const updatedCart = await Cart.findById(foundCart._id);
          if (!updatedCart) {
            throw new ApiError(500, "Something went wrong while updating the Cart");
          }
    
          const options = {
            httpOnly: true,
            secure: true,
          };
    
          return res.status(201).json(
            new ApiResponse(
              201,
              {
                updatedCart,
              },
              "Product Deleted From Cart successfully"
            )
          );
        }
      } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
      }
});




const fetchSingleClothingProduct = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      throw new ApiError(400, "All fields are required");
    }

    const productDetails = await Clothing.findById(_id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          productDetails,
        },
        "Product fetched successfully"
      )
    );
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export {
  addProductToCart,
  deleteProductToCart,
  fetchSingleClothingProduct,
};
