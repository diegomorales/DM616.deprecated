// DelayView.js

define([
  'underscore', 
  'backbone',
  'mixins/KnobMixin',
  'mixins/TextMixin',
  'mixins/ColorMixin',
  'easel'
], 	function( _, Backbone, KnobMixin, TextMixin, ColorMixin){
	
	var DelayView = Backbone.View.extend({
		
		draw:	function(){
			var model = this.model;
			
			this.stage = new createjs.Stage('fx-delay');
			
			var titleBg = new createjs.Shape();
			titleBg.graphics	.beginFill('#000')
								.drawRect(4,0, this.stage.canvas.width -8, 20);
			
			var titleText = this.createText('EFFECT 2 / DELAY', '12px Arial', '#fff', this.stage.canvas.width / 2, 3, 'center');
		
			this.stage.addChild(titleBg);
			this.stage.addChild(titleText);
	
			this.stage.update();
			
			time = this.smallKnob('TIME', 34, 50, '80ms', '2s', 'time', model.get('min_time'), model.get('max_time'));
			this.rotateKnob(this.valRev(model.get('time'), model.get('min_time'), model.get('max_time')), time);
			
			feedback = this.smallKnob('FEEDBACK', 34, 105, '0', '10', 'feedback', model.get('min_feedback'), model.get('max_feedback'));
			this.rotateKnob(this.valRev(model.get('feedback'), model.get('min_feedback'), model.get('max_feedback')), feedback);
			
			hi_cut = this.smallKnob('HI CUT', 94, 50, '1kHz', '20kHz', 'hi_cut', model.get('min_hi_cut'), model.get('max_hi_cut'));
			this.rotateKnob(this.valRev(model.get('hi_cut'), model.get('min_hi_cut'), model.get('hi_cut')), hi_cut);
			
			lo_cut = this.smallKnob('LO CUT', 94, 105, '0Hz', '1kHz', 'lo_cut', model.get('min_lo_cut'), model.get('max_lo_cut'));
			this.rotateKnob(this.valRev(model.get('lo_cut'), model.get('min_lo_cut'), model.get('max_lo_cut')), lo_cut);
			
			output_level = this.smallKnob('SEND OUT', 175, 75, '0', '10', 'volume_out', model.get('min_volume'), model.get('max_volume'));
			this.rotateKnob(this.valRev(model.get('volume_out'), model.get('min_volume'), model.get('max_volume')), output_level);
		},
	});
	
	_.extend(DelayView.prototype, KnobMixin);
	_.extend(DelayView.prototype, TextMixin);
	_.extend(DelayView.prototype, ColorMixin);

  	return DelayView;
});