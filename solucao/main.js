const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const express = require('express');
const multer = require('multer');

const {validaCpfCnpj, validaPrestacao} = require('./validators');
const formatarValores = require('./formatter');
const upload = require('./upload');

const input_file = '../data.csv';
const output_file = '../out.csv';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', upload.single('csvfile'), (req, res) => {
  res.json({message: 'Sucesso ao enviar o arquivo.'})
});

app.listen(port, () => {
  console.log(`Servidor executando na porta ${port}`);
});



currency_BR = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2
})

const write_stream = fs.createWriteStream(output_file);
write_stream.write('nrInst,nrAgencia,cdClient,nmClient,nrCpfCnpj,nrContrato,dtContrato,qtPrestacoes,vlTotal,cdProduto,dsProduto,cdCarteira,dsCarteira,nrProposta,nrPresta,tpPresta,nrSeqPre,dtVctPre,vlPresta,vlMora,vlMulta,vlOutAcr,vlIof,vlDescon,vlAtual,idSituac,idSitVen\n');

const read_stream = fs.createReadStream(input_file, {encoding : 'utf-8'});

const batch_size = 500;
let batch_buffer = [];

async function processRow(row) {
}

read_stream
  .pipe(csv())
  .on('data', row => {

    validaCpfCnpj(row.nrCpfCnpj);
    validaPrestacao(row);
    formatarValores(row, currency_BR);

    const write_row = Object.values(row).join(',') + '\n';

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

    console.log('Finalizado o processamento do arquivo ' + input_file);
    write_stream.end();
  })

  .on('error', (err) => {
    console.error('Erro na leitura ou escrita do arquivo:', err);  // Optional: Error handling
  });
