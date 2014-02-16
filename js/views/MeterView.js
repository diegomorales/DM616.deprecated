// MeterView.js

define([
  'jquery',     
  'underscore', 
  'backbone',
  'easel'
], 	function($, _, Backbone){
	
	var MeterView = Backbone.View.extend({
		
		initialize:	function(){
			this.model.on('change:isPlaying', this.setPositionCounter, this);
			this.model.on('change:song_length', this.setSongLength, this);
			//this.model.on('change:doForward', this.updateCounter, this);
			//this.model.on('change:doRewind', this.updateCounter, this);
		},
		
		setSongLength:	function(){
			this.songlength_counter.text = this.displayTime(this.model.get('song_length'));
			this.position_counter.text = this.displayTime(this.model.get('transport_time'));
			this.stage.update();
		},
		
		setPositionCounter:	function(){
			var now = audiocontext.currentTime;
			if(this.model.get('isPlaying')){
				this.collection.findWhere({channel_nr: 'transport'}).get('meter').onaudioprocess = _.bind(function(e){
					var diff_time = (audiocontext.currentTime - now);
					this.model.set({diff_time: diff_time});
					this.position_counter.text = this.displayTime(this.model.get('transport_time') + diff_time);
					this.stage.update();
				}, this);
			}else{
				var time = this.model.get('transport_time') + this.model.get('diff_time');
				this.model.set({transport_time: time });
				this.collection.findWhere({channel_nr: 'transport'}).get('meter').onaudioprocess = null;
			}
		},
		
		/*updateCounter:	function(){
			var time = this.model.get('transport_time');
			this.position_counter.text = this.display_tim
			this.stage.update();
		}*/
		
		displayTime:	function(s){
			var minutes = Math.floor(s / 60);
			var seconds = Math.floor(s) - (minutes * 60);
			var minutes_str = ("0" + minutes).slice (-2);
			var seconds_str = ("0" + seconds).slice (-2);
			var milliseconds = (s - Math.floor(s)).toFixed(2).split('.')[1];
			
			return [minutes_str, seconds_str, milliseconds].join(':');
		},
		
		db_L:	function(e){
			var out = e.outputBuffer.getChannelData(0);
			var int = e.inputBuffer.getChannelData(0);
			var max = 0;
			
			for(var i = 0; i < int.length; i++){
				out[i] = 0;//prevent feedback and we only need the input data
				max = int[i] > max ? int[i] : max;
			}
			return db = 20*Math.log(Math.max(max,Math.pow(10,-72/20)))/Math.LN10;
		},
		
		db_R:	function(e){
			var out = e.outputBuffer.getChannelData(1);
			var int = e.inputBuffer.getChannelData(1);
			var max = 0;
			
			for(var i = 0; i < int.length; i++){
				out[i] = 0;//prevent feedback and we only need the input data
				max = int[i] > max ? int[i] : max;
			}
			return db = 20*Math.log(Math.max(max,Math.pow(10,-72/20)))/Math.LN10;
		},
		
		drawMeter:	function(x, y, w, h, meter, isStereo){
			var m_L = new createjs.Shape();
			var m_R = new createjs.Shape();
			this.stage.addChild(m_L);
			m_L.cache(x, y, w, h);
			
			if(isStereo){
				this.stage.addChild(m_R);
				m_R.cache(x + 46, y, w, h);
			}
			meter.onaudioprocess = _.bind(function(e){
				var db_L = this.db_L(e);
				m_L.graphics	.beginLinearGradientFill(["#FF0000", "#FFFF00", "#00FF00"], [0.1, 0.2, 0.4], 0, 24, 0, 96)
							.drawRect(x, y - ((db_L / 72) * h), w, h + ((db_L / 72) * h));
							
				if(isStereo){
					var db_R = this.db_R(e);
					m_R.graphics	.beginLinearGradientFill(["#FF0000", "#FFFF00", "#00FF00"], [0.1, 0.2, 0.4], 0, 24, 0, 96)
							.drawRect(x + 46, y - ((db_R / 72) * h), w, h + ((db_R / 72) * h));
					
					m_R.updateCache();
					m_R.graphics.clear();
				}
				
				m_L.updateCache();
				m_L.graphics.clear();
				this.stage.update();
			}, this);
			return [m_L, m_R];
		},
		
		draw:	function(){
			this.stage = new createjs.Stage('meter-section');
			
			var bg = new createjs.Shape();
			bg.graphics	.beginFill('#000')
						.drawRect(0,0,this.stage.canvas.width, this.stage.canvas.height);
			
			this.stage.addChild(bg);
			
			//tracks
			var meter_1 = this.drawMeter(38, 20, 12, 105, this.collection.findWhere({channel_nr: 1}).get('meter'), false);
			var meter_2 = this.drawMeter(85, 20, 12, 105, this.collection.findWhere({channel_nr: 2}).get('meter'), false);
			var meter_3 = this.drawMeter(131, 20, 12, 105, this.collection.findWhere({channel_nr: 3}).get('meter'), false);
			var meter_4 = this.drawMeter(178, 20, 12, 105, this.collection.findWhere({channel_nr: 4}).get('meter'), false);
			var meter_5 = this.drawMeter(224, 20, 12, 105, this.collection.findWhere({channel_nr: 5}).get('meter'), false);
			var meter_6 = this.drawMeter(271, 20, 12, 105, this.collection.findWhere({channel_nr: 6}).get('meter'), false);
			this.track_meters = [meter_1, meter_2, meter_3, meter_4, meter_5, meter_6];
			
			//busses		
			var meter_master = this.drawMeter(38, 20, 12, 105, this.collection.findWhere({channel_nr: 'master'}).get('meter'), true);
			var meter_busA = this.drawMeter(131, 20, 12, 105, this.collection.findWhere({channel_nr: 'bus-a'}).get('meter'), false);
			var meter_busB = this.drawMeter(178, 20, 12, 105, this.collection.findWhere({channel_nr: 'bus-b'}).get('meter'), false);
			var meter_send1 = this.drawMeter(224, 20, 12, 105, this.collection.findWhere({channel_nr: 'send1'}).get('meter'), false);
			var meter_send2 = this.drawMeter(271, 20, 12, 105, this.collection.findWhere({channel_nr: 'send2'}).get('meter'), false);
			this.bus_meters = [meter_master, meter_busA, meter_busB, meter_send1, meter_send2];
				
			var meter_foreground = new createjs.Shape();
			var d = 9, offset = 10;
			for(var i = 0; i < 12; i++){
				offset = offset + d;
				meter_foreground.graphics	.beginStroke('#222')
										.setStrokeStyle(2)
										.moveTo(21, offset)
										.lineTo(301, offset)
										.endStroke();
			}
			meter_foreground.alpha = 1;

			var numbers_bg = new createjs.Shape();
			numbers_bg.graphics.beginFill('#48332E')
								.drawRect(21,209, 280, 47);
			this.stage.addChild(numbers_bg);
								
			var position_bg = new createjs.Shape();
			position_bg.graphics.beginFill('#000')
								.drawRect(60, 228, 96, 25);
			position_bg.skewX = 5;
								
			this.stage.addChild(position_bg);
			position_text = new createjs.Text('POSITION', '9px Arial', '#fff');
			position_text.x = 64;
			position_text.y = 214;
			
			this.position_counter = new createjs.Text('00:00:00', '16px digital_dream_fat_skew_narrRg', '#FF0000');
			this.position_counter.x = 48;
			this.position_counter.y = 233;
			this.position_counter.shadow = new createjs.Shadow('#FF6600', 0, 0, 20);
			this.stage.addChild(this.position_counter);
			
			var songlength_bg = new createjs.Shape();
			songlength_bg.graphics.beginFill('#000')
								.drawRect(199, 228, 96, 25);
			songlength_bg.skewX = 5;
			this.stage.addChild(songlength_bg);
								
			songlength_text = new createjs.Text('SONG LENGTH', '9px Arial', '#fff');
			songlength_text.x = 195;
			songlength_text.y = 214;
			this.stage.addChild(songlength_text);
			
			this.songlength_counter = new createjs.Text('00:00:00', '16px digital_dream_fat_skew_narrRg', '#FF0000');
			this.songlength_counter.x = 188;
			this.songlength_counter.y = 233;
			this.songlength_counter.shadow = new createjs.Shadow('#FF6600', 0, 0, 20);
			this.stage.addChild(this.songlength_counter);
			
			var meter_button_text = new createjs.Text('METER', '9px Arial', '#fff');
			meter_button_text.x = 90;
			meter_button_text.y = 180;
			
			var meter_button = new createjs.Shape();
			var meter_button_tracks = new createjs.Graphics();
			meter_button_tracks.beginFill('#666')
								.drawRect(127, 177, 16, 16);
			
			var meter_button_busses = new createjs.Graphics();
			meter_button_busses.beginFill('#ddd')
								.drawRect(127, 177, 16, 16);
								
			meter_button.graphics = meter_button_tracks;
			
			var meter_bus = new createjs.Text('MASTER / BUS / EFFECT SEND', '9px Arial', '#fff');
			meter_bus.x = 150;
			meter_bus.y = 170;
			
			var meter_track = new createjs.Text('TRACK', '9px Arial', '#fff');
			meter_track.x = 150;
			meter_track.y = 188;
			
			var meter_lines = new createjs.Shape();
			meter_lines.graphics.beginStroke('#ffffff')
								.setStrokeStyle(1)
								.moveTo(290, 174)
								.lineTo(310, 174)
								.lineTo(310, 153)
								.lineTo(305, 153)
								.endStroke()
								.beginStroke('#ffffff')
								.moveTo(290, 193)
								.lineTo(316, 193)
								.lineTo(316, 137)
								.lineTo(305, 137)
								.endStroke();
			
			var active_light = new createjs.Shape();
			active_light.graphics.beginFill('#ff0000')
								.drawCircle(11, 137, 4);
			active_light.shadow = new createjs.Shadow('#ff0000', 0,0, 9);
			
			var tracks_bg = new createjs.Shape();
			tracks_bg.graphics.beginFill('#48332E')
								.drawRect(21, 130, 280, 12);
			
			var tracks_1 = new createjs.Text('1', '9px Arial', '#FFF');
			tracks_1.x = 44;
			tracks_1.y = 131;
			tracks_1.textAlign = 'center';
			
			var tracks_2 = new createjs.Text('2', '9px Arial', '#FFF');
			tracks_2.x = 91;
			tracks_2.y = 131;
			tracks_2.textAlign = 'center';
			
			var tracks_3 = new createjs.Text('3', '9px Arial', '#FFF');
			tracks_3.x = 137;
			tracks_3.y = 131;
			tracks_3.textAlign = 'center';
			
			var tracks_4 = new createjs.Text('4', '9px Arial', '#FFF');
			tracks_4.x = 184;
			tracks_4.y = 131;
			tracks_4.textAlign = 'center';
			
			var tracks_5 = new createjs.Text('5', '9px Arial', '#FFF');
			tracks_5.x = 230;
			tracks_5.y = 131;
			tracks_5.textAlign = 'center';
			
			var tracks_6 = new createjs.Text('6', '9px Arial', '#FFF');
			tracks_6.x = 277;
			tracks_6.y = 131;
			tracks_6.textAlign = 'center';
			
			var bus_bg = new createjs.Shape();
			bus_bg.graphics	.beginFill('48332E')
							.drawRect(21, 147, 92, 12)
							.endFill()
							.beginFill('48332E')
							.drawRect(115, 147, 92, 12)
							.endFill()
							.beginFill('48332E')
							.drawRect(209, 147, 92, 12)
							.endFill();
			
			var bus_L = new createjs.Text('L', '9px Arial', '#fff');
			bus_L.x = 44;
			bus_L.y = 148;
			bus_L.textAlign = 'center';
			
			var bus_R = new createjs.Text('R', '9px Arial', '#fff');
			bus_R.x = 91;
			bus_R.y = 148;
			bus_R.textAlign = 'center';
			
			var bus_A = new createjs.Text('A', '9px Arial', '#FFF');
			bus_A.x = 137;
			bus_A.y = 148;
			bus_A.textAlign = 'center';
			
			var bus_B = new createjs.Text('B', '9px Arial', '#FFF');
			bus_B.x = 184;
			bus_B.y = 148;
			bus_B.textAlign = 'center';
			
			var bus_1 = new createjs.Text('1', '9px Arial', '#FFF');
			bus_1.x = 230;
			bus_1.y = 148;
			bus_1.textAlign = 'center';
			
			var bus_2 = new createjs.Text('2', '9px Arial', '#FFF');
			bus_2.x = 277;
			bus_2.y = 148;
			bus_2.textAlign = 'center';
			
			var bus_master = new createjs.Text('MASTER', '7px Arial', '#FFF');
			bus_master.x = 68;
			bus_master.y = 149;
			bus_master.textAlign = 'center';
			
			var bus_bus = new createjs.Text('BUS', '7px Arial', '#FFF');
			bus_bus.x = 161;
			bus_bus.y = 149;
			bus_bus.textAlign = 'center';
			
			var bus_send = new createjs.Text('SEND', '7px Arial', '#FFF');
			bus_send.x = 253;
			bus_send.y = 149;
			bus_send.textAlign = 'center';
			
			var bus_track = new createjs.Container();
			bus_track.addChild(tracks_bg, tracks_1, tracks_2, tracks_3, tracks_4, tracks_5, tracks_6,
								bus_bg, bus_L, bus_R, bus_A, bus_B, bus_1, bus_2, bus_master, bus_bus, bus_send);
										
			this.stage.addChild(meter_foreground);
			this.stage.addChild(position_text);
			this.stage.addChild(meter_button_text);
			this.stage.addChild(meter_button);
			this.stage.addChild(meter_bus);
			this.stage.addChild(meter_track);
			this.stage.addChild(bus_track);
			this.stage.addChild(meter_lines);
			this.stage.addChild(active_light);
			this.stage.update();
			
			//set tracks meters visible, busses not visible
			this.visible_meter = 'track';
			this.toggleMeter();
			meter_button.on('click', _.bind(function(){
				if(this.visible_meter == 'track'){
					this.visible_meter = 'bus';
					active_light.graphics.clear();
					active_light.graphics.beginFill('#ff0000')
								.drawCircle(11, 152, 4);
					meter_button.graphics = meter_button_busses;
				}else{
					this.visible_meter = 'track';
					active_light.graphics.clear();
					active_light.graphics.beginFill('#ff0000')
								.drawCircle(11, 137, 4);
					meter_button.graphics = meter_button_tracks;
				} 
				this.toggleMeter();
			}, this));
		},
		
		toggleMeter:	function(){
			switch(this.visible_meter){
				case 'track':
				_.each(this.bus_meters, function(m, index, list){
					list[index][0].visible = false;
					list[index][1].visible = false;
					this.stage.update();
				}, this);
				
				_.each(this.track_meters, function(m, index, list){
					list[index][0].visible = true;
					list[index][1].visible = true;
					this.stage.update();
				}, this);
				break;
				
				case 'bus':
				_.each(this.bus_meters, function(m, index, list){
					list[index][0].visible = true;
					list[index][1].visible = true;
					this.stage.update();
				}, this);
				
				_.each(this.track_meters, function(m, index, list){
					list[index][0].visible = false;
					list[index][1].visible = false;
					this.stage.update();
				}, this);
				break;
			}
		},
	});

  	return MeterView;
});