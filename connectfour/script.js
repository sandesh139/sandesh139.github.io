const showRulesButton = document.getElementById('showGameRules');
const closeRulesButton = document.getElementById('closeGameRules');
const showRulesInstruction = document.getElementById('styleRulesId');
const playButton = document.getElementById('playGame');
const pauseButton = document.getElementById('pauseGame');

const canvas = document.getElementById('drawing');
const ctx = canvas.getContext('2d');





let score = 0;
let playing = "pause";
const brickRowSize = 9;
const brickColSize = 5;



const defaultHeight = canvas.height;
const defaultWidth = canvas.width;

const defaultRow = 6;
const defaultCol = 5;

const getRowHeight = defaultHeight/defaultRow;
const getColWidth = defaultWidth/defaultCol;

const rowOffSet = getRowHeight/8;
const colOffSet = getColWidth/8;
const actualWidth = getColWidth/2-colOffSet;
const actuaHeight = getRowHeight/2 -rowOffSet;
const ovalProperty = {
    width: actualWidth,
    height: actuaHeight,
    offsetX: colOffSet,
    offsetY: rowOffSet,
    empty: true,
    touched: false
}

const ovals = [];
// for (let i = 0; i< defaultRow; i++){
//     ovals[i] = [];
//     for(let j = 0; j< defaultCol; j++){
//         const x = j * (actualWidth*2 + colOffSet) +2*actualWidth;
//         const y = i * (actuaHeight *2+ rowOffSet)+2*actuaHeight;
//         ovals[i][j] = {x, y , ...ovalProperty}
//     }
// }

for (let i = 0; i< defaultRow; i++){
    ovals[i] = [];
    for(let j = 0; j< defaultCol; j++){
        const x = j * (ovalProperty.width*2 + ovalProperty.offsetX) +2*ovalProperty.width;
        const y = i * (ovalProperty.height *2+ ovalProperty.offsetY)+2*ovalProperty.height;
        ovals[i][j] = {x, y , ...ovalProperty}
    }
}


//brick property
const brickProperty = {
    width: 70,
    height: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true
}


//paddle props

const mouseLocation = {
    x : 0,
    y: 0
}
const paddle = {
    x: canvas.width /2 -30,
    y: canvas.height - 25,
    width: 80,
    height: 10,
    dx: 0,
}

//ball props
const ball = {
    x: canvas.width /2,
    y: canvas.height /2,
    radius: 10,
    speed: 4,
    dx: 4,
    dy: -4 

}




//showing and hiding the instruction
showRulesButton.addEventListener('click', () =>
    showRulesInstruction.classList.add('show'));

closeRulesButton.addEventListener('click', () =>
    showRulesInstruction.classList.remove('show'));


playButton.addEventListener('click', startGame);

function startGame(){
    playing = "play";
    console.log('should be playing');
}

pauseButton.addEventListener('click', pauseGame);

function pauseGame(){
    playing = "pause";
    console.log('should be pause');
}

//function to draw ball on canvas
function drawBall(){
    ctx.beginPath();
    ctx.arc(ball.x,ball.y,ball.radius,0,Math.PI*2);
    ctx.fillStyle =  '#0095dd';
    ctx.fill();
    ctx.closePath();
}

//function to draw paddle on canvas
function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddle.x,paddle.y,paddle.width, paddle.height);
    ctx.fillStyle =  '#0095dd';
    ctx.fill();
    ctx.closePath();
}

function drawBackground(){
    ctx.beginPath();
    ctx.rect(0,0,canvas.width, canvas.height);
    ctx.fillStyle =  '#A9A9A9';
    ctx.fill();
    ctx.closePath();
}

//Labeling score
function labelScore(){
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`,canvas.width -100 ,30)
}

//building bricks
const bricks = [];
for (let i = 0; i< brickRowSize; i++){
    bricks[i] = [];
    for(let j = 0; j< brickColSize; j++){
        const x = i * (brickProperty.width + brickProperty.padding) + brickProperty.offsetX;
        const y = j * (brickProperty.height + brickProperty.padding) + brickProperty.offsetX;
        bricks[i][j] = {x, y , ...brickProperty}
    }
}

function drawOvals(){
    ovals.forEach(column =>{
        column.forEach(eachOval => {
            if(eachOval.empty){
                console.log("this is empty");
                if(mouseLocation.x > eachOval.x - eachOval.width &&
                    mouseLocation.x < eachOval.x + eachOval.width &&
                    mouseLocation.y > eachOval.y -eachOval.height &&
                    mouseLocation.y - ball.radius < eachOval.y + eachOval.height){
                        eachOval.touched =true;
                    }
            }
        })
    })

    ovals.forEach(column => {
        column.forEach(eachOval =>{
            ctx.beginPath();
            ctx.ellipse(eachOval.x, eachOval.y, actualWidth, actuaHeight, 0, 0, 2 * Math.PI);
            if(eachOval.touched){
                ctx.fillStyle = 'red';
            } else {
                ctx.fillStyle = '#e6ffff';
            }
            
            ctx.fill();
            ctx.closePath();
        })
    })
}




canvas.addEventListener("mousemove", function(e) { 
    var cRect = canvas.getBoundingClientRect();        // Gets CSS pos, and width/height
    var canvasX = Math.round(e.clientX - cRect.left);   // Subtract the 'left' of the canvas
    var canvasY = Math.round(e.clientY - cRect.top);
    mouseLocation.x = canvasX;
    mouseLocation.y = canvasY;
    paddle.x = canvasX;
    
    //console.log(canvasX +"  "+ canvasY);
});


function moveBall(){
    ball.x += ball.dx;
    ball.y += ball.dy;

    //wall reflection
    if(ball.x +ball.radius > canvas.width || ball.x - ball.radius <0){
        ball.dx *= -1;

    }

    if(ball.y+ball.radius > canvas.height || ball.y - ball.radius <0){
        ball.dy *= -1;

    }

    if(ball.x - ball.radius > paddle.x && 
       ball.x + ball.radius < paddle.x + paddle.width &&
       ball.y + ball.radius > paddle.y)
       {
           ball.dy = -ball.speed;
       }
    
    //ball hits brick
    bricks.forEach(column =>{
        column.forEach(eachBrick => {
            if(eachBrick.visible){
                if(ball.x -ball.radius > eachBrick.x &&
                    ball.x + ball.radius < eachBrick.x + eachBrick.width &&
                    ball.y + ball.radius > eachBrick.y &&
                    ball.y - ball.radius < eachBrick.y + eachBrick.height){
                        ball.dy *= -1;
                        eachBrick.visible = false;
                        updateScore();
                    }
            }
        })
    })

    if(ball.y +ball.radius >canvas.height){
        drawAllBricks();
    }

}

function updateScore(){
    score++;
    if(score % (brickRowSize * brickColSize) === 0){
        drawAllBricks();
    }
}

function drawAllBricks(){
    bricks.forEach(column =>{
        column.forEach(eachBrick => {
            eachBrick.visible =true;
        })
    })
    score =0;
}

function drawCircles(){
    
}

//drawing the animation of canvas.
draw();
drawUpdate();
function drawUpdate(){

    draw();
    // if(playing === "play"){
    //     draw();
    // }
    requestAnimationFrame(drawUpdate);
   
}
function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawOvals();
    
}