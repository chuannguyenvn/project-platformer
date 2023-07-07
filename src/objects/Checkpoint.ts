import Interactable from './Interactable'
import PlayScene from '../scenes/PlayScene'
import { Key } from '../constants'
import { Constants } from '../index'

class Checkpoint extends Interactable
{
    constructor(playScene: PlayScene, x = 0, y = 0) {
        super(playScene, x, y, Key.Sprite.FLAG_1)

        this.setDisplaySize(18, 36)
        this.setBodySize(18, 36)
        this.setOrigin(0.5, 1)
        this.setDrag(100000)
        
        this.play(Constants.Key.Animation.FLAG_WAVING)
    }
}

export default Checkpoint