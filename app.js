import express from 'express'
import fs from 'fs'
import ProductManager from './productManager.js'
import CartManager from './CartManager.js'

const manager = new ProductManager('./products.json')
const cartManager = new CartManager()

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
    const product = allProds.find(prod=>prod.id === Number(id))
    if (!product) {
        return res.status(404).send('Producto no encontrado')
    } delete updatedFields.id
    Object.assign(product, updatedFields)
    await fs.promises.writeFile(manager.path, JSON.stringify({payload: allProds}))
    res.json(product)
})

app.delete('/api/delete/:pid', async (req, res)=>{
    const id = parseInt(req.params.pid)
    const allProds = await manager.getProducts()
    const filteredProds = allProds.filter((prod)=>{
        return prod.id !== id
    })
    await fs.promises.writeFile(manager.path, JSON.stringify({ payload: filteredProds }))
    res.send('Producto eliminado correctamente')
})

app.post('/api/carts', async (req, res)=>{
    const newCart = await CartManager.createCart()
    return res.json(newCart)
})

app.get('/api/carts/:cid', async (req, res)=>{
    const id = parseInt(req.params.cid)
    const arrayDeCarritos = await fs.promises.readFile('./carts.json','utf-8')
    const parsedArrayDeCarritos = JSON.parse(arrayDeCarritos)
    const carritoEncontrado = parsedArrayDeCarritos.find(carrito =>  carrito.id === id)
    if (!carritoEncontrado) {
        return res.status(404).send('Error, no se encontro el carrito')
    }
    return res.json(carritoEncontrado)
})

app.post('/api/carts/:cid/product/:pid', async (req, res)=>{
    const cartId = parseInt(req.params.cid)
    const prodId = parseInt(req.params.pid)
    const arrayDeCarritos = await fs.promises.readFile('./carts.json','utf-8')
    const parsedArrayDeCarritos = JSON.parse(arrayDeCarritos)
    const carritoEncontrado = parsedArrayDeCarritos.find(carrito =>  carrito.id === cartId)
    const encontradoId = carritoEncontrado.products.find ((product)=>{
        const coincide = product.product === Number(prodId)
        return coincide
    })
    if(!encontradoId){
            carritoEncontrado.products.push({product: prodId, quantity: 1})
        } else{
            encontradoId.quantity += 1
        }
        await fs.promises.writeFile('./carts.json', JSON.stringify(parsedArrayDeCarritos))
        res.json(carritoEncontrado)
})

app.listen(8080, ()=>{
    console.log('Servidor ON')
})
