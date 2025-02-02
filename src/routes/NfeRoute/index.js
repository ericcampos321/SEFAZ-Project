const router = require('express').Router();

const NfeController = require('../../controllers/nfeController');

router.post('/createNfe', NfeController.gerarEnviarNFe);

module.exports = router;