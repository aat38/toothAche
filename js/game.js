var config = {
  type: Phaser.AUTO, 
  width: 800,
  height: 600,
  backgroundColor: "#00D7FB", 
  pixelArt: true,
  onVisible: true,
  scene: {
      title: title,
      preload: preload,
      create: create,
      update: update,
      endGame: endGame
  },
  physics: {
    default: 'arcade',
    arcade: {
        gravity: {y: 500},
        debug: false
    }
  }
};

var game = new Phaser.Game(config);
var cursors;
var spaceKey;
var timeElapsed = this.timeElapsed;
var brush=true;
var damage = 0;
var teeth =[15];
var plaques =[3];
var period = 1;//plaq spawn (sec)
var start = new Date();
var player;
var braces;
var enemies;
var decayedTeeth = 0;
var maximumAllowedDecay =3;
var maxDamage =100;

function title(){
  // return "Hello";
}

function preload ()
{
  this.load.atlas('sprites','assests/sprites.png','assests/sprites.json');
  this.load.image('gums', 'assests/gums.png');
  this.load.image('braces','assests/braces.png');
}

function create (){ /////////////////////////////////////////////start create
  this.spaceKey = this.input.keyboard.addKey(32);
  this.input.keyboard.addKeyCapture([32]);

  let bg = this.add.sprite(0, 0, 'gums');
  bg.setOrigin(0,0);

  teeth[0]= this.add.sprite(50, 175, 'sprites','spritesheet_20.png');
  teeth[1]=this.add.sprite(150, 155, 'sprites','spritesheet_20.png');
  teeth[2]=this.add.sprite(250, 145, 'sprites','spritesheet_20.png');
  teeth[3]=this.add.sprite(350, 135, 'sprites','spritesheet_20.png');
  teeth[4]=this.add.sprite(450, 135, 'sprites','spritesheet_20.png');
  teeth[5]=this.add.sprite(550, 145, 'sprites','spritesheet_20.png');
  teeth[6]=this.add.sprite(650, 155, 'sprites','spritesheet_20.png');
  teeth[7]=this.add.sprite(750, 175, 'sprites','spritesheet_20.png');
  teeth[8]=this.add.sprite(50, 455, 'sprites','spritesheet_21.png');
  teeth[9]=this.add.sprite(150, 430, 'sprites','spritesheet_21.png');
  teeth[10]=this.add.sprite(250, 420, 'sprites','spritesheet_21.png');
  teeth[11]=this.add.sprite(350, 410, 'sprites','spritesheet_21.png');
  teeth[12]=this.add.sprite(450, 410, 'sprites','spritesheet_21.png');
  teeth[13]=this.add.sprite(550, 420, 'sprites','spritesheet_21.png');
  teeth[14]=this.add.sprite(650, 430, 'sprites','spritesheet_21.png');
  teeth[15]=this.add.sprite(750, 455, 'sprites','spritesheet_21.png');

  for (let i = 0; i < teeth.length-1; i++) {
    var toof=teeth[i];
    toof.dirty=false;
    toof.spawned=false;    
    toof.plaques=[];
  }

  plaques[0] ='spritesheet_30.png';
  plaques[1] ='spritesheet_31.png';
  plaques[2] ='spritesheet_32.png';
  plaques[3] ='spritesheet_33.png';

  player = this.physics.add.sprite(200, 450, 'sprites','spritesheet_01.png');
  player.enableBody = true;
  player.body.collideWorldBounds = true;
  player.body.gravity.y = 300;
  player.setScale(4);
  player.depth = 50;

  braces = this.physics.add.sprite(0, 0, 'braces');
  braces.setOrigin(0,0);
  braces.enableBody = true;
  braces.body.allowGravity = false;
  braces.body.immovable = true;

  // enemy group (baddies)
  enemies = this.physics.add.group();
  enemies.enableBody = true;
  enemies.physicsBodyType = Phaser.Physics.ARCADE;

  this.anims.create({
    key: 'walk',
    repeat : -1,
    frameRate: 5,
    frames: this.anims.generateFrameNames('sprites', {
        prefix: 'spritesheet_',
        suffix: '.png',
        start: 3,
        end: 4,
        zeroPad: 2
        })
    })
  
  this.anims.create({
    key: 'chew',
    repeat : -1,
    frameRate: 5,
    frames: this.anims.generateFrameNames('sprites', {
        prefix: 'spritesheet_',
        suffix: '.png',
        start: 11,
        end: 13,
        zeroPad: 2
        })
    });
  
  this.anims.create({
    key: 'idleBrush',
    repeat : -1,
    frameRate: 5,
    frames: this.anims.generateFrameNames('sprites', {
        prefix: 'spritesheet_',
        suffix: '.png',
        start: 5,
        end: 6,
        zeroPad: 2
        })
    });

  this.anims.create({
    key: 'walkBrush',
    repeat : -1,
    frameRate: 5,
    frames: this.anims.generateFrameNames('sprites', {
        prefix: 'spritesheet_',
        suffix: '.png',
        start: 9,
        end: 10,
        zeroPad: 2
        })
    });

  this.anims.create({
    key: 'idleSword',
    repeat : -1,
    frameRate: 5,
    frames: this.anims.generateFrameNames('sprites', {
        prefix: 'spritesheet_',
        suffix: '.png',
        start: 14,
        end: 15,
        zeroPad: 2
        })
    });

  this.anims.create({
    key: 'walkSword',
    repeat : -1,
    frameRate: 5,
    frames: this.anims.generateFrameNames('sprites', {
        prefix: 'spritesheet_',
        suffix: '.png',
        start: 16,
        end: 17,
        zeroPad: 2
        })
    });

    this.anims.create({
      key: 'scrub',
      repeat : 0,
      frameRate: 5,
      hideOnComplete: true,
      frames: this.anims.generateFrameNames('sprites', {
          prefix: 'spritesheet_',
          suffix: '.png',
          start: 23,
          end: 28,
          zeroPad: 2
          })
      });

    cursors = this.input.keyboard.createCursorKeys();
}/////////////////////////////////////////////////////////////////////end create

