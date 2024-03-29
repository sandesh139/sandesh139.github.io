const showRulesButton = document.getElementById('showGameRules');
const closeRulesButton = document.getElementById('closeGameRules');
const showRulesInstruction = document.getElementById('styleRulesId');

const submitButton = document.getElementById('submission');

//const resetButton = document.getElementById('reset');

const computerButton = document.getElementById('computer');

// const pauseButton = document.getElementById('pauseGame');

const canvas = document.getElementById('drawing');
const ctx = canvas.getContext('2d');
const maxDepth = 7;

var started = false;

var playerTurn = true;
var computerPlaying = false;

var turnCounter = 0;

let score = 0;
let playing = "pause";

var foundWinner = false;


const defaultHeight = canvas.height;
const defaultWidth = canvas.width;

var defaultRow = 7;
var defaultCol = 7;

var getRowHeight = defaultHeight/defaultRow;
var getColWidth = defaultWidth/defaultCol;

var rowOffSet = getRowHeight/8;
var colOffSet = getColWidth/8;
var actualWidth = getColWidth/2-colOffSet;
var actuaHeight = getRowHeight/2 -rowOffSet;
var ovalProperty = {
    width: actualWidth,
    height: actuaHeight,
    offsetX: colOffSet,
    offsetY: rowOffSet,
    empty: true,
    touched: false,
    player: "none"
}

var ovals = [];



for (let i = 0; i< defaultRow; i++){
    ovals[i] = [];
    for(let j = 0; j< defaultCol; j++){
        const x = j * (ovalProperty.width*2 + ovalProperty.offsetX) +2*ovalProperty.width;
        const y = i * (ovalProperty.height *2+ ovalProperty.offsetY)+2*ovalProperty.height;
        const posX = i;
        const posY = j;
        ovals[i][j] = {x, y , posX,posY, ...ovalProperty}
    }
}


//paddle props

const mouseLocation = {
    x : 0,
    y: 0
}


const movingTile = {
    x: 0,
    y: 0,
    dy: 20,
    targetY: 0,
    playerWho: "none",
    rowStarted: 0,
    colStarted: 0,
    visible: false
}

//showing and hiding the instruction
showRulesButton.addEventListener('click', () =>
    showRulesInstruction.classList.add('show'));

closeRulesButton.addEventListener('click', () =>
    showRulesInstruction.classList.remove('show'));

submitButton.addEventListener('click', setBoard);

//resetButton.addEventListener('click', resetBoard);




