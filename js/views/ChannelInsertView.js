// ChannelInsertView.js

define([
  'jquery',     
  'underscore', 
  'backbone',
  'text!templates/InsertTemplate.html',
  'easel',
], 	function($, _, Backbone, inserttemplate){

	var ChannelInsertView = Backbone.View.extend({
		
		render:	function(){
			compiledTemplate = _.template(inserttemplate);
			this.$el.html(compiledTemplate);
			return this;
		},
		
		draw:	function(){
			/*this.stage = new createjs.Stage('output-section');
			
			var title_bg = new createjs.Shape();
			title_bg.graphics	.beginFill('#000')
								.drawRect(4, 0, this.stage.canvas.width -8, 20);
								
			var title_text = new createjs.Text('EFFECT INSERT', '12px Arial', '#fff');
			title_text.x = this.stage.canvas.width / 2;
			title_text.y = 3;
			title_text.textAlign = 'center';
			
			this.stage.addChild(title_bg);
			this.stage.addChild(title_text);
			this.stage.update();*/
		},
	});

  	return ChannelInsertView;
});