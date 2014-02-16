// DelayModel.js

define([ 
  'underscore', 
  'backbone'
], 	function(_, Backbone){

	var DelayModel = Backbone.Model.extend({
		
		initialize:	function(){
			this.set('input', audiocontext.createGain());
			this.set('fx', audiocontext.createDelay());
			this.set('output', audiocontext.createGain());
			this.set('feedback_node', audiocontext.createGain());
			this.set('hi_cut_node', audiocontext.createBiquadFilter());
			this.get('hi_cut_node').type = 'lowpass';
			this.set('lo_cut_node', audiocontext.createBiquadFilter());
			this.get('lo_cut_node').type = 'highpass';
			
			this.on('change:volume_out', this.setVolumeOut);
			this.on('change:time', this.setTime);
			this.on('change:feedback', this.setFeedback);
			this.on('change:hi_cut', this.setHiCut);
			this.on('change:lo_cut', this.setLoCut);
			
			this.route();
			this.setVolumeOut();
			this.setFeedback();
			this.setTime();
			this.setHiCut();
			this.setLoCut();
		},
		
		route: function(){
			this.get('input').connect(this.get('fx'));
			this.get('fx').connect(this.get('hi_cut_node'));
			this.get('hi_cut_node').connect(this.get('lo_cut_node'));
			this.get('lo_cut_node').connect(this.get('feedback_node'));
			this.get('feedback_node').connect(this.get('output'));
			this.get('feedback_node').connect(this.get('fx'));
		},
		
		setVolumeOut:	function(){
			this.get('output').gain.value = this.get('volume_out') / 100;
		},
		
		setTime:	function(){
			this.get('fx').delayTime.value = this.get('time') / 1000;
		},
		
		setFeedback:	function(){
			this.get('feedback_node').gain.value = this.get('feedback') / 100;
		},
		
		setHiCut:	function(){
			this.get('hi_cut_node').frequency.value = this.get('hi_cut');
		},
		
		setLoCut:	function(){
			this.get('lo_cut_node').frequency.value = this.get('lo_cut');
		},
	});

  	return DelayModel;
});