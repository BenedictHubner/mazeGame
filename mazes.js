class Maze {
    constructor(h, w) {
        this._h = h;
        this._w = w;
    }

    get h() {
        return _h;
    }
    set h(h) {
        _h = h;
    }

    get w() {
        return _w;
    }
    set w(w) {
        _w = w;
    }
}

class RectMaze extends Maze {
    constructor(h, w) {
        super(h, w);
        this.cells = new Array(w * h); //indexed across then down
        this.walls = new Array((w - 1) * h + (h-1) * w); //interior maze walls
        //indexed as vertical walls, across then down, then horizontal walls, across then down.
        this.cells = this.cells.fill(0);
        this.walls = this.walls.fill(1);
    }

    getCell(i, j) {
        return this.cells[i + this._h * j];
    }
    setCell(i, j, val) {
        this.cells[i + this._h * j] = val;
    }

    randStep(i) {
        /* Provides a random direction, 0 up, 1 right, etc. */
        let dir = 0;
        /* (Literal) edge cases first*/
        if (i == this._w - 1) {
            dir = 2 + Math.floor(Math.random() * 2);
        } else if (i == this._w * (this._h - 1)) {
            dir = Math.floor(Math.random() * 2);
        } else if (i == this.cells.length - 1) {
            dir = 3 * Math.floor(Math.random() * 2);
        } else if (i < this._w - 1) {
            dir = 1 + Math.floor(Math.random() * 3);
        } else if (i > this.cells.length - this._w) {
            let rand = Math.floor(Math.random() * 3);
            if (rand == 2) {
                rand = 3;
            }
            dir = rand;
        } else if (i % this._w == 0) {
            dir = Math.floor(Math.random() * 3);
        } else if (i % this._w == this._w - 1) {
            dir = Math.floor(Math.random() * 3);
            if (dir != 0) {
                dir++;
            }
        } else {
            dir = Math.floor(Math.random() * 4);
        }
        return dir;
    }

    generateMaze() {
        this.cells[0] = 1;
        let sum = 0;
        while (sum < this.cells.length) {
            for (let i = 1; i < this.cells.length; i++) {
                let path = new Array();
                if (this.cells[i] == 0) {
                    /* Create a random path from a cell not yet in one
                       until we are connected to the starting cell */
                    path.length = 0;
                    let pathStart = i;
                    let count = 0;
                    let cur = i;
                    while (this.cells[cur] == 0) {
                        let dir = this.randStep(cur); //0 is up, 1 right, etc.
                        if (dir == 0 && path.indexOf(cur - this._w) == -1) {
                            //if up not in path, add it and move there
                            path.push(cur);
                            cur -= this._w;
                            count = 0;
                        } else if (dir == 1 && path.indexOf(cur + 1) == -1) {
                            path.push(cur);
                            cur++;
                            count = 0;
                        } else if (dir == 2 && path.indexOf(cur + this._w) == -1) {
                            path.push(cur);
                            cur += this._w;
                            count = 0;
                        } else if (dir == 3 && path.indexOf(cur - 1) == -1) {
                            path.push(cur);
                            cur--;
                            count = 0;
                        } else if (count > 9) {
                            //if no valid direction found, try again from beginning
                            path.length = 0;
                            cur = pathStart;
                        } else {
                            count++;
                        }
                    }
                    path.push(cur);
                    this.cells[path[0]] = 1;
                    /* Next we 'break down' the walls that our short path goes through */
                    if (path.length == 1) { // Special case for one cell 'path'
                        let pos = path[0];
                        let next = path[1];
                        let row = Math.floor(pos / _w);
                        if (next == pos + 1) {
                            this.walls[pos - row] = 0;
                        } else if (next == pos - 1) {
                            this.walls[next - row] = 0;
                        } else if (next == pos - width) {
                            this.walls[(_h * (_w + 1)) + next] = 0;
                        } else if (next == pos + width) {
                            this.walls[(_h * (_w - 1)) + pos] = 0;
                        }
                    } else {
                        for (let j = 0; j < path.length - 1; j++) {
                            let pos = path[j];
                            let next = path[j + 1];
                            let row = Math.floor(pos / this._w);
                            this.cells[next] = 1; // adds the cells on short path to overall path
                            if (next == pos + 1) {
                                this.walls[pos - row] = 0;
                            } else if (next == pos - 1) {
                                this.walls[next - row] = 0;
                            } else if (next == pos - this._w) {
                                this.walls[(this._h * (this._w - 1)) + next] = 0;
                            } else if (next == pos + this._w) {
                                this.walls[(this._h * (this._w - 1)) + pos] = 0;
                            }
                        }
                    }
                    /* Check if every cell is in the path */
                    sum = 0;
                    for (let k = 0; k < this.cells.length; k++) {
                        sum += this.cells[k]
                    }
                }
            }
        }
    }

