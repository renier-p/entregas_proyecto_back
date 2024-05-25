const socketClient=io()

socketClient.on("enviodeproducts",(obj)=>{
    updateProductList(obj)
})


function updateProductList(productList) {

    const productsDiv  = document.getElementById('list-products')

    let productosHTML = ""
  
    productList.forEach((product) => {
        productosHTML += 
        `<div>
          <div >Código: ${product.code}</div>
            <div>
                <h4>${product.title}</h4>
                <p>
                <ul>
                <li>ID: ${product._id}</li>
                <li>Descrición: ${product.description}</li>
                <li>Precio: $${product.price}</li>
                <li>Category: ${product.category}</li>
                <li>Estado: ${product.status}</li>
                <li>Stock: ${product.stock}</li>
                thumbnail: <img src="${product.thumbnail}" alt="img">        </ul>
                </p>
            </div>
            <div>
            <button type="button"  onclick="deleteProduct(${product._id})">Eliminar</button>
            </div>
          </div>
        </div>`
    })
  
    productsDiv .innerHTML = productosHTML
  }


  let form = document.getElementById("formProduct")
  form.addEventListener("submit", (evt) => {
    evt.preventDefault()
  
    let title = form.elements.title.value
    let description = form.elements.description.value
    let stock = form.elements.stock.value
    let thumbnail = form.elements.thumbnail.value
    let category = form.elements.category.value
    let price = form.elements.price.value
    let code = form.elements.code.value
    let status = form.elements.status.checked
  
    socketClient.emit("addProduct", {
        title,
        description,
        stock,
        thumbnail,
        category,
        price,
        code,
      status, 
  
    })
  
    form.reset()
  })

document.getElementById("delete-btn").addEventListener("click", function () {
    const deleteidinput = document.getElementById("id-prod")
    const deleteid = parseInt(deleteidinput.value)
    socketClient.emit("deleteProduct", deleteid)
    deleteidinput.value = ""
  })

function deleteProduct(_id) {
  socketClient.emit("deleteProduct", _id)
}

