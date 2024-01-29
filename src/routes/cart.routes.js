import { Router } from "express";
import {addProductToCart, deleteProductToCart} from "../controllers/cart.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()


//secured routes
// router.route("/clothing/fetchallclothingproducts").post(fetchAllClothingProducts)
router.route("/addproducttocart").post(addProductToCart)
router.route("/deleteproducttocart").post(deleteProductToCart)

// router.route("/clothing/fetchsingleclothingproduct").post(fetchSingleClothingProduct)


// router.route("/electronics").post(refreshAccessToken)
// router.route("/misc").post(changeCurrentPassword)

export default router