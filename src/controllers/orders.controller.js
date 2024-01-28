import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Cart } from "../models/cart.model.js";

import { OrdersPlaced } from "../models/orders.placed.model.js";
import { OrdersDelivered } from "../models/orders.delivered.model.js";

import { Clothing } from "../models/clothing.model.js";

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
const calculateCheckoutDetails = asyncHandler(async (req, res) => {
  try {
    const { userId, productsAdded } = req.body;

    if (!(userId && productsAdded)) {
      throw new ApiError(400, "All fields are required");
    }
 let totalBaseAmountOfAllProducts = 0;
        let deliveryCharges = 0;
      if (productsAdded.clothing) {
        let alreadyFoundTheExistingProductInTheCart = false;
        for (const item of productsAdded.clothing) {

          const fetchProductDetails = await Clothing.findById(item._Id_OfProduct.toString());
          totalBaseAmountOfAllProducts = totalBaseAmountOfAllProducts + (fetchProductDetails.price*item.quantity);
          deliveryCharges = deliveryCharges + 50;

     
        }
      }
// it will check if the request from the client contains any ELECTRONICS product ehich has to be added to acrt, if NOT it will skip this whole if statement
      if (productsAdded.electronics) {
        let alreadyFoundTheExistingProductInTheCart = false;
        for (const item of productsAdded.electronics) {
          
            const fetchProductDetails = await Electronics.findById(item._Id_OfProduct.toString());

            totalBaseAmountOfAllProducts = totalBaseAmountOfAllProducts + (fetchProductDetails.price*item.quantity);
            deliveryCharges = deliveryCharges + 50;
        }

      }
        // it will check if the request from the client contains any MISC product which has to be added to CART, if NOT it will skip this whole if statement
      if (productsAdded.misc) {
      
        for (const item of productsAdded.misc) {
        const fetchProductDetails = await Misc.findById(item._Id_OfProduct.toString());

        totalBaseAmountOfAllProducts = totalBaseAmountOfAllProducts + (fetchProductDetails.price*item.quantity);
        deliveryCharges = deliveryCharges + 50;
        }
      }

      let baseAmount = totalBaseAmountOfAllProducts
      let taxAmount = (totalBaseAmountOfAllProducts*18)/100
      let discountAny = 0
      if(deliveryCharges!==0){
        deliveryCharges = deliveryCharges + 100
      }
      let finalAmount = baseAmount+taxAmount-discountAny+deliveryCharges
      

      const options = {
        httpOnly: true,
        secure: true,
      };

      return res.status(201).json(
        new ApiResponse(
          201,
          {
            baseAmount,
            taxAmount,
            discountAny,
            deliveryCharges,
            finalAmount
          },
          "Product valuations Calculated successfully"
        )
      );
    
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////
const addToOrdersPlaced = asyncHandler(async (req, res) => {
  try {
    const { userId, ordersPlacedArray } = req.body;

    if (!(userId && ordersPlacedArray)) {
      throw new ApiError(400, "All fields are required");
    }


    let totalBaseAmountOfAllProducts = 0;
    let deliveryCharges = 0;
  if (ordersPlacedArray[0].productsOrdersPlaced.clothing) {
    let alreadyFoundTheExistingProductInTheCart = false;
    for (const item of ordersPlacedArray[0].productsOrdersPlaced.clothing) {
      const fetchProductDetails = await Clothing.findById(item._Id_OfProduct.toString());
      totalBaseAmountOfAllProducts = totalBaseAmountOfAllProducts + (fetchProductDetails.price*item.quantity);
      deliveryCharges = deliveryCharges + 50;

 
    }
  }
// it will check if the request from the client contains any ELECTRONICS product ehich has to be added to acrt, if NOT it will skip this whole if statement
  if (ordersPlacedArray[0].productsOrdersPlaced.electronics) {
    let alreadyFoundTheExistingProductInTheCart = false;
    for (const item of ordersPlacedArray[0].productsOrdersPlaced.electronics) {
      
        const fetchProductDetails = await Electronics.findById(item._Id_OfProduct.toString());

        totalBaseAmountOfAllProducts = totalBaseAmountOfAllProducts + (fetchProductDetails.price*item.quantity);
        deliveryCharges = deliveryCharges + 50;
    }

  }
    // it will check if the request from the client contains any MISC product which has to be added to CART, if NOT it will skip this whole if statement
  if (ordersPlacedArray[0].productsOrdersPlaced.misc) {
  
    for (const item of ordersPlacedArray[0].productsOrdersPlaced.misc) {
    const fetchProductDetails = await Misc.findById(item._Id_OfProduct.toString());

    totalBaseAmountOfAllProducts = totalBaseAmountOfAllProducts + (fetchProductDetails.price*item.quantity);
    deliveryCharges = deliveryCharges + 50;
    }
  }

  let baseAmount = totalBaseAmountOfAllProducts
  let taxAmount = (totalBaseAmountOfAllProducts*18)/100
  let discountAny = 0
  if(deliveryCharges!==0){
    deliveryCharges = deliveryCharges + 100
  }
  let finalAmount = baseAmount+taxAmount-discountAny+deliveryCharges

  const billingDetails = {
            baseAmount,
            taxAmount,
            discountAny,
            deliveryCharges,
            finalAmount
          };
          const foundPlacedOrders = await OrdersPlaced.findOne({ userId: userId });
    //create a new cart if there is no cart already present in the database
    if (!foundPlacedOrders) {
      const placedOrders = await OrdersPlaced.create({
        userId,
        ordersPlacedArray: [{
          productsOrdersPlaced: ordersPlacedArray[0].productsOrdersPlaced,
          billingDetails: billingDetails
        }],
        status: "Order Placed"
      });

      const createdPlacedOrders = await OrdersPlaced.findById(placedOrders._id);
      if (!createdPlacedOrders) {
        throw new ApiError(
          500,
          "Something went wrong while creating and adding the produts to the OrdersPlaced Section"
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
            createdPlacedOrders,
          },
          "PlacedOrders created and Product added to PlacedOrders successfully, orders is placed!"
        )
      );
    } 
    
      //it will check if there is a CART ALREADY CREATED in the database, if so it will only modify the arrys of products
    else if (foundPlacedOrders) {

        // it will check if the request from the client contains any CLOTHING product ehich has to be added to acrt, if NOT it will skip this whole if statement
       
          foundPlacedOrders.ordersPlacedArray = foundPlacedOrders.ordersPlacedArray.concat(
            [{
              productsOrdersPlaced: ordersPlacedArray[0].productsOrdersPlaced,
              billingDetails: billingDetails
            }] || []
          );
      

      foundPlacedOrders.updatedAt = new Date();
      await foundPlacedOrders.save();

      const updatedPlacedOrders = await OrdersPlaced.findById(foundPlacedOrders._id);
      if (!updatedPlacedOrders) {
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
            updatedPlacedOrders,
          },
          "Products added to PlacedOrders successfully, order is placed!"
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
const moveToOrdersDelivered = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.body;
        const foundOrdersDelivered = await OrdersDelivered.findOne({ userId: userId });

        if(!foundOrdersDelivered){

        

        if (!(userId)) {
          throw new ApiError(400, "All fields are required");
        }
    
        const foundOrdersPlaced = await OrdersPlaced.findOne({ userId: userId });
    
        //create a new cart if there is no cart already present in the database
        if (!foundOrdersPlaced) {

          const options = {
            httpOnly: true,
            secure: true,
          };
    
          return res.status(404).json(
            new ApiResponse(
              404,
              {
               response: "OrdersPlaced with this User doesnt exist"
              },
              "OrdersPlaced doesnt exist"
            )
          );
        } 
        if (foundOrdersPlaced) {
          const ordersDelivered = await OrdersDelivered.create({
            userId: userId,
            ordersDeliveredArray: foundOrdersPlaced.ordersPlacedArray,
            status: "Delivered"
          });
    
          const createdOrdersDelivered = await OrdersDelivered.findById(ordersDelivered._id);
          if (!createdOrdersDelivered) {
            throw new ApiError(
              500,
              "Something went wrong while creating and adding the product to the OrdersDelivered"
            );
          }
          if(createdOrdersDelivered){
           const deletedObject = await OrdersPlaced.findOneAndDelete({ userId: userId });

          }
          const options = {
            httpOnly: true,
            secure: true,
          };
    
          return res.status(201).json(
            new ApiResponse(
              201,
              {
                ordersDelivered,
              },
              "OrdersDelivered created and moved from OrdersPlaced to OrdersDelivered successfully"
            )
          );
        } 
          //it will check if there is a CART ALREADY CREATED in the database, if so it will only modify the arrys of products
      }

      else if (foundOrdersDelivered) {

        // it will check if the request from the client contains any CLOTHING product ehich has to be added to acrt, if NOT it will skip this whole if statement
        const foundOrdersPlaced = await OrdersPlaced.findOne({ userId: userId });

        if (!foundOrdersPlaced) {

          const options = {
            httpOnly: true,
            secure: true,
          };
    
          return res.status(404).json(
            new ApiResponse(
              404,
              {
               response: "OrdersPlaced with this User doesnt exist"
              },
              "OrdersPlaced doesnt exist"
            )
          );
        } 

        if (foundOrdersPlaced) {
          
          foundOrdersDelivered.ordersDeliveredArray = foundOrdersDelivered.ordersDeliveredArray.concat(
            [{
              productsOrdersPlaced: foundOrdersPlaced.ordersPlacedArray[0].productsOrdersPlaced,
              billingDetails: foundOrdersPlaced.ordersPlacedArray[0].billingDetails
            }] || []
          );

          foundOrdersDelivered.updatedAt = new Date();
      await foundOrdersDelivered.save();

      
      

          const updatedOrdersDelivered = await OrdersDelivered.findOne({ userId: userId });
          if (!updatedOrdersDelivered) {
            throw new ApiError(
              500,
              "Something went wrong while creating and adding the product to the OrdersDelivered"
            );
          }
          if(updatedOrdersDelivered){
            const deletedObject = await OrdersPlaced.findOneAndDelete({ userId: userId });

          }
          const options = {
            httpOnly: true,
            secure: true,
          };
    
          return res.status(201).json(
            new ApiResponse(
              201,
              {
                updatedOrdersDelivered,
              },
              "OrdersDelivered created and moved from OrdersPlaced to OrdersDelivered successfully"
            )
          );
        } 
    }

      } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
      }
});





export {
    calculateCheckoutDetails,
    addToOrdersPlaced,
    moveToOrdersDelivered
};
