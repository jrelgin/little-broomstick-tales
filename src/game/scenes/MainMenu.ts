import { Scene, GameObjects } from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../constants';
import { isMobileDevice } from '../utils/device';

export class MainMenu extends Scene
{
    private startButton!: GameObjects.Text;
    private touchControls!: Phaser.GameObjects.Container;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        console.log('MainMenu scene created');
        
        // Use the game's base resolution for positioning
        const gameWidth = GAME_WIDTH;
        const gameHeight = GAME_HEIGHT;
        const centerX = gameWidth / 2;
        const centerY = gameHeight / 2;
        
        console.log('Game dimensions:', gameWidth, 'x', gameHeight);
        
        // Create background that fills the entire game area
        this.add.rectangle(centerX, centerY, gameWidth, gameHeight, 0xFFE4EC)
            .setOrigin(0.5);

        // Create title - positioned in upper portion
        this.add.text(centerX, centerY - 200, 'Little Broomstick Tales', {
            fontFamily: 'Arial Black',
            fontSize: '48px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);

        // Create start button - positioned in center
        this.startButton = this.add.text(centerX, centerY, 'Start Game', {
            fontFamily: 'Arial Black',
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center',
            backgroundColor: '#4a90e2',
            padding: {
                left: 20,
                right: 20,
                top: 10,
                bottom: 10
            }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => {
            console.log('Button hover');
            this.startButton.setScale(1.1);
        })
        .on('pointerout', () => {
            console.log('Button out');
            this.startButton.setScale(1);
        })
        .on('pointerdown', () => {
            console.log('Button clicked');
            this.scene.start('Game');
        });

        // Create instructions - positioned in lower portion
        this.add.text(centerX, centerY + 150, 'Use arrow keys to move\nthe little witch cat around the forest!', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center'
        }).setOrigin(0.5);

        // Add touch control preview only on mobile devices
        if (isMobileDevice()) {
            console.log('Mobile device detected, showing touch controls preview');
            this.createTouchControlPreview();
        } else {
            console.log('Desktop device detected, hiding touch controls');
        }
    }

    private createTouchControlPreview() {
        // Create a visual preview of touch controls for testing
        this.touchControls = this.add.container(0, 0);
        
        const touchZoneSize = 120; // Appropriate for 1024x768 resolution
        const deadZoneSize = 30;
        const touchZoneX = 100; // From left edge
        const touchZoneY = GAME_HEIGHT - 100; // From top
        
        console.log('Creating touch controls at:', touchZoneX, touchZoneY);
        
        // Add touch control visual indicators
        const touchZoneBg = this.add.circle(touchZoneX, touchZoneY, touchZoneSize / 2, 0x000000, 0.4);
        const deadZoneBg = this.add.circle(touchZoneX, touchZoneY, deadZoneSize / 2, 0x000000, 0.7);
        
        // Add label
        const labelText = this.add.text(touchZoneX, touchZoneY - touchZoneSize/2 - 25, 'Touch\nControls', {
            fontFamily: 'Arial',
            fontSize: '14px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2,
            align: 'center'
        }).setOrigin(0.5);
        
        this.touchControls.add([touchZoneBg, deadZoneBg, labelText]);
    }

}
