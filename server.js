/* Setting things up. */
const path = require('path'),
    express = require('express'),
    app = express(),
    Twit = require('twit'),
    config = {
    /* Be sure to update the .env file with your API keys. See how to get them: https://botwiki.org/tutorials/how-to-create-a-twitter-app */      
      twitter: {
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET
      }
    },
    {fabric} = require('fabric'),
    {documento} = require('./documento'),
    {compositor} = require('./compositor'),
    {marcalibro} = require('./marcalibro'),
    atob = require('atob'),
    T = new Twit(config.twitter);

const constitucionPath = './constitucion.json';
const marcalibroPath = './marcalibro.txt';
const tiempoEntreTuits = 30;

app.use(express.static('public'));

/* You can use uptimerobot.com or a similar site to hit your /BOT_ENDPOINT to wake up your app and make your Twitter bot tweet. */

app.all("/" + process.env.BOT_ENDPOINT, function (req, res) {
  var constitutuits = documento.transformar(documento.leer(constitucionPath), []);
  //res.send(JSON.stringify(constitutuits));
  var ml = marcalibro.leer(marcalibroPath);
  
  var ahora = Date.now();
  var tiempoEntreTuitsMilisegundos = tiempoEntreTuits * 60 * 1000;
  if (ml.fecha_ultimo_tuit + tiempoEntreTuitsMilisegundos > ahora.valueOf()) {
    console.log("Esperemos media hora (fecha_ultimo_tuit: "+ JSON.stringify(new Date(ml.fecha_ultimo_tuit).toJSON()) + ", ahora: " + JSON.stringify(new Date(ahora).toJSON()) + " ml: "+JSON.stringify(ml));
    res.sendStatus(429);
    return;
  }
  if (constitutuits.length <= ml.tuit) {
    console.log("Bot parado en el tuit " + ml.tuit);
    res.sendStatus(204); // 204 No Content
    return;
  }
  
  
  var titulo = "Constitución de la República Bolivariana de Venezuela #ConstitucionVenezuela1999";
  var nombreBot = "@ConstituBotVe99";

  var parte = constitutuits[ml.tuit];
  var articulo = parte.imagenEntrada.articulo;
  var texto = parte.imagenEntrada.texto;
  var referencia = parte.imagenEntrada.referencia;
  
  var canvas = compositor.imagen(
    articulo,
    texto,
    referencia,
    titulo,
    nombreBot
  );
  var pngImageB64 = canvas.toDataURL({ format: 'png' }).split(',')[1];
  var pngImage = atob(pngImageB64);

  var media_id = 0;
	console.log('Comenzando subida');
  T.post('media/upload',
    {
      command: 'INIT',
      total_bytes: pngImage.length,
      media_type: 'image/png'
    },
    function (err, data, response) {
      if (err) {
				console.log(err);
				res.sendStatus(502);
				return;
			}
			media_id = data.media_id_string;
      console.log('Enviando ' + pngImage.length + ' bytes a media_id ' + media_id);
			T.post('media/upload',
				{
					command: 'APPEND',
					media_id: media_id,
					media_data: pngImageB64,
					segment_index: 0
				},
				function (err, data, response) {
					if (err) {
						console.log(err);
						res.sendStatus(502);
						return;
					}
					console.log('Finalizando envío');
					T.post('media/upload',
						{
							command: 'FINALIZE',
							media_id: media_id
						},
						function (err, data, response) {
							if (err) {
								console.log(err);
								res.sendStatus(502);
								return;
							}
							console.log('Enviando tuit');
							T.post('statuses/update', 
							Object.assign({
								  status: parte.status,
								  media_ids: [media_id],
                  lat: 10.505314,
                  long: -66.915711,
                  display_coordinates: true,
							  }, 
                (ml.respuesta === null?
                  {}:
                  {
                    in_reply_to_status_id: ml.respuesta,
                  }
                )
              ),
							function(err, data, response) {
								if (err){
									console.log('error!', err);
									res.sendStatus(502);
								}
								else{
									console.log('Enviado tuit ' + JSON.stringify(parte) + ' correctamente');
                  
                  ml.tuit += 1;
                  ml.respuesta = data.id_str;
                  marcalibro.escribir(marcalibroPath, ml);
  
									res.sendStatus(200);
								}
							}
						);
						}
					);
				}
			);
    }
  );
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your bot is running on port ' + listener.address().port);
});
 