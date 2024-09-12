import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    foodName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
});

const Food = mongoose.model("Food", foodSchema);

export default Food;