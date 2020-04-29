const cvs = document.getElementById("pong");
const ctx = cvs.getContext("2d");

const user={
    x: 0,
    y: cvs.height/2 - 100/2,
    width:10,
    height: 100,
    color: "WHITE"
}

const com = {
    x: cvs.width -10,
    y: cvs.height/2 - 100/2,
    width: 10,
    height: 100,
    color:"WHITE"
}

const ball = {
    x: cvs.width/2,
    y: cvs.height/2,
    radius: 10,
    speed : 5,
    velocityX : 5,
    velocityY : 5,
    color: "WHITE"
}

const net = {
    x: cvs.width/2,
    y: 0,
    width: 2,
    height: 10,
    color: "WHITE"
}

function drawRectangle(x, y, width, height, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);

}


function drawCircle(x, y, radius, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
}

function render(){
    //draws the table 
    drawRectangle(0, 0, cvs.width, cvs.height, "BLACK");
    
    // draws the paddles
    drawRectangle(user.x, user.y, user.width, user.height, user.color);
    drawRectangle(com.x, com.y, com.width, com.height, com.color);
    
    //draws the ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}
cvs.addEventListener("mousemove", movePaddle);

function movePaddle(evt){
    let rect = cvs.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height/2; 
}

function collision(ball, p){
    
    ball.top = ball.y + ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;
    ball.right = ball.x + ball.radius;
    
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    

   return (ball.right > p.left && ball.top < p.bottom
           && ball.left < p.right && ball.bottom > p.top);

}

function resetBall(){
    ball.x = cvs.width/2;
    ball.y = cvs.height/2;
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}


function update(){
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    
    // AI to move opposing paddle
    let computerLevel = 0.1;
    com.y += (ball.y - (com.y + com.height/2 ))* computerLevel;
    
    if (ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0){
           ball.velocityY = -ball.velocityY;
       }

    let player = (ball.x < cvs.width/2) ? user : com;
    if (collision(ball, player)){
        let collidePoint = ball.y - (player.y + player.height/2);
        collidePoint = collidePoint/(player.height/2);
        
        // calculate the angle 
        let angleRad = collidePoint * Math.PI/4;
       
        let direction = (ball.x < cvs.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = direction * ball.speed * Math.sin(angleRad);
       
        ball.speed += 0.5;
    }
   if (ball.x - ball.radius < 0){
       resetBall();
   }
   else if (ball.x + ball.radius > cvs.width){
       resetBall();
   }
}

function game(){
    update();
    render();
}

const framePerSecond = 50;
setInterval(game, 1000/framePerSecond);


