class StrucScene extends Phaser.Scene {

    constructor() {
        super({ key: 'strucScene' });
    }

    init(data) {
        this.game = data;
        this.t
    }

    preload() {
        this.load.atlas('sprites', 'assests/sprites.png', 'assests/sprites.json');
        this.load.image('tooth', 'assests/spritesheet_22.png');
        this.load.bitmapFont('carrier_command', 'assests/font/carrier_command.png', 'assests/font/text.xml');
    }

    create() {
        this.anims.create({
            key: 'scrubB',
            repeat: -1,
            frameRate: 3,
            frames: this.anims.generateFrameNames('sprites', {
                prefix: 'spritesheet_',
                suffix: '.png',
                start: 7,
                end: 8,
                zeroPad: 2
            })
        });
        this.anims.create({
            key: 'jump',
            repeat: -1,
            frameRate: 3,
            frames: this.anims.generateFrameNames('sprites', {
                prefix: 'spritesheet_',
                suffix: '.png',
                start: 1,
                end: 2,
                zeroPad: 2
            })
        });
        this.anims.create({
            key: 'weapon',
            repeat: -1,
            frameRate: 3,
            frames: this.anims.generateFrameNames('sprites', {
                prefix: 'spritesheet_',
                suffix: '.png',
                start: 14,
                end: 15,
                zeroPad: 2
            })
        });
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

        var instru = this.add.bitmapText(20, 20, 'carrier_command', '  Defend the mouth from \n\n   monsters before bed', 25);

        //switch weapon 
        var weap = this.add.bitmapText(50, 230, 'carrier_command', 'space = switch weapon', 19);
        var playerSpaceKey = this.add.sprite(685, 240, 'sprites', 'spritesheet_01.png');
        playerSpaceKey.setScale(2);
        playerSpaceKey.play('weapon', true);

        //move
        var move = this.add.bitmapText(50, 330, 'carrier_command', 'L and R keys = walk', 19);
        var playerMove = this.add.sprite(685, 340, 'sprites', 'spritesheet_01.png');
        playerMove.setScale(2);
        playerMove.play('walk', true);

        //jump 
        var jump = this.add.bitmapText(50, 430, 'carrier_command', 'up key = jump', 19);
        var playerJ = this.add.sprite(685, 440, 'sprites', 'spritesheet_01.png');
        playerJ.setScale(2);
        playerJ.play('jump', true);

        //scrub
        var scrub = this.add.bitmapText(50, 530, 'carrier_command', 'down key = scrub', 19);
        var playerScrub = this.add.sprite(685, 540, 'sprites', 'spritesheet_01.png');
        playerScrub.setScale(2);
        playerScrub.play('scrubB', true);
        playerScrub.flipX = true;

        //create tooth button
        var shadow = this.add.image(400, 158, 'tooth');
        shadow.tint = 100;
        shadow.setScale(.5);
        this.t = this.add.sprite(400, 150, 'tooth');
        this.t.setInteractive();
        this.t.setScale(.5)
        this.t.on('pointerdown', () => this.clickButton());
        var text = this.add.bitmapText(378, 142, 'carrier_command', "\tPlay", 10);
        text.tint = 0xFFA500;

    }

    clickButton() {
        var day = 0;
        this.scene.start('gameScene', [this.game, day]);
    }

}

export default StrucScene;