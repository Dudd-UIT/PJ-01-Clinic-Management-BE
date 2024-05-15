const fs = require("fs");
const path = require("path");

const getImage = function (imageName) {
  const imagePath = path.join(__dirname, `../../public/images/${imageName}`);

  if (fs.existsSync(imagePath)) {
    return `http://localhost:3001/images/${imageName}`;
  } else {
    throw new Error("File not found: " + imageName);
  }
};

module.exports = getImage;
