import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const sizeQuantity = new Schema({
    S: {
        type: Number,
        required: true,
        default: 0
    },
    M: {
        type: Number,
        required: true,
        default: 0
    },
    L: {
        type: Number,
        required: true,
        default: 0
    },
    XL: {
        type: Number,
        required: true,
        default: 0
    },
    XXL: {
        type: Number,
        required: true,
        default: 0
    },
    XXXL: {
        type: Number,
        required: true,
        default: 0
    },
    
}, { _id: false }
);

const colorQuantityImages = new Schema({
    color: {
        type: String, // cloudinary URL
        required: true,
        default: "red"
    },
    sizeQuantity: [sizeQuantity],

    colorSpecificImageUrls: [{
        type: String, // array of cloudinary URLs
        required: true,
        default: "https://images.pexels.com/photos/8127035/pexels-photo-8127035.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }],
}, { _id: false }
);

const clothingSchema = new Schema(
    {
        tag: {
            type: String, 
            required: true
        },
        gender: {
            type: String, 
            required: true
        },
        type: {
            type: String, 
            required: true
        },
        colorQuantityImages: [colorQuantityImages],

        title: {
            type: String, 
            required: true
        },
        description: {
            type: String, 
            required: true
        },
        fullDescription: {
            type: String, 
            required: true
        },
        brand: {
            type: String, 
            required: true
        },
        price: {
            type: Number, 
            required: true
        }

    }, 
    {
        timestamps: true
    }
)

// videoSchema.plugin(mongooseAggregatePaginate)

export const Clothing = mongoose.model("Clothing", clothingSchema)