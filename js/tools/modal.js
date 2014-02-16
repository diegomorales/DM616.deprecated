// modal.js

define([
  'jquery'
], 	function($){
	
	var overlay = '#overlay';

	var doModal = function(dialog, model){	
		$(overlay).show();
		
		// display dialog centered
		$(dialog).css('margin-left', - $(dialog).outerWidth()/2);
		$(dialog).show();
		
		// close if click on overlay or close-button
		$(overlay+', .close-modal a').on('click', function(){ 
			closeModal(dialog);
		});
		
		//set preset1 to model
		$(dialog+' .preset-link').on('click', function(e){
			model.set({ presetToLoad: $(this).data('preset')});
			closeModal(dialog);
		});
	};
	
	var closeModal = function(dialog){
		$(overlay).hide();
		$(dialog).hide();
	};
	
  	return {doModal: doModal};
});