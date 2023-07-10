import { Constants } from '../index'
import { Scene } from 'phaser'

class TransitionScreen extends Phaser.GameObjects.Sprite
{
    private circle: Phaser.GameObjects.Graphics

    constructor(scene: Scene) {
        super(scene, 0, 0, Constants.Key.Sprite.SQUARE)
        scene.add.existing(this)

        this.setTintFill(0x000000)

        this.circle = scene.make.graphics().fillCircle(0, 0, 100)
        this.setMask(this.circle.createGeometryMask())
        this.setDepth(10000)
        this.setDisplaySize(10000, 10000)
        this.mask.invertAlpha = true

        this.setVisible(true)
    }

    public closeAt(x: number, y: number, ease = Phaser.Math.Easing.Circular.Out, duration = 1000): void {
        this.circle.x = x
        this.circle.y = y

        this.setVisible(true)
        this.scene.tweens.add({
            targets: this.circle,
            scale: 0,
            ease: ease,
            duration: duration,
        })
    }

    public openAt(x: number, y: number): void {
        this.circle.x = x
        this.circle.y = y

        this.circle.scale = 0
        this.scene.tweens.add({
            targets: this.circle,
            scale: 10,
            duration: 600,
            ease: Phaser.Math.Easing.Circular.In,
            onComplete: () => this.setVisible(false),
        })
    }

    public openSlightlyAt(x: number, y: number): void {
        this.circle.x = x
        this.circle.y = y

        this.circle.scale = 0
        this.scene.tweens.add({
            targets: this.circle,
            scale: 2,
            duration: 400,
            ease: Phaser.Math.Easing.Back.Out,
        })
    }
}

export default TransitionScreen