    mazeToWallArray() {
        let wallsArray = [['+', '.']];
        for (let i = 0; i < this._w * 2 - 1; i++) {
            wallsArray[0].push('+');
        }

        let halfway = (this._w - 1) * this._h;
        for (let i = 1; i < this._h * 2; i++) {
            wallsArray[i] = ['+'];
            if (i % 2 == 1) {
                let ind = Math.floor(i / 2);
                for (let j = ind * (this._w - 1); j < (ind + 1) * (this._w - 1); j++) {
                    wallsArray[i].push('.');
                    if (this.walls[j] == 1) {
                        wallsArray[i].push('+');
                    } else {
                        wallsArray[i].push('.');
                    }
                }
                wallsArray[i].push('.'); wallsArray[i].push('+');
            } else {
                let ind = Math.floor(i / 2) - 1;
                for (let j = halfway + ind * this._w; j < halfway + (ind + 1) * this._w; j++) {
                    if (this.walls[j] == 1) {
                        wallsArray[i].push('+');
                    } else {
                        wallsArray[i].push('.');
                    }
                    wallsArray[i].push('+');
                }
            }
        }

        wallsArray[this._h * 2] = ['+'];
        for (let i = 0; i < this._w * 2 - 2; i++) {
            wallsArray[this._h * 2].push('+');
        }
        wallsArray[this._h * 2].push('.'); wallsArray[this._h * 2].push('+');

        return wallsArray;
    }
}

const canvas = document.querySelector('canvas');
const c = canvas.getContext("2d");

canvas.width = 990;
canvas.height = 570;

class Cell {
    constructor({ position }) {
        this.position = position;
        this.width = 30;
        this.height = 30;
    }

    draw() {
        c.fillStyle = 'black';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

class Gate {
    constructor({ position }) {
        this.position = position;
        this.width = 30;
        this.height = 30;
        this.open = false;
    }

    draw() {
        if (!this.open) {
            c.fillStyle = 'saddlebrown';
            c.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
    }
}

class Key {
    constructor({ position }) {
        this.position = position;
        this.width = 16;
        this.height = 16;
        this.got = false;
    }

    draw() {
        if (!this.got) {
            c.fillStyle = 'gold';
            c.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
    }
}

class Player {
    constructor({ position }) {
        this.position = position;
        this.velocity = { x: 0, y: 0 };
        this.width = 16;
        this.height = 16;
        this.withKey = false;
        this.reachedEnd = false;
    }

    draw() {
        c.fillStyle = 'purple';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
        if (this.withKey) {
            c.fillStyle = 'gold';
            c.fillRect(this.position.x, this.position.y, this.width/2, this.height/2);
        }
    }

    update() {
        this.draw();
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;
    }
}

const form = document.getElementById("size");

let mazeWidth = 4;
let mazeHeight = 4;


const player = new Player({
    position: { x: 37, y: 7 }
})

let endGate = new Gate({
    position: { x: 30*(mazeWidth*2 - 1), y: 30*mazeHeight*2}
})

let rand1 = Math.ceil(mazeWidth * Math.random());
let rand2 = Math.ceil(mazeHeight * Math.random());

let endKey = new Key({
    position: { x: 30*(rand1*2-1) + 7, y: 30*(rand2*2-1) + 7 }
})

const keys = {
    up: { pressed: false, }, 
    down: { pressed: false, },
    right: { pressed: false, },
    left: { pressed: false, },
}

let mazeA = new RectMaze(mazeHeight, mazeWidth);
mazeA.generateMaze();
let mazeB = mazeA.mazeToWallArray();
let maze = [new Cell({ position: { x: 30, y: -30 } })];

mazeB.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch (symbol) {
            case '+':
                maze.push(
                    new Cell({
                        position: {
                            x: 30 * j,
                            y: 30 * i
                        }
                    })
                )
        }
    })
})

function makeMaze() {
    if (Math.random() > 0.5 && mazeHeight < 8) {
        mazeHeight++;
    } else if (mazeWidth < 16) {
        mazeWidth++;
    } else if (mazeHeight < 9) {
        mazeHeight++;
    }

    endGate.position = { x: 30 * (mazeWidth * 2 - 1), y: 30 * mazeHeight * 2 };

    rand1 = Math.ceil(mazeWidth * Math.random());
    rand2 = Math.ceil(mazeHeight * Math.random());

    endKey = new Key({
        position: { x: 30 * (rand1 * 2 - 1) + 7, y: 30 * (rand2 * 2 - 1) + 7 }
    })

    mazeA = new RectMaze(mazeHeight, mazeWidth);
    mazeA.generateMaze();
    mazeB = mazeA.mazeToWallArray();
    maze = [new Cell({ position: { x: 30, y: -30 } })];

    mazeB.forEach((row, i) => {
        row.forEach((symbol, j) => {
            switch (symbol) {
                case '+':
                    maze.push(
                        new Cell({
                            position: {
                                x: 30 * j,
                                y: 30 * i
                            }
                        })
                    )
            }
        })
    })
}

