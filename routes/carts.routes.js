import { Router } from 'express'
import Cart from "../models/cart.model.js"
import Product from '../models/product.model.js'
import fs from 'fs'

const route = Router()

route.post('/', async (req, res)=>{
    try {
        const newCart = await Cart.create({})
        return res.json(newCart)
    } catch (error) {
        res.status(500).json(error)
    }
})

route.get('/:cid', async (req, res)=>{
    try {
        const id = req.params.cid
        const cart = await Cart.findById(id).populate('products.product')
        
        if (!cart) {
            return res.status(404).send('Error, no se encontro el carrito')
        }
        return res.json(cart.products)
    } catch (error) {
        res.status(500).send(error)
    }
})

route.post('/:cid/product/:pid', async (req, res)=>{
    try {
        const cartId = req.params.cid
        const prodId = req.params.pid
        const { quantity } = req.body
       
        const product = await Product.findById(prodId)
        if (!product) {
            return res.status(404).json('Producto no encontrado')
        }
        
        const cart = await Cart.findById(cartId)
        if (!cart) {
            return res.status(404).json('Carrito no encontrado')
        }

        const productIndex = cart.products.findIndex((p)=>p.product == prodId)

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity
        } else {
            cart.products.push({ product: prodId, quantity })
        }

        const updatedCart = await cart.save()

        res.status(200).json({ status: 'success', updatedCart })
    } catch (error) {
        res.status(500).send(error)
    }
})

export default route