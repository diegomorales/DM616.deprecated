// MasterCompModel.js

define([
  'underscore', 
  'backbone',
], 	function( _, Backbone){
	
	var MasterCompModel = Backbone.Model.extend({
		defaults:{
			bypass:	true,
			threshold:	-20,
			ratio:		3,
			attack:		0.01,
			release:	0.8	
		},
		
		initialize:	function(){
			this.set('input', audiocontext.createGain());
			this.set('fx', audiocontext.createDynamicsCompressor());
			this.set('output', audiocontext.createGain());
			this.set('proc', audiocontext.createScriptProcessor(8192, 1, 1));	
			
			this.on('change:threshold', this.setThreshold);
			this.on('change:ratio', this.setRatio);
			this.on('change:attack', this.setAttack);
			this.on('change:release', this.setRelease);
			this.on('change:bypass', this.setBypass);
			
			this.setThreshold();
			this.setAttack();
			this.setRelease();
			this.setRatio();
			this.setBypass();
		},
		
		setBypass:	function(){
			if(this.get('bypass')){
				this.get('input').disconnect();
				this.get('fx').disconnect();
				this.get('input').connect(this.get('proc'));
				this.get('input').connect(this.get('output'));
				this.get('proc').connect(audiocontext.destination);
			}else{
				this.get('input').disconnect();
				this.get('fx').disconnect();
				this.get('input').connect(this.get('fx'));
				this.get('fx').connect(this.get('proc'));
				this.get('proc').connect(audiocontext.destination);
				this.get('fx').connect(this.get('output'));	
			}
		},
		
		setThreshold:	function(){
			this.get('fx').threshold.value = this.get('threshold');
		},
		
		setRatio:	function(){
			this.get('fx').ratio.value = this.get('ratio');
		},
		
		setAttack:	function(){
			this.get('fx').attack.value = this.get('attack') / 1000;
		},
		
		setRelease:	function(){
			this.get('fx').release.value = this.get('release') / 1000;
		},
	});

  	return MasterCompModel;
});