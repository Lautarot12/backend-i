//websockets desde el cliente

const socket = io()

function renderProducts(data){
        const divContainer = document.getElementById('productList')
        
        divContainer.innerHTML = ""

        data.forEach(prod => {
            const newProduct = document.createElement('div')
            const deleteProd = document.createElement('button')
            deleteProd.textContent = 'Eliminar'
            deleteProd.addEventListener('click', ()=>{
                const prod2Delete = {
                    title: prod.title,
                    id: prod.id
                }
                socket.emit('deleteProd', prod2Delete)
            })
            const pTitle = document.createElement('p')
            pTitle.textContent = `Producto: ${prod.title}`
            const pDescr = document.createElement('p')
            pDescr.textContent = `Descripcion: ${prod.description}`
            const pCateg = document.createElement('p')
            pCateg.textContent = `Categoria: ${prod.category}`
            const pPrice = document.createElement('p')
            pPrice.textContent = `Precio: ${prod.price}`
            newProduct.appendChild(pTitle)
            newProduct.appendChild(pDescr)
            newProduct.appendChild(pCateg)
            newProduct.appendChild(pPrice)
            newProduct.appendChild(deleteProd)
            divContainer.appendChild(newProduct)

        });
}

socket.on('productList', async (data)=>{
    renderProducts(data)
})


const formAddProd = document.getElementById('formAddProd')

if (formAddProd) {
    formAddProd.addEventListener('submit', ( event)=>{

        event.preventDefault()
        const title = document.getElementById('title').value
        const description = document.getElementById('description').value
        const price = document.getElementById('price').value
        const status = document.getElementById('status').value
        const category = document.getElementById('category').value

        const addedProduct = {
            title,
            description,
            price,
            status,
            category
        }

        socket.emit('submit', addedProduct)
    })
}