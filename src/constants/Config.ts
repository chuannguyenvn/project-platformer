import Phaser from 'phaser'
import BootScene from '../scenes/BootScene'
import LoadScene from '../scenes/LoadScene'


const GAME_CONFIG: Phaser.Types.Core.GameConfig = {
    parent: 'game',
    scale: {
        mode: Phaser.Scale.RESIZE,
    },
    scene: [BootScene, LoadScene],
    backgroundColor: 0xffffff,
    physics: {
        default: 'arcade',
    },
    pixelArt: true,
}


export default GAME_CONFIG

