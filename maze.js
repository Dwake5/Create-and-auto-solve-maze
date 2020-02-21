let canvas 
let ctx 
let output

const width = 1200
const height = 800

const tileW = 20
const tileH = 20

const titleRowCount = 25
const titleColumnCount = 40

// let dragok = false
let boundX 
let boundY 

let tiles = []
for (c = 0; c < titleColumnCount; c++) {
    tiles[c] = []
    for (r = 0; r < titleRowCount; r++) {
        tiles[c][r] = {x: c*(tileW+3), y: r*(tileH+3),  state: 'e'}
    }
}
tiles[0][0].state = 's'
tiles[titleColumnCount-1][titleRowCount-1].state = 'f'

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
    ctx.clearRect(0,0, width, height)
}

const draw = () => {
    clear()

    for (c = 0; c < titleColumnCount; c++) {
        for (r = 0; r < titleRowCount; r++) {
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

    for ( c = 0; c < titleColumnCount; c++) {
        for ( r = 0; r < titleRowCount; r++) {
            if (c*(tileW+3) < x && x < c*(tileW+3)+tileW && r*(tileH+3) < y && y < r*(tileH+3)+tileH) {
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

    for ( c = 0; c < titleColumnCount; c++) {
        for ( r = 0; r < titleRowCount; r++) {
            if (c*(tileW+3) < x && x < c*(tileW+3)+tileW && r*(tileH+3) < y && y < r*(tileH+3)+tileH) {
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
    // Where we are exploring from
    let xQue = [0]
    let yQue = [0]

    let pathFound = false

    let xLoc
    let yLoc


    while (xQue.length> 0 && !pathFound) {
        xLoc = xQue.shift()
        yLoc = yQue.shift()

        // Check if end is next to current node
        if (xLoc > 0) {
            if (tiles[xLoc-1][yLoc].state == 'f') {
                pathFound = true
            }
        }
        if (xLoc < titleColumnCount - 1) {
            if (tiles[xLoc+1][yLoc].state == 'f') {
                pathFound = true
            }
        }
        if (yLoc > 0) {
            if (tiles[xLoc][yLoc-1].state == 'f') {
                pathFound = true
            }
        }
        if (yLoc < titleRowCount - 1) {
            if (tiles[xLoc][yLoc+1].state == 'f') {
                pathFound = true
            }
        }


        if (xLoc > 0) {
            if (tiles[xLoc-1][yLoc].state == 'e') {
                xQue.push(xLoc-1)
                yQue.push(yLoc)
                tiles[xLoc-1][yLoc].state = tiles[xLoc][yLoc].state + 'l'
            }
        }
        if (xLoc < titleColumnCount - 1) {
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
        if (yLoc < titleRowCount - 1) {
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
        output.innerHTML = 'Solved'
        let path = tiles[xLoc][yLoc].state
        let pathLength = path.length
        let curX = 0
        let curY = 0
        for (i = 0; i < pathLength - 1; i++) {
            if (path.charAt(i+1) == 'u') {
                curY -= 1
            }
            if (path.charAt(i+1) == 'd') {
                curY += 1
            }
            if (path.charAt(i+1) == 'r') {
                curX += 1
            }
            if (path.charAt(i+1) == 'l') {
                curX -= 1
            }
            tiles[curX][curY].state = 'x'
        }
    }

}

const reset = () => {
    for (c = 0; c < titleColumnCount; c++) {
        for (r = 0; r < titleRowCount; r++) {
            tiles[c][r] = {x: c*(tileW+3), y: r*(tileH+3),  state: 'e'}
        }
    }
    tiles[0][0].state = 's'
    tiles[titleColumnCount-1][titleRowCount-1].state = 'f'

    output.innerHTML = ''
}

const resetNotWalls = () => {
    for (c = 0; c < titleColumnCount; c++) {
        for (r = 0; r < titleRowCount; r++) {
            if (tiles[c][r].state == 'w')  {
                tiles[c][r] = {x: c*(tileW+3), y: r*(tileH+3),  state: 'w'}
            } else {
                tiles[c][r] = {x: c*(tileW+3), y: r*(tileH+3),  state: 'e'}
            }
        }
    }
    tiles[0][0].state = 's'
    tiles[titleColumnCount-1][titleRowCount-1].state = 'f'

    output.innerHTML = ''
}

init()
canvas.onmousedown = myDown
canvas.onmouseup = myUp