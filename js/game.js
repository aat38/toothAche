import TitleScene from './TitleScene.js';
import GameScene from './GameScene.js';
import EndScene from './EndScene.js';

//create game scenes
var titleScene = new TitleScene();
var gameScene = new GameScene();
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
          gravity: {y: 500},
          debug: false
      }
    }
  };

//start new game  
var game = new Phaser.Game(config);

//load scenes
game.scene.add('titleScene', TitleScene);
game.scene.add("game", GameScene);
game.scene.add("endScene", EndScene);

//start title
game.scene.start('titleScene');