import PlayScene from '../scenes/PlayScene'
import Interactable from './Interactable'
import { Constants } from '../index'


class LockWall extends Interactable
{
    constructor(playScene: PlayScene, x = 0, y = 0) {
        super(playScene, x, y, Constants.Key.Sprite.LOCK_WALL)

        this.playScene.time.delayedCall(0, () => {
            this.setTexture(Constants.Key.Sprite.LOCK_WALL)
            this.setDisplaySize(18, 18)
        })

        this.setDrag(100000)
    }

    public unlock(): void {
        // Perform unlock
    }
}

export default LockWall