import mongoose, {Schema} from "mongoose";

const various_Id_OfClothingProducts = new Schema({
    _Id_OfProduct: {
        type: Schema.Types.ObjectId,
        ref: "Clothing"
    },
    timeOfAddition: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    
    
}, { _id: false }
);
const various_Id_OfElectronicsProducts = new Schema({
    _Id_OfProduct: {
        type: Schema.Types.ObjectId,
        ref: "Electronics"
    },
    timeOfAddition: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    }
    
    
}, { _id: false }
);
const various_Id_OfMiscProducts = new Schema({
    _Id_OfProduct: {
        type: Schema.Types.ObjectId,
        ref: "Misc"
    },
    timeOfAddition: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    }
    
    
}, { _id: false }
);

const variousModelsOfProducts = new Schema({
    clothing: [various_Id_OfClothingProducts],
    electronics: [various_Id_OfElectronicsProducts],
    misc: [various_Id_OfMiscProducts]
}, { _id: false }
);

const billingDetails = new Schema({
    baseAmount: {
        type: Number,
        required: true,
    },
    taxAmount: {
        type: Number,
        required: true,
    },
    discountAny: {
        type: Number,
        required: true,
    },
    deliveryCharges: {
        type: Number,
        required: true,
    },
    finalAmount: {
        type: Number,
        required: true,
    },
    
    
}, { _id: false }
);


const ordersPlacedArray = new Schema({
   
    productsOrdersPlaced: variousModelsOfProducts,

    billingDetails: billingDetails,
    
}, 
{
    timestamps: true
}, { _id: false }
);

const ordersPlacedSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        
        ordersPlacedArray: [ordersPlacedArray],

        status: {
            type: String,
            required: true,
        },


    }, 
    {
        timestamps: true
    }
)

// videoSchema.plugin(mongooseAggregatePaginate)

export const OrdersPlaced = mongoose.model("OrdersPlaced", ordersPlacedSchema)