class GameScene extends Phaser.Scene {

    constructor() {
        super({ key: 'gameScene' });
    }
    init() { /////////////////////////////////////////////////////////////////////////////////////
        this.cursors;
        this.spaceKey;
        this.timeElapsed;
        this.brush = true;
        this.damage = 0;
        this.teeth = [];
        this.plaques = [];
        this.period = 1;//plaq spawn (sec)
        this.start = new Date();
        this.player;
        this.braces;
        this.enemies;
        this.decayedTeeth = 0;
        this.maximumAllowedDecay = 3;
        this.maxDamage = 100;
    }

    preload() { /////////////////////////////////////////////////////////////////////////////////
        this.load.atlas('sprites', 'assests/sprites.png', 'assests/sprites.json');
        this.load.image('gums', 'assests/gums.png');
        this.load.image('braces', 'assests/braces.png');
    }

    create() {  /////////////////////////////////////////////////////////////////////////////////
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(32);
        this.timeElapsed = this.timeElapsed;
        let bg = this.add.sprite(0, 0, 'gums');
        bg.setOrigin(0, 0);

        this.teeth[0] = this.add.sprite(50, 175, 'sprites', 'spritesheet_20.png');
        this.teeth[1] = this.add.sprite(150, 155, 'sprites', 'spritesheet_20.png');
        this.teeth[2] = this.add.sprite(250, 145, 'sprites', 'spritesheet_20.png');
        this.teeth[3] = this.add.sprite(350, 135, 'sprites', 'spritesheet_20.png');
        this.teeth[4] = this.add.sprite(450, 135, 'sprites', 'spritesheet_20.png');
        this.teeth[5] = this.add.sprite(550, 145, 'sprites', 'spritesheet_20.png');
        this.teeth[6] = this.add.sprite(650, 155, 'sprites', 'spritesheet_20.png');
        this.teeth[7] = this.add.sprite(750, 175, 'sprites', 'spritesheet_20.png');
        this.teeth[8] = this.add.sprite(50, 455, 'sprites', 'spritesheet_21.png');
        this.teeth[9] = this.add.sprite(150, 430, 'sprites', 'spritesheet_21.png');
        this.teeth[10] = this.add.sprite(250, 420, 'sprites', 'spritesheet_21.png');
        this.teeth[11] = this.add.sprite(350, 410, 'sprites', 'spritesheet_21.png');
        this.teeth[12] = this.add.sprite(450, 410, 'sprites', 'spritesheet_21.png');
        this.teeth[13] = this.add.sprite(550, 420, 'sprites', 'spritesheet_21.png');
        this.teeth[14] = this.add.sprite(650, 430, 'sprites', 'spritesheet_21.png');
        this.teeth[15] = this.add.sprite(750, 455, 'sprites', 'spritesheet_21.png');

        for (let i = 0; i < this.teeth.length - 1; i++) {
            var toof = this.teeth[i];
            toof.dirty = false;
            toof.spawned = false;
            toof.plaques = [];
        }

        this.plaques[0] = 'spritesheet_30.png';
        this.plaques[1] = 'spritesheet_31.png';
        this.plaques[2] = 'spritesheet_32.png';
        this.plaques[3] = 'spritesheet_33.png';

        this.player = this.physics.add.sprite(400, 300, 'sprites', 'spritesheet_01.png');
        this.player.enableBody = true;
        this.player.body.collideWorldBounds = true;
        this.player.body.gravity.y = 1000;
        this.player.setScale(4);
        this.player.depth = 50;

        this.braces = this.physics.add.sprite(0, 0, 'braces');
        this.braces.setOrigin(0, 0);
        this.braces.enableBody = true;
        this.braces.body.allowGravity = false;
        this.braces.body.immovable = true;

        //platform group creation 
        this.tiles = this.physics.add.group();
        this.tiles.enableBody = true;
        this.tiles.physicsBodyType = Phaser.Physics.ARCADE;
        this.tileCreate(this);

        //enemy group creation (baddies)
        this.enemies = this.physics.add.group();
        this.enemies.enableBody = true;
        this.enemies.physicsBodyType = Phaser.Physics.ARCADE;

        //enable interaction between platforms and player/baddies
        this.physics.add.collider(this.tiles, this.player);
        this.physics.add.collider(this.tiles, this.enemies);

        //player anim
        this.anims.create({
            key: 'walk',
            repeat: -1,
            frameRate: 5,
            frames: this.anims.generateFrameNames('sprites', {
                prefix: 'spritesheet_',
                suffix: '.png',
                start: 3,
                end: 4,
                zeroPad: 2
            })
        })

        //player anim
        this.anims.create({
            key: 'idleBrush',
            repeat: -1,
            frameRate: 5,
            frames: this.anims.generateFrameNames('sprites', {
                prefix: 'spritesheet_',
                suffix: '.png',
                start: 5,
                end: 6,
                zeroPad: 2
            })
        });

        //player anim
        this.anims.create({
            key: 'walkBrush',
            repeat: -1,
            frameRate: 5,
            frames: this.anims.generateFrameNames('sprites', {
                prefix: 'spritesheet_',
                suffix: '.png',
                start: 9,
                end: 10,
                zeroPad: 2
            })
        });

        //player anim
        this.anims.create({
            key: 'scrubBrush',
            repeat: 0,
            frameRate: 5,
            hideOnComplete: true,
            frames: this.anims.generateFrameNames('sprites', {
                prefix: 'spritesheet_',
                suffix: '.png',
                start: 7,
                end: 8,
                zeroPad: 2
            })
        });

        //player anim
        this.anims.create({
            key: 'idleSword',
            repeat: -1,
            frameRate: 5,
            frames: this.anims.generateFrameNames('sprites', {
                prefix: 'spritesheet_',
                suffix: '.png',
                start: 14,
                end: 15,
                zeroPad: 2
            })
        });

        //player anim
        this.anims.create({
            key: 'walkSword',
            repeat: -1,
            frameRate: 5,
            frames: this.anims.generateFrameNames('sprites', {
                prefix: 'spritesheet_',
                suffix: '.png',
                start: 16,
                end: 17,
                zeroPad: 2
            })
        });

        //tooth paste effect
        this.anims.create({
            key: 'cloud',
            repeat: 0,
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

        //enemy anim
        this.anims.create({
            key: 'chew',
            repeat: -1,
            frameRate: 5,
            frames: this.anims.generateFrameNames('sprites', {
                prefix: 'spritesheet_',
                suffix: '.png',
                start: 11,
                end: 13,
                zeroPad: 2
            })
        });
    }

    update() { //////////////////////////////////////////////////////////////////////////////////

        var timeElapsed = new Date();
        var delta = (timeElapsed.getSeconds() - this.start.getSeconds());
        if (delta < 0) {
            this.start = new Date();
        }

        if (delta >= this.period && this.decayedTeeth <= this.maximumAllowedDecay) {
            var tooth = Math.floor(Math.random() * this.teeth.length);
            this.genPlaq(this.teeth, tooth, this);
            this.start = new Date();
        }

        if (this.enemies.children.entries.length >= 1) {
            var badKids = this.enemies.getChildren();
            for (let i = 0; i < badKids.length; i++) {
                if (this.physics.overlap(this.player, badKids[i]) == true) {
                    this.cameras.main.setBackgroundColor('#ff0000');
                    this.collideEnemy(badKids[i]);
                    this.damage++;
                    if (this.player.anims.currentAnim.key == 'walkSword') {
                        badKids[i].beenHit++;
                        if (badKids[i].beenHit >= 3) {
                            badKids[i].destroy();
                            this.cameras.main.setBackgroundColor("#00D7FB");
                        }
                    }
                } else {
                    this.cameras.main.setBackgroundColor("#00D7FB");
                }
                if (badKids[i]) {
                    badKids[i].anims.play('chew', true);
                    //if below or above boundary, reverse speed(direction)
                    if (badKids[i].body.x == 0) {
                        badKids[i].body.velocity.x = 250;
                        badKids[i].flipX = true;
                    }
                    if (badKids[i].body.x >= 800 - 120) {
                        badKids[i].body.velocity.x = -250;
                        badKids[i].flipX = false;
                    }
                }
            }
        }

        if (this.teeth.length >= 1) {
            //scrub if over a tooth that has plaque and player is idling with brush near tooth's origin
            // for(let i = 0; i< teeth.length; i++) {
            //if ((this.physics.overlap(player, teeth[i])==true) &&(player.body.velocity.x==0) && (brush==true) && (teeth[i].plaques["length"]>0)){        
            //Scrub off plaque from tooth
            // var cloud = this.add.sprite(teeth[0].getCenter().x, teeth[0].getCenter().y, 'sprites','spritesheet_23.png');
            // cloud.anims.play('scrub');
            //}
        }

        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.brush = !this.brush;
        }

        ///////brush-state/////////////////
        if (this.cursors.left.isDown && this.brush == true) {
            this.player.body.setVelocityX(-325);
            this.player.anims.play('walkBrush', true);
            this.player.flipX = true; // flip sprite left
        } else if (this.cursors.right.isDown && this.brush == true) {
            this.player.body.setVelocityX(325);
            this.player.anims.play('walkBrush', true);
            this.player.flipX = false; // use original sprite orientation
        } else if (this.brush == true) {
            this.player.body.setVelocityX(0);
            this.player.anims.play('idleBrush', true);
        }
        if (this.cursors.up.isDown && this.player.body.checkCollision.down && this.brush == true) {
            this.player.body.setVelocityY(-300); //jump
        }

        ///////sword-state///////////////////
        if (this.cursors.left.isDown && this.brush == false) {
            this.player.body.setVelocityX(-325);
            this.player.anims.play('walkSword', true);
            this.player.flipX = true;
        } else if (this.cursors.right.isDown && this.brush == false) {
            this.player.body.setVelocityX(325);
            this.player.anims.play('walkSword', true);
            this.player.flipX = false;
        } else if (this.brush == false) {
            this.player.body.setVelocityX(0);
            this.player.anims.play('idleSword', true);
        }
        if (this.cursors.up.isDown && this.player.body.checkCollision.down && this.brush == false) {
            this.player.body.setVelocityY(-300);
        }
        if (this.decayedTeeth > this.maximumAllowedDecay || this.damage >= this.maxDamage) {
            //game over
            this.endGame()
        }
    }

    //functions//////////////////////////////////////////////////////////////////////////////////
    collideEnemy(badKid) {
        if (badKid.body.touching.left) {
            badKid.x = badKid.x + 150;
        } else if (badKid.body.touching.right) {
            badKid.x = badKid.x - 150;
        } else if (badKid.body.touching.up) {
            badKid.y = badKid.y + 150;
        } else if (badKid.body.touching.down) {
            badKid.y = badKid.y - 120;
        }
    }

    genPlaq(teeth, tooth, ctx) {
        if (ctx.teeth[tooth] && ctx.teeth[tooth].visible) {
            //add a new plaque within tooth bounds 
            var toof = ctx.teeth[tooth];
            var t = toof.getBounds();
            var p = ctx.plaques[Math.floor(Math.random() * ctx.plaques.length)];
            var px = (Math.floor((Math.random() * 1) * 100) + t.x);
            var py = (Math.floor((Math.random() * 1) * 100) + t.y);
            var grimeyName = px + '_' + py;
            grimeyName = ctx.add.sprite(px, py, 'sprites', p);
            if (toof.plaques) {
                if (toof.plaques.length >= 1) {
                    toof.plaques[toof.plaques.length + 1] = grimeyName;
                } else {
                    toof.plaques[toof.plaques.length] = grimeyName;
                }
            }
            if (toof.spawned && toof.plaques) {
                //remove the tooth and its plaque
                toof.visible = false;
                if (toof.plaques.length > 0) {
                    toof.plaques.forEach(element => {
                        element.visible = false;
                    })
                }
                ctx.decayedTeeth++;
                ctx.teeth.splice(ctx.teeth[tooth], 1);
            }
            if (toof.dirty) {
                this.baddieSpawn(px, py, ctx);
                toof.spawned = true;
                toof.tintBottomLeft = 10000;
            }
            toof.dirty = true;
        }
    }

    baddieSpawn(x, y, ctx) {
        var e = ctx.enemies.create(x, y - 100, 'enemy');
        e.name = 'enemy' + x + "_" + y;
        e.setScale(3.5);
        e.body.collideWorldBounds = true;
        e.body.setBounce(.8);
        e.body.gravity.y = 800;
        e.body.velocity.x = -250;
        e.beenHit = 0;
    }

    //painfully create the platform -.- //
    tileCreate(ctx) {
        var x = -30;
        var y = 450;
        for (var i = 1; i <= 70; i++) {
            var t = ctx.tiles.create(x, y, 1, 1, 'gums');
            t.setScale(.5);
            t.alpha = 0;
            t.body.immovable = true;
            t.body.allowGravity = false;
            x += 15;
        }
        x = 0;
        y = 220;
        for (var j = 1; j <= 6; j++) {
            var t = ctx.tiles.create(x, y, 1, 1, 'gums');
            t.setScale(.5);
            t.alpha = 0;
            t.body.immovable = true;
            t.body.allowGravity = false;
            x += 15;
        }
        x = 215;
        y = 200;
        for (var k = 1; k <= 24; k++) {
            var t = ctx.tiles.create(x, y, 1, 1, 'gums');
            t.setScale(.5);
            t.alpha = 0;
            t.body.immovable = true;
            t.body.allowGravity = false;
            x += 15;
        }
        x = 715;
        y = 220;
        for (var l = 1; l <= 7; l++) {
            var t = ctx.tiles.create(x, y, 1, 1, 'gums');
            t.setScale(.5);
            t.alpha = 0;
            t.body.immovable = true;
            t.body.allowGravity = false;
            x += 15;
        }
    }

    endGame() {
        this.scene.start('endScene');
    }
}

export default GameScene;