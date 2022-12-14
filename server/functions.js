module.exports.checkFileFormat = checkFileFormat;

function checkFileFormat(filename) {
  const imageformat = ["png", "jpg", "jpeg"];
  if (imageformat.includes(filename.substring(filename.length - 3))) {
    return "image";
  } else {
    return "file";
  }
}
