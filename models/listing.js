const mongoose = require("mongoose");
const Schema = mongoose.Schema;  // to avoid writing mongoose.schema again and again
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    
    },                                                                                                                                          
    description: String,
    image: {
        url: String,
        filename: String,
    },

    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    // To add coordinates for map in GeoJSON format
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        }
    },

    category: {
        type: String,
        enum: ["Mountains", "Arctic", "Farms", "Camping", "Deserts"]
    }
});

// To delete the reviews in a particlar listing when we delete that listing.
listingSchema.post("findOneAndDelete", async(listing) =>{
    if(listing)
    {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});



const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;