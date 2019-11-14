class TitleScene extends Phaser.Scene {

    constructor() {
        super({ key: 'titleScene' });
    }

    init(data) {
        this.game = data;
        this.start = new Date();
        this.tooth;
        this.player;
        this.plaque;
        this.baddie;
        this.mus;
    }

    preload() {
        this.load.atlas('sprites', 'assests/sprites.png', 'assests/sprites.json');
        this.load.image('tooth', 'assests/spritesheet_22.png');
        this.load.image('title', 'assests/title.png');
        this.load.image('plaque', 'assests/spritesheet_32.png');
        this.load.audio('song', 'assests/audio/DJ Nervous - Lurking.mp3')
    }

    create() {
        this.mus = this.sound.add('song', this.config);
        this.mus.play();

        var title = this.add.sprite(250, 0, 'title');
        this.tweens.add({
            //title swing in 
            targets: title,
            props: {
                x: { value: '+=150', duration: 3000, ease: 'Power4' },
                y: { value: '300', duration: 1500, ease: 'Bounce.easeOut' }
            },
            repeat: 0
        });

        //tooth & plaque fade in 
        this.tooth = this.add.sprite(400, 400, 'tooth');
        this.tooth.alpha = 0;

        this.plaque = this.add.sprite(400, 390, 'plaque');
        this.plaque.alpha = 0;
        this.plaque.setScale(2);

        //create baddie and player
        this.baddie = this.add.sprite(-60, 410, 'sprites', 'spritesheet_11.png');
        this.baddie.setScale(4);
        this.baddie.flipX = true;

        this.player = this.add.sprite(-60, 410, 'sprites', 'spritesheet_01.png');
        this.player.setScale(4);

        //baddie anim
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
            repeat: 4,
            frameRate: 5,
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

        //cloud anim
        this.anims.create({
            key: 'cloud',
            repeat: 1,
            frameRate: 7,
            frames: this.anims.generateFrameNames('sprites', {
                prefix: 'spritesheet_',
                suffix: '.png',
                start: 23,
                end: 26,
                zeroPad: 2
            }),
        });
    }

    update() {
        var timeElapsed = new Date();
        var delta = (timeElapsed.getSeconds() - this.start.getSeconds());

        //resume music if click off screen
        // if (this.sound.context.state === 'suspended') {
        //     this.sound.context.resume();
        // }

        //if plaque:
        if (this.plaque.active) {
            //bring in tooth
            if (delta >= 1.5 && this.tooth.alpha <= 1) {
                this.tooth.alpha += .02;
            }
            //bring in plaque
            if (delta > 2 && this.plaque.alpha <= 1) {
                this.plaque.alpha += .02;
            }

            //bring in player
            if (this.plaque.alpha == 1 && this.player.x < 370) {
                this.player.play('walkBrush', true);
                this.player.x += 3.5;
            }

            //player scrubs off plaque
            if (this.player.x > 370) {
                this.player.play('scrubBrush', true);
                this.plaque.play('cloud', true);
                this.plaque.on('animationcomplete', this.destroy, this);
            }
        }

        if (this.baddie.x > -50 && this.baddie.x < 59) {
            this.baddie.x += 2.5;
        }

        if (this.baddie.x == 60) {
            var t = this.tweens.add({
                targets: this.player,
                duration: 100,
                scaleX: 5,
                scaleY: 5,
                yoyo: true
            });
            t._onCompleteCallback = this.playerWalk();
        }

        if (this.player.x > 340 && this.baddie.x > 60) {
            this.player.play('walkBrush', true);
            this.player.x += 4.5;
            this.baddie.x += 4.5;
        }

        if (this.baddie.x > 830) {
            this.tweens.add({
                targets: this.tooth,
                duration: 400,
                scaleX: 2,
                scaleY: 2
            });
        }

        if (this.tooth.active) {
            if (this.tooth._scaleX >= 1.99) {
                this.tooth.active = false;
                var shadow = this.add.image(400, 410, 'tooth');
                shadow.setScale(2);
                shadow.tint = 100;
                shadow.depth -= 1;

                this.tooth.setInteractive();
                this.tooth.on('pointerdown', () => this.clickButton());

                var text = this.add.text(340, 360, "\t Click to \nGet Scrubbin");
                text.setFill('#ffa500')
                text.setStroke('#ffa500', 2.5)
            }
        }
    }

    destroy() {
        this.plaque.destroy();
        this.player.play('idleBrush', true);
        this.player.x = 340;
        this.player.y = 400;
        this.enemyEnter();
    }

    enemyEnter() {
        this.baddie.x = -45;
        this.baddie.play('chew', true);
    }

    playerWalk() {
        this.player.x += 3.5;
        this.baddie.x += 3.5;
    }

    clickButton() {
        this.scene.start('gameScene', this.game);
    }
}

export default TitleScene;