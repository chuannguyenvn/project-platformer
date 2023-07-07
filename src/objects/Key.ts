import PlayScene from '../scenes/PlayScene'
import Interactable from './Interactable'
import { Constants } from '../index'
import Maths from '../utilities/Maths'
import Lock from './Lock'
import Vector2 = Phaser.Math.Vector2

class Key extends Interactable
{
    private isCollected = false
    private targetingLock: Lock | null

    constructor(playScene: PlayScene, x = 0, y = 0) {
        super(playScene, x, y, Constants.Key.Sprite.KEY)

        this.playScene.time.delayedCall(0, () => {
            this.setTexture(Constants.Key.Sprite.KEY)
            this.setDisplaySize(18, 18)
        })

        this.setDrag(100000)
        this.setDepth(1)
    }

    update(time: number, delta: number) {
        if (this.targetingLock) this.flyToLock(delta)
        if (this.isCollected) this.flyToPlayer(delta)
    }

    private flyToLock(delta: number): void {
        if (!this.targetingLock) return

        const lockPosition = new Vector2(this.targetingLock.x, this.targetingLock.y)
        const currentPosition = new Vector2(this.x, this.y)
        if (Phaser.Math.Distance.Between(lockPosition.x, lockPosition.y,
            currentPosition.x, currentPosition.y) > 5)
        {
            const newPosition = Maths.lerpVector2(currentPosition, lockPosition, 7 * delta / 1000)
            this.x = newPosition.x
            this.y = newPosition.y
        }
        else
        {
            const lock = this.targetingLock
            this.targetingLock = null
            this.playScene.tweens.add({
                targets: this,
                scale: 0,
                duration: 800,
                ease: Phaser.Math.Easing.Back.In,
                onComplete: () => {
                    lock.unlock()
                    this.destroy()
                },
            })
        }
    }

    private flyToPlayer(delta: number): void {
        const playerPosition = new Vector2(this.playScene.player.x, this.playScene.player.y)
        const currentPosition = new Vector2(this.x, this.y)
        if (Phaser.Math.Distance.Between(playerPosition.x, playerPosition.y,
            currentPosition.x, currentPosition.y) > 25)
        {
            const targetPosition = Maths.lerpVector2ByDistance(playerPosition, currentPosition, 25)
            const newPosition = Maths.lerpVector2(currentPosition, targetPosition, 5 * delta / 1000)
            this.x = newPosition.x
            this.y = newPosition.y
        }
    }

    public collect(): void {
        this.isCollected = true
        this.playScene.currentKey = this
    }

    public unlock(lock: Lock): void {
        this.isCollected = false
        this.playScene.currentKey = null
        this.targetingLock = lock
    }
}

export default Key