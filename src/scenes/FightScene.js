class FightScene extends Phaser.Scene {
    constructor() {
        super('FightScene');
    }

    create() {
        this.add.text(20, 20, 'Fighting...', { fontSize: '24px', fill: '#fff' });

        // Player and enemy placeholder
        this.player = this.add.rectangle(100, 500, 50, 100, 0x00ff00);
        this.enemy = this.add.rectangle(700, 500, 50, 100, 0xff0000);

        // Key input for movement
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // Move player with arrow keys
        if (this.cursors.left.isDown) {
            this.player.x -= 5;
        } else if (this.cursors.right.isDown) {
            this.player.x += 5;
        }

        // Simple enemy AI (move left and right)
        this.enemy.x += Math.sin(this.time.now / 500) * 2;
    }
}