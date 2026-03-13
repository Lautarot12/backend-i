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

route.get('/products', async (req, res)=>{
    
    const { page = 1, limit = 10, sort } = req.query

    let sortOption = {}

    if(sort === 'asc'){
        sortOption = { price: 1 }
    } else if (sort === 'desc') {
        sortOption = { price: -1 }
    }
    
    const data = await Product.paginate({}, { limit, page, sort: sortOption, lean: true })

    res.render('products', {
        products: data.docs,
        page: data.page,
        hasPrevPage: data.hasPrevPage,
        hasNextPage: data.hasNextPage,
        prevPage: data.prevPage,
        nextPage: data.nextPage
    })
})