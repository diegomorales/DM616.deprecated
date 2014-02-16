/* KnobMixin.js
 * 
 * TextMixin.js must also be included in the View for this mixin to work.
 */

define([
], 	function(){
	
	var KnobMixin = {
		
		smallKnob:	function(title, x, y, textLeft, textRight, value, min, max, bgColor, cursorColor, drawRange){
			var type = 'small';
			
			if(!bgColor) bgColor = '#555';
			if(!cursorColor) cursorColor = '#fff';
			if(drawRange === undefined) drawRange = true;
			
			return this._drawKnob(title, x, y, textLeft, textRight, value, min, max, bgColor, cursorColor, drawRange, type);
		},
		
		mediumKnob:	function(title, x, y, textLeft, textRight, value, min, max, bgColor, cursorColor, drawRange){
			var type = 'medium';
			
			if(!bgColor) bgColor = '#555';
			if(!cursorColor) cursorColor = '#fff';
			if(drawRange === undefined) drawRange = true;
			
			return this._drawKnob(title, x, y, textLeft, textRight, value, min, max, bgColor, cursorColor, drawRange, type);
		},
		
		largeKnob:	function(title, x, y, textLeft, textRight, value, min, max, bgColor, cursorColor, drawRange){
			var type = 'large';
			
			if(!bgColor) bgColor = '#555';
			if(!cursorColor) cursorColor = '#fff';
			if(drawRange === undefined) drawRange = true;
			
			return this._drawKnob(title, x, y, textLeft, textRight, value, min, max, bgColor, cursorColor, drawRange, type);
		},
		
		_drawKnob:	function(title, x, y, textLeft, textRight, value, min, max, bgColor, cursorColor, drawRange, type){
			var	radius,
				rangeDistance,
				titleTextAlign,
				titleTextOffsetY,
				titleTextOffsetX,
				knobTextX,
				knobTextY,
			
				knob,
				knobBg,
				knobCursor,
				knobDots,
				knobTitle,
				knobTextLeft,
				knobTextLeftAlign,
				knobTextRight,
				knobTextRightAling;
				
			switch(type){
				case 'small':
					radius = 14;
					rangeDistance = 4;
					titleTextAlign = 'center';
					titleTextOffsetY = 28;
					titleTextOffsetX = 0,
					knobTextX = 10;
					knobTextY = 16;
					knobTextLeftAlign = 'right';
					knobTextRightAlign = 'left';
				break;
				
				case 'medium':
					radius = 18;
					rangeDistance = 4;
					titleTextAlign = 'left';
					titleTextOffsetY = 34;
					titleTextOffsetX = 30;
					knobTextX = 14;
					knobTextY = 20;
					knobTextLeftAlign = 'right';
					knobTextRightAlign = 'left';
				break;
				
				case 'large':
					radius = 24;
					rangeDistance = 5;
					titleTextAlign = 'left';
					titleTextOffsetY = 39;
					titleTextOffsetX = 30;
					knobTextX = 28;
					knobTextY = 24;
					knobTextLeftAlign = 'left';
					knobTextRightAlign = 'right';
				break;
			}
					
			knobBg = new createjs.Shape();
			knobBg.graphics.beginRadialGradientFill([bgColor, this.ColorLuminance(bgColor, -0.3)], [0.6, 1], x, y, 0, x, y, radius)
							.drawCircle(x, y, radius);
			knobBg.shadow = new createjs.Shadow('#000', 0, 0, 4);
			
			knobCursor = new createjs.Shape();
			knobCursor.graphics.beginFill(cursorColor)
							.drawRect(x -2, y - radius, 4, radius);
							
			if(drawRange){
				knobDots = new createjs.Shape();
				var dash = function(obj){ this.setLineDash = [1, 3]; };
				var angleArc = 300;
				var angleOffset = -90 - (angleArc / 2);
				var startAngle = (angleOffset * Math.PI) / 180;
				var endAngle = ((angleOffset + angleArc) * Math.PI) / 180;
				knobDots.graphics.setStrokeStyle(1)
								.beginStroke("#000")
								.inject(dash, [1, 3])
								.arc(x, y, radius + rangeDistance, startAngle, endAngle)
								.endStroke();
				knobDots.alpha = 0.2;
			}
							
			knob = new createjs.Container();
			knob.regX = x;
			knob.regY = y;
			knob.x = x;
			knob.y = y;
			
			if(title) knobTitle = this.createText(title, 'bold 8px Arial', '#000', x - titleTextOffsetX, y - titleTextOffsetY, titleTextAlign);
			if(textLeft) knobTextLeft = this.createText(textLeft, '7px Arial', '#000', x - knobTextX, y + knobTextY, knobTextLeftAlign);
			if(textRight) knobTextRight = this.createText(textRight, '7px Arial', '#000', x + knobTextX, y + knobTextY, knobTextRightAlign);
			
			knob.addChild(knobBg, knobCursor);
			
			if(drawRange) this.stage.addChild(knobDots);
			this.stage.addChild(knob);
			if(title) this.stage.addChild(knobTitle);
			if(textLeft) this.stage.addChild(knobTextLeft);
			if(textRight) this.stage.addChild(knobTextRight);
			this.stage.update();
			
			var mouseAngle;
			knob.on('mousedown', _.bind(function(){
				var mouseStartAngle = this.xyMouseMove(x, y);
				
				if(mouseStartAngle >= -150 && mouseStartAngle <= 150){
					this.rotateKnob(mouseStartAngle, knob);
					this.model.set(value, this.val(mouseStartAngle, min, max));
				}
				
				knob.on('pressmove', _.bind(function(){
					mouseAngle = this.xyMouseMove(x, y); 
					
					if(mouseAngle >= -150 && mouseAngle <= 150){
						this.rotateKnob(mouseAngle, knob);
						this.model.set(value, this.val(mouseAngle, min, max));			
					}else{
						if(mouseAngle < -150) mouseStartAngle = -150;
						if(mouseAngle > 150) mouseStartAngle = 150;					
					}
					mouseStartAngle = mouseAngle;
				}, this));
			}, this));
			
			return knob;
		},
		
		xy2degree:	function(x, y){
			var a = Math.atan2(x, y);
            return (a * 180) / Math.PI;
		},
		
		xyMouseMove:	function(x, y){
			var mousePos = {x: this.stage.mouseX, y: this.stage.mouseY },
				deg = this.xy2degree((x - mousePos.x), (y - mousePos.y));
			return -deg;
		},
		
		rotateKnob:	function(deg, knob){
			knob.rotation = deg;
			this.stage.update();
		},
		
		val:	function(v, min, max){
			var knob_min = -150,
				knob_max = 150,
				scale = (max - min) / (knob_max - knob_min);
			return Math.round(min + ((v - knob_min) * scale));
		},
		
		valRev:	function(v, min, max){
			var knob_min = -150,
				knob_max = 150,
				scale = (knob_max - knob_min) / (max - min);
			return knob_min + ((v- min) * scale);
		}
	};

  	return KnobMixin;
});