﻿import { Scene } from 'phaser'
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
    public currentKey: Key | null

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
            key: Constants.Key.Animation.PLAYER_RUNNING,
            frames: [
                { key: Constants.Key.Sprite.PLAYER_RUNNING },
                { key: Constants.Key.Sprite.PLAYER_IDLE },
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
        this.player = new Player(this, 300, 700)
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
        this.background.setDepth(-1)
        this.background.setScrollFactor(0, 0.2)

        this.cameras.main.setBounds(50, 0, 4200, 840)
    }

    private setUpTilemap(): void {
        this.physics.world.TILE_BIAS = 18

        const map = this.make.tilemap({ key: Constants.Key.Tilemap.LEVEL_3 })
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

        this.locks = []
        this.lockWalls = []
        for (let i = 0; i < 1; i++)
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
            this.lockWalls = this.lockWalls.concat(lockWalls)
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
        this.physics.add.collider(this.playerGroup, this.locks)
        this.physics.add.collider(this.playerGroup, this.lockWalls)
        this.physics.add.collider(this.spikes, this.terrainTilemapLayer as TilemapLayer)
        this.physics.add.collider(this.springs, this.terrainTilemapLayer as TilemapLayer)

        this.add.group(this.keys, { runChildUpdate: true })
        this.add.group(this.locks, { runChildUpdate: true })
    }

    private setUpRaycasting(): void {
        this.raycasterPlugin = new PhaserRaycaster(this, this.plugins)
        this.raycaster = this.raycasterPlugin.createRaycaster({ debug: true })
        this.raycaster.mapGameObjects(this.terrainTilemapLayer, false, { collisionTiles: Data.getCollidableTiles() })
        this.raycaster.mapGameObjects(this.goldTilemapLayer, false, { collisionTiles: [10] })
        this.ray = this.raycaster.createRay()
    }

    update(time: number, delta: number) {
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
    }
}

export default PlayScene