let canvas 
let ctx 
let output
let checks = {}
const width = 1200
const height = 800

const tileW = 20
const tileH = 20
const gap = 3

const tileRowCount = 25
const tileColumnCount = 40

let boundX 
let boundY 

// Tiles are altered based on there state.
// e = empty (initial state)
// w = wall 
// s = start
// f = finish
// x = optimal path

let tiles = []
for (c = 0; c < tileColumnCount; c++) {
    tiles[c] = []
    for (r = 0; r < tileRowCount; r++) {
        tiles[c][r] = {x: c*(tileW + gap), y: r*(tileH + gap),  state: 'e'}
    }
}
tiles[0][0].state = 's'
tiles[tileColumnCount-1][tileRowCount-1].state = 'f'

const rectangle = (x,y,w,h, state) => {
    if (state == 's') {
        ctx.fillStyle = '#00FF00'
    } else if (state == 'f') {
        ctx.fillStyle = '#FF0000'
    } else if (state == 'e') {
        ctx.fillStyle = '#AAAAAA'
    } else if (state == 'w') {
        ctx.fillStyle = '#0000FF'
    } else if (state == 'x') {
        ctx.fillStyle = '#000000'
    } else {
        ctx.fillStyle = '#FFFF00'
    }
    
    ctx.beginPath()
    ctx.rect(x,y,w,h)
    ctx.closePath()
    ctx.fill()
}

const clear = () => {
    ctx.clearRect(0, 0, width, height)
}

const draw = () => {
    clear()

    for (c = 0; c < tileColumnCount; c++) {
        for (r = 0; r < tileRowCount; r++) {
            rectangle(tiles[c][r].x, tiles[c][r].y, tileW, tileH, tiles[c][r].state)
        }
    }
}

const init = () => {
    canvas = document.getElementById('myCanvas')
    ctx = canvas.getContext('2d')
    output = document.getElementById('outcome')
    return setInterval(draw, 10)
}

const myMove = e => {
    x = e.pageX - canvas.offsetLeft
    y = e.pageY - canvas.offsetTop

    for ( c = 0; c < tileColumnCount; c++) {
        for ( r = 0; r < tileRowCount; r++) {
            if (c*(tileW + gap) < x && x < c*(tileW + gap)+tileW && r*(tileH + gap) < y && y < r*(tileH + gap)+tileH) {
                if (tiles[c][r].state == 'e' && (c != boundX || r != boundY)) {
                    tiles[c][r].state = 'w'
                    boundX = c
                    boundY = r
                } else if (tiles[c][r].state == 'w' && (c != boundX || r != boundY)) {
                    tiles[c][r].state = 'e'
                    boundX = c
                    boundY = r
                }
            }
        }
    }
}

const myDown = e => {
    canvas.onmousemove = myMove

    x = e.pageX - canvas.offsetLeft
    y = e.pageY - canvas.offsetTop

    for (c = 0; c < tileColumnCount; c++) {
        for (r = 0; r < tileRowCount; r++) {
            if (c*(tileW + gap) < x && x < c*(tileW + gap)+tileW && r*(tileH + gap) < y && y < r*(tileH + gap)+tileH) {
                if (tiles[c][r].state == 'e') {
                    tiles[c][r].state = 'w'
                    boundX = c
                    boundY = r
                } else if (tiles[c][r].state == 'w') {
                    tiles[c][r].state = 'e'
                    boundX = c
                    boundY = r
                }
            }
        }
    }
}

const myUp = () => {
    canvas.onmousemove = null
}

