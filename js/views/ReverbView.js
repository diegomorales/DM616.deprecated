// ReverbView.js

define([
  'underscore', 
  'backbone',
  'mixins/KnobMixin',
  'mixins/TextMixin',
  'mixins/ColorMixin',
  'easel'
], 	function( _, Backbone, KnobMixin, TextMixin, ColorMixin){
	
	// TODO: refactor variable names
	
	var ReverbView = Backbone.View.extend({
		
		draw:	function(){
			var model = this.model;
			
			this.stage = new createjs.Stage('fx-reverb');
			
			var titleBg = new createjs.Shape();
			titleBg.graphics	.beginFill('#000')
								.drawRect(4,0, this.stage.canvas.width -8, 20);
			
			var titleText = this.createText('EFFECT 1 / REVERB', '12px Arial', '#fff', this.stage.canvas.width / 2, 3, 'center'),
				text_S = this.createText('S', '10px Arial', '#000', 7, 30),
				text_M = this.createText('M', '10px Arial', '#000', 22, 30),
				text_L = this.createText('L', '10px Arial', '#000', 39, 30);

			
			// reverb selection
			var reverbs = model.get('IRs');
			this.buttons = [];
			var yOffset = 46;
			_.each(reverbs, _.bind(function(reverb){	
				var reverbTitle = this.createText(reverb.name, '10px ARIAL', '#000', 56, yOffset);
				
				var selectS_off = new createjs.Graphics();
				selectS_off	.beginFill('#eee')
							.beginStroke('#48332E')
							.drawRect(6, yOffset, 10,10);
							
				var selectS_on = new createjs.Graphics();
				selectS_on	.beginFill('#eee')
							.beginStroke('#48332E')
							.setStrokeStyle(3)
							.drawRect(6, yOffset, 10,10);
				
				var selectS = new createjs.Shape();
				selectS.graphics = selectS_off;
								
				var selectM_off = new createjs.Graphics();
				selectM_off.beginFill('#eee')
									.beginStroke('#48332E')
									.drawRect(22, yOffset, 10,10);
									
				var selectM_on = new createjs.Graphics();
				selectM_on	.beginFill('#eee')
									.beginStroke('#48332E')
									.setStrokeStyle(3)
									.drawRect(22, yOffset, 10,10);
									
				var selectM = new createjs.Shape();
				selectM.graphics = selectM_off;
				
				var selectL_off = new createjs.Graphics();
				selectL_off.beginFill('#eee')
									.beginStroke('#48332E')
									.drawRect(38, yOffset, 10,10);
									
				var selectL_on = new createjs.Graphics();
				selectL_on	.beginFill('#eee')
									.beginStroke('#48332E')
									.setStrokeStyle(3)
									.drawRect(38, yOffset, 10,10);
				
				var selectL = new createjs.Shape();
				selectL.graphics = selectL_off;
								
				this.stage.addChild(selectS);
				this.stage.addChild(selectM);
				this.stage.addChild(selectL);
				this.stage.addChild(reverbTitle);
				yOffset += 16;
				
				this.buttons[reverb.reverbType] = { 
					s: selectS,
					s_off: selectS_off,
					s_on: selectS_on,
					m: selectM,
					m_off: selectM_off,
					m_on: selectM_on,
					l: selectL,
					l_off: selectL_off,
					l_on: selectL_on,
					reverbType: reverb.reverbType,
					};
				
				selectS.on('click', _.bind(function(){
					model.set({sub_type : 's'});
					model.set({reverbType: reverb.reverbType});
					this.selectButton(reverb.reverbType, 's');
				}, this));
				
				selectM.on('click', _.bind(function(){
					model.set({sub_type : 'm'});
					model.set({reverbType: reverb.reverbType});
					this.selectButton(reverb.reverbType, 'm');
				}, this));
				
				selectL.on('click', _.bind(function(){
					model.set({sub_type : 'l'});
					model.set({reverbType: reverb.reverbType});
					this.selectButton(reverb.reverbType, 'l');
				}, this));
				
			}, this));
		
			// ----------------
			
			this.stage.addChild(titleBg);
			this.stage.addChild(titleText);
			this.stage.addChild(text_S);
			this.stage.addChild(text_M);
			this.stage.addChild(text_L);
			
			this.stage.update();
			
			output_level = this.smallKnob('SEND OUT', 175, 75, '0', '10', 'volume_out', model.get('min_volume'), model.get('max_volume'));
			this.rotateKnob(this.valRev(model.get('volume_out'), model.get('min_volume'), model.get('max_volume')), output_level);
			
			this.selectButton(model.get('reverbType'), model.get('sub_type'));
		},
		
		selectButton:	function(r_type, s_type){
			_.each(this.buttons, function(button_array, index, buttons){
				button_array.s.graphics = button_array.s_off;
				button_array.m.graphics = button_array.m_off;
				button_array.l.graphics = button_array.l_off;
				
				if(r_type == button_array.reverbType){
					switch(s_type){
						case 's':
						button_array.s.graphics = button_array.s_on;
						break;
						
						case 'm':
						button_array.m.graphics = button_array.m_on;
						break;
						
						case 'l':
						button_array.l.graphics = button_array.l_on;
						break;
					}
				}
	
			}, this);
			
			this.stage.update();
		},
	});
	
	_.extend(ReverbView.prototype, KnobMixin);
	_.extend(ReverbView.prototype, TextMixin);
	_.extend(ReverbView.prototype, ColorMixin);

  	return ReverbView;
});