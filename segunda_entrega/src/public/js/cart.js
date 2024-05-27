document.addEventListener('DOMContentLoaded', () => {
    const products = document.getElementsByClassName('product');
    const arrayProducts = Array.from(products);

    arrayProducts.forEach(product => {
        product.addEventListener('click', async () => {
            const stock = Number(product.getAttribute('data-value'));
            const { value: quantity } = await Swal.fire({
                title: 'Agregar Cantidad',
                input: 'number',
                inputAttributes: {
                    autocapitalize: 'off'
                },
                showCancelButton: true,
                confirmButtonText: 'Confirmar',
            });
            if (quantity !== null) {
                console.log("CANTIDAD", quantity);
                const quantityNumber = Number(quantity);
                if (quantityNumber > 0 && stock >= quantityNumber) {
                    try {
                        const response = await fetch('http://localhost:8080/api/carts', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ products: [{ _id: product._id, quantity: quantityNumber }] }),
                        });
                        if (response.ok) {
                            const data = await response.json();
                            Swal.fire({
                                title: 'Producto agregado',
                                text: `ID: ${product.id} - Cantidad: ${quantityNumber}`,
                                icon: 'success',
                            });
                        } else {
                            Swal.fire({
                                title: 'Error',
                                text: 'No se pudo agregar el producto al carro',
                                icon: 'error',
                            });
                        }
                    } catch (error) {
                        console.error('Error al agregar el producto al carrito:', error);
                        Swal.fire({
                            title: 'Error',
                            text: 'No se pudo agregar el producto al carro',
                            icon: 'error',
                        
                        });
                    }
                } else if (quantityNumber <= 0) {
                    Swal.fire({
                        title: 'Debe ser mayor a 0',
                        icon: 'warning',
                    });
                } else {
                    Swal.fire({
                        title: 'Mayor que el stock',
                        icon: 'error',
                    });
                }
            }
        });
    });
});
