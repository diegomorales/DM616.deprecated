// CassetteModel.js

define([
  'jquery',     
  'underscore', 
  'backbone'
], 	function($, _, Backbone){
	
	var CassetteModel = Backbone.Model.extend({
		initialize:	function(){
			this.on('change:presetToLoad', this.loadPreset, this);	
		},
		
		newMix:	function(){
				
		},
		
		loadPreset:	function(){
			this.get('mixer').loadMix(this.get('presetToLoad'));
		}
	});

  	return CassetteModel;
});