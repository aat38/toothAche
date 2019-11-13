class EndScene extends Phaser.Scene {

	constructor() {
		super({key:'endScene'});
    }
    clickButton() {
        this.tooth.y = 310;
        this.text.y=270;
        this.scene.switch('gameScene');
    }
    init() {
        var tooth;
        var text;
    }

    preload() {
        this.load.image('tooth', 'assests/spritesheet_22.png');
    }

    create() {
        var shadow = this.add.image(400, 310, 'tooth');
        shadow.setScale(1.5);
        shadow.tint = 100;

        this.tooth = this.add.image(400, 300, 'tooth');
        this.tooth.setScale(1.5);
        this.tooth.setInteractive();
        this.tooth.on('pointerdown', () => this.clickButton());

        this.text = this.add.text(310, 260, "Oh no! You\'ve lost.\n\t\t\t\t\t\t\t :( \nClick to play again");
        this.text.setFill('#ffa500');
        this.text.setStroke('#ffa500', 2.5);
    }
}

export default EndScene;