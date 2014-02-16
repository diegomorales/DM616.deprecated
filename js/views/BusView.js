// BusView.js

define([
  'jquery',     
  'underscore', 
  'backbone',
  'views/FaderView',
  'text!templates/BusTemplate.html',
], 	function($, _, Backbone, FaderView, bustemplate){
	
	var BusView = Backbone.View.extend({		
		render:	function(){
			compiledTemplate = _.template(bustemplate, this.model.toJSON());
			this.$el.html(compiledTemplate);
			return this;
		},
		
		draw:	function(){
			var view = new FaderView({
				model: this.model
			});
			view.render();
		},
	});

  	return BusView;
});