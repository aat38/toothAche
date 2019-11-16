class EndScene extends Phaser.Scene {

    constructor() {
        super({ key: 'endScene' });
    }
    clickButton() {
        this.scene.start('gameScene', [this.game, this.day]);
    }
    init(config) {
        this.game = config[0];
        this.day = config[1];
    }

    preload() {
        this.load.image('tooth', 'assests/spritesheet_22.png');
        this.load.bitmapFont('carrier_command', 'assests/font/carrier_command.png', 'assests/font/text.xml');
    }

    create() {
        var shadowF = this.add.image(400, 410, 'tooth');
        shadowF.setScale(1.5);
        shadowF.tint = 100;

        var toothF = this.add.image(400, 400, 'tooth');
        toothF.setScale(1.5);
        toothF.setInteractive();
        toothF.on('pointerdown', () => this.clickButton());

        var txtF = this.add.bitmapText(310, 100, 'carrier_command', 'Oh no!', 25);
        var txtF2 = this.add.bitmapText(75, 200, 'carrier_command', "You\'ve lost on day " + this.day + " :(", 25);
        var textF = this.add.bitmapText(310, 350, 'carrier_command', " Click to \n\nplay again", 15);
        this.day = 0;
        textF.tint = 0xFFA500;
    }
}

export default EndScene;