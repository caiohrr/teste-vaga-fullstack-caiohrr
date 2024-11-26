const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');

const upload = require('./upload');
const parseAndWriteCSV = require('./parse');

const app = express();
const PORT = 3000;

let current_output_path = "no_file";
let current_upload_path = "no_file";

app.use(express.static(path.join(__dirname, 'public')));

app.use('/tmp-uploads', express.static(path.join(__dirname, 'uploads')));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/favicon.ico', (req, res) => res.status(204));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/download', (req, res) => {
  res.download(current_output_path, 'output.csv', (err) => {
    if (current_output_path == "no_file" || err) {
      res.status(500).send("File not found or unable to download.");
    } else {
      // Deletar o arquivo csv resultante no servidor após ser baixado
      fs.unlink(current_output_path, (err) => {
        if (err) throw err;
        console.log(`${current_output_path} was deleted`);
      });
    }
  });
});

app.post('/upload', upload.single('csvfile'), async (req, res) => {
  const uploaded_csv_path = req.file.path;
  const output_file_path = path.join(__dirname, 'tmp-uploads', `output-${Date.now()}.csv`);

  current_output_path = output_file_path;
  current_upload_path = uploaded_csv_path;

  try {
    const result = await parseAndWriteCSV(uploaded_csv_path, output_file_path);

    // Deletar o arquivo csv que o usuário fez upload 
    fs.unlink(current_upload_path, (err) => {
      if (err) throw err;
      console.log(`${current_upload_path} was deleted`);
    });

    res.sendStatus(204);

  } catch (err) {
    console.error('Erro durante o processamento do arquivo: ', err);
    res.status(500).send("Erro processando o arquivo");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor executando na porta ${PORT}`);
});
