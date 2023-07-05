import Sprite = Phaser.Physics.Arcade.Sprite
import Phaser, { Scene } from 'phaser'
import { Key } from '../constants'


class Spike extends Sprite
{
    constructor(scene: Scene, x = 0, y = 0) {
        super(scene, x, y, Key.Sprite.SPIKE)
        scene.add.existing(this)
        
        scene.time.delayedCall(0, () => {
            this.setTexture(Key.Sprite.SPIKE)
            this.setDisplaySize(18, 18)
        })
    }
}

export default Spike