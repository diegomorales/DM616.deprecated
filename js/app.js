define([
  'jquery',
  'underscore',
  'backbone',
  'views/MixerView'
], function($, _, Backbone, MixerView){
  var initialize = function(){
  	
	var m = new MixerView();
	
	// make connections
	var master_out = m.busses.findWhere({ channel_nr: 'master'}).get('node');
	m.channels.each(function(channel){
		if(channel.get('toBusA')){
			// connect Channel to Bus-A
			channel.get('fader').get('node').connect(m.busses.findWhere({ channel_nr: 'bus-a'}).get('node'));
		}else if(channel.get('toBusB')){
			// connect Channel to Bus-B
			channel.get('fader').get('node').connect(m.busses.findWhere({ channel_nr: 'bus-b'}).get('node'));
		}else{
			// connect Channel to Master
			channel.get('fader').get('node').connect(master_out);
		}
		channel.get('effectsend1').get('node').connect(m.fx1.get('input'));
		channel.get('effectsend2').get('node').connect(m.fx2.get('input'));
		//channel.get('fader').get('node').connect(master_out);
		
		//connect to meter
		channel.get('fader').get('node').connect(m.meters.findWhere({ channel_nr : channel.get('channel_nr')}).get('meter'));
	});
	
	// Busses to master out
	m.busses.findWhere({ channel_nr: 'bus-a'}).get('node').connect(master_out);
	m.busses.findWhere({ channel_nr: 'bus-b'}).get('node').connect(master_out);
	m.busses.findWhere({ channel_nr: 'bus-a'}).get('node').connect(m.meters.findWhere({ channel_nr : 'bus-a'}).get('meter'));
	m.busses.findWhere({ channel_nr: 'bus-b'}).get('node').connect(m.meters.findWhere({ channel_nr : 'bus-b'}).get('meter'));
	m.busses.findWhere({ channel_nr: 'master'}).get('node').connect(m.meters.findWhere({ channel_nr : 'master'}).get('meter'));
	
	// send effects to master out
	m.fx1.get('output').connect(master_out);
	m.fx2.get('output').connect(master_out);
	m.fx1.get('output').connect(m.meters.findWhere({ channel_nr : 'send1'}).get('meter'));
	m.fx2.get('output').connect(m.meters.findWhere({ channel_nr : 'send2'}).get('meter'));
	
	//master_out.connect(audiocontext.destination);
	master_out.connect(m.mastercomp.get('input'));
	m.mastercomp.get('output').connect(m.meters.findWhere({ channel_nr : 'transport'}).get('meter'));
	m.mastercomp.get('output').connect(audiocontext.destination);
	
	//connect all meters to destination
	m.meters.each(function(meter){
		meter.get('meter').connect(audiocontext.destination);
	});	


	//load tracks
	/*m.channels.each(function(channel){
		channel.loadSound();
	});*/
	
	//m.loadMix();
  };

  return {
    initialize: initialize
  };
});