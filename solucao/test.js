const fs = require('fs');
const readline = require('readline');

const readStream = fs.createReadStream('../data.csv', { encoding: 'utf8' });

let leftover = '';

readStream.on('data', (chunk) => {
  const lines = (leftover + chunk).split('\n'); // Split chunk by line breaks
  leftover = lines.pop(); // Keep the last incomplete line
  lines.forEach((line) => {
    console.log('Line:', line); // Process each line
  });
});

readStream.on('end', () => {
  if (leftover) {
    console.log('Last line:', leftover); // Process any remaining text
  }
  console.log('Finished reading file.');
});

