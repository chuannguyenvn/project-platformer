import Sprite = Phaser.Physics.Arcade.Sprite
import { Scene } from 'phaser'
import { Key } from '../constants'

class Coin extends Sprite
{
    constructor(scene: Scene, x = 0, y = 0) {
        super(scene, x, y, Key.Sprite.COIN_FRONT)
        scene.add.existing(this)

        this.play(Key.Animation.COIN)

        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    }
}

export default Coin