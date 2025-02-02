const NfeService = require('../../service/NfeService');

// Função para gerar e enviar a NF-e
class NfeController {
   async gerarEnviarNFe(req, res) {
      try {
         const nfeData = req.body;

         const xml = await NfeService.gerarNFeXML(nfeData);  // Chama o service para gerar o XML
         
         const response = await NfeService.enviarNFe(xml);  // Envia o XML para a SEFAZ

         return res.status(200).json({
            status: 'sucesso',
            motivo: 'NFe gerada e enviada com sucesso',
            chaveAcesso: response.chaveAcesso,
         });

         
      } catch (error) {
         console.error('Erro ao gerar e enviar NFe:', error);
         return res.status(500).json({
            status: 'erro',
            motivo: 'Erro interno do servidor',
         });
      }
   }
}

module.exports = new NfeController();