window.setTimeout(checkEndGame,600);
function setBoard(){
    
    let test ="";
    let inputRow, inputCol =0;
    foundWinner = false;
    callOneTime = true;
    //timer = setTimeout(drawUpdate,200);
    //window.setTimeout(checkEndGame,600);

        inputRow = document.getElementById('rowInput').value;
        inputCol = document.getElementById('colInput').value;
  
    if (isNaN(inputRow) || inputRow < 4 || inputRow > 20 || isNaN(inputCol)
        || inputCol <4 || inputCol >20) {
        test = "Not-valid: give in between 4 and 20";
        
    } else {
        ovals = [];
        turnCounter = 0;
        test = "Enjoy !";
        started =true;
        defaultRow = inputRow;
        defaultCol = inputCol;
        getRowHeight = defaultHeight/defaultRow;
        getColWidth = defaultWidth/defaultCol;

        rowOffSet = getRowHeight/8;
        colOffSet = getColWidth/8;
        actualWidth = getColWidth/2-colOffSet;
        actuaHeight = getRowHeight/2 -rowOffSet;
        ovalProperty = {
            width: actualWidth,
            height: actuaHeight,
            offsetX: colOffSet,
            offsetY: rowOffSet,
            empty: true,
            touched: false
        }

        for (let i = 0; i< defaultRow; i++){
            ovals[i] = [];
            for(let j = 0; j< defaultCol; j++){
                const x = j * (ovalProperty.width*2 + ovalProperty.offsetX) +2*ovalProperty.width;
                const y = i * (ovalProperty.height *2+ ovalProperty.offsetY)+2*ovalProperty.height;
                ovals[i][j] = {x, y , ...ovalProperty}
            }
        }

    }

document.getElementById("valid").innerHTML = test;
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



function drawOvals(){
    ovals.forEach(column =>{
        column.forEach(eachOval => {
            if(eachOval.empty){
                
                if(mouseLocation.x > eachOval.x - eachOval.width  &&
                    mouseLocation.x < eachOval.x + eachOval.width &&
                    mouseLocation.y > eachOval.y -eachOval.height  &&
                    mouseLocation.y  < eachOval.y + eachOval.height ){
                        eachOval.touched =true;
                    } else {
                        eachOval.touched = false;
                    }
            }
        })
    })

    ovals.forEach(column => {
        column.forEach(eachOval =>{
            ctx.beginPath();
            ctx.ellipse(eachOval.x, eachOval.y, actualWidth, actuaHeight, 0, 0, 2 * Math.PI);
            if(eachOval.touched && eachOval.empty && !foundWinner){
                if(turnCounter % 2 == 0){
                    ctx.fillStyle = 'red';
                } else if(turnCounter % 2 == 1) {
                    ctx.fillStyle = 'blue';
                }
            } else if(eachOval.empty) {
                ctx.fillStyle = '#e6ffff';
            } else if (eachOval.player === "human"){
                ctx.fillStyle = 'red';
            } else if (eachOval.player === "computer"){
                ctx.fillStyle = 'blue';
            }
            
            ctx.fill();
            ctx.closePath();
        })
    })
}

function resetBoard(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ovals = [];
    started = false;
    defaultCol = 8;
    defaultRow = 8;
    turnCounter = 0;
    computerPlaying =false;
}




canvas.addEventListener("mousemove", function(e) { 
    var cRect = canvas.getBoundingClientRect();        // Gets CSS pos, and width/height
    var canvasX = Math.round(e.clientX - cRect.left);   // Subtract the 'left' of the canvas
    var canvasY = Math.round(e.clientY - cRect.top);
    mouseLocation.x = canvasX;
    mouseLocation.y = canvasY;
    
});

canvas.addEventListener("click", clickHandle, false);

function clickHandle(e){
    
    
    if(!foundWinner && !movingTile.visible){
    
    //checkEndGame();
    if(isFull()){
        alert("Game is draw");
        foundWinner =true;
    }
    
    let row,col;
    if(playerTurn || !computerPlaying){
        for(let i =0; i< defaultRow; i++){
            for(let j = 0; j< defaultCol; j++){
                if(ovals[i][j].touched && ovals[i][j].empty){
                    //console.log(ovals[i][j].posX + " "+ ovals[i][j].posY);
                    if(turnCounter %2 == 0){
                        
                       
                        movingTile.rowStarted = i;
                        movingTile.colStarted = j;
                        dropPieceMove(i,j,"human");
                       
                        turnCounter++;
                        //checkEndGame();
                        //computerPlaying = true;
                        
                    } else if(!computerPlaying) {
                        

                        movingTile.rowStarted = i;
                        movingTile.colStarted = j;

                        dropPieceMove(i,j,"computer");
                        //checkEndGame();
                        
                        turnCounter++;
                    }
                    started = true;
                   
                    //undoDrop(j); //this is working
                    
                }
            }
        }
   
}


    //checkEndGame();
    

    if(isFull()){
        alert("Game is draw");
        foundWinner =true;
    }
}

}


var callOneTime = true;
function checkEndGame(){
    if(findWinner() === "human"){
        drawOvals();
        foundWinner = true;
        
        callOneTime = false;
        clearTimeout(timer);
        alert("Red won !");
        
    } else if(findWinner() === "computer"){
        drawOvals();
        foundWinner = true;
        console.log("computer won !");
        callOneTime =false;
        clearTimeout(timer);
        alert("Blue  won !");

    }
    if(callOneTime){
        window.setTimeout(checkEndGame,600);
    }
    
}



function dropPiece(dropRow, dropCol, playerWho){
    let i = dropRow;
    let j = dropCol;
    if(i<0){
        i = 0;
    }
    while(i+1< defaultRow){
        if(!ovals[i+1][j].empty){
            break;
        }
        i++;
    }
    //console.log("this is i" + i);
    ovals[i][j].empty = false;
    ovals[i][j].player = playerWho;
    if(playerWho === "computer"){
        playerTurn = true;
    } else {
        playerTurn = false;
    }
    //playerTurn= false;
    

}

function dropPieceMove(dropRow, dropCol, playerWho){
    let i = dropRow;
    let j = dropCol;
    while(i+1< defaultRow){
        if(!ovals[i+1][j].empty){
            break;
        }
        i++;
    }
    
    clearTimeout(timer);
    movingTile.x = ovals[dropRow][dropCol].x;
    movingTile.y = ovals[dropRow][dropCol].y;
    movingTile.visible = true;
    movingTile.targetY = (ovals[i][dropCol].y);
    movingTile.playerWho = playerWho;
    movePiece();
    //ovals[i][j].empty = false;
    //ovals[i][j].player = playerWho;
}

var completedMove = false;


async function movePiece(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    
    timer = setTimeout(movePiece,200);
    
    movingTile.y +=movingTile.dy;

    ovals.forEach(column => {
        column.forEach(eachOval =>{
            ctx.beginPath();
            ctx.ellipse(eachOval.x, eachOval.y, actualWidth, actuaHeight, 0, 0, 2 * Math.PI);
            if(eachOval.empty) {
                ctx.fillStyle = '#e6ffff';
            } else if (eachOval.player === "human"){
                ctx.fillStyle = 'red';
            } else if (eachOval.player === "computer"){
                ctx.fillStyle = 'blue';
            }

            ctx.fill();
            ctx.closePath();
        })
    })
    ctx.beginPath();
    ctx.ellipse(movingTile.x, movingTile.y, actualWidth, actuaHeight, 0, 0, 2 * Math.PI);
    if(movingTile.playerWho === "human"){
        ctx.fillStyle = 'red';
    } else if (movingTile.playerWho === "computer"){
        ctx.fillStyle = 'blue';
    }
    ctx.fill();
    ctx.closePath();
    
    if(movingTile.y+30>movingTile.targetY){
        clearTimeout(timer);
        dropPiece(movingTile.rowStarted-2, movingTile.colStarted, movingTile.playerWho);
        movingTile.visible = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();
        drawOvals();
        //checkEndGame();
        drawUpdate();
    }

}


function findLocalWinner(r,c,rowOffSet,colOffSet){
    let x = r;
    let y = c;
    let player = ovals[r][c].player;
    let i = 1;
    let localWinner = false;
    let a = 0;
    let isEmpty = ovals[r][c].empty;
    if(!isEmpty){
    while (i<5 && x>=0&&x<defaultRow &&y>=0 &&y<defaultCol ) {
        if (ovals[x][y].player===player) {
            x = r + i * rowOffSet;
            y = c + i * colOffSet;
            a++;
            if (a > 3) {
                localWinner = true;
            }
        }
        i++;
    }
}
    return localWinner;
}


function findWinner(){
    for (let c =0;c<defaultCol;c++){
        for(let r=0; r<defaultRow;r++) {
            let winner = ovals[r][c].player;
            if (findLocalWinner(r, c, 0, 1)) {
                return winner;
            }
            if (findLocalWinner(r, c, 1, 0)) {
                return winner;
            }
            if (findLocalWinner(r, c, 1, 1)) {
                return winner;
            }
            if (findLocalWinner(r, c, 1, -1)) {
                return winner;
            }
        }
    }
    return null;
}



 

function isFull(){
    for (let i = 0; i < defaultCol; i++) {
        if (ovals[0][i].empty) {
            return false;
        }
    }
    return true;
}




function isLegal(column){
    if (column >= 0 && column < defaultCol) {
        if (ovals[defaultRow-1][column].empty) {
            return true;
        }
    }
    return false;
}
//drawing the animation of canvas.
drawUpdate();



var timer;




function drawUpdate(){
    timer = setTimeout(drawUpdate,200);
    
    draw();
    //requestAnimationFrame(drawUpdate);
   
}


function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawOvals();
}

