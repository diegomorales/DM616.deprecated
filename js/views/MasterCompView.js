// MasterCompView.js

define([
  'jquery',
  'underscore', 
  'backbone',
  'mixins/KnobMixin',
  'mixins/TextMixin',
  'mixins/ColorMixin',
  'easel'
], 	function($, _, Backbone, KnobMixin, TextMixin, ColorMixin){
	
	var MasterCompView = Backbone.View.extend({
		
		draw:	function(){
			this.stage = new createjs.Stage('fx-mastercomp');

			var onButton = new createjs.Graphics();
			onButton.beginFill('#555')
					.beginStroke('#fff')
					.setStrokeStyle(3)
					.drawRect(6,30,10,10);
					
			var offButton = new createjs.Graphics();
			offButton.beginFill('#555')
					.beginStroke('#fff')
					.setStrokeStyle(1)
					.drawRect(6,30,10,10);
			
			var setBypassButton = _.bind(function(status){
				if(status) bypass.graphics = onButton;
				else bypass.graphics = offButton;	
							
				this.stage.update();
			}, this);
			
			var titleBg = new createjs.Shape();
			titleBg.graphics	.beginFill('#000')
								.drawRect(4,0, this.stage.canvas.width -8, 20);
								
			var titleText = this.createText('MASTER COMPRESSOR', '12px Arial', '#fff', this.stage.canvas.width / 2, 3, 'center');
						
			var bypass = new createjs.Shape();
			
			var bypassText = this.createText('BYPASS', '9px Arial', '#000', 20, 30);
			
			var gain_reduction_text = new createjs.Text('0 dB', '9px digital_dream_narrowregular', '#fff');
			gain_reduction_text.x = 170;
			gain_reduction_text.y = 142;
			gain_reduction_text.textAlign = 'center';
			
			gain_reduction_title = new createjs.Text('GAIN\nREDUCTION', '9px Arial', '#000');
			gain_reduction_title.x = 170;
			gain_reduction_title.y = 48;
			gain_reduction_title.textAlign = 'center';
			
			var gain_reduction_bg = new createjs.Shape();
			gain_reduction_bg.graphics	.beginFill('#000')
										.beginStroke('#777')
										.setStrokeStyle(2)
										.drawRect(140, 70, 60, 90);
										
			var gain_reduction_meter = new createjs.Shape();
			gain_reduction_meter.cache(144, 74, 56, 86);
			
			this.stage.addChild(gain_reduction_bg);
			this.stage.addChild(gain_reduction_title);
			this.stage.addChild(gain_reduction_meter);
			this.stage.addChild(gain_reduction_text);
			this.stage.addChild(bypass);
			this.stage.addChild(bypassText);
			this.stage.addChild(titleBg);
			this.stage.addChild(titleText);
			
			var bypassbutton = function(){
				if(this.model.get('bypass')){
					this.model.set({bypass: false});
					this.model.get('proc').onaudioprocess = _.bind(function(){
						var db = this.model.get('fx').reduction.value;
						gain_reduction_text.text = (db).toFixed(2) + ' dB';
						
						gain_reduction_meter.graphics.beginFill('#FF0000')
														.drawRect(144, 74, 52, -db * 2.4);
						
						gain_reduction_meter.updateCache();
						gain_reduction_meter.graphics.clear();
						this.stage.update();
					}, this);
				}else{
					this.model.set({bypass: true});
					this.model.get('proc').onaudioprocess = null;
				} 
				setBypassButton(this.model.get('bypass'));
			};
			bypass.on('click', _.bind(bypassbutton, this));
			
			this.stage.update();
			
			// init knob positions and bypass
			attack = this.smallKnob('ATTACK', 34, 80, '1ms', '100ms', 'attack', this.model.get('min_attack'), this.model.get('max_attack'));
			this.rotateKnob(this.valRev(this.model.get('attack'), this.model.get('min_attack'), this.model.get('max_attack')), attack);
			
			release = this.smallKnob('RELEASE', 34, 140, '10ms', '1s', 'release', this.model.get('min_release'), this.model.get('max_release'));
			this.rotateKnob(this.valRev(this.model.get('release'), this.model.get('min_release'), this.model.get('max_release')), release);
			
			ratio = this.smallKnob('RATIO', 100, 80, '1:1', '1:12', 'ratio', this.model.get('min_ratio'), this.model.get('max_ratio'));
			this.rotateKnob(this.valRev(this.model.get('ratio'), this.model.get('min_ratio'), this.model.get('max_ratio')), ratio);
			
			threshold = this.smallKnob('THRESHOLD', 100, 140, '-100dB', '0dB', 'threshold', this.model.get('min_threshold'), this.model.get('max_threshold'));
			this.rotateKnob(this.valRev(this.model.get('threshold'), this.model.get('min_threshold'), this.model.get('max_threshold')), threshold);
			
			setBypassButton(this.model.get('bypass'));
		},
	});
	
	_.extend(MasterCompView.prototype, KnobMixin);
	_.extend(MasterCompView.prototype, TextMixin);
	_.extend(MasterCompView.prototype, ColorMixin);

  	return MasterCompView;
});