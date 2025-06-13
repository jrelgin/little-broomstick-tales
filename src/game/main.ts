import { Boot } from './scenes/Boot';
import { GameComplete } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game, Scale } from 'phaser';
import { Preloader } from './scenes/Preloader';
import {
    GAME_HEIGHT,
    GAME_WIDTH,
    MAX_HEIGHT,
    MAX_WIDTH,
    MIN_HEIGHT,
    MIN_WIDTH
} from './constants';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game-container',
    backgroundColor: '#028af8',
    render: {
        antialias: false,
        pixelArt: true,
        roundPixels: true
    },
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        min: {
            width: MIN_WIDTH,
            height: MIN_HEIGHT
        },
        max: {
            width: MAX_WIDTH,
            height: MAX_HEIGHT
        }
    },
    input: {
        gamepad: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameComplete
    ],
    dom: {
        createContainer: true
    }
};

export default function StartGame(containerId: string) {
    const game = new Game({ ...config, parent: containerId });
    game.canvas.style.cursor = 'none';
    return game;
}