const solveMaze = () => {
    // Places to check
    let xQue = [0]
    let yQue = [0]

    let pathFound = false
    
    // Where we are exploring from
    let xLoc
    let yLoc

    while (xQue.length > 0 && !pathFound) {
        xLoc = xQue.shift()
        yLoc = yQue.shift()

        // Check if finish point is next to current node
        // left, right, up, down
        if (xLoc > 0) {
            if (tiles[xLoc-1][yLoc].state == 'f') {
                pathFound = true
            }
        }
        if (xLoc < tileColumnCount - 1) {
            if (tiles[xLoc+1][yLoc].state == 'f') {
                pathFound = true
            }
        }
        if (yLoc > 0) {
            if (tiles[xLoc][yLoc-1].state == 'f') {
                pathFound = true
            }
        }
        if (yLoc < tileRowCount - 1) {
            if (tiles[xLoc][yLoc+1].state == 'f') {
                pathFound = true
            }
        }

        // Current tile is not next to exit, so check next to it for future paths.
        // So that previous paths arent also checked in a cycle and so that a path can be coloured, a letter is appended to them.
        // 'l','r','u', or 'd'
        if (xLoc > 0) {
            if (tiles[xLoc-1][yLoc].state == 'e') {
                xQue.push(xLoc-1)
                yQue.push(yLoc)
                tiles[xLoc-1][yLoc].state = tiles[xLoc][yLoc].state + 'l'
            }
        }
        if (xLoc < tileColumnCount - 1) {
            if (tiles[xLoc+1][yLoc].state == 'e') {
                xQue.push(xLoc+1)
                yQue.push(yLoc)
                tiles[xLoc+1][yLoc].state = tiles[xLoc][yLoc].state + 'r'
            }
        }
        if (yLoc > 0) {
            if (tiles[xLoc][yLoc-1].state == 'e') {
                xQue.push(xLoc)
                yQue.push(yLoc-1)
                tiles[xLoc][yLoc-1].state = tiles[xLoc][yLoc].state + 'u'
            }
        }
        if (yLoc < tileRowCount - 1) {
            if (tiles[xLoc][yLoc+1].state == 'e') {
                xQue.push(xLoc)
                yQue.push(yLoc+1)
                tiles[xLoc][yLoc+1].state = tiles[xLoc][yLoc].state + 'd'
            }
        }
        
    }

    if (!pathFound) {
        output.innerHTML = 'No solution'
    } else {
        output.innerHTML = 'Solved!'
        console.log(tiles[xLoc][yLoc].state)
        let path = tiles[xLoc][yLoc].state
        let pathLength = path.length

        let curX = 0
        let curY = 0
        for (i = 1; i < pathLength; i++) {
            if (path.charAt(i) == 'u') {
                curY -= 1
            }
            if (path.charAt(i) == 'd') {
                curY += 1
            }
            if (path.charAt(i) == 'r') {
                curX += 1
            }
            if (path.charAt(i) == 'l') {
                curX -= 1
            }
            tiles[curX][curY].state = 'x'
        }
    }

}

const reset = () => {
    for (c = 0; c < tileColumnCount; c++) {
        for (r = 0; r < tileRowCount; r++) {
            tiles[c][r] = {x: c*(tileW + gap), y: r*(tileH + gap),  state: 'e'}
        }
    }
    tiles[0][0].state = 's'
    tiles[tileColumnCount-1][tileRowCount-1].state = 'f'

    output.innerHTML = ''
}

const resetNotWalls = () => {
    for (c = 0; c < tileColumnCount; c++) {
        for (r = 0; r < tileRowCount; r++) {
            if (tiles[c][r].state == 'w')  {
                tiles[c][r] = {x: c*(tileW + gap), y: r*(tileH + gap),  state: 'w'}
            } else {
                tiles[c][r] = {x: c*(tileW + gap), y: r*(tileH + gap),  state: 'e'}
            }
        }
    }
    tiles[0][0].state = 's'
    tiles[tileColumnCount-1][tileRowCount-1].state = 'f'

    output.innerHTML = ''
}

const randomFill = () => {
    let fillPercent = document.getElementById('fillPercent')
    let fill = fillPercent.options[fillPercent.selectedIndex].value
    for (c = 0; c < tileColumnCount; c++) {
        for (r = 0; r < tileRowCount; r++) {
            if (Math.random()*100>(100-fill))  {
                tiles[c][r] = {x: c*(tileW + gap), y: r*(tileH + gap),  state: 'w'}
            } else {
                tiles[c][r] = {x: c*(tileW + gap), y: r*(tileH + gap),  state: 'e'}
            }
        }
    }
    // Leave the start and exit empty, to (dramatically) increase chance of solution on higher fill.
    tiles[0][1].state='e'
    tiles[1][0].state='e'
    tiles[38][24].state='e'
    tiles[39][23].state='e'

    tiles[0][0].state = 's'
    tiles[tileColumnCount-1][tileRowCount-1].state = 'f'

    output.innerHTML = `Grid filled with ${fill}% walls`
}

init()
canvas.onmousedown = myDown
canvas.onmouseup = myUp