const fs = require('fs');

var marcalibro = {};

marcalibro.leer = function (contadorPath) {
 
  try {
    var marcalibro = JSON.parse(
      fs.readFileSync(contadorPath)
    );
  }
  catch (e) {
    // El archivo no existe, todo bien
    return {
      tuit: 0,
      respuesta: null,
      fecha_ultimo_tuit: null,
    };
  }

  return marcalibro;
};

marcalibro.escribir = function (contadorPath, marcalibro) {
    marcalibro = Object.assign(marcalibro, { fecha_ultimo_tuit: Date.now().valueOf() });
    fs.writeFileSync(contadorPath, JSON.stringify(marcalibro));
}

exports.marcalibro = marcalibro;