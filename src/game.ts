import GAME_CONFIG from './constants/Config'
import Phaser from 'phaser'
import Assets from './constants/Keys'

export class Game extends Phaser.Game
{
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config)
    }
}

window.addEventListener('load', () => {
    const game = new Game(GAME_CONFIG)
})