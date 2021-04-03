
const canvas = document.getElementById('drawing');
const ctx = canvas.getContext('2d');
const colorBackground = "#9966CB";
const color2 = 'green';
const color1 = 'black';
drawLayout();
function drawLayout(){
    ctx.beginPath();
    ctx.rect(0,0,canvas.width, canvas.height);
    ctx.fillStyle =  colorBackground;
    ctx.fill();
    ctx.closePath();
    for (let i =0; i< 31; i++){
        ctx.beginPath();
        ctx.strokeRect(10+i*32,5,32,30);
        ctx.fillStyle = '#131E3A';
        ctx.fillText(""+i, 20+i*32, 45);
        ctx.closePath();    
    }
}
function canvas_arrow(context, fromx, fromy, tox, toy) {
    var headlen = 10; // length of head in pixels
    var dx = tox - fromx;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
  }

  

function drawUpdate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLayout();
    for (let i =0; i<heapSize; i++){
        ctx.beginPath();
        ctx.fillStyle = color1;
        ctx.font = '15px serif';
        ctx.fillText(""+nodes[i], 15+i*32, 30);
        ctx.fillText(""+ nodes[i], tree[i][0]-5,tree[i][1]+2);
        ctx.arc(tree[i][0], tree[i][1], 20, 0, 2 * Math.PI);
        if(i>0 && i%2==1){
            canvas_arrow(ctx,tree[i][2]-20,tree[i][3]-20,tree[i][0],tree[i][1]-20);
        } else if(i >0){
            canvas_arrow(ctx,tree[i][2]+20,tree[i][3]-20,tree[i][0],tree[i][1]-20);
        }
        ctx.stroke();
        ctx.closePath();    
    }
}


const add = document.getElementById('add');

add.addEventListener('click', addNode);

let nodes = [];
let heapSize = 0;
function getLeftNodeIndex(nodeIndex){
    return 2 *nodeIndex +1;
}

function getRightNodeIndex(nodeIndex){
    return 2 * nodeIndex + 2;
}

/**
 * @param nodeIndex is the index of the node in the heap
 * @returns the index of the parent node in the heap
 */
function getParentNodeIndex(nodeIndex){
    return parseInt((nodeIndex -1) /2);
}

/**
 * @param nodeIndex is the index of the node in the heap
 * @returns true if the node has a left node, otherwise false.
 */
function hasLeftNode(nodeIndex){
    return getLeftNodeIndex(nodeIndex) < heapSize;
}


/**
 * @param nodeIndex is the index of the node in the heap
 * @returns true if the node has a right node, otherwise false.
 */
function hasRightNode(nodeIndex){
    return getRightNodeIndex(nodeIndex) < heapSize;
}

/**
 * @param nodeIndex is the index of the node in the heap
 * @returns true if the node has a parent node, otherwise false.
 */
function hasParentNode(nodeIndex){
    return getParentNodeIndex(nodeIndex) >= 0;
}

/**
 * @param nodeIndex is the index of the node in the heap
 * @returns the left node
 */
function getLeftNode(nodeIndex){
    return nodes[getLeftNodeIndex(nodeIndex)];
}

/**
 * @param nodeIndex is the index of the node in the heap
 * @returns the right node
 */
function getRightNode(nodeIndex){
    return nodes[getRightNodeIndex(nodeIndex)];
}

/**
 * @param nodeIndex is the index of the node in the heap
 * @returns the parent node
 */
function getParentNode(nodeIndex){
    console.log("parent node index "+getParentNodeIndex(nodeIndex) + " of node index "+ nodeIndex);
    return nodes[getParentNodeIndex(nodeIndex)];
}

/**
 * this method swaps the nodes in the heap
 * @param nodeIndexOne
 * @param nodeIndexTwo
 */


const movingIndexOne = {
    nodeValue:0,
    x: 0,
    y: 30,
    dx: 20,
    targetX: 0,
    indexStarted: 0
}
const movingIndexTwo = {
    nodeValue: 0,
    x: 0,
    y: 30,
    dx: 20,
    targetX: 0,
    indexStarted: 0,
}
async function swapNodes(nodeIndexOne, nodeIndexTwo){
    movingIndexOne.indexStarted = nodeIndexOne;
    movingIndexOne.nodeValue = nodes[nodeIndexOne];
    movingIndexOne.x = 15 + nodeIndexOne*32;
    movingIndexOne.targetX = 15+ nodeIndexTwo *32;

    movingIndexTwo.indexStarted = nodeIndexTwo;
    movingIndexTwo.nodeValue = nodes[nodeIndexTwo];
    movingIndexTwo.x =15 + nodeIndexTwo*32;
    movingIndexTwo.targetX = 15+ nodeIndexOne *32;
    if(nodeIndexOne> nodeIndexTwo){
        movingIndexOne.dx = -5;
        movingIndexTwo.dx = 5;
    } else {
        movingIndexOne.dx = 5;
        movingIndexTwo.dx = -5;
    }

    await drawUpdateSwap();
    let temp = nodes[nodeIndexOne];
    nodes[nodeIndexOne] = nodes[nodeIndexTwo];
    nodes[nodeIndexTwo] = temp;
}

