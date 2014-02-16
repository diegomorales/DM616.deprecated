// ChannelModel.js

define([
  'underscore', 
  'backbone',
  'models/EqModel',
  'models/PanModel',
  'models/VolumeModel',
], 	function( _, Backbone, EqModel, PanModel, VolumeModel){
	
	var ChannelModel = Backbone.Model.extend({
		defaults:	{
			toBusA:	false,
			toBusB:	false,
			audio_url: '',
		},
		
		initialize:	function(){

			this.set('fader', new VolumeModel({
					channel_nr : this.get('channel_nr'),
					color: 'red',
				})
			);
			
			this.set('high_peak', new EqModel({
					type:	'peaking',
					freq:	5400.0,
					min_freq:	800.0,
					max_freq:	10000.0,
					q:		0.2,
					gain:	0.0,
					min_gain:	-15.0,
					max_gain:	15.0,
					channel_nr : this.get('channel_nr'),
					name:	'hi',
					title: 'HIGH',
					rangeLeftText: '-15\n800Hz',
					rangeRightText: '+15\n10kHz',
				})
			);
			
			this.set('low_peak', new EqModel({
					type:	'peaking',
					freq:	770.0,
					min_freq:	40.0,
					max_freq:	1500.0,
					q:		0.2,
					gain:	0.0,
					min_gain:	-15.0,
					max_gain:	15.0,
					channel_nr : this.get('channel_nr'),
					name:	'lo',
					title: 'LOW',
					rangeLeftText: '-15\n40Hz',
					rangeRightText: '+15\n1.5kHz',
				})
			);
			
			this.set('panner', new PanModel({
					pan:	0,
					channel_nr: this.get('channel_nr'),
					name:	'pan',
					title:	'PAN',
					radius: 18,
					rangeLeftText: 'L',
					rangeRightText: 'R',
					min: -80,
					max: 80,
					bgColor: '#111',
					valueName: 'pan',
				})
			);
			this.set('effectsend1', new VolumeModel({
					name:	'send1',
					title:	'EFFECT SEND 1',
					channel_nr: this.get('channel_nr'),
					volume: 0,
					min: 0,
					max: 100,
					radius: 18,
					rangeLeftText: '0',
					rangeRightText: '10',
					bgColor: '#444',
					valueName: 'volume',
				})
			);
			
			this.set('effectsend2', new VolumeModel({
					name:	'send2',
					title:	'EFFECT SEND 2',
					channel_nr: this.get('channel_nr'),
					volume: 0,
					min: 0,
					max: 100,
					radius: 18,
					rangeLeftText: '0',
					rangeRightText: '10',
					bgColor: '#444',
					valueName: 'volume',
				})
			);
		},
		
		loadSound:	function(){
			this.set({isLoading: 1});
			this.set('track', new Audio());
			this.get('track').src = this.get('audio_url');
			this.get('track').addEventListener('canplaythrough', _.bind(function(){		
				this.set('input', audiocontext.createMediaElementSource(this.get('track')));
				this.set('isLoading', 0);
				this.make_signalChain();	
				this.set({isLoading: 0});
				this.set({track_duration:this.get('track').duration });
			}, this), false);
		},
		
		changeVolume: function(value){
			this.get('fader').get('node').gain.value = value/100;
		},
		
		play:	function(){
			this.make_signalChain();
			
			this.get('input').mediaElement.play();
		},
		
		stop:	function(){
			if(this.get('input') == null) return;
			
			this.get('input').mediaElement.pause();
		},
		
		rewind:	function(){
			this.get('input').mediaElement.currentTime -= 10;
		},
		
		fullRewind:	function(){
			this.get('input').mediaElement.currentTime = 0;
		},
		
		forward:	function(){
			this.get('input').mediaElement.currentTime += 10;
		},
		
		make_signalChain:	function(){
			this.get('input').connect(this.get('high_peak').get('node'));
			this.get('high_peak').get('node').connect(this.get('low_peak').get('node'));
			this.get('low_peak').get('node').connect(this.get('panner').get('node'));
			this.get('low_peak').get('node').connect(this.get('effectsend1').get('node'));
			this.get('low_peak').get('node').connect(this.get('effectsend2').get('node'));
			this.get('panner').get('node').connect(this.get('fader').get('node'));
		},
	});

	return ChannelModel;

});