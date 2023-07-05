import { Scene } from 'phaser'
import { Constants } from '../index'
import Player from '../objects/Player'
import { Data } from '../constants'
import Spike from '../objects/Spike'
import Spring from '../objects/Spring'
import PhaserRaycaster from 'phaser-raycaster'
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
        this.setUpCamera()

        this.player = this.add.group([new Player(this, 500, 300)], { runChildUpdate: true })

        this.setUpTilemap()
        this.setUpRaycasting()
    }

    private setUpInputs(): void {
        this.cursors = this.input.keyboard?.createCursorKeys() as Phaser.Types.Input.Keyboard.CursorKeys

        this.wKey = this.input.keyboard?.addKey('W') as Phaser.Input.Keyboard.Key
        this.aKey = this.input.keyboard?.addKey('A') as Phaser.Input.Keyboard.Key
        this.sKey = this.input.keyboard?.addKey('S') as Phaser.Input.Keyboard.Key
        this.dKey = this.input.keyboard?.addKey('D') as Phaser.Input.Keyboard.Key
    }

    private setUpCamera(): void {
        this.cameras.main.setZoom(2)
        this.cameras.main.centerOn(450, 350)

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

        this.physics.add.collider(this.player, this.tilemapLayer as TilemapLayer)
        this.physics.add.collider(this.spikes, this.tilemapLayer as TilemapLayer)
        this.physics.add.collider(this.springs, this.tilemapLayer as TilemapLayer)
    }

    private setUpRaycasting(): void {
        this.raycasterPlugin = new PhaserRaycaster(this, this.plugins)
        this.raycaster = this.raycasterPlugin.createRaycaster({ debug: true })
        this.raycaster.mapGameObjects(this.tilemapLayer)
        this.raycaster.mapGameObjects(this.springs)
        this.raycaster.mapGameObjects(this.spikes)
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
    }
}

export default PlayScene