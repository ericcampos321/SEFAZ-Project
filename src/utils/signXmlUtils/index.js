require("dotenv").config();

const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const { DOMParser, XMLSerializer } = require("@xmldom/xmldom");

// Função para carregar a chave privada e o certificado
const loadKeys = () => {
    const privateKeyPath = path.resolve(process.env.PRIVATE_KEY_PATH);
    const certificatePath = path.resolve(process.env.CERT_PATH_CERT);

    if (!fs.existsSync(privateKeyPath) || !fs.existsSync(certificatePath)) {
        throw new Error("Erro: Caminho para a chave privada ou certificado inválido.");
    }

    const privateKey = fs.readFileSync(privateKeyPath, "utf8");
    const certificate = fs.readFileSync(certificatePath, "utf8");

    return { privateKey, certificate };
};

// Função para assinar o XML
const signXml = ({ xml, chave }) => {
    if (!chave) {
        throw new Error("Erro: A chave não foi gerada corretamente.");
    }

    if (!xml || typeof xml !== "string") {
        throw new Error("Erro: O XML de entrada não é válido.");
    }

    const { privateKey, certificate } = loadKeys();

    // Configurar hash do XML
    const signer = crypto.createSign("RSA-SHA256");

    // Localizar a tag infNFe
    const doc = new DOMParser().parseFromString(xml, "application/xml");
    const infNFeNode = doc.getElementsByTagName("infNFe")[0];
    if (!infNFeNode) {
        throw new Error("Erro: Não foi possível localizar a tag 'infNFe' no XML.");
    }


    // Canonicalizar o XML
    const xmlSerializer = new XMLSerializer();
    const canonicalizedXml = xmlSerializer.serializeToString(infNFeNode);

    // Gerar assinatura
    signer.update(canonicalizedXml);
    const signature = signer.sign(privateKey, "base64");

    // Construir o nó da assinatura XML
    const signatureNode = doc.createElement("Signature");
    signatureNode.setAttribute("xmlns", "http://www.w3.org/2000/09/xmldsig#");

    const signedInfoNode = doc.createElement("SignedInfo");
    signatureNode.appendChild(signedInfoNode);

    const signatureValueNode = doc.createElement("SignatureValue");
    signatureValueNode.textContent = signature;
    signatureNode.appendChild(signatureValueNode);

    const keyInfoNode = doc.createElement("KeyInfo");
    const x509DataNode = doc.createElement("X509Data");
    const x509CertificateNode = doc.createElement("X509Certificate");
    x509CertificateNode.textContent = certificate
        .replace(/-----BEGIN CERTIFICATE-----|-----END CERTIFICATE-----|\n|\r/g, "");
    x509DataNode.appendChild(x509CertificateNode);
    keyInfoNode.appendChild(x509DataNode);
    signatureNode.appendChild(keyInfoNode);

    // Inserir o nó da assinatura no XML
    infNFeNode.parentNode.insertBefore(signatureNode, infNFeNode.nextSibling);

    // Retornar o XML assinado
    const signedXml = xmlSerializer.serializeToString(doc);
    return signedXml;


};

module.exports = signXml;
