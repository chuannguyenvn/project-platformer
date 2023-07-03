import Phaser from 'phaser'
import BootScene from '../scenes/BootScene'
import LoadScene from '../scenes/LoadScene'


const GAME_CONFIG: Phaser.Types.Core.GameConfig = {
    parent: 'game',
    // scale: {
    //     mode: Phaser.Scale.RESIZE,
    // },
    width: 180,
    height: 180,
    scene: [BootScene, LoadScene],
    backgroundColor: 0xffffff,
    physics: {
        default: 'arcade',
    },
    pixelArt: true,
    zoom: 5,
}


export default GAME_CONFIG

