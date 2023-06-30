import Phaser from 'phaser'


const GAME_CONFIG: Phaser.Types.Core.GameConfig = {
    parent: 'game',
    scale: {
        mode: Phaser.Scale.RESIZE,
    },
    scene: [],
    backgroundColor: 0xffffff,
    physics: {
        default: 'arcade',
    },
}

export default GAME_CONFIG