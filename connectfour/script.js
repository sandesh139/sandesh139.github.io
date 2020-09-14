const showRulesButton = document.getElementById('showGameRules');
const closeRulesButton = document.getElementById('closeGameRules');
const showRulesInstruction = document.getElementById('styleRulesId');

const submitButton = document.getElementById('submission');

const resetButton = document.getElementById('reset');


// const pauseButton = document.getElementById('pauseGame');

const canvas = document.getElementById('drawing');
const ctx = canvas.getContext('2d');

var started = false;

var playerTurn = true;

let score = 0;
let playing = "pause";




const defaultHeight = canvas.height;
const defaultWidth = canvas.width;

var defaultRow = 4;
var defaultCol = 6;

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

const ovals = [];



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







//showing and hiding the instruction
showRulesButton.addEventListener('click', () =>
    showRulesInstruction.classList.add('show'));

closeRulesButton.addEventListener('click', () =>
    showRulesInstruction.classList.remove('show'));

submitButton.addEventListener('click', setBoard);

resetButton.addEventListener('click', resetBoard);

function setBoard(){
    let test ="";
    if(!started){
    const inputRow = document.getElementById('rowInput').value;
    const inputCol = document.getElementById('colInput').value;
    
    if (isNaN(inputRow) || inputRow < 4 || inputRow > 20 || isNaN(inputCol)
        || inputCol <4 || inputCol >20) {
        test = "Not-valid: give in between 4 and 20";
        
    } else {
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
    
} else{
    test = "Press- reset and submit the board again";
}

document.getElementById("valid").innerHTML = test;


}



//playButton.addEventListener('click', startGame);



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
                
                if(mouseLocation.x > eachOval.x - eachOval.width + 3 &&
                    mouseLocation.x < eachOval.x + eachOval.width - 3 &&
                    mouseLocation.y > eachOval.y -eachOval.height + 3  &&
                    mouseLocation.y  < eachOval.y + eachOval.height -3 ){
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
            if(eachOval.touched && eachOval.empty){
                ctx.fillStyle = 'red';
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
    ovals.forEach(column =>{
        column.forEach(eachOval => {
            eachOval.empty = true;
            eachOval.player = "none";
        })
    })
    started = false;
}




canvas.addEventListener("mousemove", function(e) { 
    var cRect = canvas.getBoundingClientRect();        // Gets CSS pos, and width/height
    var canvasX = Math.round(e.clientX - cRect.left);   // Subtract the 'left' of the canvas
    var canvasY = Math.round(e.clientY - cRect.top);
    mouseLocation.x = canvasX;
    mouseLocation.y = canvasY;
    
    
    //console.log(canvasX +"  "+ canvasY);
});

canvas.addEventListener("click", clickHandle, false);

function clickHandle(e){
    if(findWinner() === "human"){
        console.log("Human won");
    }
    let row,col;
    if(playerTurn){
        for(let i =0; i< defaultRow; i++){
            for(let j = 0; j< defaultCol; j++){
                if(ovals[i][j].touched && ovals[i][j].empty){
                    console.log(ovals[i][j].posX + " "+ ovals[i][j].posY);
                    dropPiece(i,j,"human");
                    // while(i+1< defaultRow){
                    //     if(!ovals[i+1][j].empty){
                    //         break;
                    //     }
                    //     i++;
                    // }
                    // console.log("this is i" + i);
                    // ovals[i][j].empty = false;
                    // ovals[i][j].player = "human";
                    // playerTurn= false;
                }
            }
        }
   
}
    computerPlayer();
    if(findWinner() === "human"){
        console.log("Human won");
    }
}

function dropPiece(dropRow, dropCol, playerWho){
    i = dropRow;
    j = dropCol;
    while(i+1< defaultRow){
        if(!ovals[i+1][j].empty){
            break;
        }
        i++;
    }
    console.log("this is i" + i);
    ovals[i][j].empty = false;
    ovals[i][j].player = playerWho;
    //playerTurn= false;

}

function findLocalWinner(r,c,rowOffSet,colOffSet){
    var x = r;
    var y = c;
    var player = ovals[r][c].player;
    var i = 1;
    var localWinner = false;
    var a = 0;
    var isEmpty = ovals[r][c].empty;
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

function bestMoveforComputer(){
    var depth;
}

//drawing the animation of canvas.
drawUpdate();

function computerPlayer(){
    console.log("Hi this is computer playeing");
}


function drawUpdate(){

    draw();
    
    requestAnimationFrame(drawUpdate);
   
}


function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawOvals();
}

