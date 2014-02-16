// FaderView.js

define([   
  'underscore', 
  'backbone',
  'easel'
], 	function( _, Backbone){
	
	var FaderView = Backbone.View.extend({
		
		moveFader:	function(value, fader_button){
			fader_button.y = value;
    		this.stage.update(); 
		},
		
		render:	function(){
			var model = this.model,
			fader_header_bg = new createjs.Shape(),
			fader_header_nr,
			fader_header_ol,
			fader_header_light = new createjs.Shape(),
			fader_track = new createjs.Shape(),
			fader_meter = new createjs.Container(),
			fader_meter_lines = new createjs.Shape(),
			fader_button = new createjs.Container(),
			fader_button_back = new createjs.Shape(),
			fader_button_line = new createjs.Shape();
			
			this.stage = new createjs.Stage('fader-'+model.get('channel_nr'));

			fader_header_bg.graphics.beginFill('#1D1E21')
									.drawRect(0, 0, this.stage.canvas.width, 21);
			
			fader_header_nr = new createjs.Text(model.get('channel_nr').toString().toUpperCase(), '12px Arial', '#fff');
			fader_header_nr.x = 9;
			fader_header_nr.y = 5;
			
			fader_header_ol = new createjs.Text('OVER\nLOAD', '6px Arial', '#fff');
			fader_header_ol.x = 28;
			fader_header_ol.y = 5;
			
			fader_header_light.graphics	.beginFill('#5E0000')
										.drawCircle(54, 11, 3);
			
			fader_track.graphics	.beginFill('#000')
									.drawRect(32, 42, 6, 144);
									
			fader_meter.x = 4;
			fader_meter.y = 46;					
			
			for(var i = 0; i <= 10; i++){		
				var fader_meter_nr = new createjs.Text((i - 10) * (-1), '7px Arial', '#000');
				fader_meter_nr.x = 9;
				fader_meter_nr.y = (i * 13);
				fader_meter_nr.textAlign = 'right';
				fader_meter.addChild(fader_meter_nr);
				
				fader_meter_lines.graphics	.beginStroke('#000')
											.setStrokeStyle(1)
											.moveTo(11, (i * 13) + 3.5)
											.lineTo(52, (i * 13) + 3.5)
											.endStroke();
			}
			
			fader_meter.addChild(fader_meter_lines);
			
			fader_button.x = 19;
			fader_button.y = 37;
			fader_button.cursor = 'pointer';
			
			fader_button_back.graphics	.beginLinearGradientFill(['#ddd', '#fff', '#ddd'], [0, 0.5, 1], 0, 0, 0, 42)
										.drawRect(0,0,32,42);
			fader_button_back.shadow = new createjs.Shadow('#000', 0, 0, 10);
			
			fader_button_line.graphics	.beginStroke(model.get('color'))
										.setStrokeStyle(4)
										.moveTo(0, 21)
										.lineTo(32, 21)
										.endStroke();
					
			fader_button.addChild(fader_button_back, fader_button_line);
			
			this.stage.addChild(fader_header_bg);
			
			if(!model.get('isBus')){
				this.stage.addChild(fader_header_ol);
				this.stage.addChild(fader_header_light);
			}else{
				fader_header_nr.x = (this.stage.canvas.width / 2);
				fader_header_nr.textAlign = 'center';
			}
	
			this.stage.addChild(fader_header_nr);		
			this.stage.addChild(fader_track);
			this.stage.addChild(fader_meter);
			this.stage.addChild(fader_button);
			
			fader_button.on('mousedown', function(e){
				this.offset = {x:this.x-e.stageX, y:this.y-e.stageY};
			});
			
			fader_button.on('pressmove', _.bind(function(e){
				e.nativeEvent.preventDefault() && e.nativeEvent.preventDefault;
				var newY = e.stageY+ e.currentTarget.offset.y;
				if(newY < 27) newY = 27;
		        if(newY > 157) newY = 157;
		        this.moveFader(newY, fader_button);
		        model.set('volume', this.val(newY));
			}, this));
			
			this.stage.update();
			
			// init fader
			this.moveFader(this.valRev(model.get('volume')), fader_button);
		},
		
		val: function(v){
			return Math.round(100 - ((v - 27) / 130) * 100);
		},
		
		valRev: function(v){
			return Math.round(27 + (130 - ((v / 100) * 130 ) ));
		},
	});

  	return FaderView;
});