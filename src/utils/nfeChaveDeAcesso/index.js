
function gerarChaveAcesso({ cUF, ano, mes, cnpj, mod, serie, nNF, cNF }) {
    // Concatena os 43 primeiros dígitos da chave de acesso
    let chave = `${cUF}${ano}${mes}${cnpj}${mod}${serie}${nNF}${cNF}`;
    
    // Calcula o dígito verificador (DV) usando módulo 11
    const dv = calcularDV(chave);
    chave += dv;  // Adiciona o DV no final

    return chave;

}

// Função para calcular o Dígito Verificador (DV) pelo módulo 11
function calcularDV(chave43) {
    
    let peso = 2;
    let soma = 0;

    // Calcula a soma ponderada dos 43 dígitos da chave
    for (let i = chave43.length - 1; i >= 0; i--) {
        soma += parseInt(chave43[i]) * peso;
        peso = peso === 9 ? 2 : peso + 1;  // Alterna o peso entre 2 e 9
    }

    const resto = soma % 11;
    const dv = resto < 2 ? 0 : 11 - resto;

    return dv.toString();
}

module.exports = gerarChaveAcesso;
