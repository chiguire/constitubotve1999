@ConstitubotVe99
===================================

Este es el código para el bot de Twitter que tuitea la Constitución de la República Bolivariana de Venezuela, promulgada en 1999.

Cada cierto tiempo, cuando se llama a una dirección secreta, el bot lee una versión de la Constitución organizada en formato JSON, la convierte en datos que utiliza para producir un tuit, y usa esos datos para elaborar la imagen y contactar a Twitter para publicar el tuit. El bot no hará más nada al llegar al final de los tuits.

La transformación de los datos permite que el tuit tenga una referencia a los títulos y capítulos de cada artículo, y permite también una sintaxis sencilla para resaltar una parte de cada artículo en el texto del status de Twitter. Como la mayoría de los artículos supera fácilmente los 280 caracteres, este resaltado permite resumir una parte del texto.

Este código está basado en [twitterbot](https://glitch.com/~twitterbot), por @stefan. Emplea las librerías [Twit](https://github.com/ttezel/twit) para usar el API de Twitter y [Fabric](http://fabricjs.com) para elaborar las imágenes. El código está en español para que se entienda lo mejor posible, pero casi la totalidad de la documentación está en inglés.

**Impulsado por [Glitch](https://glitch.com)** - Glitch permite hacer proyectos donde es muy simple poder inspeccionar el código y "remezclar" (remix) las aplicaciones para que las puedas modificar para tus propósitos. Eres bienvenido de hacerlo con este código, y con los datos que están en constitucion.json.

\ ゜o゜)ノ
