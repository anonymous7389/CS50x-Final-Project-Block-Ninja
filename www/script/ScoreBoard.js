'use strict';
var ScoreBoard = function(game) {

    Phaser.Group.call(this, game);
    
    this.gameover = this.create(this.game.world.width * .5 , this.game.world.height * .25, 'gameover');
    this.gameover.anchor.setTo(0.5, 0.5);
    
    this.panel = this.create(game.world.width * .5, game.world.height * .5, 'panel');
    this.panel.anchor.setTo(0.5, 0.5);
    
    this.scoreText = this.game.add.text(this.game.world.width * 0.5, this.game.world.height * 0.4, 'Score:');
    this.scoreText.anchor.setTo(0.5, 0.5);
    this.add(this.scoreText);

    this.highScoreText = this.game.add.text(this.game.world.width * 0.5, this.game.world.height * 0.6, 'High Score:');
    this.highScoreText.anchor.setTo(0.5, 0.5);
    this.add(this.highScoreText);
    
    this.homeButton = this.game.add.button(this.game.world.width * 0.25, this.game.world.height * 0.75, 'homeButton', 
    function(){game.state.start('MainMenu');}, this);
    this.homeButton.anchor.setTo(0.5, 0.5);
    this.add(this.homeButton);
    
    this.restartButton = this.game.add.button(this.game.world.width * 0.75, this.game.world.height * 0.75, 'restartButton', 
    function(){game.state.start('Game');}, this);
    this.restartButton.anchor.setTo(0.5, 0.5);
	this.add(this.restartButton);

};

ScoreBoard.prototype = Object.create(Phaser.Group.prototype);
ScoreBoard.prototype.constructor = ScoreBoard;

ScoreBoard.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

ScoreBoard.prototype.show = function(score) {
        
    var highscore;
	if(typeof(Storage) !== "undefined") {
		highscore = localStorage.getItem('highscore');
		if (typeof(highscore) !== 'undefined' && highscore !== null){
	        if (score > highscore){
			    highscore = score;
			    localStorage.setItem('highscore', highscore);
			 }
	    }
	    else{
	        highscore = score
	        localStorage.setItem('highscore', score);
	    }
	}else {
        highscore = "Local Storage is NOT supported!";
	}
    this.highScoreText.text = "High Score: " + highscore;
    this.scoreText.text = "Score: "  + score; 
};

/*ScoreBoard.prototype.restartState = function(game){
    //this.game.lose = false;
	this.game.collectShuriken = false;
	this.game.explode = false;
	this.game.score = 0;
};*/