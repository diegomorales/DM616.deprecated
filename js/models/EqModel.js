// EqModel.js

define([   
  'underscore', 
  'backbone',
], 	function(_, Backbone){
	
	var EqModel = Backbone.Model.extend({
		
		initialize: function(){
			this.set('node', audiocontext.createBiquadFilter());
			this.get('node').type = this.get('type');
			this.get('node').frequency.value = this.get('freq');
			this.get('node').Q.value = this.get('q');
			this.get('node').gain.value = this.get('gain');
			
			this.on('change:freq', this.setFrequency);
			this.on('change:gain', this.setGain);
			
			this.setFrequency();
			this.setGain();
		},
		
		setGain:	function(){
			this.get('node').gain.value = this.get('gain');
		},
		
		setFrequency:	function(){
			this.get('node').frequency.value = this.get('freq');
		}
	});

  	return EqModel;
});