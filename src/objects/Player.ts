import Sprite = Phaser.Physics.Arcade.Sprite
import Body = Phaser.Physics.Arcade.Body
import Vector2 = Phaser.Math.Vector2
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
    }

    update(): void {
        this.handleMovement()
        this.handleGun()
    }

    private handleMovement(): void {
        (this.body as Body).setVelocityX(0)

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

        // if (this.body?.velocity.y as number > 500)
        // {
        //     this.setVelocityY(500)
        // }

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
        if (this.playScene.input.activePointer.leftButtonDown())
        {
            portalToPlace = this.playScene.bluePortal
        }
        else if (this.playScene.input.activePointer.rightButtonDown())
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
        if (!portal.isActive) return

        this.setPosition(portal.destinationPortal.x, portal.destinationPortal.y)
        this.setVelocity(this.lastFrameVelocity.x, this.lastFrameVelocity.y)

        this.playScene.bluePortal.deactivate()
        this.playScene.orangePortal.deactivate()

        this.overlapingPortalThisFrame = portal.destinationPortal

        if (portal.orientation === portal.destinationPortal.orientation)
        {
            this.setVelocity(this.lastFrameVelocity.x * -1, this.lastFrameVelocity.y * -1)
        }
        else if (portal.orientation.clone().scale(-1) !== portal.destinationPortal.orientation)
        {
            const angle = Maths.SignedDegreeAngleBetween(
                portal.orientation.clone(),
                portal.destinationPortal.orientation.clone())

            if (angle > 0)
                this.setVelocity(-this.lastFrameVelocity.y, this.lastFrameVelocity.x)
            else
                this.setVelocity(this.lastFrameVelocity.y, -this.lastFrameVelocity.x)

        }
    }

    public win(): void {
        console.log('won')
    }

    public die(): void {
        console.log('lose')
    }
}

enum PlayerState
{
    IDLE,
    RUNNING,
    JUMPING,
}

export default Player