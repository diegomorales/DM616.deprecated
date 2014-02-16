// FaderModel.js

define([
//  'jquery',     
  'underscore', 
  'backbone'
], 	function( _, Backbone){
	
	var FaderModel = Backbone.Model.extend({
		node:	null,
		volume: null,
		channel_nr: null,
		isBus: false,
		
		initialize: function(){
			this.set('node', audiocontext.createGain());
			this.on('change:volume', this.setVolume);
		},
		
		setVolume:	function(){
			var n = this.get('node');
			n.gain.value = this.get('volume')/100;
		}
	});
	
  	return FaderModel;
});