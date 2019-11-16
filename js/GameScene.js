class GameScene extends Phaser.Scene {

    constructor() {
        super({ key: 'gameScene' });
    }
    init(data) {
        //config
        this.game = data[0];
        this.game.config.backgroundColor.r = 0;
        this.game.config.backgroundColor.g = 215;
        this.game.config.backgroundColor.b = 251;
        this.cursors;
        this.spaceKey;
        //timing
        this.builtInTimer = 0;
        this.timeElapsed = 0;
        this.dusk = 140;
        this.spawnRate = 1;
        //health
        this.damage = 0;
        this.healthInd;
        this.hptext;
        this.healthPer = 100;
        this.maxDamage = 100;
        this.decayedTeeth = 0;
        this.maximumAllowedDecay = 3;
        //creation
        this.teeth = [];
        this.plaques = [];
        this.player = [];
        this.enemies = [];
        //state
        this.brush = true;
        this.day = data[1];
        this.end = false;
    }

    preload() { ///////////////////////////////////////////////////////////////////////////////////////
        this.load.atlas('sprites', 'assests/sprites.png', 'assests/sprites.json');
        this.load.image('gums', 'assests/gums.png');
        this.load.image('braces', 'assests/braces.png');
        this.load.bitmapFont('carrier_command', 'assests/font/carrier_command.png', 'assests/font/text.xml');
    }

    create() {  //////////////////////////////////////////////////////////////////////////////////////
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(32);

        this.day++;

        let bg = this.add.sprite(0, 0, 'gums');
        bg.setOrigin(0, 0);

        this.teeth[0] = this.physics.add.sprite(50, 175, 'sprites', 'spritesheet_20.png');
        this.teeth[1] = this.physics.add.sprite(150, 155, 'sprites', 'spritesheet_20.png');
        this.teeth[2] = this.physics.add.sprite(250, 145, 'sprites', 'spritesheet_20.png');
        this.teeth[3] = this.physics.add.sprite(350, 135, 'sprites', 'spritesheet_20.png');
        this.teeth[4] = this.physics.add.sprite(450, 135, 'sprites', 'spritesheet_20.png');
        this.teeth[5] = this.physics.add.sprite(550, 145, 'sprites', 'spritesheet_20.png');
        this.teeth[6] = this.physics.add.sprite(650, 155, 'sprites', 'spritesheet_20.png');
        this.teeth[7] = this.physics.add.sprite(750, 175, 'sprites', 'spritesheet_20.png');
        this.teeth[8] = this.physics.add.sprite(50, 455, 'sprites', 'spritesheet_21.png');
        this.teeth[9] = this.physics.add.sprite(150, 430, 'sprites', 'spritesheet_21.png');
        this.teeth[10] = this.physics.add.sprite(250, 420, 'sprites', 'spritesheet_21.png');
        this.teeth[11] = this.physics.add.sprite(350, 410, 'sprites', 'spritesheet_21.png');
        this.teeth[12] = this.physics.add.sprite(450, 410, 'sprites', 'spritesheet_21.png');
        this.teeth[13] = this.physics.add.sprite(550, 420, 'sprites', 'spritesheet_21.png');
        this.teeth[14] = this.physics.add.sprite(650, 430, 'sprites', 'spritesheet_21.png');
        this.teeth[15] = this.physics.add.sprite(750, 455, 'sprites', 'spritesheet_21.png');

        //enable physics characteristics for each tooth
        for (let i = 0; i < this.teeth.length; i++) {
            var toof = this.teeth[i];
            toof.enableBody = true;
            toof.body.allowGravity = false;
            toof.body.immovable = true;
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

        //can't figure out how to draw a damn rectangle so this is a workaround
        var outline = this.add.sprite(765, 587, 'sprites', 'spritesheet_01.png');
        outline.setScale(2.4);
        outline.tint = 10;
        this.healthInd = this.add.sprite(765, 586, 'sprites', 'spritesheet_01.png');
        this.healthInd.setScale(2);
        var htxt = this.add.bitmapText(521, 575, 'carrier_command', 'Health:', 15);
        this.hptext = this.add.bitmapText(651, 575, 'carrier_command', '' + this.healthPer + "%", 15);

        var braces = this.physics.add.sprite(0, 0, 'braces');
        braces.setOrigin(0, 0);
        braces.enableBody = true;
        braces.body.allowGravity = false;
        braces.body.immovable = true;

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

        //////////anims//////////////////////////////////////////////
        //other player anims still available via TitleScene imports//
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
        //tooth paste effect//
        this.anims.create({
            key: 'cloud',
            repeat: 0,
            frameRate: 8,
            hideOnComplete: true,
            frames: this.anims.generateFrameNames('sprites', {
                prefix: 'spritesheet_',
                suffix: '.png',
                start: 23,
                end: 27,
                zeroPad: 2
            })
        });
    }

    update() { ///////////////////////////////////////////////////////////////////////////////////////
        if (this.game.config.backgroundColor.r != this.dusk) {
            this.builtInTimer++;
            //changing color for time of day
            if (this.builtInTimer / 200 % 1 == 0) {
                this.game.config.backgroundColor.r = this.game.config.backgroundColor.r + 10;
                this.game.config.backgroundColor.g = this.game.config.backgroundColor.g - 10;
                this.game.config.backgroundColor.b = this.game.config.backgroundColor.b - 15;
                this.cameras.main.setBackgroundColor(this.game.config.backgroundColor);
            }
            //random plaque generation
            if ((this.builtInTimer / 50) % 1 == 0 && this.decayedTeeth <= this.maximumAllowedDecay) {
                var tooth = Math.floor(Math.random() * this.teeth.length);
                this.genPlaq(this.teeth, tooth, this);
            }
        }

        if (this.enemies.children.entries.length >= 1) {
            var badKids = this.enemies.getChildren();
            for (let i = 0; i < badKids.length; i++) {
                //checks to keep enemies in bounds//
                if (badKids[i].getBounds().x > this.game.width) {
                    badKids[i].body.x = badKids[i].body.x - 50;
                }
                if (badKids[i].getBounds().y > 550) {
                    badKids[i].body.y = badKids[i].body.y - 150;
                }
                if (this.physics.overlap(this.player, badKids[i]) == true) {
                    //indicate player is recieving damage
                    this.cameras.main.setBackgroundColor('#ff0000');
                    this.collideEnemy(badKids[i]);
                    if (this.player.anims.currentAnim.key == 'walkSword') {
                        //player is defending himself
                        badKids[i].beenHit++;
                        if (badKids[i].beenHit >= 3) {
                            badKids[i].destroy();
                            this.cameras.main.setBackgroundColor(this.game.config.backgroundColor);
                        }
                    } else {
                        //player is unprotected, so increase damage
                        this.damage++;
                        this.hptext.text = '' + (this.healthPer - this.damage) + "%";
                    }
                } else {
                    //no longer indicate player is recieving damage - return to normal
                    this.cameras.main.setBackgroundColor(this.game.config.backgroundColor);
                }
                if (badKids[i]) {
                    badKids[i].anims.play('chew', true);
                    //if below or above boundary, reverse speed and direction of baddie
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

        //change health indicator color
        if (this.damage <= 20) {
            this.healthInd.tint = 0x01FE03;//green
        } else if (this.damage <= 40) {
            this.healthInd.tint = 0xCBF003;//light green
        } else if (this.damage <= 60) {
            this.healthInd.tint = 0xCCFF00;//yellow
        } else if (this.damage <= 80) {
            this.healthInd.tint = 0xFFA500;//orange
        } else if (this.damage <= this.maxDamage) {
            this.healthInd.tint = 0xFF0000;//red death
        }

        //scrub if over a tooth that has plaque and player is idling with brush near tooth's origin
        if (this.teeth.length >= 1) {
            for (let i = 0; i < this.teeth.length; i++) {
                if ((this.physics.overlap(this.player, this.teeth[i]) == true) && (this.teeth[i].plaques.length > 0)) {
                    if (this.player.anims.currentAnim.key == 'scrubBrush') {
                        this.delPlaq(i, this);
                    }
                }
            }
        }

        //toggle weapon
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.brush = !this.brush;
        }

        ///////brush-state controls//////////////////////////
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
        if (this.cursors.down.isDown && this.brush == true) {
            this.player.body.setVelocityX(0);
            this.player.anims.play('scrubBrush', true);
            var cloud = this.add.sprite(this.player.body.x + 30, this.player.body.y + 25, 'gums'); //arbitrarily picked gums
            cloud.anims.play('cloud', true);
        }
        if (this.cursors.up.isDown && this.player.body.checkCollision.down && this.brush == true) {
            this.player.body.setVelocityY(-300); //jump
        }

        ///////sword-state controls///////////////////////////
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

        ///game state
        if (this.decayedTeeth > this.maximumAllowedDecay || this.damage >= this.maxDamage) {
            this.end = true;
            this.endGame();
        }

        if (this.game.config.backgroundColor.r == this.dusk) {
            this.baddieKill();
        }
    }

    //functions//////////////////////////////////////////////////////////////////////////////////
    //push back enemy on collide w player
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

    //Add a new plaque within tooth bounds 
    genPlaq(teeth, tooth, ctx) {
        if (ctx.teeth[tooth] && ctx.teeth[tooth].visible) {
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
            if (toof.spawned && toof.tintBottomLeft < 16777215) {
                //remove the tooth and its plaque if tooth is tinted
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

    //remove plaque within tooth bounds 
    delPlaq(num, ctx) {
        var t = ctx.teeth[num];
        if (t.plaques && t.visible) {
            if (t.plaques.length > 0) {
                t.plaques.forEach(element => {
                    element.visible = false;
                })
            }
            t.tintBottomLeft = 16777215; //<- "!dirty" tint value 
            t.plaques = [];
            t.dirty = false;
            ctx.teeth[num] = t;
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

    //Painfully create platforms -.- 
    tileCreate(ctx) {
        var x = -30;
        var y = 450;
        for (var i = 1; i <= 130; i++) {
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
        for (var l = 1; l <= 20; l++) {
            var t = ctx.tiles.create(x, y, 1, 1, 'gums');
            t.setScale(.5);
            t.alpha = 0;
            t.body.immovable = true;
            t.body.allowGravity = false;
            x += 15;
        }
    }

    baddieKill() {
        if (this.enemies.children.entries.length > 0) {
            var defenseText = this.add.bitmapText(70, 540, 'carrier_command', 'Finish off the monsters before bed!', 15);
        } else {
            if (this.end == false) {
                this.scene.start('success', [this.game, this.day]);
            }
        }
    }

    endGame() {
        this.scene.start('endScene', [this.game, this.day]);
    }
}

export default GameScene;