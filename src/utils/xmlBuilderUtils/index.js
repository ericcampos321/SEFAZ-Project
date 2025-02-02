const { create } = require('xmlbuilder2');
const gerarChaveAcesso = require('../../utils/nfeChaveDeAcesso');

function buildNFeXML(data) {
	if (data) {
		data.chave = gerarChaveAcesso({
			cUF: data.cUF,
			ano: data.dhEmi.substring(2, 4),
			mes: data.dhEmi.substring(5, 7),
			cnpj: data.emitCNPJ,
			mod: '55',
			serie: data.serie.padStart(3, '0'),
			nNF: data.nNF.padStart(9, '0'),
			cNF: data.cNF.padStart(8, '0'),
		});
	}

	const xml = create({ version: '1.0', encoding: 'UTF-8' })
		.ele('NFe', { xmlns: 'http://www.portalfiscal.inf.br/nfe' })
		.ele('infNFe', {
			Id: `NFe${data.chave}`,
			versao: '4.00'
		})
		.ele('ide')
		.ele('cUF').txt(data.cUF).up()
		.ele('cNF').txt(data.cNF).up()
		.ele('natOp').txt(data.natOp).up()
		.ele('mod').txt('55').up()
		.ele('serie').txt(data.serie).up()
		.ele('nNF').txt(data.nNF).up()
		.ele('dhEmi').txt(data.dhEmi).up()
		.ele('tpNF').txt('1').up()
		.ele('idDest').txt('1').up()
		.ele('cMunFG').txt(data.emitCityCode).up()
		.ele('tpImp').txt('1').up()
		.ele('tpEmis').txt('1').up()
		.ele('cDV').txt(data.cDV).up()
		.ele('tpAmb').txt('1').up()
		.ele('finNFe').txt('1').up()
		.ele('indFinal').txt('1').up()
		.ele('indPres').txt('0').up()
		.up()
		.ele('emit')
		.ele('CNPJ').txt(data.emitCNPJ).up()
		.ele('xNome').txt(data.emitName).up()
		.ele('enderEmit')
		.ele('xLgr').txt(data.emitStreet).up()
		.ele('nro').txt(data.emitNumber).up()
		.ele('xBairro').txt(data.emitNeighborhood).up()
		.ele('cMun').txt(data.emitCityCode).up()
		.ele('xMun').txt(data.emitCity).up()
		.ele('UF').txt(data.emitUF).up()
		.ele('CEP').txt(data.emitCEP).up()
		.ele('cPais').txt('1058').up()
		.ele('xPais').txt('BRASIL').up()
		.up()
		.up()
		.ele('dest')
		.ele('CNPJ').txt(data.destCNPJ).up()
		.ele('xNome').txt(data.destName).up()
		.ele('enderDest')
		.ele('xLgr').txt(data.destStreet).up()
		.ele('nro').txt(data.destNumber).up()
		.ele('xBairro').txt(data.destNeighborhood).up()
		.ele('cMun').txt(data.destCityCode).up()
		.ele('xMun').txt(data.destCity).up()
		.ele('UF').txt(data.destUF).up()
		.ele('CEP').txt(data.destCEP).up()
		.ele('cPais').txt('1058').up()
		.ele('xPais').txt('BRASIL').up()
		.up()
		.up()
		.ele('det', { nItem: '1' })
		.ele('prod')
		.ele('cProd').txt(data.prodCode).up()
		.ele('xProd').txt(data.prodName).up()
		.ele('qCom').txt(data.prodQuantity).up()
		.ele('vUnCom').txt(data.prodUnitPrice).up()
		.ele('vProd').txt(data.prodTotal).up()
		.ele('indTot').txt('1').up()
		.up()
		.ele('imposto')
		.ele('ICMS')
		.ele('ICMS00')
		.ele('orig').txt('0').up()
		.ele('CST').txt('00').up()
		.ele('modBC').txt('3').up()
		.ele('vBC').txt(data.vBC).up()
		.ele('pICMS').txt('18.00').up()
		.ele('vICMS').txt(data.vICMS).up()
		.up()
		.up()
		.up()
		.up()
		.ele('total')
		.ele('ICMSTot')
		.ele('vBC').txt(data.vBC).up()
		.ele('vICMS').txt(data.vICMS).up()
		.ele('vProd').txt(data.vProd).up()
		.ele('vNF').txt(data.vNF).up()
		.up()
		.up()
		.ele('transp')
		.ele('modFrete').txt('0').up()
		.up()
		.up()
		.end({ prettyPrint: true });

	return { xml, chave: data.chave };
}

module.exports = buildNFeXML;
