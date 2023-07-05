import Interactable from './Interactable'
import PlayScene from '../scenes/PlayScene'
import { Key } from '../constants'

class Goal extends Interactable
{
    constructor(playScene: PlayScene, x = 0, y = 0) {
        super(playScene, x, y, Key.Sprite.DOOR)

        this.setDisplaySize(18, 36)
        this.setBodySize(18, 36)
        this.setOrigin(0.5, 1)
        this.setDrag(100000)
    }
}

export default Goal