import { Router } from "express";
import {addClothingProducts, fetchAllClothingProducts, fetchSingleClothingProduct} from "../controllers/products.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()


//secured routes
router.route("/clothing/fetchallclothingproducts").post(fetchAllClothingProducts)
router.route("/clothing/addclothingproducts").post(addClothingProducts)
router.route("/clothing/fetchsingleclothingproduct").post(fetchSingleClothingProduct)


// router.route("/electronics").post(refreshAccessToken)
// router.route("/misc").post(changeCurrentPassword)

export default router