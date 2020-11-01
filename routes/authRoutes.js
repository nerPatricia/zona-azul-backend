const {Router} = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

//acho q n precisa de get pra isso ésó no front
router.get('/cadastrar-usuario', authController.temp);//authController.userSignup_get);
router.post('/cadastrar-usuario', authController.userSignup_post);

//acho q n precisa de get pra isso ésó no front
router.get('/cadastrar-carro', authController.temp);
router.post('/cadastrar-carro', authController.carRegister_post);

//acho q n precisa de get pra isso é só no front
router.get('/login', authController.login_get);
router.post('/login',authController.login_post);

router.get('/logout',authController.logout_get);

router.post('/add-creditos',authController.addCredit_post); //sem retorno

router.post('/cadastrar-vaga',authController.vagaRegister_post); //sem retorno

router.get('/vagas',authController.temp);

//retorna o id do registro da vaga
router.post('/estacionar',authController.estacionar_post);

//retorna um vetor com os carros do usuario
router.get('/get-carros', authController.get_carros);

//todo
router.get('/dashboard', authController.temp); //n sei se precisa disso ou oq fazer com isso

module.exports = router;