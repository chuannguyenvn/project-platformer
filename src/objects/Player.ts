import Sprite = Phaser.Physics.Arcade.Sprite
import Body = Phaser.Physics.Arcade.Body
import Vector2 = Phaser.Math.Vector2
import Tween = Phaser.Tweens.Tween
import Tilemap = Key.Tilemap
import PlayScene from '../scenes/PlayScene'
import { Key } from '../constants'
import Phaser from 'phaser'
import { Portal, PortalOrientation } from './Portal'
import Maths from '../utilities/Maths'
import StateMachine from '../utilities/StateMachine'

class Player extends Sprite
{
    private playScene: PlayScene
    private lastFrameVelocity: Vector2
    private overlapingPortalLastFrame: Portal | null
    public overlapingPortalThisFrame: Portal | null

    private playerStateMachine: StateMachine<PlayerState> = new StateMachine<PlayerState>(PlayerState.IDLE)
    private playerRunningAnimation: Animation

    private channelingMomentum = 1
    private releaseMomentum = 1

    private gravityTween: Tween
    private xFriction: number = 1

    private hasKey: boolean = false
    private forceWalkOut: boolean = false

    constructor(playScene: PlayScene, x = 0, y = 0) {
        super(playScene, x, y, Key.Sprite.PLAYER_IDLE)
        playScene.physics.add.existing(this)
        playScene.add.existing(this)
        this.playScene = playScene

        this.playScene.cursors.space.on(Phaser.Input.Keyboard.Events.DOWN, () => {
            if ((this.body as Body).blocked.down)
            {
                this.playerStateMachine.changeState(PlayerState.JUMPING);
                (this.body as Body).setVelocityY(-500)
            }
        })

        this.playerStateMachine.configure(PlayerState.IDLE).onEntry(() => {
            this.setTexture(Key.Sprite.PLAYER_IDLE)
        })

        this.playerStateMachine.configure(PlayerState.JUMPING).onEntry(() => {
            this.setTexture(Key.Sprite.PLAYER_RUNNING)
        })

        this.playerStateMachine.configure(PlayerState.RUNNING).onEntry(() => {
            this.play(Key.Animation.PLAYER_RUNNING)
        })

        this.playerStateMachine.configure(PlayerState.RUNNING).onExit(() => {
            this.stop()
        })

        this.gravityTween = this.playScene.tweens.addCounter({
            from: 0,
            to: 100,
            duration: 250,
            ease: Phaser.Math.Easing.Sine.InOut,
            onUpdate: (tween) => {
                this.setGravityY(tween.getValue())
                this.xFriction = tween.getValue() / 100
            },
        })
    }

    update(time: number, delta: number): void {
        if (this.forceWalkOut)
        {
            (this.body as Body).setVelocityX(200)
            return
        }

        this.handleMovement(delta)
        this.handleGun()
    }

    private handleMovement(delta: number): void {
        this.channelingMomentum = Math.max(this.channelingMomentum - delta / 2000, 1)

        if (this.body?.blocked.down)
            (this.body as Body).setVelocityX((this.body as Body).velocity.x * 0.75)
        else
            (this.body as Body).setVelocityX((this.body as Body).velocity.x * (1 - this.xFriction / 100))

        if (this.playScene.aKey.isDown)
        {
            if (this.playerStateMachine.currentState !== PlayerState.JUMPING)
                this.playerStateMachine.changeState(PlayerState.RUNNING);
            (this.body as Body).setVelocityX(-200)
        }
        else if (this.playScene.dKey.isDown)
        {
            if (this.playerStateMachine.currentState !== PlayerState.JUMPING)
                this.playerStateMachine.changeState(PlayerState.RUNNING);
            (this.body as Body).setVelocityX(200)
        }
        else
        {
            this.playerStateMachine.changeState(PlayerState.IDLE)
        }

        this.lastFrameVelocity = this.body?.velocity as Vector2
        this.overlapingPortalLastFrame = this.overlapingPortalThisFrame
        this.overlapingPortalThisFrame = null
    }

