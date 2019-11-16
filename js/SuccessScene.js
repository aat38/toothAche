class SuccessScene extends Phaser.Scene {

    constructor() {
        super({ key: 'success' });
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
    }

    create() {
        var shadowS = this.add.image(400, 410, 'tooth');
        shadowS.setScale(1.5);
        shadowS.tint = 100;

        var toothS = this.add.image(400, 400, 'tooth');
        toothS.setScale(1.5);
        toothS.setInteractive();
        toothS.on('pointerdown', () => this.clickButton());

        var txtS = this.add.bitmapText(290, 200, 'carrier_command', 'Success!', 25);
        var textS = this.add.bitmapText(310, 350, 'carrier_command'," Click when \n\n  ready to \n\nstart day " + (this.day+1),13);
        textS.tint = 0xFFA500;
    }
}

export default SuccessScene;