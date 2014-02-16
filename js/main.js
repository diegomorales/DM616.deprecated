var audiocontext = new AudioContext();
require.config({
	shim: {
        easel: {
            exports: 'createjs'
        }
    },
    
    waitSeconds: 200,
 
	paths: {
	    jquery: 'libs/jquery',
	    underscore: 'libs/underscore',
	    backbone: 'libs/backbone',
	    easel: 'libs/easeljs',
	},
  // mixer settings
	config:	{
  		"views/MixerView": {
	  		channelcount:	6,
	  		channels:	[	
				{ url:	'audio/te_espero/track1.mp3'},
				{ url:	'audio/te_espero/track2.mp3'},
				{ url:	'audio/te_espero/track3.mp3'},
				{ url:	'audio/te_espero/track4.mp3'},
				{ url:	'audio/te_espero/track5.mp3'},
				{ url:	'audio/te_espero/track6.mp3'},
			],
			/*channels:	[	
				{ url:	'audio/hard_to_breath/track1.mp3'},
				{ url:	'audio/hard_to_breath/track2.mp3'},
				{ url:	'audio/hard_to_breath/track3.mp3'},
				{ url:	'audio/hard_to_breath/track4.mp3'},
				{ url:	'audio/hard_to_breath/track5.mp3'},
				{ url:	'audio/hard_to_breath/track6.mp3'},
			],
		/*
		channels:	[	
				{ url:	'audio/just_go/track1.mp3'},
				{ url:	'audio/just_go/track2.mp3'},
				{ url:	'audio/just_go/track3.mp3'},
				{ url:	'audio/just_go/track4.mp3'},
				{ url:	'audio/just_go/track5.mp3'},
				{ url:	'audio/just_go/track6.mp3'},
			]*/
		},
	}
});

require([
  'app',
], 	function(MixerApp){
		MixerApp.initialize();
});