//sleep implementation. this doesnot block the program execution.
const sleep = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

getData();
let tree;
async  function getData() {
    const response = await fetch("tree.json");
    tree = await response.json();
}

 async function drawUpdateSwap(){
    console.log("draw swap is called");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLayout();
    for (let i =0; i<heapSize; i++){
        if(!(i==movingIndexOne.indexStarted || i == movingIndexTwo.indexStarted)){
            ctx.beginPath();
            ctx.fillStyle = color1;
            ctx.font = '15px serif';
            ctx.fillText(""+nodes[i], 15+i*32, 30);
            ctx.fillText(""+nodes[i], tree[i][0] , tree[i][1]);
            ctx.closePath();  
        }
        ctx.beginPath();
        ctx.arc(tree[i][0]+3, tree[i][1], 20, 0, 2 * Math.PI);
        if(i>0 && i%2==1){
            canvas_arrow(ctx,tree[i][2]-20,tree[i][3]-20,tree[i][0],tree[i][1]-20);
        } else if(i >0){
            canvas_arrow(ctx,tree[i][2]+20,tree[i][3]-20,tree[i][0],tree[i][1]-20);
        }
        ctx.stroke();
    }

    movingIndexOne.x += movingIndexOne.dx;
    movingIndexTwo.x +=movingIndexTwo.dx;
    ctx.beginPath();
    ctx.fillStyle = color2;
    ctx.font = '15px serif';
    ctx.fillText(movingIndexOne.nodeValue, movingIndexOne.x, 30);
    ctx.fillText(movingIndexTwo.nodeValue, movingIndexTwo.x, 30);
    ctx.fillText(""+movingIndexTwo.nodeValue, tree[movingIndexOne.indexStarted][0] , tree[movingIndexOne.indexStarted][1]);
    ctx.fillText(""+movingIndexOne.nodeValue, tree[movingIndexTwo.indexStarted][0] , tree[movingIndexTwo.indexStarted][1]);
    ctx.closePath();  
    if(!(Math.abs(movingIndexOne.targetX - movingIndexOne.x) <=5)){
        console.log("sleep is called");
        await sleep(300).then(() => {
            //do stuff
            drawUpdateSwap();
          })
    } else {
        while(hasParentNode(currIndex) && getParentNode(currIndex) > nodes[currIndex]){
            console.log("swap node is called before");
            swapNodes(getParentNodeIndex(currIndex),currIndex);
            console.log("swap node is called after");
            checkSwap = 1;
            currIndex = getParentNodeIndex(currIndex);
        }
    }
}


/**
 * @returns the min node
 */
function getMinNode(){
    if(heapSize == 0) throw new IllegalStateException();
    return nodes[0];
}

function removeNode(){
    if(heapSize == 0) throw new IllegalStateException();
    nodes[0] = nodes[heapSize-1];
    heapSize--;
    heapifyDown();
}




function addNode(){
    addString = document.getElementById('addInput').value;
    addInput = parseInt(addString, 10);
    nodes[heapSize] = addInput;
    console.log("added"+addInput);
    document.getElementById('addInput').value = "";
    heapSize++;
    heapifyUp();
    
    console.log(getMinNode());
}


let currIndex;
function heapifyUp(){
    currIndex = heapSize -1;
    let checkSwap = 0;
    while(hasParentNode(currIndex) && getParentNode(currIndex) > nodes[currIndex]){
        console.log("swap node is called before");
        swapNodes(getParentNodeIndex(currIndex),currIndex);
        console.log("swap node is called after");
        checkSwap = 1;
        currIndex = getParentNodeIndex(currIndex);
        
    }
    console.log(nodes);
    if(checkSwap==0){
        drawUpdate();
    }
}

function heapifyDown(){
    let currIndex = 0;
    let checkSwap = 0;
    while(hasLeftNode(currIndex)){
        let smallerChildIndex = getLeftNodeIndex(currIndex);
        if(hasRightNode(currIndex) && getRightNode(currIndex) < getLeftNode(currIndex)){
            smallerChildIndex = getRightNodeIndex(currIndex);
        }
        if(nodes[currIndex] < nodes[smallerChildIndex]){
            break;
        } else {
            checkSwap =1;
            swapNodes(currIndex, smallerChildIndex);
        }
        currIndex = smallerChildIndex;
    }
    if(checkSwap==0){
        drawUpdate();
    }
   
}