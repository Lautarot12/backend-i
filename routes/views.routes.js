import { Router } from 'express'
import __dirname from '../utils.js'
import ProductManager from '../ProductManager.js'

const route = Router()
const manager = new ProductManager(__dirname + '/products.json')

route.get('/', async (req, res)=>{
    const productList = await manager.getProducts()
    res.render('index', { productList })
})

route.get('/realtimeproducts', (req, res)=>{
    res.render('realTimeProducts')
})

export default route