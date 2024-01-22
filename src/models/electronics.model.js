import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const colorQuantityImages = new Schema({
    color: {
        type: String, // cloudinary URL
        required: true,
        default: "red"
    },
    quantity: {
        type: Number,
        required: true,
        default: 7
    },
    colorSpecificImageUrls: [{
        type: String, // array of cloudinary URLs
        required: true,
        default: "https://images.pexels.com/photos/8127035/pexels-photo-8127035.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }],
});

const electronicsSchema = new Schema(
    {
        
        tag: {
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
        }

    }, 
    {
        timestamps: true
    }
)

// videoSchema.plugin(mongooseAggregatePaginate)

export const Electronics = mongoose.model("Electronics", electronicsSchema)