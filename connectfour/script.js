const showRulesButton = document.getElementById('showGameRules');
const closeRulesButton = document.getElementById('closeGameRules');
const showRulesInstruction = document.getElementById('styleRulesId');

const submitButton = document.getElementById('submission');


// const pauseButton = document.getElementById('pauseGame');

const canvas = document.getElementById('drawing');
const ctx = canvas.getContext('2d');

var started = false;



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
    touched: false
}

const ovals = [];



for (let i = 0; i< defaultRow; i++){
    ovals[i] = [];
    for(let j = 0; j< defaultCol; j++){
        const x = j * (ovalProperty.width*2 + ovalProperty.offsetX) +2*ovalProperty.width;
        const y = i * (ovalProperty.height *2+ ovalProperty.offsetY)+2*ovalProperty.height;
        ovals[i][j] = {x, y , ...ovalProperty}
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

function setBoard(){
    if(!started){
    const inputRow = document.getElementById('rowInput').value;
    const inputCol = document.getElementById('colInput').value;
    let test ="";
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
    document.getElementById("valid").innerHTML = test;
}
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
    
    
    //console.log(canvasX +"  "+ canvasY);
});



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