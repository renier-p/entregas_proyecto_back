import { Router } from 'express';
import bcrypt from 'bcrypt';
import User from '../../Dao/models/user.js';

const router = Router();

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        // Asignar el rol 'usuario' por defecto para todos los usuarios que se registren
        const newUser = new User({ first_name, last_name, email, age, password: hashedPassword, role: 'usuario' });
        await newUser.save();
        res.redirect('/login');
    } catch (err) {
        res.status(500).send('Error al registrar usuario');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).send('Usuario no encontrado');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Contraseña incorrecta');

        let role = 'usuario'; // Asignar el rol 'usuario' por defecto
        // Verificar si las credenciales corresponden a un administrador
        if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
            role = 'admin'; // Asignar el rol 'admin' si las credenciales coinciden
        }

        req.session.user = {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: role // Asignar el rol correspondiente
        };
        res.redirect('/profile');
    } catch (err) {
        res.status(500).send('Error al iniciar sesión');
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/login');
    });
});

export default router;



