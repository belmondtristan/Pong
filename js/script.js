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





let pongId;
let bouton_g = document.getElementById('fleche-gauche');
let bouton_d = document.getElementById('fleche-droite');
let bouton_new = document.getElementById('b_new');

 const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

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
    moveBall(b_speed, b_angle);
    draw_raquette();
    drawBall();
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
        b_speed = b_speed*(-1);
        b_angle = (Math.PI - b_angle)*(-1);
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
    cancelAnimationFrame(pongId);
    draw();
}


//place tout les elements au centre et lance la boucle du jeu
function startGame() {
    running = true;
    x_b = (400-4)/2;
    y_b = canvas.height/2;
    x_r = (canvas.width-80)/2;
    b_angle = Math.random();
    b_speed = speed_b_default;
    y_b = canvas.height/2;
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

loop();