function flash(ctx){
  ctx.cameras.main.shake(200,5); //doesn't shake, just flashes bg
}

//MAKE THIS COMPATIBLE W ALL ENEMIES 
function collideEnemy(badKid) {
    if(badKid.body.touching.left) {
      badKid.x =badKid.x +150;
    } else if (badKid.body.touching.right) {
      badKid.x =badKid.x -150;
    } else if (badKid.body.touching.up) {
      badKid.y =badKid.y+150;	
    } else if (badKid.body.touching.down) {
      badKid.y=badKid.y -120;
    }
}

function genPlaq(teeth,tooth,ctx){
  if(teeth[tooth] && teeth[tooth].visible){
    //add a new plaque within tooth bounds 
    var toof = teeth[tooth];
    var t = toof.getBounds();
    var p=plaques[Math.floor(Math.random() * plaques.length)];
    var px=(Math.floor((Math.random()*1)*100)+t.x);
    var py=(Math.floor((Math.random()*1)*100)+t.y);
    var grimeyName = px+'_'+py;
    grimeyName = ctx.add.sprite(px, py, 'sprites', p);
    if(toof.plaques){
      if(toof.plaques.length >=1){
        toof.plaques[toof.plaques.length+1]= grimeyName;
      }else{
        toof.plaques[toof.plaques.length]= grimeyName;
      }
    }
     if (toof.spawned && toof.plaques){
      //remove the tooth and its plaque
      toof.visible=false;
      if(toof.plaques.length>0){
          toof.plaques.forEach(element => {
            element.visible=false;
          })
        }
      decayedTeeth++;
      teeth.splice(teeth[tooth], 1);
    }
    if (toof.dirty){
      baddieSpawn(px,py,ctx);
      toof.spawned = true;
      toof.tintBottomLeft=10000;
     }
    toof.dirty = true;
  }
}

