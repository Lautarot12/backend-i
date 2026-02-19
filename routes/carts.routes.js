import { Router } from 'express'
import CartManager from '../CartManager.js'
import fs from 'fs'

const route = Router()
const cartManager = new CartManager()

route.post('/', async (req, res)=>{
    const newCart = await cartManager.createCart()
    return res.json(newCart)
})

route.get('/:cid', async (req, res)=>{
    const id = parseInt(req.params.cid)
    const arrayDeCarritos = await fs.promises.readFile('./carts.json','utf-8')
    const parsedArrayDeCarritos = JSON.parse(arrayDeCarritos)
    const carritoEncontrado = parsedArrayDeCarritos.find(carrito =>  carrito.id === id)
    if (!carritoEncontrado) {
        return res.status(404).send('Error, no se encontro el carrito')
    }
    return res.json(carritoEncontrado)
})

route.post('/:cid/product/:pid', async (req, res)=>{
    const cartId = parseInt(req.params.cid)
    const prodId = parseInt(req.params.pid)
    const arrayDeCarritos = await fs.promises.readFile('./carts.json','utf-8')
    const parsedArrayDeCarritos = JSON.parse(arrayDeCarritos)
    const carritoEncontrado = parsedArrayDeCarritos.find(carrito =>  carrito.id === cartId)
    if (!carritoEncontrado) {
        return res.status(404).send('Error, Carrito no encontrado')
    }
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

export default route