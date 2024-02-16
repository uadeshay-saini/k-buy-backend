import { Router } from "express";
import {calculateCheckoutDetails, addToOrdersPlaced, moveToOrdersDelivered} from "../controllers/orders.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()


//secured routes
// router.route("/clothing/fetchallclothingproducts").post(fetchAllClothingProducts)
router.route("/calculatecheckoutdetails").post(verifyJWT, calculateCheckoutDetails)
router.route("/addtoordersplaced").post(verifyJWT, addToOrdersPlaced)
router.route("/movetoordersdelivered").post(verifyJWT, moveToOrdersDelivered)


// router.route("/deleteproducttocart").post(deleteProductToCart)

// router.route("/clothing/fetchsingleclothingproduct").post(fetchSingleClothingProduct)


// router.route("/electronics").post(refreshAccessToken)
// router.route("/misc").post(changeCurrentPassword)

export default router