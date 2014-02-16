// MixerView.js

define([
  'jquery',     
  'underscore', 
  'backbone',
  'collections/ChannelCollection',
  'collections/BusCollection',
  'collections/MeterCollection',
  'collections/PresetCollection',
  'models/TransportModel',
  'models/ReverbModel',
  'models/DelayModel',
  'models/MeterModel',
  'models/MasterCompModel',
  'models/CassetteModel',
  'models/ChannelModel',
  'views/TransportView',
  'views/ChannelView',
  'views/BusView',
  'views/MeterView',
  'views/ReverbView',
  'views/DelayView',
  'views/MasterCompView',
  'views/ChannelInsertView',
  'views/CassetteView',
  'module',
  'easel',
], function($, _, Backbone, 
	ChannelCollection, BusCollection, MeterCollection, PresetCollection, TransportModel, ReverbModel, DelayModel, MeterModel, MasterCompModel, CassetteModel, ChannelModel,
	TransportView, ChannelView, BusView,MeterView, ReverbView, DelayView, MasterCompView, ChannelInsertView, CassetteView,
	 module){
	
	var MixerView = Backbone.View.extend({
		tagName:	'div',
		
		initialize: function(){
			this.drawBg();
			this.presets = new PresetCollection();
			this.channels = new ChannelCollection();
			this.busses = new BusCollection();	
			this.meters = new MeterCollection();
			this.transporttime = new TransportModel({transport_time: 0, isPlaying : false});
			this.listenTo(this.channels, 'add', this.addChannel);
			this.listenTo(this.channels, 'change:toBusA', this.routeChanneltoBusA);
			this.listenTo(this.channels, 'change:toBusB', this.routeChanneltoBusB);
			this.listenTo(this.busses, 'add', this.addBus);			
			this.createChannelStrips();
			this.createBusses();
			this.createSendEffects();
			this.createTransport();
			this.createMeter();
			this.createMasterComp();
			this.createChannelInsert();
			this.createCassetteView();
		},
		
		loadMix:	function(presetIndex){
			var preset = this.presets.at(presetIndex);
			this.channel1.set(preset.get('channels')[0]);
			this.channel2.set(preset.get('channels')[1]);
			this.channel3.set(preset.get('channels')[2]);
			this.channel4.set(preset.get('channels')[3]);
			this.channel5.set(preset.get('channels')[4]);
			this.channel6.set(preset.get('channels')[5]);
			
			this.channels.each(function(channel){
				channel.loadSound();
			});
		},
		
		createCassetteView:	function(){
			this.cassette = new CassetteModel({
				mixer: this,
			});
			var view = new CassetteView({
				model: this.cassette, 
				collection: this.presets,
				
				});
			$('#cassette-section').append(view.render().el);
		},
		
		createChannelInsert:	function(){
			var view = new ChannelInsertView();
			$('#output-section').append(view.render().el);
		},
		
		createMasterComp:	function(){
			this.mastercomp = new MasterCompModel({
				bypass: true,
				
				threshold: -20,
				min_threshold: -100,
				max_threshold: 0,
				
				ratio:3,
				min_ratio: 1,
				max_ratio: 12,
				
				attack: 10,
				min_attack: 1,
				max_attack: 100,
				
				release: 400,
				min_release: 20,
				max_release: 1000
			});
			
			var view = new MasterCompView({model: this.mastercomp});
			view.draw();
		},
		
		createSendEffects:	function(){
			this.fx1 = new ReverbModel({
				volume_out: 20,
				min_volume: 0,
				max_volume: 100,
				reverb_type: 2,
				sub_type: 'm',
			});
			
			var view = new ReverbView({model: this.fx1});
			view.draw();
			
			this.fx2 = new DelayModel({
				volume_out: 20,
				min_volume: 0,
				max_volume: 100,
				
				time: 200,
				min_time: 80,
				max_time: 2000,
				
				feedback: 40,
				min_feedback: 0,
				max_feedback: 100,
				
				hi_cut: 20000,
				min_hi_cut: 1000,
				max_hi_cut: 20000,
				
				lo_cut: 0,
				min_lo_cut: 0,
				max_lo_cut: 1000,
			});
			var view2 = new DelayView({model: this.fx2});
			view2.draw();
		},
		
		createMeter:	function(){
			var meterview = new MeterView({
				collection:	this.meters,
				model: this.transporttime,
			});
			meterview.draw();
		},
		
		drawBg:	function(){
			var stage = new createjs.Stage('mixer-bg');
			
			var group = new createjs.Container();
			
			var bg = new createjs.Shape();
			bg.graphics	.beginFill('#000')
						.moveTo(46, 0)
						.lineTo(998, 0)
						.lineTo(1038, 2)
						.quadraticCurveTo(1044, 3, 1044,8)
						.lineTo(1044, 874)
						.quadraticCurveTo(1044, 879, 1038, 880)
						.lineTo(998, 882)
						.lineTo(46, 882)
						.lineTo(6,880)
						.quadraticCurveTo(0, 879, 0, 874)
				    	.lineTo(0,8)
				    	.quadraticCurveTo(0, 3, 6, 2)
						.endFill();
						
			var left_border_g = new createjs.Graphics();
			left_border_g.beginFill('#999999')
								.moveTo(46, 0)
				    			.lineTo(46, 882)
				    			.lineTo(6,880)
				    			.quadraticCurveTo(0, 879, 0, 874)
				    			.lineTo(0,8)
				    			.quadraticCurveTo(0, 3, 6, 2)
				    			.endFill();	
			var left_border = new createjs.Shape(left_border_g);
				    			
			var left_border_clip = new createjs.Shape(left_border_g);
				    			
			var left_border_inner = new createjs.Shape();
			left_border_inner.graphics.beginStroke('#050505')								
								.moveTo(46, 0)
				    			.lineTo(46, 882)
				    			.lineTo(6,880)
				    			.quadraticCurveTo(0, 879, 0, 874)
				    			.lineTo(0,8)
				    			.quadraticCurveTo(0, 3, 6, 2)
				    			.endStroke();
			left_border_inner.shadow = new createjs.Shadow('#000', 0, 0, 8);		
			left_border.mask = left_border_clip;
				    		
			var right_border_g = new createjs.Graphics();
			right_border_g.beginFill('#999999')
									.moveTo(998, 0)
				    				.lineTo(998, 882)
				    				.lineTo(1038,880)
				    				.quadraticCurveTo(1044, 879, 1044, 874)
				    				.lineTo(1044,8)
				    				.quadraticCurveTo(1044, 3, 1038, 2)
				    				.endFill();
				
			var right_border = new createjs.Shape(right_border_g);
			var right_border_clip = new createjs.Shape(right_border_g);
			right_border.mask = right_border_clip;
			
			var right_border_inner = new createjs.Shape();
			right_border_inner.graphics.beginStroke('#050505')
									.moveTo(998, 0)
				    				.lineTo(998, 882)
				    				.lineTo(1038,880)
				    				.quadraticCurveTo(1044, 879, 1044, 874)
				    				.lineTo(1044,8)
				    				.quadraticCurveTo(1044, 3, 1038, 2)
				    				.endStroke();
			right_border_inner.shadow = new createjs.Shadow('#000',0,0, 8);
				    				
			var armrest = new createjs.Shape();
			armrest.graphics.beginFill('#661C00')
							.drawRect(46, 809, 952, 73);
			
			group.addChild(bg, left_border, left_border_inner, right_border, right_border_inner, armrest);
			group.x = 20;
			group.y = 20;
			bg.shadow = new createjs.Shadow('#000', 0, 0, 20);
			
			stage.addChild(group);
			stage.update();
		},
		
		addChannel:	function(channel){
			var view = new ChannelView({
				model: channel,
				id: 'channel-'+channel.get('channel_nr'),
			});
			$('#channel-section').append(view.render().el);
			view.draw();
		},
		
		createChannelStrips:	function(){
			//var c = module.config().channelcount;
			for(i = 1; i < (7); i++){
				/*this.channels.add({
					channel_nr: i,
					audio_url: '',
					toBusA: false,
					toBusB: false,
				});
				*/
				this.meters.add({
					channel_nr: i,
				});
			}
			this.channel1 = new ChannelModel({channel_nr: 1});
			this.channel2 = new ChannelModel({channel_nr: 2});
			this.channel3 = new ChannelModel({channel_nr: 3});
			this.channel4 = new ChannelModel({channel_nr: 4});
			this.channel5 = new ChannelModel({channel_nr: 5});
			this.channel6 = new ChannelModel({channel_nr: 6});
			
			this.channels.add([this.channel1, this.channel2, this.channel3, this.channel4, this.channel5, this.channel6]);
			
			this.meters.add({
				channel_nr: 'transport',
				buffer_size: 8192
			});
			this.meters.add({channel_nr: 'send1'});
			this.meters.add({channel_nr: 'send2'});
		},
		
		routeChanneltoBusA:	function(channel){
			var channel_out = channel.get('fader').get('node');	
			channel_out.disconnect();
			if(channel.get('toBusA')){
				//connect to Bus
				channel_out.connect(this.busses.findWhere({ channel_nr: 'bus-a'}).get('node'));
			}else{
				//connect to Master
				channel_out.connect(this.busses.findWhere({ channel_nr: 'master'}).get('node'));
				
				//re-connect meter
				channel_out.connect(this.meters.findWhere({ channel_nr: channel.get('channel_nr')}).get('meter'));
			}
		},
		
		routeChanneltoBusB:	function(channel){
			var channel_out = channel.get('fader').get('node');	
			channel_out.disconnect();
			if(channel.get('toBusB')){
				//connect to Bus
				channel_out.connect(this.busses.findWhere({ channel_nr: 'bus-b'}).get('node'));
			}else{
				//connect to Master
				channel_out.connect(this.busses.findWhere({ channel_nr: 'master'}).get('node'));
				
				//re-connect meter
				channel_out.connect(this.meters.findWhere({ channel_nr: channel.get('channel_nr')}).get('meter'));
			}
		},
		
		createTransport:	function(){
			var view = new TransportView({
				collection: this.channels,
				model: this.transporttime,
			});
			view.render();
		},
		
		createBusses:	function(){
			this.busses.add({
				channel_nr:	'bus-a',
				volume:	80,
				color: 'blue',
				isBus:	true
			});
			
			this.busses.add({
				channel_nr:	'bus-b',
				volume:	80,
				color: 'blue',
				isBus:	true
			});
			
			this.busses.add({
				channel_nr:	'master',
				volume:	80,
				color: 'black',
				isBus:	true
			});
			
			this.meters.add({channel_nr: 'bus-a'});
			this.meters.add({channel_nr: 'bus-b'});
			this.meters.add({channel_nr: 'master'});
		},
		
		addBus:	function(bus){
			var view = new BusView({
				model: bus,
			});
			$('#bus-section').append(view.render().el);
			view.draw();
		},
		
		render:	function(){
		},
		
		hideLoader:	function(){
			
		}
	});

	return MixerView;

});