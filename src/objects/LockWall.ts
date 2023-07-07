import PlayScene from '../scenes/PlayScene'
import Interactable from './Interactable'
import { Constants } from '../index'
import Vector2 = Phaser.Math.Vector2


class LockWall extends Interactable
{
    constructor(playScene: PlayScene, x = 0, y = 0) {
        super(playScene, x, y, Constants.Key.Sprite.LOCK_WALL)

        this.playScene.time.delayedCall(0, () => {
            this.setTexture(Constants.Key.Sprite.LOCK_WALL)
            this.setDisplaySize(18, 18)
        })

        this.setImmovable(true)
        this.setDrag(100000)
    }

    public unlock(): void {
        this.setDrag(0)
        this.setMass(1)
        this.setAngularVelocity(Phaser.Math.Between(-1000, 1000))
        Phaser.Math.RandomXY(this.body?.velocity as Vector2, 200)
        this.playScene.time.delayedCall(5000, () => this.destroy())
    }
}

export default LockWall