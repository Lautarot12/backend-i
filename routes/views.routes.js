import { Router } from 'express'
import __dirname from '../utils.js'
import Product from '../models/product.model.js'

const route = Router()

route.get('/', async (req, res)=>{
    try {
        const { limit = 10, page = 1 } = req.query

        const data = await Product.paginate({}, { limit, page, lean: true })
        const products = data.docs
        delete data.docs

        const links = []

        for(let i =1; i <= data.totalPages; i++){
            links.push({ text: i, link: `?limit=${limit}&page=${i}` })
        }

        res.render("index", { products, links })
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al mostrar la pagina de home' })
    }
})

route.get('/realtimeproducts', (req, res)=>{
    res.render('realTimeProducts')
})

export default route