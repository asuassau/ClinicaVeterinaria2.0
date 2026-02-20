//middleware para la carga de imagenes. 

var multer  = require('multer');

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images');
  },
  filename: (req, file, cb) => {
    let ext = 'jpg'; // fallback seguro

    if (file.mimetype === 'image/gif') ext = 'gif';
    else if (file.mimetype === 'image/png') ext = 'png';
    else if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') ext = 'jpg';

    cb(null, 'image-' + Date.now() + '.' + ext);
  }
});

var upload = multer({ storage });

module.exports = upload;