function animate() {
    let end = requestAnimationFrame(animate);
    c.fillStyle = "white";
    c.fillRect(0, 0, canvas.width, canvas.height);
    maze.forEach(cell => {
        cell.draw();
    });
    endGate.draw();
    endKey.draw();
    player.update();
    if (keys.down.pressed && !keys.up.pressed) {
        player.velocity.y = 2;
    } else if (keys.up.pressed && !keys.down.pressed) {
        player.velocity.y = -2;
    } else {
        player.velocity.y = 0;
    }
    if (keys.left.pressed && !keys.right.pressed) {
        player.velocity.x = -2;
    } else if (keys.right.pressed && !keys.left.pressed) {
        player.velocity.x = 2;
    } else {
        player.velocity.x = 0;
    }
    maze.forEach(cell => {
        if (player.position.x + player.velocity.x < cell.position.x + cell.width &&
            player.position.x + player.width + player.velocity.x > cell.position.x &&
            player.position.y < cell.position.y + cell.height &&
            player.position.y + player.height > cell.position.y) {
            player.velocity.x = 0;
            if (player.position.x < cell.position.x) {
                player.position.x = cell.position.x - player.width;
            } else {
                player.position.x = cell.position.x + cell.width;
            }
        }
        if (player.position.x < cell.position.x + cell.width &&
            player.position.x + player.width > cell.position.x &&
            player.position.y + player.velocity.y < cell.position.y + cell.height &&
            player.position.y + player.height + player.velocity.y > cell.position.y) {
            player.velocity.y = 0;
            if (player.position.y < cell.position.y) {
                player.position.y = cell.position.y - player.height;
            } else {
                player.position.y = cell.position.y + cell.height;
            }
        }
    });

    if (player.position.x + player.velocity.x < endKey.position.x + endKey.width &&
        player.position.x + player.width + player.velocity.x > endKey.position.x &&
        player.position.y + player.velocity.y < endKey.position.y + endKey.height &&
        player.position.y + player.height + player.velocity.y > endKey.position.y) {
        endKey.got = true;
        player.withKey = true;
    }

    if (player.position.x + player.velocity.x < endGate.position.x + endGate.width &&
        player.position.x + player.width + player.velocity.x > endGate.position.x &&
        player.position.y + player.velocity.y < endGate.position.y + endGate.height &&
        player.position.y + player.height + player.velocity.y > endGate.position.y) {
        if (player.withKey) {
            endGate.open = true;
            player.withKey = false;
        } else if (!endGate.open) {
            player.velocity.y = 0;
        }
    }

    if (player.position.y > 30 * mazeHeight * 2 + 7) {
        player.reachedEnd = true;
        drawWinText();
        cancelAnimationFrame(end);
    }
}

function drawWinText() {
    c.fillStyle = "lightgrey";
    c.fillRect(295, 150, 400, 190);
    c.strokeStyle = "grey";
    c.strokeRect(295, 150, 400, 190);
    if (mazeHeight < 9 || mazeWidth < 16) {
        c.fillStyle = "black";
        c.font = "32px Arial";
        c.fillText("Press space to make a", 330, 240);
        c.fillText("new, harder, maze.", 355, 274);
    } else {
        c.fillStyle = "black";
        c.font = "32px Arial";
        c.fillText("You finished the game!", 330, 240);
    }
}

animate();

addEventListener("keydown", ({ key }) => {
    switch (key) {
        case "w":
            keys.up.pressed = true;
            break;
        case "s":
            keys.down.pressed = true;
            break;
        case "a":
            keys.left.pressed = true;
            break;
        case "d":
            keys.right.pressed = true;
            break;
        case " ":
            if (player.reachedEnd) {
                console.log("restart tried");
                player.position = { x: 37, y: 7 };
                endGate.open = false;
                player.withKey = false
                console.log("fine");
                makeMaze();
                console.log("fine");
                animate();
                console.log("fine");
            }
    }
})

addEventListener("keyup", ({ key }) => {
    switch (key) {
        case "w":
            keys.up.pressed = false;
            break;
        case "s":
            keys.down.pressed = false;
            break;
        case "a":
            keys.left.pressed = false;
            break;
        case "d":
            keys.right.pressed = false;
            break;
    }
})