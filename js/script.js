const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');
let x_b = (400-4)/2;
let y_b = 572;
const speed_b_default = 2;
let b_angle; // angle entre 45 et 135 degrés
let b_speed = speed_b_default;
let x_r = (canvas.width-80)/2;
let r_speed = 10;

let running = false;
let starttime;





let pongId;
let bouton_g = document.getElementById('fleche-gauche');
let bouton_d = document.getElementById('fleche-droite');
let bouton_new = document.getElementById('b_new');
let score = 0;
let bestScore = 0;
let scorValue = document.getElementById('score-value');
let bestScorValue = document.getElementById('best-score-value');

 const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// Support tactile pour mobile : boutons gauche/droite
if (bouton_g && bouton_d) {
    bouton_g.addEventListener('touchstart', function(e) {
        e.preventDefault();
        keys['ArrowLeft'] = true;
    });
    bouton_g.addEventListener('touchend', function(e) {
        e.preventDefault();
        keys['ArrowLeft'] = false;
    });
    bouton_d.addEventListener('touchstart', function(e) {
        e.preventDefault();
        keys['ArrowRight'] = true;
    });
    bouton_d.addEventListener('touchend', function(e) {
        e.preventDefault();
        keys['ArrowRight'] = false;
    });
}

function draw(){
    ctx.fillStyle = 'white';
    ctx.fillRect(x_r, 580, 80, 10);
    
    ctx.beginPath();
    ctx.arc(x_b, y_b, 8, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
}


function update(){
    if(keys["ArrowLeft"] && x_r > 0) x_r -= r_speed;
    if(keys["ArrowRight"] && x_r + 80  < canvas.width) x_r += r_speed;
    if (b_speed < 8 && b_speed > 0) {
        b_speed = b_speed + 0.01;
    }
    if (b_speed > -8 && b_speed < 0) {
        b_speed = b_speed - 0.001;
    }
    moveBall(b_speed, b_angle);
    draw_raquette();
    drawBall();
    calculScore();
   
}



function calculScore(){
    if (running) {
        scoreUpdate();
    }
}

function initScore(){
    score = 0;
    bestScore = 0;
    scorValue.textContent = score;
    bestScorValue.textContent = bestScore;
}

function resetScore(){
    score = 0;
    scorValue.textContent = score;
}

function scoreUpdate(){
    score = Math.floor((Date.now() - starttime) / 1000);
    scorValue.textContent = score;
    if (score > bestScore) {
        bestScore = score;
        bestScorValue.textContent = bestScore;
    }
}

function draw_raquette(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(x_r,580, 80 ,10);
}

function drawBall() {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(x_b, y_b, 8, 0, Math.PI * 2);
    ctx.fill();
}

function moveBall(speed, angle) {
    y_b -= speed;
    x_b += speed * Math.cos(angle);
    if (y_b <= 0) {
        b_speed = b_speed * (-1);
        b_angle = (Math.PI - b_angle) * (-1);
    }
    // Collision balle/raquette avec marge
    if (
        y_b + 8 >= 580 && // bas de la balle touche le haut de la raquette
        y_b - 8 <= 590 && // haut de la balle ne dépasse pas trop la raquette
        x_b + 8 >= x_r && // balle touche le côté gauche de la raquette
        x_b - 8 <= x_r + 80 // balle touche le côté droit de la raquette
    ) {
        b_speed = b_speed * (-1); // rebondit vers le haut
        let hit = (x_b - (x_r + 40)) / 40; // -1 (gauche) à +1 (droite)
        b_angle = hit * (Math.PI - b_angle); // modifie l'angle selon l'endroit où la balle touche la raquette
    }
    if (y_b >= canvas.height) {
        stopGame();
    }
    if (x_b <= 0 || x_b >= 400) {
        b_angle = Math.PI - b_angle;
    }
}

function loop() {
    if (running) {
        update();
        pongId = requestAnimationFrame(loop);
      } else {
        // dessiner l'état final si perdu
        draw();
      }
}

function stopGame() {
    running = false;
    resetValues();
    draw();
    cancelAnimationFrame(pongId);
    alert("Game Over! Ton score: " + score + " seconds.");
}

function resetValues(){
    x_b = (400-4)/2;
    y_b = canvas.height/2;
    b_speed = speed_b_default;
    b_angle = Math.random();
    x_r = (canvas.width-80)/2;
}

//place tout les elements au centre et lance la boucle du jeu
function startGame() {
    running = true;
    resetValues();
    starttime = Date.now();
    if (bestScore == 0){
        initScore();
    }
    else{
        resetScore();
    }
    
    loop();
}

//prototype deplacement raquette avec boutons
/*document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowLeft":
            // Déplacer vers la gauche (en évitant de sortir du canvas)
            if (x_r > 0) x_r -= r_speed;
            break;

        case "ArrowRight":
            // Déplacer vers la droite (en évitant de dépasser la largeur)
            if (x_r + 80 < canvas.width) x_r += r_speed;
            break;

        default:
            // Pour toute autre touche, on ne fait rien
            break;
    }
    draw_raquette(); // on redessine après le déplacement
});*/

bouton_new.addEventListener('click',() => {
   startGame();
})
