import PlayScene from '../scenes/PlayScene'
import Interactable from './Interactable'
import { Constants } from '../index'
import LockWall from './LockWall'


class Lock extends Interactable
{
    private lockWalls: LockWall[]

    constructor(playScene: PlayScene, x = 0, y = 0, lockWalls: LockWall[]) {
        super(playScene, x, y, Constants.Key.Sprite.LOCK)

        this.lockWalls = lockWalls

        this.playScene.time.delayedCall(0, () => {
            this.setTexture(Constants.Key.Sprite.LOCK)
            this.setDisplaySize(18, 18)
        })

        this.setBodySize(50, 50)
    }

    public unlock(): void {
        this.lockWalls.forEach(lockWall => lockWall.unlock())
        
        // Perform self-unlock
    }
}

export default Lock