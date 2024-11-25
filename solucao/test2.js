const fs = require('fs');

const readStream = fs.createReadStream('../data.csv', {
  highWaterMark: 512, // Read 1 KB at a time
  encoding: 'utf8',
});

readStream.on('data', (chunk) => {
  console.log(chunk);
  console.log('Chunk size:', chunk.length, 'bytes');
});
