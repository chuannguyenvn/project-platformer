import PlayScene from '../scenes/PlayScene'
import Interactable from './Interactable'
import { Constants } from '../index'


class Key extends Interactable
{
    private isCollected = false

    constructor(playScene: PlayScene, x = 0, y = 0) {
        super(playScene, x, y, Constants.Key.Sprite.KEY)

        this.playScene.time.delayedCall(0, () => {
            this.setTexture(Constants.Key.Sprite.KEY)
            this.setDisplaySize(18, 18)
        })
    }

    update(time: number, delta: number) {
        if (!this.isCollected) return

        // Follows player
    }

    public collect(): void {
        this.isCollected = true
    }
}

export default Key