var game = new Phaser.Game(800, 600, Phaser.AUTO);

var spacefield, backgroundSpeed, spacesheep, cursors, bullets, fireButton, enemies, scoreText, winText;

var bulletTime = 0;
var score = 0;

var mainState = {
    preload:function(){
	game.load.image('starfield','assets/starfield.png')
	game.load.image('bullet','assets/bullet.png');
	game.load.image('spacesheep','assets/spacesheep.png');
	game.load.image('enemy', 'assets/enemy.png');
    },

    create:function(){
	spacefield = game.add.tileSprite(0,0,800,600,'starfield');
	spacesheep = game.add.sprite(game.world.centerX, game.world.centerY + 300, 'spacesheep');

	bullets = game.add.group();
	bullets.enableBody = true;
	bullets.physicsBodyType = Phaser.Physics.ARCADE;
	bullets.createMultiple(30, 'bullet');
	bullets.setAll('anchor.x', 1.8);
	bullets.setAll('anchor.y', 5);
	bullets.setAll('outOfBoundsKill', true);
	bullets.setAll('checkWorldBounds', true);

	enemies = game.add.group();
	enemies.enableBody = true;
	enemies.physicsBodyType = Phaser.Physics.ARACDE;

	createEnemies();

	scoreText = game.add.text(0,550,'Score:', {font: '32px Arial',fill : '#fff'});
	winText = game.add.text(game.world.centerX,game.world.centerY, 'You Win',{font: '32px Arial', fill : '#fff'});
	winText.visible = false;
	
	fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	
	spacesheep.scale.setTo(-0.5,-0.5);
	game.physics.arcade.enable(spacesheep);
	backgroundSpeed = 5;
	cursors = game.input.keyboard.createCursorKeys();
    },

    update:function(){
	game.physics.arcade.overlap(bullets,enemies,collisionHandler,null,this);
	spacesheep.body.velocity.x = 0;
	spacefield.tilePosition.y += backgroundSpeed;
	if (cursors.left.isDown){
	    spacesheep.body.velocity.x = -350;
	} else if (cursors.right.isDown){
	    spacesheep.body.velocity.x = 350;
	}

	if (fireButton.isDown){
	    fireBullet();
	}

	scoreText.text = 'Score:' + score;
	if (score == 4000) {
	    winText.visible = true;
	    scoreText.visible = false;
	}
    }
}



function fireBullet(){
    if(game.time.now > bulletTime){

	bullet = bullets.getFirstExists(false)

	if (bullet){
	    bullet.reset(spacesheep.x,spacesheep.y);
	    bullet.body.velocity.y = -400;
	    bulletTime = game.time.now + 200;
	}
    }
}


function createEnemies(){
    for (var y = 0; y < 4; y++){
	for (var x = 0; x < 10; x++){
	    var enemy = enemies.create(x*48, y*50, 'enemy');
	    enemy.anchor.setTo(0.5,0.5);
	}
    }

    enemies.x = 100;
    enemies.y = 50;


    var tween = game.add.tween(enemies).to({x:200}, 2000, Phaser.Easing.Linear.None,true,0,1000,true);


    tween.onLoop.add(decend,this);
}

function decend(){
    enemies.y += 10;
}

function collisionHandler(bullet,enemy){
    bullet.kill();
    enemy.kill();
    score += 100;
}
game.state.add('mainState',mainState);
game.state.start('mainState');
