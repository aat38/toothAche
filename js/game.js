import TitleScene from './TitleScene.js';
import StrucScene from './StrucScene.js';
import GameScene from './GameScene.js';
import SuccessScene from './SuccessScene.js';
import EndScene from './EndScene.js';

//create game scenes
var titleScene = new TitleScene();
var strucScene = new StrucScene();
var gameScene = new GameScene();
var success = new SuccessScene();
var endScene = new EndScene();


var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#00D7FB",
  pixelArt: true,
  onVisible: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: false
    }
  },
  audio: {
    disableWebAudio: true
  }
};

//start new game  
var game = new Phaser.Game(config);

//load scenes
game.scene.add('titleScene', TitleScene);
game.scene.add('strucScene', StrucScene); //instructions screen
game.scene.add("gameScene", GameScene);
game.scene.add('success', SuccessScene);
game.scene.add("endScene", EndScene);

//start title
game.scene.start('titleScene', game);