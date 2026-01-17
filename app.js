import express from 'express'
import fs from 'fs'
import ProductManager from './productManager.js'

const manager = new ProductManager('./products.json')

const app = express()
app.use(express.json())

app.get('/api/products', async (req, res)=>{
    const products = await manager.getProducts()
    return res.json(products)
})

app.get('/api/products/:pid', async (req, res)=>{
    const id = parseInt(req.params.pid)
    const prodFoundId = await manager.getProductById(id)
    if(!prodFoundId){
        res.status(404)
        return res.send('Producto no encontrado')
    } res.json(prodFoundId)
})

app.post('/api/products', async (req, res)=>{
    const body = req.body
    const newProduct = await manager.addProduct(body.title, body.description, body.price, body.thumbnail, body.code, body.stock)
    res.json(newProduct.payload)
})

app.put('/api/products/:pid', async (req, res)=>{
    const id = parseInt(req.params.pid)
    const updatedFields = req.body
    const allProds = await manager.getProducts()
    const product = allProds.payload.find(prod=>prod.id === Number(id))
    if (!product) {
        return res.status(404).send('Producto no encontrado')
    } Object.assign(product, updatedFields)
    await fs.promises.writeFile(manager.path, JSON.stringify(allProds))
    res.json(product)
})

app.listen(8080, ()=>{
    console.log('Servidor ON')
})
