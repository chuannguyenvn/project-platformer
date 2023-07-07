import PlayScene from '../scenes/PlayScene'
import Interactable from './Interactable'
import { Constants } from '../index'
import Maths from '../utilities/Maths'
import Vector2 = Phaser.Math.Vector2


class Key extends Interactable
{
    private isCollected = false

    constructor(playScene: PlayScene, x = 0, y = 0) {
        super(playScene, x, y, Constants.Key.Sprite.KEY)

        this.playScene.time.delayedCall(0, () => {
            this.setTexture(Constants.Key.Sprite.KEY)
            this.setDisplaySize(18, 18)
        })

        this.setDrag(100000)
    }

    update(time: number, delta: number) {
        if (!this.isCollected) return

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
        console.log('collected')
    }
}

export default Key