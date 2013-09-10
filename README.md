OpenVideoAnnotation
==================
##Annotation Plugin

Annotations.js is a plugin for Video JS player. The aim of this plugin is to create annotations in video-js.

##Live-Demo

There is a demo of the annotations plugin in the next webpage:

http://danielcebrian.com/annotations/demo.html

##Installation

To use the tool you need to install the [video-js player plugin](https://github.com/videojs/video.js/), [rangeslider plugin for video-js](https://github.com/danielcebrian/rangeslider-videojs) and the [Annotator plugin](https://github.com/okfn/annotator/) to annotate text and video.

In addition add annotations.min.js and annotations.min.css CDN distributed file to your head tag, just after
videojs:

```html
	<head>
		<!-- Annotator -->
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js"></script>
		<script src="http://assets.annotateit.org/annotator/v1.2.5/annotator-full.min.js"></script>
		<link rel="stylesheet" href="http://assets.annotateit.org/annotator/v1.2.5/annotator.min.css">

		<!--video-js-->
		<link href="http://vjs.zencdn.net/4.1/video-js.css" rel="stylesheet">
		<script src="lib/video-js/video.min.js"></script>

		<!--RangeSlider Pluging-->
		<script src="lib/rangeslider.min.js"></script>
		<link href="lib/rangeslider.min.css" rel="stylesheet">

		<!--Annotations Pluging-->
		<script src="build/annotations.min.js"></script>
		<link href="build/annotations.min.css" rel="stylesheet">
	</head>
```

##Usage

Load all the videos in video-js with different id, as you can see in the [tutorial of video-js player](https://github.com/videojs/video.js/blob/master/docs/setup.md) 

```html
<video id="vid1" class="video-js vjs-default-skin" controls preload="none" width="640" height="264"
poster="http://video-js.zencoder.com/oceans-clip.png"
data-setup=''>
	<source src="http://video-js.zencoder.com/oceans-clip.mp4" type='video/mp4' />
	<source src="http://video-js.zencoder.com/oceans-clip.webm" type='video/webm' />
	<source src="http://video-js.zencoder.com/oceans-clip.ogv" type='video/ogg' />
</video>
```
	
To load and control the plugin from Javascript must select the <div> with the content to annotate. In addition add the plugin to the videojs, as follow:

```js
<script>
	var options = {
    		optionsAnnotator: {user: {},store: {}},
			optionsVideoJS: {},
			optionsRS: {},
    		optionsOVA: {posBigNew:'ul'},
    	}
	//Add the div id to annotate by Annotator. In the demo.html the id is "airlock" too.
	var ova = new OpenVideoAnnotation.Annotator($('#airlock'),options);
	
	//(optional) Set the configuration for the users
	ova.setCurrentUser($('#username').val());

	$('#username').change(function () {
		ova.setCurrentUser($(this).val());
	});
	
</script>
```

The initial options for the annotations is the position of the button for new annotations:

posBigNew (options):

* ul (up left) -by default-
* ur (up right)
* bl (below left) 
* br (below right)
* c  (center)
* none  (without button)

NumAnnotations: it is the number of Annotation that will be load in the display. The other annotation will be hide under the scroll. (By default: 16)

#URl API to preload an annotation

This plugin allow to share an annotation with two methodologies:

The first method will send a stored annotation  in the database (ToDo)

The second method will send a new isolated annotation that is not in the database. The code to share a annotation with this method is:

http://url-with-the-video.com/?ovaSrc=(Source)&ovaContainer=(ContainerID)&ovaStart=(Start)&ovaEnd=(End)&ovaText=(Text)&ovaUser=(User)

All the values between brackets must be replaced by the real value.

The obligatory values are:

* ovaSrc = source where is the video. For example, in the demo video with this plugin the source is in: http://video-js.zencoder.com/oceans-clip.mp4
* ovaContainer = the id where we had put the video. In the demo is vid1
* ovaStart = the time to start the video
* ovaEnd = the time to end the video

The optionals values are:

* ovaText = the text that the user will see.
* ovaUser = the user who has sent the annotation

Caution, all these variables must be ready to be in a URL link and take care of special characters like &()#/. To do this, we can parse the string with decodeURIComponent().

An example of URL API is this:

http://danielcebrian.com/annotations/demo.html?ovaContainer=vid1&ovaSrc=http%3A%2F%2Fvideo-js.zencoder.com%2Foceans-clip.mp4&ovaStart=2&ovaEnd=10&ovaText=This%20is%20test&ovaUser=Test%20User


#API Methods to take control of the plugin

Once the plugin is started and the DOM readed, we can control the Open Video Annotator giving the id of the video in the html. It is possible to use the following functions:

### newVideoAn(VideoID) ###

Create a new video annotation. VideoID is the ID in html for the video. In the demo example is 'vid1'.

```js
	ova.newVideoAn('divID');
```

### showDisplay(VideoID) ###

Show the annotation display

```js
	ova.showDisplay('divID');
```

### hideDisplay(VideoID) ###

Hide the annotation display

```js
	ova.hideDisplay('divID');
```

### setposBigNew(VideoID, position) ###

Set the position of the new big annotation button. The values for the inlet position are:

* ul (up left) -by default-
* ur (up right)
* bl (below left) 
* br (below right)
* c  (center)
* none  (without button)

```js
	ova.setposBigNew('divID',position);
```

### playTarget(annotationId) ###

Play an annotation using the annotation Id, like this example:

```js
	ova.playTarget('8I2NBkJbQoeF3-bqgpcwTw');
```
