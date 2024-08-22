import { Scene } from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');
        this.totalScore = 0; // Variable persistente para el puntaje total
    }

    create() {
        this.cameras.main.setBackgroundColor(0x2973a3);

        this.add.image(512, 384, 'background').setAlpha(0.5);

        // Mostrar el puntaje acumulado
        this.scoreText = this.add.text(10, 10, 'Score: ' + this.totalScore, { fontSize: '20px', fill: '#fff' });
  
        // Crear pala como rectángulo
        this.paddle = this.add.rectangle(400, 650, 100, 20, 0xd11c1c);
        this.physics.add.existing(this.paddle);
        this.paddle.body.setImmovable(true);
        this.paddle.body.setCollideWorldBounds(true);
  
        // Crear bola como sprite utilizando la imagen cargada
        this.ball = this.add.sprite(400, 400, "ball");
        this.ball.setScale(0.06);
        this.physics.add.existing(this.ball);
        this.ball.body.setCollideWorldBounds(true);
        this.ball.body.setBounce(1, 1);
        this.ball.body.setVelocity(200, 200);
  
        // Activar colisiones con los límites del mundo para la pelota
        this.ball.body.onWorldBounds = true;
  
        // Crear un contenedor para los obstáculos
        this.obstacleContainer = this.add.container();
  
        // Añadir múltiples obstáculos al contenedor en una cuadrícula
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 8; col++) {
                let x = 150 + col * 100;
                let y = 100 + row * 40;
                let obstacle = this.add.rectangle(x, y, 60, 20, 0x24bf39);
                this.physics.add.existing(obstacle);
                obstacle.body.setImmovable(true);
                this.obstacleContainer.add(obstacle);
            }
        }
  
        // Configurar para que la pala no sea afectada por la gravedad
        this.paddle.body.setAllowGravity(false);
  
        // Agregar colisiones
        this.physics.add.collider(this.paddle, this.ball, null, null, this);
        this.physics.add.collider(this.obstacleContainer.list, this.ball, this.handleCollision, null, this);
  
        // Colisión de la pelota con el límite inferior
        this.physics.world.on("worldbounds", (body, up, down, left, right) => {
            if (down && body.gameObject === this.ball) {
                console.log("hit bottom");
                this.GameOver();
            }
        });
  
        // Crear cursor
        this.cursor = this.input.keyboard.createCursorKeys();
    }

    update() {
        // Mover la pala con el cursor del mouse
        this.paddle.x = this.input.activePointer.x;
    
        // Asegurarse de que la pala no se salga de los límites
        if (this.paddle.x < this.paddle.width / 2) {
            this.paddle.x = this.paddle.width / 2;
        } else if (this.paddle.x > this.scale.width - this.paddle.width / 2) {
            this.paddle.x = this.scale.width - this.paddle.width / 2;
        }
    }

    handleCollision(obstacle, ball) {
        console.log("collision");
        obstacle.destroy();
    
        // Incrementar el puntaje y actualizar el texto
        this.totalScore += 10;
        this.scoreText.setText('Score: ' + this.totalScore);
        
        // Verificar si todos los obstáculos han sido destruidos
        if (this.obstacleContainer.count('children') === 0) {
            this.restartGame();
        }
    }

    GameOver() {
        console.log('Game Over');
        // Pasar el puntaje a la escena de Game Over
        this.scene.start('GameOver', { finalScore: this.totalScore });
        this.totalScore = 0; // Restablecer el puntaje acumulado
    }

    restartGame() {
        // Aumentar la velocidad de la pelota en un 10%
        this.ball.body.velocity.x *= 1.1;
        this.ball.body.velocity.y *= 1.1;

        // Reiniciar la escena sin reiniciar el puntaje
        this.scene.restart();
    }
}
