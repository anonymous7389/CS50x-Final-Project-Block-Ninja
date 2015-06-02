
BasicGame.LeaderBoard = function (game) {

	this.music = null;
	this.playButton = null;

};

BasicGame.LeaderBoard.prototype = {
    
    create: function () {

    	//	We've already preloaded our assets, so let's kick right into the Main Menu itself.
    	//	Here all we're doing is playing some music and adding a picture and button
    	//	Naturally I expect you to do something significantly better :)
    		
    	this.music = this.add.sound('titleMusic', 1, 1);
    	this.music.play();
    		
    	this.add.sprite(0, 0, 'titlepage');
    	var highscore = localStorage.getItem('highscore');
    	this.title = this.add.text(this.world.width * 0.5, this.world.height * 0.4, "High Score", {fontSize: '70px', fill: '#fff' });
    	this.title.anchor.setTo(0.5, 0.5);
    	
    	this.score = this.add.text(this.world.width * 0.5, this.world.height * 0.5, highscore, {fontSize: '50px', fill: '#fff' });
    	this.score.anchor.setTo(0.5, 0.5);
    	
    	//this.mutedButton = this.add.button(0, 0, 'mutedButton', function(){this.music.resume(); this.mutedButton.visible=false; this.soundButton.visible=true}, this);
    	//this.mutedButton.visible = false;
    	//this.soundButton = this.add.button(0, 0, 'soundButton', function(){this.music.pause(); this.soundButton.visible=false; this.mutedButton.visible=true;}, this);
    
    	this.menuButton = this.add.button(this.world.width * 0.5, this.world.height * 0.7, 'homeButton', this.mainMenu, this, 1, 2, 1, 2);
    	this.menuButton.anchor.setTo(0.5, 0.5);

	},

	update: function () {

		//	Do some nice funky main menu effect here

	},
	
	mainMenu: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		this.music.stop();

		//	And start the actual game
		this.state.start('MainMenu');

	}

};