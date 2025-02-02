const buildNFeXML = require('../../utils/xmlBuilderUtils');
const signXml = require('../../utils/signXmlUtils');
const sefazClient = require('../../client/sefazClient');
const gerarChaveAcesso = require('../../utils/nfeChaveDeAcesso');

class NfeService {
   // Função para gerar o XML e enviar a NFe
   async gerarNFeXML(data) {

      const xml = buildNFeXML(data);

      const xmlAssinado = signXml(xml);
      return xmlAssinado;
   }
   async enviarNFe(xmlAssinado) {
      try {
         const response = await sefazClient(xmlAssinado);
         return response;
      } catch (error) {
         return { msg: error.message || error };

      }
   }
}


module.exports = new NfeService();