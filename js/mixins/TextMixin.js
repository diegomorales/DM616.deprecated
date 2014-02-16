// TextMixin.js

define([
], 	function(){
	
	var TextMixin = {
		createText:	function(text, font, color, x, y, textAlign){
			
			if(!textAlign) textAlign = 'left';
			
			var canvasText = new createjs.Text();
			canvasText.text = text;
			canvasText.font = font;
			canvasText.color = color;
			canvasText.x = x;
			canvasText.y = y;
			canvasText.textAlign = textAlign;
			
			return canvasText;
		}
	};

  	return TextMixin;
});