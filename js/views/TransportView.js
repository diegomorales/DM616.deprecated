// TransportView.js

define([
  'jquery',     
  'underscore', 
  'backbone',
  'mixins/TextMixin',
  'easel'
], 	function($, _, Backbone, TextMixin){
	
	var TransportView = Backbone.View.extend({
		
		initialize:	function(){
			this.collection.on('change:track_duration', this.setSongLength, this);
			
			this.playButton = this.createButtonBase(88, 140, 'PLAY');
			this.playButton.on('click', this.play, this);
			
			this.stopButton = this.createButtonBase(20, 140, 'STOP');	
			this.stopButton.on('click', this.stop, this);
		},
		
		setSongLength:	function(){
			var l = this.collection.max(function(c){
				return c.get('track_duration');
			});
			this.model.set({
				song_length: l.get('track_duration'),
				transport_time: 0,
				});
		},
		
		play:	function(){
			this.collection.each(function(channel){
				channel.play();
			});
			this.model.set({isPlaying: true});
		},
		
		stop:	function(){
			this.collection.each(function(channel){
				channel.stop();
			});
			this.model.set({isPlaying: false});
		},
		
		rewind:	function(){
			this.collection.each(function(channel){
				channel.rewind();
			});
			var t = this.model.get('transport_time');
			this.model.set({transport_time: Math.max(t - 10, 0)});
		},
		
		forward:	function(){
			this.collection.each(function(channel){
				channel.forward();
			});
			var t = this.model.get('transport_time');
			this.model.set({transport_time: t + 10});
		},
		
		fullRewind:	function(){
			this.collection.each(function(channel){
				channel.fullRewind();
			});
		},
		
		createButtonBase: function(x, y, title){
			var buttonWidth = 65,
				buttonHeight = 36,
				button,
				buttonBg,
				buttonText;
				
			button = new createjs.Container();
			button.x = x;
			button.y = y;
			
			buttonBg = new createjs.Shape();
			buttonBg.graphics.beginFill('#FDFDFD')
							.drawRect(0, 0, 65, 36);
				
			buttonBg.shadow = new createjs.Shadow('#000', 0, 2, 1);
			
			buttonText = this.createText(title, '8px Arial', '#000', buttonWidth / 2, 24, 'center');
			
			button.addChild(buttonBg, buttonText);
			
			return button;
			
		},
		
		render:	function(){
			
			this.stage = new createjs.Stage('transport-section');
			
			//play button
			var playIcon;
			
			playIcon = new createjs.Shape();
			playIcon.x = 32;
			playIcon.y = 12;
			playIcon.regX = 5;
			playIcon.regY = 4;
			playIcon.graphics.beginFill('#000')
								.moveTo(0,0)
								.lineTo(0,8)
								.lineTo(10,4)
								.endFill();
			
			this.playButton.addChild(playIcon);
			
			//stop button
			var stopIcon;
			
			stopIcon = new createjs.Shape();
			stopIcon.x = 32;
			stopIcon.y = 12;
			stopIcon.regX = 4;
			stopIcon.regY = 4;
			stopIcon.graphics.beginFill('#000')
							.drawRect(0,0,8,8);
							
			this.stopButton.addChild(stopIcon);
			
			//rewind
			var rewind,
				rewindIcon;
				
			rewind = this.createButtonBase(20, 90, 'REWIND');
			
			rewindIcon = new createjs.Shape();
			rewindIcon.x = 32;
			rewindIcon.y = 12;
			rewindIcon.regX = 9;
			rewindIcon.regY = 4;
			rewindIcon.graphics.beginFill('#000')
								.moveTo(0,4).lineTo(10,8).lineTo(10,0).endFill()
								.beginFill('#000')
								.moveTo(8,4).lineTo(18,8).lineTo(18,0).endFill();
								
			rewind.addChild(rewindIcon);
			
			//forward
			var forward,
				forwardIcon;
				
			forward = this.createButtonBase(88, 90, 'F. FWD');
			
			forwardIcon = new createjs.Shape();
			forwardIcon.x = 32;
			forwardIcon.y = 12;
			forwardIcon.regX = 9;
			forwardIcon.regY = 4;
			forwardIcon.graphics.beginFill('#000')
								.moveTo(0,0).lineTo(0,8).lineTo(10,4).endFill()
								.beginFill('#000')
								.moveTo(8,0).lineTo(8,8).lineTo(18,4).endFill();
					
			forward.addChild(forwardIcon);
			
			this.stage.addChild(forward);
			this.stage.addChild(rewind);
			this.stage.addChild(this.stopButton);
			this.stage.addChild(this.playButton);
			this.stage.update();
		},
	});

	_.extend(TransportView.prototype, TextMixin);

  	return TransportView;
});