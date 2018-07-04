const { fabric } = require('fabric');

const compositor = {
	imagen: function (articulo, texto, referencia, titulo, nombreBot) {
		var canvas = new fabric.Canvas(
			null, 
			{
				width:600,
				height:1200,
				backgroundColor: '#c6cae3'
			}
		);
		var tituloTxt = new fabric.Textbox(
			titulo,
			{
				top:6,
				left:5,
				width:400,
				fontFamily: 'Arial',
				fontWeight: 'bold',
				fontSize: 16,
				fill: 'white'
			}
		);
		var rect = new fabric.Rect({
			top: 0,
			left: 0,
			fill: 'navy',
			textAlign: 'right',
			width: canvas.width,
			height: tituloTxt.aCoords.bl.y + 4
		});
		var nombreBotTxt = new fabric.Text(
			nombreBot,
			{
				top:5,
				fontFamily: 'Arial',
				fontWeight: 'bold',
				fontSize: 14,
				fill: 'white'
			}
		);
		nombreBotTxt.left = canvas.width - nombreBotTxt.width - 10;
    if (typeof articulo !== "undefined") {
      var articuloTxt = new fabric.Text(
        "Artículo " + articulo,
        {
          top: rect.height + 10,
          left: 10,
          fontFamily: 'Arial',
          fontSize: 16,
          fontWeight: 'bold'
        }
      );
      var articuloBLY = articuloTxt.aCoords.bl.y;
    } else {
      var articuloBLY = rect.height;
    }
		var textoTxt = new fabric.Textbox(
			texto,
			{
				top: articuloBLY + 10,
				left: 10,
				width: canvas.width - 10*3,
				fontFamily: 'Arial',
				fontSize: 14
			}
		);
		var referenciaTxt = new fabric.Textbox(
			"-- " + referencia,
			{
				top:textoTxt.aCoords.bl.y + 20,
				left: 20,
				width: canvas.width - 20*2,
				fontFamily: 'Arial',
				fontSize: 14,
				fontStyle: 'italic'
			}
		);
		
		canvas.add(rect);
		canvas.add(nombreBotTxt);
		canvas.add(tituloTxt);
    if (typeof articuloTxt !== "undefined") { canvas.add(articuloTxt); }
		canvas.add(textoTxt);
		canvas.add(referenciaTxt);
		
		canvas.setHeight(referenciaTxt.aCoords.bl.y + 20);
		return canvas;
	}
};

exports.compositor = compositor;