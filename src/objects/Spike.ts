import Sprite = Phaser.Physics.Arcade.Sprite
import Phaser from 'phaser'
import { Key } from '../constants'
import PlayScene from '../scenes/PlayScene'
import Interactable from './Interactable'


class Spike extends Interactable
{
    constructor(playScene: PlayScene, x = 0, y = 0) {
        super(playScene, x, y, Key.Sprite.SPIKE)

        this.playScene.time.delayedCall(0, () => {
            this.setTexture(Key.Sprite.SPIKE)
            this.setDisplaySize(18, 18)
        })
    }
}

export default Spike