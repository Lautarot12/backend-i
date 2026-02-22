import { Router } from 'express'
import ProductManager from '../ProductManager.js'
import fs from 'fs'

const route = Router()
const manager = new ProductManager('./products.json')


route.get('/', async (req, res)=>{
    const products = await manager.getProducts()
    return res.json(products)
})

route.get('/:pid', async (req, res)=>{
    const id = parseInt(req.params.pid)
    const prodFoundId = await manager.getProductById(id)
    if(!prodFoundId){
        res.status(404)
        return res.send('Producto no encontrado')
    } res.json(prodFoundId)
})

route.post('/', async (req, res)=>{
    const body = req.body
    const newProduct = await manager.addProduct(body.title, body.description, body.price, body.thumbnail, body.code, body.stock)
    res.json(newProduct)
})

route.put('/:pid', async (req, res)=>{
    const id = parseInt(req.params.pid)
    const updatedFields = req.body
    const updatedProduct = await manager.updateProduct(id, updatedFields)
    if (!updatedProduct) {
        return res.status(404).send("Error: Producto no encontrado")
    }
    return res.json(updatedProduct)
})

route.delete('/:pid', async (req, res)=>{
    const id = parseInt(req.params.pid)
    const deletingProd = await manager.deleteProduct(id)
    if (!deletingProd) {
        return res.status(404).send('Error: El producto no pudo eliminarse.')
    }
    res.send('Producto eliminado correctamente')
})

export default route