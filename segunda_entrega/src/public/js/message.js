const socketClient = io();
const userName = document.getElementById("username");
const form = document.getElementById("form");
const inputMessage = document.getElementById("message");
const chatMessages = document.getElementById("chatmessage");
const clearChat = document.getElementById("clearchat");

let usuario = null;

if (!usuario) {
  Swal.fire({
    title: "Bienvenidos al Chat",
    text: "Ingresa tu usuario",
    input: "text",
    inputValidator: (value) => {
      if (!value) {
        return "Necesitas ingresar un nombre para unirte a la sala";
      }
    },
  })
    .then((username) => {
      usuario = username.value;
      userName.innerHTML = usuario;
      socketClient.emit("nuevousuario", usuario);
    })
    .catch((error) => {
      console.error("Error al ingresar el usuario:", error);
    });
}

form.onsubmit = (e) => {
  e.preventDefault();
  if (inputMessage.value.trim() === "") return;

  const info = {
    user: usuario,
    message: inputMessage.value,
  };

  socketClient.emit("mensaje", info);
  inputMessage.value = ""; // Limpiar el input después de enviar
};

clearChat.onclick = () => {
  socketClient.emit("clearchat");
};

socketClient.on("chat", (mensajes) => {
  const chatRender = mensajes
    .map((e) => {
      return `<div class="message"><strong>${e.user}:</strong> ${e.message}</div>`;
    })
    .join("");
  chatMessages.innerHTML = chatRender;
});

socketClient.on("broadcast", (usuario) => {
  Toastify({
    text: `Ingreso ${usuario} al chat`,
    duration: 5000,
    position: "right",
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();
});
