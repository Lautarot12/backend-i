import { Router } from 'express'

const route = Router()

route.get('/', (req, res)=>{
    const user = {
        nombre: 'Lautaro',
        edad: 23
    }
    res.render('index', user)
})

export default route