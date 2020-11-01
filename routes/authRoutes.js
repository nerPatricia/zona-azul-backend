const {Router} = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

router.get('/cadastrar-usuario', authController.userSignup_get);
router.post('/cadastrar-usuario', authController.userSignup_post);

router.get('/cadastrar-carro', authController.temp);
router.post('/cadastrar-carro', authController.carRegister_post);

router.get('/login', authController.login_get);
router.post('/login',authController.login_post);

router.get('/logout',authController.logout_get);

router.post('/add-creditos',authController.addCredit_post);

//todo
router.get('/dashboard', authMiddleware.isEmployee, (req,res) => {res.sendStatus(200)});
router.get('/listar-carros'); //criar metodo pra buscar todos os carros de um usuario

module.exports = router;