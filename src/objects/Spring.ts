import Sprite = Phaser.Physics.Arcade.Sprite
import Phaser from 'phaser'
import { Key } from '../constants'
import PlayScene from '../scenes/PlayScene'


class Spring extends Sprite
{
    private playScene: PlayScene

    constructor(playScene: PlayScene, x = 0, y = 0) {
        super(playScene, x, y, Key.Sprite.SPRING_COMPRESSED)
        this.playScene = playScene
        this.playScene.physics.add.existing(this)
        this.playScene.add.existing(this)

        playScene.time.delayedCall(0, () => {
            this.setTexture(Key.Sprite.SPRING_COMPRESSED)
            this.setDisplaySize(18, 18)
        })
    }

    public release(): void {
        this.setTexture(Key.Sprite.SPRING_RELEASED)
        this.playScene.time.delayedCall(1, () => {
            this.setTexture(Key.Sprite.SPRING_COMPRESSED)
        })
    }
}

export default Spring