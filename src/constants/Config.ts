import Phaser from 'phaser'
import BootScene from '../scenes/BootScene'
import LoadScene from '../scenes/LoadScene'
import PlayScene from '../scenes/PlayScene'
import PhaserRaycaster from 'phaser-raycaster'

const GAME_CONFIG: Phaser.Types.Core.GameConfig = {
    parent: 'game',
    scale: {
        mode: Phaser.Scale.RESIZE,
    },
    scene: [BootScene, LoadScene, PlayScene],
    backgroundColor: 0xffffff,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 2000 },
        },
    },
    pixelArt: true,
    plugins: {
        scene: [
            {
                key: 'PhaserRaycaster',
                plugin: PhaserRaycaster,
                mapping: 'raycasterPlugin'
            }
        ]
    }
}


export default GAME_CONFIG

