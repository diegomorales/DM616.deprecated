// PresetCollection.js

define([
  'jquery',     
  'underscore', 
  'backbone',
  'models/PresetModel'
], 	function($, _, Backbone, PresetModel){
	
	var PresetCollection = Backbone.Collection.extend({
		initialize:	function(){
			var preset1 = new PresetModel({
				title:	'te espero',
				name:	'preset1',
				channels:	[
					{
						channel_nr: 1,
						audio_url: 'audio/te_espero/track1.mp3',
					},
					{
						channel_nr: 2,
						audio_url: 'audio/te_espero/track2.mp3',
					},
					{
						channel_nr: 3,
						audio_url: 'audio/te_espero/track3.mp3',
					},
					{
						channel_nr: 4,
						audio_url: 'audio/te_espero/track4.mp3',
					},
					{
						channel_nr: 5,
						audio_url: 'audio/te_espero/track5.mp3',
					},
					{
						channel_nr: 6,
						audio_url: 'audio/te_espero/track6.mp3',
					}
				],
			});
			
			var preset2 = new PresetModel({
				title:	'Hard To Breath',
				name:	'preset2',
				channels:	[
					{
						channel_nr: 1,
						audio_url: 'audio/hard_to_breath/track1.mp3',
					},
					{
						channel_nr: 2,
						audio_url: 'audio/hard_to_breath/track2.mp3',
					},
					{
						channel_nr: 3,
						audio_url: 'audio/hard_to_breath/track3.mp3',
					},
					{
						channel_nr: 4,
						audio_url: 'audio/hard_to_breath/track4.mp3',
					},
					{
						channel_nr: 5,
						audio_url: 'audio/hard_to_breath/track5.mp3',
					},
					{
						channel_nr: 6,
						audio_url: 'audio/hard_to_breath/track6.mp3',
					}
				],
			});
			
			var preset3 = new PresetModel({
				title:	'just go',
				name:	'preset3',
				channels:	[
					{
						channel_nr: 1,
						audio_url: 'audio/just_go/track1.mp3',
					},
					{
						channel_nr: 2,
						audio_url: 'audio/just_go/track2.mp3',
					},
					{
						channel_nr: 3,
						audio_url: 'audio/just_go/track3.mp3',
					},
					{
						channel_nr: 4,
						audio_url: 'audio/just_go/track4.mp3',
					},
					{
						channel_nr: 5,
						audio_url: 'audio/just_go/track5.mp3',
					},
					{
						channel_nr: 6,
						audio_url: 'audio/just_go/track6.mp3',
					}
				],
			});
			
			this.add([preset1, preset2, preset3]);
		}
	});

  	return PresetCollection;
});