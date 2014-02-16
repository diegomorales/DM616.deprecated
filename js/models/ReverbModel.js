// ReverbModel.js

define([  
  'underscore', 
  'backbone'
], 	function( _, Backbone){
	
	// TODO: refactor variable names
	
	var ReverbModel = Backbone.Model.extend({
		defaults:{
			volume_out: 0,
			reverbType: '1',
			sub_type: 'm',
 		},
		
		initialize:	function(){
			this.set('input', audiocontext.createGain());
			this.set('fx', audiocontext.createConvolver());
			this.set('output', audiocontext.createGain());
			
			this.set('IRs', [
			{	reverbType: 1,
				name: 'HALL',
				path_small:	'IR/small_hall.wav',
				path_medium:	'IR/medium_hall.wav',
				path_large:	'IR/large_hall.wav',
				buffer_small: null,
				buffer_medium: null,
				buffer_large: null,
			},
			{	reverbType: 2,
				name: 'CHAMBER',
				path_small:	'IR/small_chamber.wav',
				path_medium:	'IR/medium_chamber.wav',
				path_large:	'IR/large_chamber.wav',
				buffer_small: null,
				buffer_medium: null,
				buffer_large: null,
			},
			{	reverbType: 3,
				name: 'PLATE',
				path_small:	'IR/small_plate.wav',
				path_medium:	'IR/medium_plate.wav',
				path_large:	'IR/large_plate.wav',
				buffer_small: null,
				buffer_medium: null,
				buffer_large: null,
			},
			{	reverbType: 4,
				name: 'ROOM',
				path_small:	'IR/small_room.wav',
				path_medium:	'IR/medium_room.wav',
				path_large:	'IR/large_room.wav',
				buffer_small: null,
				buffer_medium: null,
				buffer_large: null,
			},
			{	reverbType: 5,
				name: 'AMBIENCE',
				path_small:	'IR/small_ambience.wav',
				path_medium:	'IR/medium_ambience.wav',
				path_large:	'IR/large_ambience.wav',
				buffer_small: null,
				buffer_medium: null,
				buffer_large: null,
			}
			]);
			
			this.on('change:volume_out', this.setVolumeOut);
			this.on('change:reverbType', this.setIR);
			this.on('change:sub_type', this.setIR);
			
			this.setVolumeOut();
			this.loadIR();
			
			this.route();	
		},
		
		loadIR:	function(){
			_.each(this.get('IRs'),function(ir, index, list){
				var request_small = new XMLHttpRequest();
				request_small.open("GET", ir.path_small, true);
				request_small.responseType = 'arraybuffer';
				request_small.onload = _.bind(function(){
						this.get('IRs')[index].buffer_small = audiocontext.createBuffer(request_small.response, false);
						if(this.get('reverbType') == ir.reverbType && this.get('sub_type') == 's') this.get('fx').buffer = this.get('IRs')[index].buffer_small;
				}, this);			
				request_small.send();
				
				var request_medium = new XMLHttpRequest();
				request_medium.open("GET", ir.path_medium, true);
				request_medium.responseType = 'arraybuffer';
				request_medium.onload = _.bind(function(){
						this.get('IRs')[index].buffer_medium = audiocontext.createBuffer(request_medium.response, false);
						if(this.get('reverbType') == ir.reverbType && this.get('sub_type') == 'm') this.get('fx').buffer = this.get('IRs')[index].buffer_medium;
				}, this);			
				request_medium.send();
				
				var request_large = new XMLHttpRequest();
				request_large.open("GET", ir.path_large, true);
				request_large.responseType = 'arraybuffer';
				request_large.onload = _.bind(function(){
						this.get('IRs')[index].buffer_large = audiocontext.createBuffer(request_large.response, false);
						if(this.get('reverbType') == ir.reverbType && this.get('sub_type') == 'l') this.get('fx').buffer = this.get('IRs')[index].buffer_large;
				}, this);			
				request_large.send();
			}, this);
		},
		
		setIR:	function(){
			_.each(this.get('IRs'),function(ir){
				if(ir.reverbType == this.get('reverbType')){
					switch(this.get('sub_type')){
						case 's':
						this.get('fx').buffer = ir.buffer_small;
						break;
						
						case 'm':
						this.get('fx').buffer = ir.buffer_medium;
						break;
						
						case 'l':
						this.get('fx').buffer = ir.buffer_large;
						break;
						
						default:
						this.get('fx').buffer = ir.buffer_medium;
					}
				}
			}, this);
		},
		
		route:	function(){
			this.get('input').connect(this.get('fx'));
			this.get('fx').connect(this.get('output'));
		},
		
		setVolumeOut:	function(){
			this.get('output').gain.value = this.get('volume_out') / 100;
		}
	});

  	return ReverbModel;
});