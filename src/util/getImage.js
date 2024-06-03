const fs = require("fs");
const path = require("path");

const getImage = function (imageName) {

  if(!imageName) {
    return null;
  }
  const imagePath = path.join(__dirname, `../../public/images/${imageName}`);
  console.log('imagePath', imagePath)

  if (fs.existsSync(imagePath)) {
    return `http://152.69.209.236:3001/images/${imageName}`;
  } else {
    throw new Error("File not found: " + imageName);
  }
};

module.exports = getImage;
