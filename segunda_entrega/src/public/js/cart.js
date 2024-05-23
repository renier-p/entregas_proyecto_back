document.addEventListener("DOMContentLoaded", () => {
  const products = document.getElementsByClassName("product");
  const arrayProducts = Array.from(products);

  arrayProducts.forEach((product) => {
    product.addEventListener("click", async () => {
      const stock = Number(product.getAttribute("data-value"));
      const { value: quantity } = await Swal.fire({
        title: "Add quantity",
        input: "number",
        inputAttributes: {
          autocapitalize: "off",
        },
        showCancelButton: true,
        confirmButtonText: "Confirmar",
      });
      if (quantity !== null) {
        console.log("Cantidad", quantity);
        const quantityNumber = Number(quantity);
        if (quantityNumber > 0 && stock >= quantityNumber) {
          try {
            const response = await fetch("http://localhost:8080/api/carts", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                products: [{ _id: product._id, quantity: quantityNumber }],
              }),
            });
            if (response.ok) {
              const data = await response.json();
              Swal.fire({
                title: "Producto agregado",
                text: `ID: ${product.id} - Cantidad: ${quantityNumber}`,
                icon: "success",
              });
            } else {
              Swal.fire({
                title: "Error",
                text: "Hubo un error agregando el producto",
                icon: "error",
              });
            }
          } catch (error) {
            console.error("Error al agregar el producto al carrito:", error);
            Swal.fire({
              title: "Error",
              text: "Hubo un error agregando el producto",
              icon: "error",
            });
          }
        } else if (quantityNumber <= 0) {
          Swal.fire({
            title: "La cantidad no puede ser 0",
            icon: "warning",
          });
        } else {
          Swal.fire({
            title: "La cantidad es mayor que el stock",
            icon: "error",
          });
        }
      }
    });
  });
});
