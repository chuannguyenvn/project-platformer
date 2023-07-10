import { Scene } from 'phaser'
import { Constants } from '../index'
import Player from '../objects/Player'
import { Data } from '../constants'
import Spike from '../objects/Spike'
import Spring from '../objects/Spring'
import PhaserRaycaster from 'phaser-raycaster'
import { Portal } from '../objects/Portal'
import Goal from '../objects/Goal'
import Key from '../objects/Key'
import Lock from '../objects/Lock'
import LockWall from '../objects/LockWall'
import TransitionScreen from '../objects/TransitionScreen'
import Checkpoint from '../objects/Checkpoint'
import Group = Phaser.GameObjects.Group
import Tileset = Phaser.Tilemaps.Tileset
import TilemapLayer = Phaser.Tilemaps.TilemapLayer
import GameObject = Phaser.GameObjects.GameObject
import Ray = Raycaster.Ray
import Image = Phaser.GameObjects.Image

class PlayScene extends Scene
{
    public controls: Phaser.Cameras.Controls.FixedKeyControl
    public cursors: Phaser.Types.Input.Keyboard.CursorKeys
    public wKey: Phaser.Input.Keyboard.Key
    public aKey: Phaser.Input.Keyboard.Key
    public sKey: Phaser.Input.Keyboard.Key
    public dKey: Phaser.Input.Keyboard.Key
    public pKey: Phaser.Input.Keyboard.Key
    public oKey: Phaser.Input.Keyboard.Key

    public godMode = false

    public leftMouseDown = false
    public rightMouseDown = false

    private background: Image

    private tileset: Tileset
    private terrainTilemapLayer: TilemapLayer
    private decorationTilemapLayer: TilemapLayer
    private goldTilemapLayer: TilemapLayer

    public player: Player
    private playerGroup: Group
    private goal: Goal

    public portals: GameObject[]
    public bluePortal: Portal
    public orangePortal: Portal

    private spikes: GameObject[]
    private springs: GameObject[]
    private keys: GameObject[]
    private locks: GameObject[]
    private lockWalls: GameObject[]
    public currentKey: Key | null = null

    public raycasterPlugin: PhaserRaycaster
    public raycaster: Raycaster
    public ray: Ray

    public currentLevel: Constants.Key.Tilemap = Constants.Key.Tilemap.LEVEL_1

    private transitionScreen: TransitionScreen

    private checkpoints: GameObject[]
    private latestCheckpoint: Checkpoint | null

    constructor() {
        super({ key: Constants.Key.Scene.PLAY })
    }

    create() {
        this.setUpInputs()
        this.setUpPlayer()
        this.setUpCamera()
        this.setUpWorld()
        this.setUpRaycasting()
        this.setUpTransition()
    }

    private setUpInputs(): void {
        this.input.mouse?.disableContextMenu()

        this.cursors = this.input.keyboard?.createCursorKeys() as Phaser.Types.Input.Keyboard.CursorKeys

        this.wKey = this.input.keyboard?.addKey('W') as Phaser.Input.Keyboard.Key
        this.aKey = this.input.keyboard?.addKey('A') as Phaser.Input.Keyboard.Key
        this.sKey = this.input.keyboard?.addKey('S') as Phaser.Input.Keyboard.Key
        this.dKey = this.input.keyboard?.addKey('D') as Phaser.Input.Keyboard.Key
        this.pKey = this.input.keyboard?.addKey('P') as Phaser.Input.Keyboard.Key
        this.oKey = this.input.keyboard?.addKey('O') as Phaser.Input.Keyboard.Key

        this.input.on(Phaser.Input.Events.POINTER_DOWN, () => {
            if (this.input.activePointer.leftButtonDown())
            {
                this.leftMouseDown = true
                this.time.delayedCall(0, () => this.leftMouseDown = false)
            }
            else if (this.input.activePointer.rightButtonDown())
            {
                this.rightMouseDown = true
                this.time.delayedCall(0, () => this.rightMouseDown = false)
            }
        })
    }

    private setUpPlayer() {
        if (this.latestCheckpoint)
        {
            this.player = new Player(this, this.latestCheckpoint.x, this.latestCheckpoint.y)
        }
        else if (this.currentLevel === Constants.Key.Tilemap.LEVEL_3)
        {
            this.player = new Player(this, 300, 600)
        }
        else
        {
            this.player = new Player(this, 300, 700)
        }

        this.playerGroup = this.add.group([this.player], { runChildUpdate: true })

        this.bluePortal = new Portal(this, true)
        this.orangePortal = new Portal(this, false)
        this.bluePortal.destinationPortal = this.orangePortal
        this.orangePortal.destinationPortal = this.bluePortal
        this.portals = [this.bluePortal, this.orangePortal]

        this.add.group(this.portals, { runChildUpdate: true })
    }

    private setUpCamera(): void {
        this.cameras.main.setZoom(2)
        this.cameras.main.startFollow(this.playerGroup.getChildren()[0], false, 0.2, 0.2, 0, 0)

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

        this.background = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, Constants.Key.Sprite.BACKGROUND)
        this.background.setOrigin(0.5)
        this.background.setDepth(-1000)
        this.background.setScrollFactor(0, 0.2)
        this.background.setScale(3)

