class ResultScene extends Phaser.Scene {
    constructor() {
        super('ResultScene');
    }

    create() {
        this.add.text(250, 250, 'Game Over', { fontSize: '32px', fill: '#fff' });
        const restartButton = this.add.text(300, 350, 'Restart', { fontSize: '24px', fill: '#ff0' });
        restartButton.setInteractive();
        restartButton.on('pointerdown', () => {
            this.scene.start('FightScene');
        });
    }
}