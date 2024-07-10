const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '../out/renderer/src/imagens');
const outputPath = path.join(__dirname, 'images.json');

// Função para obter todos os arquivos do diretório
const getFiles = (dir, files = []) => {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, files);
    } else {
      files.push(filePath);
    }
  });
  return files;
};

// Filtrar apenas arquivos de imagem
const filterImageFiles = files => {
  return files.filter(file => {
    return /\.(png|jpe?g)$/.test(path.extname(file).toLowerCase());
  });
};

// Função principal para gerar JSON com caminhos relativos
const generateJson = () => {
  const allFiles = getFiles(directoryPath);
  const imageFiles = filterImageFiles(allFiles);
  const relativePaths = imageFiles.map(file => path.relative(__dirname, file).replace(/\\/g, '/'));

  const jsonContent = JSON.stringify({ animals: relativePaths }, null, 2);

  fs.writeFileSync(outputPath, jsonContent, 'utf-8');
  console.log('images.json foi gerado com sucesso!');
};

module.exports = generateJson;
