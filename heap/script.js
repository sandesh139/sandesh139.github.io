
const canvas = document.getElementById('drawing');
const ctx = canvas.getContext('2d');


drawLayout();
function drawLayout(){
    ctx.beginPath();
    ctx.rect(0,0,canvas.width, canvas.height);
    ctx.fillStyle =  '#A9A9A9';
    ctx.fill();
    ctx.closePath();
    for (let i =0; i< 30; i++){
        ctx.beginPath();
        ctx.strokeRect(10+i*32,5,32,30);
        ctx.fillStyle = 'blue';
        ctx.fillText(""+i, 20+i*32, 45);
        ctx.closePath();    
    }
}



function drawUpdate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLayout();
    for (let i =0; i<heapSize; i++){
        ctx.beginPath();
        ctx.fillStyle = 'green';
        ctx.font = '15px serif';
        ctx.fillText(""+nodes[i], 15+i*32, 30);
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
function swapNodes(nodeIndexOne, nodeIndexTwo){
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

    drawUpdateSwap();
    let temp = nodes[nodeIndexOne];
    nodes[nodeIndexOne] = nodes[nodeIndexTwo];
    nodes[nodeIndexTwo] = temp;
}

//best sleep implementation I have used in javascript.
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
function drawUpdateSwap(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLayout();
    for (let i =0; i<heapSize; i++){
        if(!(i==movingIndexOne.indexStarted || i == movingIndexTwo.indexStarted)){
            ctx.beginPath();
            ctx.fillStyle = 'green';
            ctx.font = '15px serif';
            ctx.fillText(""+nodes[i], 15+i*32, 30);
            ctx.closePath();  
        }
    }
    movingIndexOne.x += movingIndexOne.dx;
    movingIndexTwo.x +=movingIndexTwo.dx;
    ctx.beginPath();
    ctx.fillStyle = 'green';
    ctx.font = '15px serif';
    ctx.fillText(movingIndexOne.nodeValue, movingIndexOne.x, 30);
    ctx.fillText(movingIndexTwo.nodeValue, movingIndexTwo.x, 30);
    ctx.closePath();  
    if(!(Math.abs(movingIndexOne.targetX - movingIndexOne.x) <=5)){
        sleep(250).then(() => {
            //do stuff
            drawUpdateSwap();
          })
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

function heapifyUp(){
    let currIndex = heapSize -1;
    let checkSwap = 0;
    // console.log("this is parent node "+ getParentNode(currIndex));
    // console.log("nodes : "+ nodes[currIndex]);
    // console.log("curr Index : " + currIndex);
    // console.log(hasParentNode(currIndex));
    while(hasParentNode(currIndex) && getParentNode(currIndex) > nodes[currIndex]){
        console.log("swap node is called");
        swapNodes(getParentNodeIndex(currIndex),currIndex);
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