function baddieSpawn(x,y,ctx){
  var e = enemies.create(x, y, 'enemy');
  e.name = 'enemy'+x+"_"+y;
  e.setScale(3.5);
  e.body.collideWorldBounds = true;
  e.body.velocity.x = -250; 
  e.beenHit=0;
}

function update() { ////////////////////////////////////////////////////////// update
  var timeElapsed = new Date();
  var delta = (timeElapsed.getSeconds() - start.getSeconds());
  if(delta < 0){
    start = new Date();
  }

  if(delta >= period && decayedTeeth <= maximumAllowedDecay){
    var tooth=Math.floor(Math.random() * teeth.length);
    genPlaq(teeth,tooth,this);
    start = new Date();
  }

  if(decayedTeeth > maximumAllowedDecay || damage >= maxDamage){
    //game over
    //this.scene.start('endGame');???
  }

  if (enemies.children.entries.length >= 1){
    var badKids=enemies.getChildren();
    for(let i = 0; i< badKids.length; i++) {
      if (this.physics.overlap(player, badKids[i])==true){
        this.cameras.main.setBackgroundColor('#ff0000');
        collideEnemy(badKids[i]);
        damage++;
          if(player.anims.currentAnim.key=='walkSword'){
            badKids[i].beenHit++;
            if (badKids[i].beenHit >=3){
              badKids[i].destroy();
              this.cameras.main.setBackgroundColor(config.backgroundColor);
            }
          }
      }else{
        this.cameras.main.setBackgroundColor(config.backgroundColor);
      }
      if(badKids[i]){
        badKids[i].anims.play('chew', true);
      //if below or above boundary, reverse speed(direction)
        if (badKids[i].body.x==0){ 
          badKids[i].body.velocity.x =250;
          badKids[i].flipX = true;
        }
        if(badKids[i].body.x >= config.width-120){
          badKids[i].body.velocity.x = -250;
          badKids[i].flipX = false;
        }
      }
    }
  }

  if(teeth.length >=1){
  //scrub if over a tooth that has plaque and player is idling with brush near tooth's origin
    // for(let i = 0; i< teeth.length; i++) {
  //if ((this.physics.overlap(player, teeth[i])==true) &&(player.body.velocity.x==0) && (brush==true) && (teeth[i].plaques["length"]>0)){        
      //Scrub off plaque from tooth
      // var cloud = this.add.sprite(teeth[0].getCenter().x, teeth[0].getCenter().y, 'sprites','spritesheet_23.png');
      // cloud.anims.play('scrub');
    //}
  }

  if (this.physics.overlap(player, braces)){
    //
  }

 if (Phaser.Input.Keyboard.JustDown(this.spaceKey)){
      brush=!brush;
  }

  ///////brush-state/////////////////
  if (cursors.left.isDown && brush == true){
    player.body.setVelocityX(-325);
    player.anims.play('walkBrush', true);
    player.flipX = true; // flip sprite left
  }else if (cursors.right.isDown && brush == true){
    player.body.setVelocityX(325);
    player.anims.play('walkBrush', true);
    player.flipX = false; // use original sprite orientation
  }else if (brush == true){
    player.body.setVelocityX(0);
    player.anims.play('idleBrush', true);
  }
  if(cursors.up.isDown && player.body.onFloor() && brush == true){
    player.body.setVelocityY(-600); //jump
  }
  ///////sword-state///////////////////
  if (cursors.left.isDown && brush == false){
    player.body.setVelocityX(-325);
    player.anims.play('walkSword', true); 
    player.flipX = true; 
  }else if (cursors.right.isDown && brush == false){
    player.body.setVelocityX(325);
    player.anims.play('walkSword', true);
    player.flipX = false; 
  }else if(brush == false){
    player.body.setVelocityX(0);
    player.anims.play('idleSword', true);
  }
  if(cursors.up.isDown && player.body.onFloor() && brush == false){
    player.body.setVelocityY(-600); 
  }
}

function endGame(){
//
}