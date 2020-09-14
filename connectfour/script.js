const showRulesButton = document.getElementById('showGameRules');
const closeRulesButton = document.getElementById('closeGameRules');
const showRulesInstruction = document.getElementById('styleRulesId');

const submitButton = document.getElementById('submission');

const resetButton = document.getElementById('reset');

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







//showing and hiding the instruction
showRulesButton.addEventListener('click', () =>
    showRulesInstruction.classList.add('show'));

closeRulesButton.addEventListener('click', () =>
    showRulesInstruction.classList.remove('show'));

submitButton.addEventListener('click', setBoard);

resetButton.addEventListener('click', resetBoard);

function setComputer(){
    if(!started){
    computerPlaying = true;
    } else {
        alert('reset the game');
    }    
}

function setBoard(){
    ovals = [];
    turnCounter = 0;
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ovals = [];
    started = false;
    defaultCol = 8;
    defaultRow = 8;
    turnCounter = 0;
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
    var humanTime =true;
    if(!foundWinner){
    
    if(findWinner() === "human"){
        drawOvals();
        foundWinner = true;
        console.log("Red won");
        alert("Red won !");
    } else if(findWinner() === "computer"){
        drawOvals();
        foundWinner = true;
        
        alert("Blue won !");
        
    }
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
                        dropPiece(i,j,"human");
                        turnCounter++;
                    } else if(!computerPlaying) {
                        dropPiece(i,j,"computer");
                        turnCounter++;
                    }
                    humanTime =false;
                    //undoDrop(j); //this is working
                    
                }
            }
        }
   
}
    
    if(findWinner() === "human"){
        drawOvals();
        foundWinner = true;
        
        alert("Red won !");
    } else if(findWinner() === "computer"){
        drawOvals();
        foundWinner = true;
        console.log("computer won !");
        alert("Blue  won !");

    }
    if(!foundWinner &&! humanTime && computerPlaying){
        computerPlayer();
        turnCounter++;
    }
    if(isFull()){
        alert("Game is draw");
        foundWinner =true;
    }
    // if(isfull()){
    //     console.log("board is full");
    // }
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
    //console.log("this is i" + i);
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
   
    var result = -20;
    var bestColumn = 0;

    for (var c=0; c<defaultCol;c++)
            if (isLegal(c)){
                dropPiece(0,c,"computer");
                var bests = minScoreForHuman(1);
                undoDrop(c);
                if (bests>=result){
                    result = bests;
                    bestColumn=c;
                }
            }
        // Hint: this will be similar to maxScoreForComputer
        // if(bestColumn === defaultCol -1){
        //     bestColumn = Math.floor(Math.random() * defaultCol);
        // }
        return bestColumn;
}

function maxScoreForComputer(depth) {
    // TODO You have to write this.

    // Hint: this will be similar to minScoreForHuman
    var winner = findWinner();
    if (winner === "computer") {
        return 10;
    } else if (winner === "human") {
        return -10;
    } else if (isFull() || depth === maxDepth) {
        return 0;
    } else {
        var bestResult = -20;
        for (var c = 0; c < defaultCol; c++) {
            if (isLegal(c)) {
                dropPiece(0,c, "computer");
                var result = minScoreForHuman(depth + 2);
                undoDrop(c);
                if (result >= bestResult) {
                    bestResult = result;
                }
            }
        }
        return bestResult;
    }
}

function minScoreForHuman(depth){
    var winner = findWinner();
    //console.log("helloworld!!!!!!" + maxDepth);
        if (winner === "computer") {
            // computer is winning, so human is stuck
            return 10;
        } else if (winner === "human") {
            // human already won, no chance for computer
            return -10;
        } else if (isFull() || (depth === maxDepth)) {
            // We either have a tie (full board) or we've searched as
            // far as we can go. Either way, call it a draw.
            return 0;
        } else {
            // At this point, we know there isn't a winner already and
            // that there must be at least one column still available
            // for play. We'll search all possible moves for the human
            // player and decide which one gives the lowest (best for
            // human) score, assuming that the computer would play
            // perfectly.

            // Start off with a value for best result that is larger
            // than any possible result.
            var bestResult = 20;

            // Loop over all columns to test them in turn.
            for (var c = 0; c < defaultCol; c++) {
                if (isLegal(c)) {
                    // This column is a legal move. We'll drop a piece
                    // there so we can see how good it is.
                    dropPiece(0,c, "human");
                    // Call maxScoreForComputer to see what the value would be for the
                    // computer's best play. The maxScoreForComputer method will end
                    // up calling minScoreForHuman in a similar fashion in order to
                    // figure out the best result for the computer's
                    // turn, assuming the human will play perfectly in
                    // response.
                    var result = maxScoreForComputer(depth + 2);
                    // Now that we have the result, undo the drop so
                    // the board will be like it was before.
                    undoDrop(c);

                    if (result <= bestResult) {
                        // We've found a new best score. Remember it.
                        bestResult = result;
                    }
                }
            }
            return bestResult;
        }
}


 

function isFull(){
    for (var i = 0; i < defaultCol; i++) {
        if (ovals[0][i].empty) {
            return false;
        }
    }
    return true;
}

function undoDrop(column){
    var row = 0;
        while(ovals[row][column].empty && row < defaultRow) {
            row++;
        }
        // Set the top row that had a piece to empty again.
        ovals[row][column].player = "none";
        ovals[row][column].empty = true;
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

function computerPlayer(){
    //console.log("Hi this is computer playing");
    dropPiece(0,bestMoveforComputer(),"computer");

}


function drawUpdate(){
    setTimeout(drawUpdate,300);
    draw();
    //requestAnimationFrame(drawUpdate);
   
}


function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawOvals();
}

