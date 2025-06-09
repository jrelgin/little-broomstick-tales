import { Scene } from 'phaser';

export class GameComplete extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    titleText: Phaser.GameObjects.Text;
    messageText: Phaser.GameObjects.Text;
    playAgainText: Phaser.GameObjects.Text;

    constructor ()
    {
        super('GameComplete');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x87CEEB); // Light blue background

        // Get the center of the screen
        const centerX = this.camera.width / 2;
        const centerY = this.camera.height / 2;

        // Calculate scale factors based on screen size
        const baseWidth = 3072; // Our reference width
        const baseHeight = 1920; // Our reference height
        const scaleX = this.camera.width / baseWidth;
        const scaleY = this.camera.height / baseHeight;
        const scale = Math.min(scaleX, scaleY); // Use the smaller scale to maintain aspect ratio

        // Add a semi-transparent background
        this.background = this.add.image(centerX, centerY, 'background')
            .setDisplaySize(this.camera.width, this.camera.height)
            .setAlpha(0.3);

        // Add the main title with responsive font size
        const titleFontSize = Math.floor(128 * scale);
        this.titleText = this.add.text(centerX, centerY * 0.4, 'Congratulations!', {
            fontFamily: 'Arial Black',
            fontSize: `${titleFontSize}px`,
            color: '#FFD700', // Gold color
            stroke: '#000000',
            strokeThickness: Math.max(4, Math.floor(16 * scale)),
            align: 'center'
        });
        this.titleText.setOrigin(0.5);

        // Add a positive message with responsive font size
        const messageFontSize = Math.floor(64 * scale);
        this.messageText = this.add.text(centerX, centerY * 0.7, 'You completed your magical adventure!', {
            fontFamily: 'Arial',
            fontSize: `${messageFontSize}px`,
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: Math.max(3, Math.floor(12 * scale)),
            align: 'center'
        });
        this.messageText.setOrigin(0.5);

        // Add play again text with responsive font size
        const playAgainFontSize = Math.floor(48 * scale);
        this.playAgainText = this.add.text(centerX, centerY * 1.2, 'Click anywhere to play again', {
            fontFamily: 'Arial',
            fontSize: `${playAgainFontSize}px`,
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: Math.max(2, Math.floor(8 * scale)),
            align: 'center'
        });
        this.playAgainText.setOrigin(0.5);

        // Add a gentle floating animation to the play again text
        this.tweens.add({
            targets: this.playAgainText,
            y: centerY * 1.25,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Return to main menu on click
        this.input.once('pointerdown', () => {
            this.scene.start('MainMenu');
        });

        // Handle window resize
        this.scale.on('resize', this.resize, this);
    }

    private resize(gameSize: { width: number; height: number }) {
        // Update camera
        this.cameras.main.setSize(gameSize.width, gameSize.height);
        
        // Get new center coordinates
        const centerX = gameSize.width / 2;
        const centerY = gameSize.height / 2;
        
        // Update background
        this.background.setPosition(centerX, centerY)
            .setDisplaySize(gameSize.width, gameSize.height);
        
        // Update text positions
        this.titleText.setPosition(centerX, centerY * 0.4);
        this.messageText.setPosition(centerX, centerY * 0.7);
        this.playAgainText.setPosition(centerX, centerY * 1.2);
    }
}
