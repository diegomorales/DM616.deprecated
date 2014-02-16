// BusselectView.js

define([
  'jquery',     
  'underscore', 
  'backbone',
  'module',
  'easel'
], 	function($, _, Backbone, module){

	var BusselectView = Backbone.View.extend({
		initialize:	function(){
			this.bus_a_button = new createjs.Shape();
			this.bus_b_button = new createjs.Shape();
			
			this.bus_a_button.on('click', _.bind(this.setBusA, this));
			this.bus_b_button.on('click', _.bind(this.setBusB, this));
			
			this.button_a_on = new createjs.Graphics();
			this.button_a_on	.beginStroke('#48332E')
							.beginFill('#eee')
							.setStrokeStyle(3)
							.drawRect(45, 2, 10, 10);
							
			this.button_a_off = new createjs.Graphics();
			this.button_a_off	.beginStroke('#48332E')
							.beginFill('#eee')
							.setStrokeStyle(1)
							.drawRect(45, 2, 10, 10);
							
			this.button_b_on = new createjs.Graphics();
			this.button_b_on	.beginStroke('#48332E')
							.beginFill('#eee')
							.setStrokeStyle(3)
							.drawRect(45, 23, 10, 10);
							
			this.button_b_off = new createjs.Graphics();
			this.button_b_off	.beginStroke('#48332E')
							.beginFill('#eee')
							.setStrokeStyle(1)
							.drawRect(45, 23, 10, 10);
		},
		
		setBusA:	function(){
			if(this.model.get('toBusA')){
				this.model.set('toBusA', false);
			}else{
				this.model.set('toBusA', true);
			}
			this.toggleBusA();
		},
		
		setBusB:	function(){
			if(this.model.get('toBusB')){
				this.model.set('toBusB', false);
			}else{
				this.model.set('toBusB', true);
			}
			this.toggleBusB();
		},
		
		toggleBusA: function(){
			if(this.model.get('toBusA')){
				this.bus_a_button.graphics = this.button_a_on;
			}else{
				this.bus_a_button.graphics = this.button_a_off;
			}
			this.stage.update();
		},
		toggleBusB: function(){
			if(this.model.get('toBusB')){
				this.bus_b_button.graphics = this.button_b_on;
			}else{
				this.bus_b_button.graphics = this.button_b_off;
			}
			this.stage.update();
		},
		
		draw:	function(){
			this.stage = new createjs.Stage('busselect-'+this.model.get('channel_nr'));
			var bus_a_text = new createjs.Text('BUS-A', 'bold 8px Arial', '#000');
			bus_a_text.x = 5;
			bus_a_text.y = 4;
			
			var bus_b_text = new createjs.Text('BUS-B', 'bold 8px Arial', '#000');
			bus_b_text.x = 5;
			bus_b_text.y = 24;

			this.stage.addChild(bus_a_text);
			this.stage.addChild(bus_b_text);
			this.stage.addChild(this.bus_a_button);
			this.stage.addChild(this.bus_b_button);
			this.stage.update();
			
			this.toggleBusA();
			this.toggleBusB();
		},
		
		render:	function(){
			this.draw();
		}
	});
	
  	return BusselectView;
});