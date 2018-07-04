const fs = require('fs');

const documento = {};

documento.leer = function (path) {
  return JSON.parse(
    fs.readFileSync(path, { encoding: "utf-8" })
  ); 
}

documento.transformar = function(doc, ref)
{
	var textosTransformados = aplanar(doc.map(function(e) {
		return documento.transformarI(e, ref);
	}));
	return textosTransformados; //.splice(0, 10);
}

function aplanar(items) {
	const flat = [];
	items.forEach(item => {
		if (Array.isArray(item)) {
			flat.push(...aplanar(item));
		} else {
			flat.push(item);
		}
	});
	return flat;
}

documento.transformarI = function (e, referencia) {
	//console.log("Calling " + JSON.stringify(e) + " on ref " + ref);
  var hashtags = " #ConstitucionVenezuela1999";
  var noEsUndef = function (e) { return typeof e !== "undefined"; };
  var tieneArticulo  = "articulo"  in e;
  var elArticulo350  = tieneArticulo && e.articulo === "350";
  var tieneTitulo    = "titulo"    in e;
  var tieneSubtitulo = "subtitulo" in e;
  var tieneTextos    = "textos"    in e;
  var tieneContenido = "contenido" in e;
  var tieneSubrayado = tieneTextos && (e.textos.join('').split("#").length === 3);
  var referenciaActual = [
    (tieneTitulo?
      e.titulo: 
      undefined
    ), 
    (tieneSubtitulo?
      e.subtitulo: 
      undefined
    )
  ].filter(noEsUndef)
   .join(", ");
  var nuevaReferencia = (referenciaActual.length === 0?
    referencia:
    referencia.concat(referenciaActual)
  );

  if (tieneTextos) {
    var inicioStatus = (tieneArticulo?
      "Artículo " + e.articulo:
      nuevaReferencia.slice().reverse().join(", ")
    );
    var subrayado = (tieneSubrayado?
      ' - ' + e.textos.join("\n").split("#")[1]:
      ''
    ).substr(0, 280 - inicioStatus.length - (!elArticulo350? hashtags.length: 0)); // Hacer que quepa en 280 caracteres
    var status = [inicioStatus, subrayado, (!elArticulo350? hashtags: '')].join('');
    var initialtwt = {
      status: status,
      statusLength: status.length,
      imagenEntrada: Object.assign({
          texto: e.textos.join("\n").split("#").join(''),
          referencia: nuevaReferencia.join(", ")
	      },
	      (tieneArticulo?
	        { articulo: e.articulo }:
	        undefined
	      )
      )
    }
  }

  if (tieneContenido) {
    var contenido = e.contenido.map(function (e) {
      return documento.transformarI(e, nuevaReferencia);
    });
  }

  return [
    (noEsUndef(initialtwt)?
      initialtwt:
      undefined
    )
  ].filter(noEsUndef).concat(
    (noEsUndef(contenido)?
      contenido:
      []
    )
  );
}

exports.documento = documento;