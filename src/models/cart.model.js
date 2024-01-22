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
    
    
}, { _id: false }
);
const various_Id_OfElectronicsProducts = new Schema({
    _Id_OfProduct: {
        type: Schema.Types.ObjectId,
        ref: "Clothing"
    },
    timeOfAddition: {
        type: String,
        required: true,
    },
    
    
}, { _id: false }
);
const various_Id_OfMiscProducts = new Schema({
    _Id_OfProduct: {
        type: Schema.Types.ObjectId,
        ref: "Clothing"
    },
    timeOfAddition: {
        type: String,
        required: true,
    },
    
    
}, { _id: false }
);

const variousModelsOfProducts = new Schema({
    clothing: [various_Id_OfClothingProducts],
    electronics: [various_Id_OfElectronicsProducts],
    misc: [various_Id_OfMiscProducts]
}, { _id: false }
);

const cartSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        productsAdded: variousModelsOfProducts,

    }, 
    {
        timestamps: true
    }
)

// videoSchema.plugin(mongooseAggregatePaginate)

export const Cart = mongoose.model("Cart", cartSchema)