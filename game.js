let gridX = 10;
let gridY = 15;
let minesPercentage = 0.15;

let grid = [];
for (var i = 0; i < gridX; ++i) {
    var row = [];
    for (var j = 0; j < gridY; ++j) {
        row.push(0);
    }
    grid.push(row);
}

let numberOfMines = Math.floor(minesPercentage * (gridX * gridY + 1));

function randInt(a, b) {
    return Math.floor(Math.random() * (b - a) + a);
}

function isNeighbour(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) <= 1 && Math.abs(y1 - y2) <= 1;
}

function populateGrid(clickX, clickY) {
    var count = 0;
    while (count < numberOfMines) {
        var randx = Randint(0, gridX - 1);
        var randy = Randint(0, gridY - 1);
        if (isNeighbour(clickX, clickY, randx, randy)) {
            continue;
        }
        if (grid[randx][randy] === 0) {
            grid[randx][randy] = -1;
            count += 1;
        }
    }

    var diffx = [-1, -1, -1, 0, 0, 1, 1, 1];
    var diffy = [-1, 0, 1, -1, 1, -1, 0, 1];
    for (var i = 0; i < x; ++i) {
        for (var j = 0; j < y; ++j) {
            if (grid[i][j] === -1) {
                continue;
            }
            var count = 0;
            for (var k = 0; k < 8; ++k) {
                var newx = i + diffx[k];
                var newy = j + diffy[k];
                if (newx >= 0 && newx < x - 1 && newy >= 0 && newy < y - 1) {
                    if (grid[newx][newy] === -1) {
                        count += 1;
                    }
                }
            }

            grid[i][j] = count;
        }
    }
}