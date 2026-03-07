import { Router } from 'express'
import ProductManager from '../ProductManager.js'
import fs from 'fs'
import Product from '../models/product.model.js'

const route = Router()
const manager = new ProductManager('./products.json')


route.get('/', async (req, res)=>{
    try {
        const products = await Product.find().lean()
        return res.json(products)
    } catch (error) {
        res.status(500).send(error)
    }
})

route.get('/:pid', async (req, res)=>{
    try {
        const id = req.params.pid
        const prodFoundId = await manager.getProductById(id)
        if(!prodFoundId){
            res.status(404)
            return res.send('Producto no encontrado')
        } res.json(prodFoundId)
    } catch (error) {
        res.status(500).send(error)
    }
})

route.post('/', async (req, res)=>{
    try {
        const body = req.body
        const resultado = await Product.create(body)
        if (!resultado) {
            return res.status(400).send('Error, el producto no se pudo agregar, intente nuevamente.')
        }
        res.status(201).json(resultado)
    } catch (error) {
        res.status(500).send(error)
    }
})

route.put('/:pid', async (req, res)=>{
    try {
        const id = req.params.pid
        const updatedFields = req.body
        const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, { new: true, runValidators: true })
        if (!updatedProduct) {
            return res.status(404).send("Error: Producto no encontrado")
        }
        return res.json(updatedProduct)
    } catch (error) {
        res.status(500).send(error)
    }
})

route.delete('/:pid', async (req, res)=>{
    try {
        const id = req.params.pid
        const deletingProd = await manager.deleteProduct(id)
        if (!deletingProd) {
            return res.status(404).send('Error: El producto no pudo eliminarse.')
        }
        res.send({
            'status': 'success',
            'message': 'Producto eliminado correctamente',
        })
    } catch (error) {
        res.status(500).send(error)
    }
})

export default route