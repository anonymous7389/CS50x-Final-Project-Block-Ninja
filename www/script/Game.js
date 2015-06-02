
BasicGame.Game = function (game) {

	//	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;	//	the tween manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator
    //	You can use any of these from any function within this State.
    //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
	/*this.lose = false;
	this.collectShuriken = false;
	this.explode = false;
	this.score = 0;
	this.highScore;*/
};

BasicGame.Game.prototype = {

	create: function () {
		this.lose = false;
		this.collectShuriken = false;
		this.explode = false;
		this.score = 0;
		this.highScore;
	    
	    //	Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
	    
	    // add background
	    this.game.add.tileSprite(0, 0, 480, 720, 'background');
	    
	    this.jumpSound = this.add.sound('jump');
	    this.explosionSound = this.add.sound('explode');
	    this.hitGroundSound = this.add.sound('hitGround');
	    this.capturedSound = this.add.sound('captured');
	    
	    this.shurikenSymbol = this.game.add.image(0, 0, 'shuriken');
	    this.homeButton = this.game.add.button(this.world.width, 0, 'homeButton', this.quitGame, this);
	    this.homeButton.anchor.setTo(1,0);
	    this.scoreText = this.game.add.text(this.shurikenSymbol.width, 0, '0', { fontSize: '50px', fill: '#000' });
	    
	    // hold the line (shuriken)
	    this.lineHolder = this.game.add.sprite(this.game.world.width * 0.5, 0, 'ninjaholder');
	    this.lineHolder.anchor.setTo(0.5, 0);
	    this.game.physics.arcade.enable(this.lineHolder);
	    this.lineHolder.body.immovable = true;
	    
	    // player physics properties & animations
	    this.player = this.game.add.sprite(this.game.world.width * 0.5, this.lineHolder.height, 'ninja', 1);
	    this.game.physics.arcade.enable(this.player);
	    this.player.anchor.setTo(0.5, 0.2);
	    this.player.body.bounce.y = 0.5;
	    this.player.body.gravity.y = 400;
	    this.player.body.collideWorldBounds = true;
	    this.player.animations.add('move', [2, 1, 3, 4], 12, true);
	    
	    // initialise ground and its physics
	    this.ground = this.game.add.tileSprite(0, this.game.world.height - 70, this.game.world.width, 70, 'grasstile');
	    this.game.physics.arcade.enable(this.ground);
	    this.ground.physicsType = Phaser.SPRITE;  // code to fix phaser 2.3.0 bug
	    this.ground.body.immovable = true;
	    
	    // initialise line 
	    this.line = new Phaser.Line(this.lineHolder.x, this.lineHolder.y, this.player.x, this.player.y);
	    
	    // initialise box physics properties & animations
	    this.boxes = this.game.add.group();
	    this.boxes.enableBody = true;
	    this.boxes.createMultiple(30, 'box');
	    this.game.time.events.loop(1300, this.addRowsBox, this);
	    
	    // initialise shuriken
	    this.shuriken = this.game.add.sprite(this.game.world.width * 0.5, this.game.world.height - this.ground.height, 'shuriken');
	    this.shuriken.anchor.setTo(0.5, 1.0);
	    this.game.physics.arcade.enable(this.shuriken);

		this.scoreboard = new ScoreBoard(this.game);
		this.scoreboard.visible = false;
	},

	update: function () {

		//	Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
		this.game.physics.arcade.collide(this.ground, this.player, this.ninjaDie, null, this);
	    this.game.physics.arcade.collide(this.lineHolder, this.player, this.capturedShuriken, null, this);
	    this.game.physics.arcade.collide(this.boxes, this.player, this.boxExplode, null, this);
	    this.game.physics.arcade.overlap(this.shuriken, this.player, this.touchShuriken, null, this);
	    
	    if (this.game.input.activePointer.isDown && this.lose === false){
	        this.player.body.velocity.y = -300;
	        this.jumpSound.play();
	        this.player.animations.play('move');
	    }
	    else {
	        if (this.lose === true){
	            this.player.animations.stop();
	            this.player.frame = 0;
	        }
	        else if (this.collectShuriken === true){
	            this.player.animations.stop();
	            this.player.frame = 5;
	        }
	        else {
	            this.player.animations.stop();
	            this.player.frame = 1;
	        }
	    }
	    this.line.fromSprite(this.lineHolder, this.player, false);
	    
	    if (this.explode === true){
	        this.boxes.forEachAlive(function(box) {box.animations.play('explode');}, this);
	    }
	    
	    if (this.lose === true){
	    	this.game.debug.reset();
	    	this.scoreboard.show(this.score);
	    	this.scoreboard.visible = true;
	    }
	},

	render: function() {
		this.game.debug.geom(this.line, 'black', true);
		/*if (this.lose === true){
			this.game.debug.geom(this.line, 'rgba(0, 0, 0, 0)', true);
		}*/
	},
	
	ninjaDie: function() {
		if (this.lose === false){
			this.lose = true;
			this.hitGroundSound.play();
		}
	},
	
	capturedShuriken: function() {
		if (this.collectShuriken === true && this.lose === false){
	        this.score++;
	        this.scoreText.text = this.score;
	        this.capturedSound.play();
	        this.collectShuriken = false;
	        this.shuriken = this.game.add.sprite(this.game.world.width * 0.5, this.game.world.height - this.ground.height, 'shuriken');
	        this.shuriken.anchor.setTo(0.5, 1.0);
	        this.game.physics.arcade.enable(this.shuriken);
	    }
	},
	
	touchShuriken: function() {
		if (this.lose === false){
			this.collectShuriken = true;
		    this.capturedSound.play();
		}
		this.shuriken.kill();
	},
	
	boxExplode: function() {
		if (this.lose === false){
			this.lose = true;
		    this.explode = true;
		    this.explosionSound.play();
		}
	},
	
	addOneBox: function(x, y, direction) {
		if (this.lose === false){
			var box = this.boxes.getFirstDead();
		    box.body.immovable = true;
		    box.anchor.setTo(1, 1);
		    box.frame = 23;
		    box.animations.add('explode', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17 ,18, 19, 20, 21, 22], 23, true);
		    box.reset(x, y);
		    box.body.velocity.x = direction * 200;
		    box.checkWorldBounds = true;
		    box.outOfBoundsKill = true;
		}
	},
	
	addRowsBox: function() {
		if (this.lose === false){
		    for (var i = 0; i < Math.floor(Math.random() * 4 + 1); i++){
		        this.addOneBox(this.game.world.width - i * 48, this.game.world.height - this.ground.height - this.shuriken.height - 400, -1);
		    }
		    
		    for (var j = 0; j < Math.floor(Math.random() * 4 + 1); j++){
		        this.addOneBox(j * 48, this.game.world.height - this.ground.height - this.shuriken.height, 1);
		    }
		}
	},
	
	quitGame: function (pointer) {

		//	Here you should destroy anything you no longer need.
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.
		this.lose = false;
		this.collectShuriken = false;
		this.explode = false;
		this.score = 0;
		
		this.player.kill();
		this.shurikenSymbol.kill();
	    this.homeButton.kill();
	    this.scoreText.kill();
	    this.lineHolder.kill();
	    
		this.jumpSound.stop();
	    this.explosionSound.stop();
	    this.hitGroundSound.stop();
	    this.capturedSound.stop();
		this.state.start('MainMenu');

	},
	
};
