﻿export namespace Key
{
    export enum Audio
    {
        DEFAULT = 'key.audio.default'
    }

    export enum Sprite
    {
        CIRCLE = 'key.sprite.circle',
        SQUARE = 'key.sprite.square',
        GRADIENT_TOP_TO_BOTTOM = 'key.sprite.gradient-top-to-bottom',
        KENNEY_DEFAULT_TILESET = 'key.sprite.kenney-default-tileset',
        COIN_FRONT = 'key.sprite.coin-front',
        COIN_SIDE = 'key.sprite.coin-side',
        SPIKE = 'key.sprite.spike',
        DOOR = 'key.sprite.door',
        FLAG_1 = 'key.sprite.flag-1',
        FLAG_2 = 'key.sprite.flag-2',
        KEY = 'key.sprite.key',
        LOCK = 'key.sprite.lock',
        LOCK_WALL = 'key.sprite.lock-wall',
        CASTLE = 'key.sprite.castle',
        SPRING_COMPRESSED = 'key.sprite.spring-compressed',
        SPRING_RELEASED = 'key.sprite.spring-released',
        PLAYER_IDLE = 'key.sprite.player-idle',
        PLAYER_RUNNING = 'key.sprite.player-running',
        BACKGROUND = 'ley.sprite.background',
    }

    export enum Animation
    {
        COIN = 'key.animation.coin',
        PLAYER_RUNNING = 'key.animation.player-running',
        FLAG_WAVING = 'ley.animation.flag-waving'
    }

    export enum Scene
    {
        BOOT = 'key.scene.boot',
        LOAD = 'key.scene.load',
        PLAY = 'key.scene.play',
    }

    export namespace Tileset
    {
        export namespace Terrain
        {
            export enum Base
            {
                COL_MID = 120,
                MID_LEFT = 121,
                MID_MID = 122,
                MID_RIGHT = 123,
                COL_BOT = 140,
                BOT_LEFT = 141,
                BOT_MID = 142,
                BOT_RIGHT = 143,
                CORNER_TOP_LEFT = 4,
                CORNER_TOP_RIGHT = 5,
                CORNER_BOT_LEFT = 24,
                CORNER_BOT_RIGHT = 25,
            }

            export enum Grass
            {
                UNIT = 0,
                ROW_LEFT = 1,
                ROW_MID = 2,
                ROW_RIGHT = 3,
                COL_TOP = 20,
                TOP_LEFT = 21,
                TOP_MID = 22,
                TOP_RIGHT = 23,
            }

            export enum Dessert
            {
                UNIT = 40,
                ROW_LEFT = 41,
                ROW_MID = 42,
                ROW_RIGHT = 43,
                COL_TOP = 60,
                TOP_LEFT = 61,
                TOP_MID = 62,
                TOP_RIGHT = 63,
            }

            export enum Snowy
            {
                UNIT = 80,
                ROW_LEFT = 81,
                ROW_MID = 82,
                ROW_RIGHT = 83,
                COL_TOP = 100,
                TOP_LEFT = 101,
                TOP_MID = 102,
                TOP_RIGHT = 103,
            }

            export enum WoodenPlank
            {
                UNIT = 47,
                LEFT = 48,
                MID = 49,
                RIGHT = 50,
            }
        }

        export enum Decorations
        {
            PLANT_SMALL = 124,
            PLANT_LARGE = 125,
            PINE_TREE = 126,
            CACTUS = 127,
            MUSHROOM_RED = 128,
            MUSHROOM_BROWN = 129,
        }

        export enum Interactables
        {
            KEY = 27,
            LEVER_LEFT = 64,
            LEVER_MID = 65,
            LEVER_RIGHT = 66,
            DIAMOND = 67,
            SPRING_COMPRESSED = 107,
            SPRING_RELEASED = 108,
            DOOR_TOP = 110,
            DOOR_WITH_WINDOW = 130,
            DOOR_NO_WINDOW = 150,
            COIN_FRONT = 151,
            COIN_SIDE = 152,
        }

        export namespace Props
        {
            export namespace Trees
            {
                export namespace Mushroom
                {
                    export enum Trunk
                    {
                        BOTTOM = 72,
                        MID = 52,
                        TOP = 32,
                    }

                    export enum Canopy
                    {
                        WITH_TRUNK = 12,
                        NO_TRUNK = 13,
                        LEFT = 14,
                        RIGHT = 15,
                    }
                }

                export namespace Wooden
                {
                    export enum Trunk
                    {
                        BOTTOM = 72,
                        MID = 52,
                        TOP = 32,
                    }

                    export enum Canopy
                    {
                        WITH_TRUNK = 12,
                        NO_TRUNK = 13,
                        LEFT = 14,
                        RIGHT = 15,
                    }

                    export enum Branch
                    {
                        WITH_LEAVES_LEFT,
                        NO_LEAVES_LEFT,
                        NO_LEAVES_RIGHT,
                        LEFT,
                        RIGHT,
                        WITH_LEAVES_MID,
                        NO_LEAVES_MID,
                    }
                }
            }
        }
    }

    export enum Tilemap
    {
        LEVEL_1 = 'key.tilemap.level-1',
        LEVEL_2 = 'key.tilemap.level-2',
        LEVEL_3 = 'key.tilemap.level-3',
    }
}