    private handleGun(): void {
        const worldMousePosition = this.playScene.cameras.main.getWorldPoint(
            this.playScene.input.activePointer.x,
            this.playScene.input.activePointer.y,
        )

        const angle = Phaser.Math.Angle.Between(this.x, this.y, worldMousePosition.x, worldMousePosition.y)

        this.playScene.ray.setOrigin(this.x, this.y)
        this.playScene.ray.setAngle(angle)
        const intersectionResult = this.playScene.ray.cast()
        if (intersectionResult === false) return

        const intersection = intersectionResult as Phaser.Geom.Point
        if ((intersection as any).segment === undefined) return
        let portalToPlace: Portal
        if (this.playScene.leftMouseDown)
        {
            portalToPlace = this.playScene.bluePortal
        }
        else if (this.playScene.rightMouseDown)
        {
            portalToPlace = this.playScene.orangePortal
        }
        else return

        const objectHit = (intersection as any).object
        if (objectHit.layer.name !== 'gold_tiles') return

        const segment = (intersection as any).segment
        if (intersection.x > this.x)
        {
            if (intersection.y > this.y)
            {
                if (segment.x1 === segment.x2)
                {
                    portalToPlace.setOrientation(PortalOrientation.LEFT)
                }
                else
                {
                    portalToPlace.setOrientation(PortalOrientation.UP)
                }
            }
            else
            {
                if (segment.x1 === segment.x2)
                {
                    portalToPlace.setOrientation(PortalOrientation.LEFT)
                }
                else
                {
                    portalToPlace.setOrientation(PortalOrientation.DOWN)
                }
            }
        }
        else
        {
            if (intersection.y > this.y)
            {
                if (segment.x1 === segment.x2)
                {
                    portalToPlace.setOrientation(PortalOrientation.RIGHT)
                }
                else
                {
                    portalToPlace.setOrientation(PortalOrientation.UP)
                }
            }
            else
            {
                if (segment.x1 === segment.x2)
                {
                    portalToPlace.setOrientation(PortalOrientation.RIGHT)
                }
                else
                {
                    portalToPlace.setOrientation(PortalOrientation.DOWN)
                }
            }
        }

        portalToPlace.setPosition(intersection.x, intersection.y)

        this.releaseMomentum = this.channelingMomentum
        this.channelingMomentum = 1
    }

    public handleSpringCollision(): void {
        (this.body as Body).setVelocityY(-700)
    }

    public enterPortal(portal: Portal): void {
        if (this.overlapingPortalLastFrame === portal)
        {
            this.overlapingPortalThisFrame = portal
            return
        }

        this.setPosition(portal.destinationPortal.x + portal.destinationPortal.orientation.x * 20,
            portal.destinationPortal.y + portal.destinationPortal.orientation.y * 20)

        this.overlapingPortalThisFrame = portal.destinationPortal

        if (portal.orientation === portal.destinationPortal.orientation)
        {
            let xVel = Phaser.Math.Clamp(this.lastFrameVelocity.x * this.releaseMomentum, -10000, 10000)
            let yVel = Phaser.Math.Clamp(this.lastFrameVelocity.y * this.releaseMomentum, -1500, 1500)

            if (portal.orientation === Vector2.UP || portal.orientation === Vector2.DOWN)
            {
                yVel *= -1
            }
            else
            {
                xVel *= -1
            }

            this.setVelocity(xVel, yVel)
        }
        else
        {
            const angle = Maths.SignedDegreeAngleBetween(
                portal.orientation.clone(),
                portal.destinationPortal.orientation.clone())

            if (Math.abs(angle) !== 180)
            {
                if (angle > 0)
                    this.setVelocity(-this.lastFrameVelocity.y, this.lastFrameVelocity.x)
                else
                    this.setVelocity(this.lastFrameVelocity.y, -this.lastFrameVelocity.x)
            }
        }

        this.channelingMomentum += 0.25
        this.releaseMomentum = 1

        this.gravityTween.play()
    }

    public win(): void {
        this.forceWalkOut = true

        this.playScene.time.delayedCall(2000, () => {
            if (this.playScene.currentLevel === Tilemap.LEVEL_1)
            {
                this.playScene.loadLevel(Tilemap.LEVEL_2)
            }
            else if (this.playScene.currentLevel === Tilemap.LEVEL_2)
            {
                this.playScene.loadLevel(Tilemap.LEVEL_3)
            }
            else
            {

            }
        })
    }

    public die(): void {
        this.setDrag(10000)
    }
}

enum PlayerState
{
    IDLE,
    RUNNING,
    JUMPING,
}

export default Player