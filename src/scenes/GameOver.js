import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    init(data) {
        // Guardar el puntaje pasado desde la escena anterior
        this.finalScore = data.finalScore || 0;
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0xff0000);

        this.add.image(512, 384, 'background').setAlpha(0.5);

        const width = this.scale.width;
        const height = this.scale.height;
        
        // Mostrar el mensaje de Game Over y el puntaje final
        this.add.text(width / 2, height / 2 - 100, "GAME OVER", {
          fontSize: "64px",
          fill: "#fff"
        }).setOrigin(0.5);
    
        this.add.text(width / 2, height / 2, `Score: ${this.finalScore}`, {
          fontSize: "32px",
          fill: "#fff"
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('MainMenu');

        });
    }
}
