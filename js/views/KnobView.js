// KnobView.js

define([  
  'underscore', 
  'backbone',
  'mixins/KnobMixin',
  'mixins/TextMixin',
  'mixins/ColorMixin',
  'easel',
], 	function( _, Backbone, KnobMixin, TextMixin, ColorMixin){
	
	var KnobView = Backbone.View.extend({
		
		draw:	function(){	
			var model = this.model,
			textLeft = model.get('rangeLeftText'),
			textRight = model.get('rangeRightText'),
			title = model.get('title'),
			min = model.get('min'),
			max = model.get('max'),
			valueName = model.get('valueName'),
			knob,
			bgColor,
			cursorColor,
			x,
			y;
			
			if(model.get('bgColor')) bgColor = model.get('bgColor');
			if(model.get('cursorColor')) cursorColor = model.get('cursorColor');
				
			this.stage = new createjs.Stage(model.get('name')+'-'+model.get('channel_nr'));
			x = this.stage.canvas.width / 2;
			y = this.stage.canvas.height / 2;
					
			this.stage.update();
			
			knob = this.mediumKnob(title, x, y, textLeft, textRight, valueName, min, max, bgColor, cursorColor);
			this.rotateKnob(this.valRev(model.get(valueName), min, max), knob);
		}
	});
	
	_.extend(KnobView.prototype, KnobMixin);
	_.extend(KnobView.prototype, TextMixin);
	_.extend(KnobView.prototype, ColorMixin);

  	return KnobView;
});