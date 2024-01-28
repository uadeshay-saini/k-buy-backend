import { Router } from "express";
import {addClothingProducts, fetchAllClothingProducts, fetchSingleClothingProduct, addElectronicsProducts,
    fetchAllElectronicsProducts,
    fetchSingleElectronicsProduct,
    addMiscProducts,
    fetchAllMiscProducts,
    fetchSingleMiscProduct} from "../controllers/products.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()


//secured routes
router.route("/clothing/fetchallclothingproducts").post(fetchAllClothingProducts)
router.route("/clothing/addclothingproducts").post(addClothingProducts)
router.route("/clothing/fetchsingleclothingproduct").post(fetchSingleClothingProduct)


router.route("/electronics/fetchallelectronicsproducts").post(fetchAllElectronicsProducts)
router.route("/electronics/addelectronicsproducts").post(addElectronicsProducts)
router.route("/electronics/fetchsingleelectronicsproduct").post(fetchSingleElectronicsProduct)


router.route("/misc/fetchallmiscproducts").post(fetchAllMiscProducts)
router.route("/misc/addmiscproducts").post(addMiscProducts)
router.route("/misc/fetchsinglemiscproduct").post(fetchSingleMiscProduct)


// router.route("/electronics").post(refreshAccessToken)
// router.route("/misc").post(changeCurrentPassword)

export default router