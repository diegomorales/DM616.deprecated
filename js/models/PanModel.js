// PanModel.js

define([
  'underscore', 
  'backbone',
], 	function(_, Backbone){
	
	var PanModel = Backbone.Model.extend({
		
		initialize:	function(){
			this.set('node', audiocontext.createPanner());
			
			this.get('node').panningModel = 'HRTF';
			this.get('node').distanceModel = 'linear';
			
			this.on('change:pan', this.setPan);
			
			this.setPan();
		},
		
		setPan:	function(){
			var xDeg = parseInt(this.get('pan'));
			var zDeg = xDeg + 90;
			if (zDeg > 90) {
				zDeg = 180 - zDeg;
			}
			var x = Math.sin(xDeg * (Math.PI / 180));
			var z = Math.sin(zDeg * (Math.PI / 180));

			this.get('node').setPosition(x, 0, z);
		},
	});

  	return PanModel;
});