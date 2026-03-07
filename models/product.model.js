import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        maxLength: 100,
    },
    description: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 500,
    },
    code: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: Boolean,
        default: true
    },
    category: {
        type: String,
        required: true,
        enum: ['frescos', 'congelados', 'precocidos']
    },
    thumbnail: {
        type: String,
        trim: true,
        default: 'product.jpg'
    }
}, { timestamps: true })

const Product = mongoose.model('Product', productSchema)

export default Product