import PlayScene from '../scenes/PlayScene'
import Interactable from './Interactable'
import { Constants } from '../index'
import LockWall from './LockWall'
import Vector2 = Phaser.Math.Vector2


class Lock extends Interactable
{
    public lockWalls: LockWall[]

    constructor(playScene: PlayScene, x = 0, y = 0) {
        super(playScene, x, y, Constants.Key.Sprite.LOCK)
        
        this.playScene.time.delayedCall(0, () => {
            this.setTexture(Constants.Key.Sprite.LOCK)
            this.setDisplaySize(18, 18)
        })

        this.setMass(100000)
        this.setDrag(100000)
    }

    update(time: number, delta: number) {
        const playerPosition = new Vector2(this.playScene.player.x, this.playScene.player.y)
        const currentPosition = new Vector2(this.x, this.y)
        if (Phaser.Math.Distance.Between(playerPosition.x, playerPosition.y,
            currentPosition.x, currentPosition.y) < 100)
        {
            this.playScene.currentKey?.unlock(this)
        }
    }

    public unlock(): void {
        this.lockWalls.forEach(lockWall => lockWall.unlock())

        this.setDrag(0)
        this.setMass(1)
        this.setAngularVelocity(Phaser.Math.Between(-1000, 1000))
        Phaser.Math.RandomXY(this.body?.velocity as Vector2, 200)
    }
}

export default Lock