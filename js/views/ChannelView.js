// ChannelView.js

define([
  'jquery',     
  'underscore', 
  'backbone',
  'views/EqView',
  'views/BusselectView',
  'views/KnobView',
  'views/FaderView',
  'text!templates/ChannelTemplate.html',
  'mixins/TextMixin',
  'easel'
], 	function($, _, Backbone, 
	EqView, BusselectView, KnobView, FaderView, channeltemplate, TextMixin){
	
	var ChannelView = Backbone.View.extend({
		tagName:	'div',
		className:	'channel-strip',
		
		initialize:	function(){
			this.faderView = new FaderView({model: this.model.get('fader')});		
			this.listenTo(this.model, 'change:isLoading', this.toggleLoaderImg);
			
			this.eq_hi_peakView = new EqView({model : this.model.get('high_peak')});
			this.eq_lo_peakView = new EqView({model : this.model.get('low_peak')});
			
			this.pannerView = new KnobView({model : this.model.get('panner')});
			
			this.send1View = new KnobView({model: this.model.get('effectsend1')});
			this.send2View = new KnobView({model: this.model.get('effectsend2')});
			
			this.busselectView = new BusselectView({model: this.model});
			
			//graphics objects for status
			this.greenStatus = new createjs.Graphics();
			this.greenStatus.beginFill('#00FF00').drawCircle(35, 25, 8);
			
			this.redStatus = new createjs.Graphics();
			this.redStatus.beginFill('#FF0000').drawCircle(35, 25, 8);
		},
		
		load:	function(){
			this.model.loadSound();
		},
		
		toggleLoaderImg:	function(){
			if(this.model.get('isLoading') == 1){
				this.inputStatus.graphics = this.redStatus;
				this.stage.update();
			}else{
				this.inputStatus.graphics = this.greenStatus;
				this.stage.update();
			}
		},
		
		draw:	function(){
			this.drawInputs();
			this.busselectView.render();
			this.eq_hi_peakView.render();
			this.eq_lo_peakView.render();
			this.send1View.draw();
			this.send2View.draw();
			this.pannerView.draw();
			this.faderView.render();
		},
		
		drawInputs:	function(){
			this.stage = new createjs.Stage('input-'+this.model.get('channel_nr'));
			
			//input jack
			var input = new createjs.Container();
			input.x = 0;
			input.y = 80;
			
			var inputTitle = this.createText('INPUT / MIC LINE', 'bold 7px Arial', '#000', 35, 0, 'center');
			
			var inputBg = new createjs.Shape();
			inputBg.graphics.beginFill('#B6B6B6')
							.beginStroke('#000')
							.setStrokeStyle(3)
							.drawCircle(35, 25, 12);
							
			this.inputStatus = new createjs.Shape();
			this.inputStatus.graphics.beginFill('#000')
								.drawCircle(35, 25, 8);
								
			input.addChild(inputTitle, inputBg, this.inputStatus);
			
			this.stage.addChild(input);
			this.stage.update();
		},
		
		render:	function(){
			compiledTemplate = _.template(channeltemplate, this.model.toJSON());
			this.$el.html(compiledTemplate);
			return this;
		},
	});
	
	_.extend(ChannelView.prototype, TextMixin);

  	return ChannelView;
});