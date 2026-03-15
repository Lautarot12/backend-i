

const buttons = document.querySelectorAll('.add-to-cart')

buttons.forEach(button => {
    button.addEventListener('click', ()=>{
        const productId = button.dataset.id
        const cartID = "69b705d3b63c5fb71d784af4"

        fetch(`/api/carts/${cartID}/product/${productId}`,{
            method: 'POST'
        })
    })
});