        this.cameras.main.setBounds(50, 0, 4200, 840)
    }

    private setUpWorld(): void {
        this.physics.world.TILE_BIAS = 18

        const map = this.make.tilemap({ key: this.currentLevel })
        this.tileset = map.addTilesetImage('tiles_packed', Constants.Key.Sprite.KENNEY_DEFAULT_TILESET) as Tileset
        this.terrainTilemapLayer = map.createLayer('terrain', this.tileset as Tileset) as TilemapLayer
        this.terrainTilemapLayer.setCollision(Data.getCollidableTiles())

        this.spikes = map.createFromObjects('objects', {
            name: 'spike',
            classType: Spike,
        })

        this.springs = map.createFromObjects('objects', {
            name: 'spring',
            classType: Spring,
        })

        this.keys = map.createFromObjects('objects', {
            name: 'key',
            classType: Key,
        })

        this.checkpoints = map.createFromObjects('objects', {
            name: 'checkpoint',
            classType: Checkpoint,
        })

        if (this.currentLevel === Constants.Key.Tilemap.LEVEL_3)
        {
            this.locks = []
            this.lockWalls = []
            for (let i = 0; i < 8; i++)
            {
                const lock = map.createFromObjects('objects', {
                    name: 'lock-' + i,
                    classType: Lock,
                })

                const lockWalls = map.createFromObjects('objects', {
                    name: 'lock-wall-' + i,
                    classType: LockWall,
                });

                (lock[0] as Lock).lockWalls = lockWalls as LockWall[]

                this.locks.push(lock[0])
                this.lockWalls = this.lockWalls.concat(lockWalls);

                (lock[0] as Lock).collider = this.physics.add.collider(this.playerGroup, lock.concat(lockWalls))
            }

            const castle = this.add.image(3965, 450, Constants.Key.Sprite.CASTLE)
            castle.setDisplaySize(275, 150)
            castle.setDepth(-100)
            castle.setOrigin(0, 1)
        }

        this.goal = map.createFromObjects('objects', {
            name: 'goal',
            classType: Goal,
        })[0] as Goal

        this.decorationTilemapLayer = map.createLayer('decoration', this.tileset as Tileset) as TilemapLayer
        this.goldTilemapLayer = map.createLayer('gold_tiles', this.tileset as Tileset) as TilemapLayer
        this.goldTilemapLayer.setCollision([10])

        this.physics.add.collider(this.playerGroup, this.terrainTilemapLayer as TilemapLayer)
        this.physics.add.collider(this.playerGroup, this.goldTilemapLayer as TilemapLayer)
        this.physics.add.collider(this.spikes, this.terrainTilemapLayer as TilemapLayer)
        this.physics.add.collider(this.springs, this.terrainTilemapLayer as TilemapLayer)

        this.add.group(this.keys, { runChildUpdate: true })
        this.add.group(this.locks, { runChildUpdate: true })
    }

    private setUpRaycasting(): void {
        this.raycasterPlugin = new PhaserRaycaster(this, this.plugins)
        this.raycaster = this.raycasterPlugin.createRaycaster({
            debug: {
                enabled: true,
                maps: false,
                rays: true,
            },
        })
        this.raycaster.mapGameObjects(this.terrainTilemapLayer, false, { collisionTiles: Data.getCollidableTiles() })
        this.raycaster.mapGameObjects(this.goldTilemapLayer, false, { collisionTiles: [10] })
        this.ray = this.raycaster.createRay()
    }

    private setUpTransition(): void {
        this.transitionScreen = new TransitionScreen(this)
        this.transitionScreen.openAt(this.player.x, this.player.y)
    }

    update(time: number, delta: number) {
        this.handleGodMode()

        this.controls.update(delta)

        this.physics.world.overlap(this.playerGroup, this.spikes, (player, _) => {
            (player as Player).die()
        })

        this.physics.world.overlap(this.playerGroup, this.springs, (player, spring) => {
            (player as Player).handleSpringCollision();
            (spring as Spring).release()
        })

        this.physics.world.overlap(this.playerGroup, this.portals, (player, portal) => {
            (player as Player).enterPortal(portal as Portal)
        })

        this.physics.world.overlap(this.playerGroup, this.goal, (player, _) => {
            (player as Player).win()
        })

        this.physics.world.overlap(this.playerGroup, this.keys, (player, key) => {
            (key as Key).collect()
        })

        this.physics.world.overlap(this.playerGroup, this.checkpoints, (player, checkpoint) => {
            this.latestCheckpoint = checkpoint as Checkpoint
        })
    }

    private handleGodMode() {
        if (this.pKey.isDown)
        {
            this.godMode = true
            console.log('GOD MODE!!!')
        }
        else if (this.oKey.isDown)
        {
            this.godMode = false
            console.log('peasant mode')
        }

        if (this.godMode)
        {
            if (this.cursors.right.isDown)
            {
                if (this.currentLevel === Constants.Key.Tilemap.LEVEL_1)
                {
                    this.loadLevel(Constants.Key.Tilemap.LEVEL_2)
                }
                else if (this.currentLevel === Constants.Key.Tilemap.LEVEL_2)
                {
                    this.loadLevel(Constants.Key.Tilemap.LEVEL_3)
                }
            }
            else if (this.cursors.left.isDown)
            {
                if (this.currentLevel === Constants.Key.Tilemap.LEVEL_2)
                {
                    this.loadLevel(Constants.Key.Tilemap.LEVEL_1)
                }
                else if (this.currentLevel === Constants.Key.Tilemap.LEVEL_3)
                {
                    this.loadLevel(Constants.Key.Tilemap.LEVEL_2)
                }
            }
        }
    }

    public loadLevel(level: Constants.Key.Tilemap) {
        if (level !== this.currentLevel) this.latestCheckpoint = null
        this.transitionScreen.closeAt(this.player.x, this.player.y)
        this.time.delayedCall(1000, () => {

            this.currentLevel = level
            this.scene.start(Constants.Key.Scene.PLAY)
        })
    }
}

export default PlayScene