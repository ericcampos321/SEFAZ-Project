require("dotenv").config();

const axios = require("axios");
const https = require("https");
const fs = require("fs");
const xml2js = require("xml2js");
const signXml = require("../../utils/signXmlUtils");


const certPath = process.env.CERT_PATH;
const certPassword = process.env.CERT_PASSWORD;

// Função para configurar o agente HTTPS com certificado
/*const createHttpsAgent = () => {
  return new https.Agent({
    pfx: fs.readFileSync(certPath),
    passphrase: certPassword,
    rejectUnauthorized: false, // Para homologação, pode ser necessário desativar a verificação
  });
};*/

// Função para enviar o XML para a SEFAZ
async function enviarNFe({xml, chave}) {
  console.log(chave);
  try {
    if (!xml || !chave) {
      throw new Error("XML ou chave de acesso inválidos.");
    }

    console.log("Iniciando assinatura do XML...");
    const xmlAssinado = await signXml({ xml, chave });
    console.log("XML assinado com sucesso!");

    const sefazUrl =
      process.env.NODE_ENV === "production"
        ? process.env.SEFAZ_URL_PRODUCAO
        : process.env.SEFAZ_URL_HOMOLOGACAO;

    const agent = createHttpsAgent();

    console.log("Enviando NF-e para SEFAZ...");
    const response = await axios.post(sefazUrl, xmlAssinado, {
      httpsAgent: agent,
      headers: {
        "Content-Type": "application/xml",
      },
    });

    if (response.status === 200) {
      console.log("Resposta recebida com sucesso.");
      const xmlResponse = response.data;

      console.log("Resposta da SEFAZ:", xmlResponse);

      const parsedResponse = await parseXmlResponse(xmlResponse);

      if (parsedResponse) {
        console.log("Resposta processada com sucesso.");
        return {
          status: 1,
          chaveAcesso: parsedResponse.chaveAcesso,
        };
      } else {
        console.error("Erro ao processar a resposta da SEFAZ.");
        return { status: 0, motivo: "Erro ao processar a resposta da SEFAZ" };
      }
    } else {
      console.error("Resposta inesperada da SEFAZ.");
      return { status: 0, motivo: "Resposta inesperada da SEFAZ" };
    }
  } catch (error) {
    console.error("Erro ao enviar NF-e para a SEFAZ:", error.message);
    return { status: 0, motivo: error.message };
  }
}

// Função para parsear a resposta XML
async function parseXmlResponse(xmlResponse) {
  try {
    const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });
    const result = await parser.parseStringPromise(xmlResponse);

    if (result && result.retConsReciNFe && result.retConsReciNFe.infRec) {
      return { chaveAcesso: result.retConsReciNFe.infRec.nRec };
    } else {
      console.error("Chave de acesso não encontrada na resposta.");
      return null;
    }
  } catch (error) {
    console.error("Erro ao processar o XML de resposta:", error.message);
    return null;
  }
}

module.exports = enviarNFe;
