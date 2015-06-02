
BasicGame.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;

};

BasicGame.MainMenu.prototype = {
	
	create: function () {

		//	We've already preloaded our assets, so let's kick right into the Main Menu itself.
		//	Here all we're doing is playing some music and adding a picture and button
		//	Naturally I expect you to do something significantly better :)
		
		this.music = this.add.sound('titleMusic', 1, 1);
		this.music.play();
		
		this.add.sprite(0, 0, 'titlepage');
		
		this.title = this.add.image(this.world.width * 0.5, this.world.height * 0.25, 'title');
		this.title.anchor.setTo(0.5, 0.5);
		
		this.mutedButton = this.add.button(0, 0, 'mutedButton', function(){this.music.resume(); this.mutedButton.visible=false; this.soundButton.visible=true}, this);
		this.mutedButton.visible = false;
		this.soundButton = this.add.button(0, 0, 'soundButton', function(){this.music.pause(); this.soundButton.visible=false; this.mutedButton.visible=true;}, this);

		this.playButton = this.add.button(this.world.width * 0.25, this.world.height * 0.60, 'playButton', this.startGame, this, 1, 2, 1, 2);
		this.playButton.anchor.setTo(0.5, 0.5);
		this.leaderboardButton = this.add.button(this.world.width * 0.75 , this.world.height * 0.60, 'leaderboardButton', 
		function(){this.music.stop(); this.state.start('LeaderBoard');}, this);
		this.leaderboardButton.anchor.setTo(0.5, 0.5);

	},

	update: function () {

		//	Do some nice funky main menu effect here

	},
	
	startGame: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		this.music.stop();

		//	And start the actual game
		this.state.start('Game');

	}

};
