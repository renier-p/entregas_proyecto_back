import { Router } from "express";
import User from "../../Dao/models/user.js"

const router = Router();

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const newUser = new User({ first_name, last_name, email, age, password });
        await newUser.save();
        res.redirect('/login');
    } catch (err) {
        res.status(500).send('Error al registrar usuario');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password)
    try {
        const user = await User.findOne({ email });
        console.log(user)
        if (!user) return res.status(404).send('Usuario no encontrado');
        req.session.user = {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
        };
        console.log(req.session.user)
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

// import { Router } from "express";
// import User from "../../Dao/models/user.js";
// import bcrypt from 'bcrypt';

// const router = Router();

// router.post("/register", async (req, res) => {
//     const { first_name, last_name, email, age, password } = req.body;
//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = new User({ first_name, last_name, email, age, password: hashedPassword, role: email === 'adminCoder@coder.com' ? 'admin' : 'user' });
//         await newUser.save();
//         res.redirect('/login');
//     } catch (err) {
//         res.status(500).send('Error al registrar usuario');
//     }
// });

// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const user = await User.findOne({ email });
//         if (!user) return res.status(404).send("Usuario no encontrado");

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(400).send("Contraseña incorrecta");

//         req.session.user = {
//             id: user._id,
//             first_name: user.first_name,
//             last_name: user.last_name,
//             email: user.email,
//             age: user.age,
//             role: user.role
//         };
//         res.redirect('/profile');
//     } catch (err) {
//         res.status(500).send('Error al iniciar sesión');
//     }
// });

// router.post('/logout', (req, res) => {
//     req.session.destroy((err) => {
//         if (err) return res.status(500).send('Error al cerrar sesión');
//         res.redirect('/login');
//     });
// });

// export default router;

