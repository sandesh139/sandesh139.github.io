
function bestMoveforComputer(){
   
    let result = -20;
    let bestColumn = 0;
    console.log("default col " +defaultCol);
    for (let c=0; c<defaultCol;c++)
            if (isLegal(c)){
                dropPieceComputer(0,c,"computer");
                let bests = minScoreForHuman(1);
                undoDrop(c);
                if (bests>=result){
                    result = bests;
                    bestColumn=c;
                }
            }
            result = -20;
            
        console.log("best column found "+ bestColumn);
        return bestColumn;
}
let countCall = 0;

function maxScoreForComputer(depth) {
    console.log(depth+" = depth");
    countCall++;
    // TODO You have to write this.

    // Hint: this will be similar to minScoreForHuman
    let winner = findWinner();
    if (winner === "computer") {
        return 10;
    } else if (winner === "human") {
        return -10;
    } else if (isFull() || depth === maxDepth) {
        console.log("max full");
        return 0;
    } else {
        let bestResult = -20;
        for (let c = 0; c < defaultCol; c++) {
            if (isLegal(c)) {
                dropPieceComputer(0,c, "computer");
                let result = -20;
                result = minScoreForHuman(depth + 2);
                undoDrop(c);
                if (result >= bestResult) {
                    bestResult = result;
                }
            }
        }
        //console.log("maxscore :"+ bestResult);
        return bestResult;
    }
}

function minScoreForHuman(depth){
    countCall++;
    let winner = findWinner();
    //console.log("helloworld!!!!!!" + maxDepth);
        if (winner === "computer") {
            // computer is winning, so human is stuck
            return 10;
        } else if (winner === "human") {
            // human already won, no chance for computer
            return -10;
        } else if (isFull() || (depth === maxDepth)) {
            console.log("min full");
            // We either have a tie (full board) or we've searched as
            // far as we can go. Either way, call it a draw.
            return 0;
        } else {
           
            let bestResult = 20;

            // Loop over all columns to test them in turn.
            for (let c = 0; c < defaultCol; c++) {
                if (isLegal(c)) {
                   
                    dropPieceComputer(0,c, "human");
                    
                    let result = maxScoreForComputer(depth + 2);
                    
                    undoDrop(c);

                    if (result <= bestResult) {
                        bestResult = result;
                    }
                }
            }
            //console.log("minscore :"+ bestResult);
            return bestResult;
        }
}

function dropPieceComputer(dropRow, dropCol, playerWho){
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
    ovals[i][j].empty = false;
    ovals[i][j].player = playerWho;

}


function undoDrop(column){
    let row = 0;
        while(ovals[row][column].empty && row < defaultRow) {
            row++;
        }
        //Set the top row that had a piece to empty again.
        ovals[row][column].player = "none";
        ovals[row][column].empty = true;
}