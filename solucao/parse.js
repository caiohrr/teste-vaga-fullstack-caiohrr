const fs = require('fs');
const csv = require('csv-parser');

const delimiter = ',';

const {validaCpfCnpj, validaPrestacao} = require('./validators');
const formatarValores = require('./formatter');

currency_BR = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2
})

function parseAndWriteCSV(input_file_path, output_file_path) {

  return new Promise((resolve, reject) => {

    // Utilizando um buffer para escrever de forma mais otimizada
    const batch_size = 500;
    let batch_buffer = [];

    const write_stream = fs.createWriteStream(output_file_path);
    write_stream.write('nrInst,nrAgencia,cdClient,nmClient,nrCpfCnpj,nrContrato,dtContrato,qtPrestacoes,vlTotal,cdProduto,dsProduto,cdCarteira,dsCarteira,nrProposta,nrPresta,tpPresta,nrSeqPre,dtVctPre,vlPresta,vlMora,vlMulta,vlOutAcr,vlIof,vlDescon,vlAtual,idSituac,idSitVen\n');

    const read_stream = fs.createReadStream(input_file_path, {encoding : 'utf-8'});

    read_stream
      .pipe(csv())
      .on('data', row => {

        // Aqui pode ser feito algo adicional se o cpf/cnpj
        // for inválido
        validaCpfCnpj(row.nrCpfCnpj);

        // Mesma coisa para a validação de prestação, essas funções
        // estão verificando mas nada de efetivo se realiza com isso
        validaPrestacao(row);

        // Aqui os valores são atualizados de fato
        formatarValores(row, currency_BR);

        const write_row = Object.values(row).join(delimiter) + '\n';

        batch_buffer.push(write_row);
        if (batch_buffer.length >= batch_size) {
          write_stream.write(batch_buffer.join(''));
          batch_buffer = [];
        }
      })
      .on('end', () => {

        if (batch_buffer.length > 0) {
          write_stream.write(batch_buffer.join(''));
        }

        console.log('Finalizado o processamento do arquivo ' + input_file_path);
        write_stream.end();

        resolve(output_file_path);
      })

      .on('error', (err) => {
        console.error('Erro na leitura ou escrita do arquivo:', err);  // Optional: Error handling
        reject(err);
      });
  })
}

module.exports = parseAndWriteCSV;
