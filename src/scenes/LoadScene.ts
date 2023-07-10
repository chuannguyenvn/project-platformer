import Phaser, { Scene } from 'phaser'
import { Constants } from '../index'
import PreloadHelper from '../utilities/PreloadHelper'
import TransitionScreen from '../objects/TransitionScreen'
import Image = Phaser.GameObjects.Image


class LoadScene extends Scene
{
    private transitionScreen: TransitionScreen

    private player: Image

    constructor() {
        super({ key: Constants.Key.Scene.LOAD })
    }

    preload(): void {
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.KENNEY_DEFAULT_TILESET)
        PreloadHelper.preloadTilemap(this, Constants.Key.Tilemap.LEVEL_1)
        PreloadHelper.preloadTilemap(this, Constants.Key.Tilemap.LEVEL_2)
        PreloadHelper.preloadTilemap(this, Constants.Key.Tilemap.LEVEL_3)
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.COIN_SIDE)
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.COIN_FRONT)
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.SPIKE)
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.DOOR)
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.FLAG_1)
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.FLAG_2)
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.KEY)
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.LOCK)
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.LOCK_WALL)
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.CASTLE)
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.SPRING_COMPRESSED)
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.SPRING_RELEASED)
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.PLAYER_IDLE)
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.PLAYER_RUNNING)
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.BACKGROUND)
        PreloadHelper.preloadSprite(this, Constants.Key.Sprite.SQUARE)
    }

    create(): void {
        this.anims.create({
            key: Constants.Key.Animation.PLAYER_RUNNING,
            frames: [
                { key: Constants.Key.Sprite.PLAYER_RUNNING },
                { key: Constants.Key.Sprite.PLAYER_IDLE },
            ],
            frameRate: 6,
            repeat: -1,
        })

        this.anims.create({
            key: Constants.Key.Animation.FLAG_WAVING,
            frames: [
                { key: Constants.Key.Sprite.FLAG_1 },
                { key: Constants.Key.Sprite.FLAG_2 },
            ],
            frameRate: 3,
            repeat: -1,
        })

        this.transitionScreen = new TransitionScreen(this)
        this.transitionScreen.openSlightlyAt(this.scale.width / 2, this.scale.height / 2)

        this.player = this.add.image(this.scale.width / 2, this.scale.height * 0.3, Constants.Key.Sprite.PLAYER_RUNNING)
        this.player.setScale(2)
        this.tweens.add({
            targets: this.player,
            y: this.scale.height * 0.7,
            duration: 1000,
            repeat: -1,
        })
        this.tweens.add({
            targets: this.player,
            rotation: Phaser.Math.PI2,
            duration: 2345,
            repeat: -1,
        })

        this.add.image(this.scale.width / 2, this.scale.height * 0.2, Constants.Key.Sprite.SQUARE).setTintFill(0x0000ff).setScale(1.5)
        this.add.image(this.scale.width / 2, this.scale.height * 0.8, Constants.Key.Sprite.SQUARE).setTintFill(0xff8800).setScale(1.5)
        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, Constants.Key.Sprite.BACKGROUND).setDepth(-1)

        const title1 = this.add.text(this.scale.width / 2, this.scale.height * 0.15, 'Platformer game')
            .setFont('100px calibri')
            .setColor('#ffffff')
            .setOrigin(0.5)
            .setDepth(100000)

        const title2 = this.add.text(this.scale.width / 2, this.scale.height * 0.2, '(with portals?!)')
            .setFont('25px calibri')
            .setColor('#ffffff')
            .setOrigin(0.5)
            .setDepth(100000)

        const title3 = this.add.text(this.scale.width / 2, this.scale.height * 0.85, 'Click anywhere to continue')
            .setFont('50px calibri')
            .setColor('#ffffff')
            .setOrigin(0.5)
            .setDepth(100000)

        this.input.on(Phaser.Input.Events.POINTER_UP, () => {
            title1.setVisible(false)
            title2.setVisible(false)
            title3.setVisible(false)
            this.transitionScreen.closeAt(this.scale.width / 2, this.scale.height / 2, Phaser.Math.Easing.Back.In, 400)
            this.time.delayedCall(1000, () => this.scene.start(Constants.Key.Scene.PLAY))
        })
    }
}

export default LoadScene