const mongoose = require('mongoose');

// Função para salvar o status da NFe
async function salvarStatusNFe(chaveAcesso, status) {
  const nfe = new Nfe({
    chaveAcesso,
    status,
    dataEnvio: new Date(),
  });

  await nfe.save();
}

module.exports = { salvarStatusNFe };