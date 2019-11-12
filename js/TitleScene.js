class TitleScene extends Phaser.Scene {

    constructor() {
        super({ key: 'titleScene' });
    }
    clickButton() {
        //create tween? 400->410->400
        this.tooth.y = 410;
        this.text.y=370;
        this.scene.switch('gameScene');
    }
    
    init() {
        var tooth;
        var text;
    }

    preload() {
        this.load.image('tooth', 'assests/spritesheet_22.png');
        this.load.image('title', 'assests/title.png');
    }

    create() {
        var title = this.add.image(0, 0, 'title');
        title.setOrigin(0, 0);

        var shadow = this.add.image(400, 410, 'tooth');
        shadow.setScale(1.5);
        shadow.tint = 100;

        this.tooth = this.add.image(400, 400, 'tooth');
        this.tooth.setScale(1.5);
        this.tooth.setInteractive();
        this.tooth.on('pointerdown', () => this.clickButton());

        this.text = this.add.text(340, 360, "\t Click to \nGet Scrubbin");
        this.text.setFill('#ffa500')
        this.text.setStroke('#ffa500', 2.5)
    }
}

export default TitleScene;