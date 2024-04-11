require('dotenv').config();
const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');
// const { TinyPNG } = require('tinypng');

// const client = new TinyPNG(process.env.TINYPNG_KEY);

const sharp = require('sharp');

const folderPath = path.join(__dirname, '..', 'etc', 'textures');


fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('Error reading folder:', err);
    return;
  }

  const imageFiles = files.filter(file => file.includes('.jpg') || file.includes('.png'));

  console.log(`found ${files.length} files, ${imageFiles.length} images`);

  imageFiles.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const { width, height } = sizeOf(filePath);
    if (width > 1024 || height > 1024) {
      const newName = filePath.substring(0, filePath.lastIndexOf('.')) + '-sm' + filePath.substring(filePath.lastIndexOf('.'));
      // console.log(newName)
      sharp(filePath).resize(1024, Math.floor((width / height) * 1024)).toFile(newName);
      // client.compress(fs.readFileSync(filePath), {
      //   width: 1024,
      //   height: (width / height) * 1024,
      //   method: 'scale'
      // })
    } else {
      // client.compress(fs.readFileSync(filePath))
    }
  });
});