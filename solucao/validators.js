// Validação dos dados

function validaCpf(cpf) {

  if (cpf.length != 11) {
    return false;
  }

  let sum = 0;
  for (let i = 1; i <= 9; i++) {
    sum += i * cpf[i - 1];
  }

  let df_1 = (sum % 11) % 10;

  sum = 0;
  for (let i = 0; i <= 8; i++) {
    sum += i * cpf[i];
  }
  sum += df_1 * 9;

  let df_2 = (sum % 11) % 10;

  if (df_1 == cpf[9] && df_2 == cpf[10]) {
    //console.log("CPF %d isvalid", cpf);
    return true;
  } else {
    //console.log("CPF %d notvalid", cpf);
    return false;
  }

}

function validaCnpj(cnpj) {

  if (cnpj.length != 14) {
    return false;
  }

  const pesos = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let df_1 = 0;

  for (let i = 0; i < 12; i++) {
    df_1 += cnpj[i] * pesos[i];
  }

  df_1 = df_1 % 11;
  if (df_1 < 2) {
    df_1 = 0;
  } else {
    df_1 = 11 - df_1;
  }

  let df_2 = cnpj[0] * 6; 

  for (let i = 1; i < 12; i++) {
    df_2 += cnpj[i] * pesos[i - 1]; 
  }

  df_2 += df_1 * 2;

  df_2 = df_2 % 11;

  if (df_2 < 2) {
    df_2 = 0;
  } else {
    df_2 = 11 - df_2;
  }

  if (cnpj[12] == df_1 && cnpj[13] == df_2) {
    return true;
  } else {
    return false;
  }

}

function validaCpfCnpj(cpf_cnpj) {

  // O tamanho determinara se sera avaliado como cpf ou cnpj
  if (cpf_cnpj.length == 11) {
    return validaCpf(cpf_cnpj);
  } else if (cpf_cnpj.length == 14) {
    return validaCnpj(cpf_cnpj);
  } else {
    return false;
  }
}

function validaPrestacao(data) {

  return data.vlTotal == data.vlPresta * data.qtPrestacoes;
}

module.exports = {validaCpf, validaCnpj, validaCpfCnpj, validaPrestacao};
