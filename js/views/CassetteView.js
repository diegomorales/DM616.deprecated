// CassetteView.js

define([
  'jquery',     
  'underscore', 
  'backbone',
  'text!templates/CassetteTemplate.html',
  'text!templates/PresetsTemplate.html',
  'tools/modal'
], 	function($, _, Backbone, ctemplate, ptemplate, modal){
	
	var CassetteView = Backbone.View.extend({
		initialize:	function(){
			//this.preset_dialog = $('#preset-dialog');
		},
		events:{
			'click .new-mix': 'newMix',
			'click .load-mix': 'loadMix',
			'click .save-mix': 'saveMix',
			'click .presets' :	'showPresetDialog',
		},
		
		newMix: function(){
			this.model.newMix();
		},

		showPresetDialog:	function(){
			compiledTemplate = _.template(ptemplate, { collection: this.collection.toJSON()});
			$('body').append(compiledTemplate);
			modal.doModal('#preset-dialog', this.model);
		},
		
		render:	function(){
			compiledTemplate = _.template(ctemplate, this.model.toJSON());
			this.$el.html(compiledTemplate);
			return this;
		},
	});

  	return CassetteView;
});