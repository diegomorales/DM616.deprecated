// EqView.js

define([
  'jquery',
  'underscore', 
  'backbone',
  'mixins/KnobMixin',
  'mixins/TextMixin',
  'mixins/ColorMixin',
], 	function($, _, Backbone, KnobMixin, TextMixin, ColorMixin){
	
	var EqView = Backbone.View.extend({

		render:	function(){
			var model = this.model,
				minGain = model.get('min_gain'),
				maxGain = model.get('max_gain'),
				minFreq = model.get('min_freq'),
				maxFreq = model.get('max_freq'),
				x,
				y;
			
			this.stage = new createjs.Stage('eq-'+model.get('name')+'-'+model.get('channel_nr'));
			x = this.stage.canvas.width / 2;
			y = this.stage.canvas.height / 2;
		
			this.stage.update();
			
			freqKnob = this.largeKnob(model.get('title'), x, y, model.get('rangeLeftText'), model.get('rangeRightText'), 'freq', minFreq, maxFreq, '#000');
			gainKnob = this.smallKnob(null, x, y, null, null, 'gain', minGain, maxGain, '#FFFF00', '#000', false);
			
			this.rotateKnob(this.valRev(model.get('gain'), minGain, maxGain), gainKnob);
			this.rotateKnob(this.valRev(model.get('freq'), minFreq, maxFreq), freqKnob);
		},
		
	});

	_.extend(EqView.prototype, KnobMixin);
	_.extend(EqView.prototype, TextMixin);
	_.extend(EqView.prototype, ColorMixin);

  	return EqView;
});