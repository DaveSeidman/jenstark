require('dotenv').config();
const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');
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
      console.log('resziing', file)
      // sharp(filePath)
      //   .resize(1024, Math.floor((width / height) * 1024))
      //   .toBuffer()
      //   .then((buffer) => {
      //     fs.writeFile(filePath, buffer, (err) => {
      //       if (err) {
      //         console.error('Error replacing original file:', err);
      //       } else {
      //         console.log('Replaced original file with resized version.');
      //       }
      //     });
      //   })
      //   .catch((err) => {
      //     console.error('Error resizing image:', err);
      //   });
    }
  });
});