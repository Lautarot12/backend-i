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
    res.json(newProduct.payload)
})

route.put('/:pid', async (req, res)=>{
    const id = parseInt(req.params.pid)
    const updatedFields = req.body
    const allProds = await manager.getProducts()
    const product = allProds.find(prod=>prod.id === Number(id))
    if (!product) {
        return res.status(404).send('Producto no encontrado')
    } delete updatedFields.id
    Object.assign(product, updatedFields)
    await fs.promises.writeFile(manager.path, JSON.stringify({payload: allProds}))
    res.json(product)
})

route.delete('/:pid', async (req, res)=>{
    const id = parseInt(req.params.pid)
    const allProds = await manager.getProducts()
    const filteredProds = allProds.filter((prod)=>{
        return prod.id !== id
    })
    await fs.promises.writeFile(manager.path, JSON.stringify({ payload: filteredProds }))
    res.send('Producto eliminado correctamente')
})

export default route