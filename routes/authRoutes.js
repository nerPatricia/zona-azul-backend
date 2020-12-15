const {
  Router
} = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

router.post('/cadastrar-usuario', authController.userSignup_post);

router.post('/cadastrar-carro', authController.carRegister_post);

router.post('/login', authController.login_post);

router.get('/logout', authController.logout_get);

router.post('/add-creditos', authController.addCredit_post); //sem retorno

router.post('/cadastrar-vaga', authController.vagaRegister_post); //sem retorno

//retorna o id do registro da vaga
router.post('/estacionar', authController.estacionar_post);

//retorna um vetor com os carros do usuario
router.get('/get-carros', authController.get_carros);

//retorna saldo do usuario
router.get('/get-saldo', authController.get_saldo);

module.exports = router;