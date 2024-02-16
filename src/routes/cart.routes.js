import { Router } from "express";
import {addProductToCart, fetchCart, deleteProductToCart} from "../controllers/cart.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()


//secured routes
// router.route("/clothing/fetchallclothingproducts").post(fetchAllClothingProducts)
router.route("/addproducttocart").post(verifyJWT, addProductToCart)
router.route("/fetchcart").post(verifyJWT, fetchCart)
router.route("/deleteproducttocart").post(verifyJWT, deleteProductToCart)

// router.route("/clothing/fetchsingleclothingproduct").post(fetchSingleClothingProduct)


// router.route("/electronics").post(refreshAccessToken)
// router.route("/misc").post(changeCurrentPassword)

export default router