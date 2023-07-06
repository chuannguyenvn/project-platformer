import { Scene } from 'phaser'
import { Constants } from '../index'
import Player from '../objects/Player'
import { Data, Key } from '../constants'
import Spike from '../objects/Spike'
import Spring from '../objects/Spring'
import PhaserRaycaster from 'phaser-raycaster'
import { Portal } from '../objects/Portal'
import Goal from '../objects/Goal'
import Group = Phaser.GameObjects.Group
import Tileset = Phaser.Tilemaps.Tileset
import TilemapLayer = Phaser.Tilemaps.TilemapLayer
import GameObject = Phaser.GameObjects.GameObject
import Ray = Raycaster.Ray

class PlayScene extends Scene
{
    public controls: Phaser.Cameras.Controls.FixedKeyControl
    public cursors: Phaser.Types.Input.Keyboard.CursorKeys
    public wKey: Phaser.Input.Keyboard.Key
    public aKey: Phaser.Input.Keyboard.Key
    public sKey: Phaser.Input.Keyboard.Key
    public dKey: Phaser.Input.Keyboard.Key

    private tileset: Tileset
    private tilemapLayer: TilemapLayer

    private player: Group
    private goal: Goal

    public portals: GameObject[]
    public bluePortal: Portal
    public orangePortal: Portal

    private spikes: GameObject[]
    private springs: GameObject[]

    public raycasterPlugin: PhaserRaycaster
    public raycaster: Raycaster
    public ray: Ray

    constructor() {
        super({ key: Constants.Key.Scene.PLAY })
    }

    create() {
        this.setUpInputs()
        this.setUpPlayer()
        this.setUpCamera()
        this.setUpTilemap()
        this.setUpRaycasting()

        this.anims.create({
            key: Key.Animation.PLAYER_RUNNING,
            frames: [
                { key: Key.Sprite.PLAYER_RUNNING },
                { key: Key.Sprite.PLAYER_IDLE },
            ],
            frameRate: 6,
            repeat: -1,
        })
    }

    private setUpInputs(): void {
        this.input.mouse?.disableContextMenu()

        this.cursors = this.input.keyboard?.createCursorKeys() as Phaser.Types.Input.Keyboard.CursorKeys

        this.wKey = this.input.keyboard?.addKey('W') as Phaser.Input.Keyboard.Key
        this.aKey = this.input.keyboard?.addKey('A') as Phaser.Input.Keyboard.Key
        this.sKey = this.input.keyboard?.addKey('S') as Phaser.Input.Keyboard.Key
        this.dKey = this.input.keyboard?.addKey('D') as Phaser.Input.Keyboard.Key
    }

    private setUpPlayer() {
        this.player = this.add.group([new Player(this, 200, 200)], { runChildUpdate: true })

        this.bluePortal = new Portal(this, true)
        this.orangePortal = new Portal(this, false)
        this.bluePortal.destinationPortal = this.orangePortal
        this.orangePortal.destinationPortal = this.bluePortal
        this.portals = [this.bluePortal, this.orangePortal]

        this.add.group(this.portals, { runChildUpdate: true })
    }

    private setUpCamera(): void {
        this.cameras.main.setZoom(2)
        this.cameras.main.startFollow(this.player.getChildren()[0])

        const cursors = this.input.keyboard?.createCursorKeys()
        const controlConfig = {
            camera: this.cameras.main,
            left: cursors?.left,
            right: cursors?.right,
            up: cursors?.up,
            down: cursors?.down,
            speed: 0.5,
        }
        this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig)
    }

    private setUpTilemap(): void {
        this.physics.world.TILE_BIAS = 18
        
        const map = this.make.tilemap({ key: Constants.Key.Tilemap.LEVEL_1 })
        this.tileset = map.addTilesetImage('tiles_packed', Constants.Key.Sprite.KENNEY_DEFAULT_TILESET) as Tileset
        this.tilemapLayer = map.createLayer('terrain', this.tileset as Tileset) as TilemapLayer
        map.setCollision(Data.getCollidableTiles())

        this.spikes = map.createFromObjects('objects', {
            name: 'spike',
            classType: Spike,
        })

        this.springs = map.createFromObjects('objects', {
            name: 'spring',
            classType: Spring,
        })

        this.goal = map.createFromObjects('objects', {
            name: 'goal',
            classType: Goal,
        })[0] as Goal

        map.createLayer('decoration', this.tileset as Tileset) as TilemapLayer

        this.physics.add.collider(this.player, this.tilemapLayer as TilemapLayer)
        this.physics.add.collider(this.spikes, this.tilemapLayer as TilemapLayer)
        this.physics.add.collider(this.springs, this.tilemapLayer as TilemapLayer)
    }

    private setUpRaycasting(): void {
        this.raycasterPlugin = new PhaserRaycaster(this, this.plugins)
        this.raycaster = this.raycasterPlugin.createRaycaster({ debug: true })
        this.raycaster.mapGameObjects(this.tilemapLayer, false, { collisionTiles: [10] })
        this.ray = this.raycaster.createRay()
    }

    update(time: number, delta: number) {
        this.controls.update(delta)

        this.physics.world.overlap(this.player, this.spikes, (player, _) => {
            (player as Player).die()
        })

        this.physics.world.overlap(this.player, this.springs, (player, spring) => {
            (player as Player).handleSpringCollision();
            (spring as Spring).release()
        })

        this.physics.world.overlap(this.player, this.portals, (player, portal) => {
            (player as Player).enterPortal(portal as Portal)
        })

        this.physics.world.overlap(this.player, this.goal, (player, _) => {
            (player as Player).win()
        })
    }
}

export default PlayScene