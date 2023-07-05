import Interactable from './Interactable'
import PlayScene from '../scenes/PlayScene'
import { Key } from '../constants'

class Portal extends Interactable
{
    constructor(playScene: PlayScene, isBlue: boolean) {
        super(playScene, -10000, -10000, Key.Sprite.SQUARE, true)

        this.setDisplaySize(18, 18)

        if (isBlue)
        {
            this.setTintFill(0x0000ff)
        }
        else
        {
            this.setTintFill(0xffff00)
        }
        
        this.setImmovable(true)
        this.setGravity(0, 0)
    }
}

export default Portal