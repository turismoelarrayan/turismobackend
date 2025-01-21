// server.js
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Endpoint para enviar correos
app.post("/send-email", async (req, res) => {
  const { name, email, number, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Todos los campos son obligatorios." });
  }

  try {
    // Configura el transporte de Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // Usa Gmail como ejemplo
      auth: {
        user: process.env.EMAIL, // Tu correo
        pass: process.env.PASSWORD, // Tu contraseña o app password
      },
    });

    // Configura el contenido del correo
    const mailOptions = {
      from: `"Turismo El Arrayán" <${process.env.EMAIL}>`,
      to: "tusreservasarrayan@gmail.com", // Correo donde se recibirá el mensaje
      subject: `Nuevo mensaje de ${name}`,
      text: `
        Nombre: ${name}
        Email: ${email}
        Teléfono: ${number}
        Mensaje: ${message}
      `,
    };

    // Envía el correo
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: "Correo enviado con éxito." });
  } catch (error) {
    console.error("Error enviando correo:", error);
    res.status(500).json({ error: "No se pudo enviar el correo." });
  }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
