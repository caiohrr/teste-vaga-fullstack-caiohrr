const fs = require('fs');
const csv = require('csv-parser');
//const csv = require('csv-parse');
//const { parse } = require("json2csv");

const input_file = '../data.csv';
const output_file = '../output.csv';

const results = [];

  
// Converter para R$:
//  vlTotal: '40370.2',
//  vlPresta: '64852.96',
//  vlMora: '56016.01',
//  vlMulta: '25427.7',
//  vlOutAcr: '0',
//  vlIof: '0',
//  vlDescon: '0',
//  vlAtual: '146296.67',

currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2
})

fs.createReadStream(input_file)
  .pipe(csv())
  .on("data", data => {
    // Modificar os valores
    data.vlTotal = currency.format(data.vlTotal);
    data.vlPresta = currency.format(data.vlPresta);
    data.vlMora = currency.format(data.vlMora);
    data.vlMulta = currency.format(data.vlMulta);
    data.vlOutAcr = currency.format(data.vlOutAcr);
    data.vlIof = currency.format(data.vlIof);
    data.vlDescon = currency.format(data.vlDescon);
    data.vlAtual = currency.format(data.vlAtual);

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
    console.log(results);

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
