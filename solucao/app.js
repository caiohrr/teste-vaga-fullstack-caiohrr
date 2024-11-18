const fs = require('fs');
const csv = require('csv-parser');
//const csv = require('csv-parse');
//const { parse } = require("json2csv");

const input_file = '../data.csv';
const output_file = '../output.csv';

const results = [];

  
currency_BR = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2
})


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

function formatarValores(data, currency) {
  data.vlTotal = currency.format(data.vlTotal);
  data.vlPresta = currency.format(data.vlPresta);
  data.vlMora = currency.format(data.vlMora);
  data.vlMulta = currency.format(data.vlMulta);
  data.vlOutAcr = currency.format(data.vlOutAcr);
  data.vlIof = currency.format(data.vlIof);
  data.vlDescon = currency.format(data.vlDescon);
  data.vlAtual = currency.format(data.vlAtual);
}

function validaPrestacao(data) {
  let tmp_presta = data.vlTotal / data.qtPrestacoes;
  //console.log("vlTotal = %d, qtd = %d", data.vlTotal, data.qtPrestacoes);
  //console.log("vlPresta = %d", data.vlPresta);
  //console.log("actual = %d", tmp_presta);

  if (data.vlPresta != tmp_presta) {
    return false;
    //console.log("wrong");
  } else {
    return true;
    //console.log("correto");
  }
}

fs.createReadStream(input_file)
  .pipe(csv())
  .on("data", data => {
    // Modificar os valores
  
    validaCpfCnpj(data.nrCpfCnpj);
    validaPrestacao(data);
    formatarValores(data, currency_BR);

    results.push(data);
  })
  .on("end", () => {
    // json para csv
    const options = {
      quote: '',
      quoted: false,
      quotedEmpty: false,
    };
    //console.log(typeof results);
    //console.log(results[0].nrCpfCnpj);
    //console.log(results[1].nrCpfCnpj);
    //console.log(results);

    //const csv_data = parse(results, options);

    //// escrevendo o novo arquivo
    //fs.writeFile(output_file, csv_data, (err) => {
    //  if (err) {
    //    console.error("Error writing to output file:", err);
    //  } else {
    //  console.log(`Modified CSV saved to ${output_file}`);
    //  }
    //});
  });
