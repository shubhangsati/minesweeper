class Block {
    constructor(number) {
        this.number = number;
        this.unfolded = true;
        this.flagged = false;
        this.string = "<br>";
        this.classlist = "block";
    }

    flag() {
        if (this.flagged === true) {
            this.flagged = false;
            this.string = "<br>";
            return;
        }
        this.flagged = true;
        this.string = "**";
    }

    reveal() {
        if (this.flagged === true) {return;}
        if (this.number == -1) {
            alert("Game Over!");
            window.location.reload();
        }
        if (this.unfolded === false) {return;}
        this.unfolded = false;
        if (this.number === -1) {
            this.string = "*";
        } else {
            if (this.number === 0) {
                this.string = "<br>";
            }
            else {
                this.string = this.number.toString();
            }
        }
        this.classlist += " folded";
    }

    getHTML(row, col) {
        return `<div class='${this.classlist}' onclick='handleClick(${row}, ${col});'
                oncontextmenu='handleRightClick(${row}, ${col}); return false;'>
                ${this.string}</div>`;
    }
}

class Grid {
    constructor(rows, cols, minesPercentage=0.15) {
        this.solved = false;
        this.rows = rows;
        this.cols = cols;
        this.minesPercentage = minesPercentage;
        this.numberOfMines = Math.floor(minesPercentage * (this.rows * this.cols + 1));
        this.firstClick = true;
        this.grid = [];
        
        for (var i = 0; i < this.rows; ++i) {
            var l = [];
            for (var j = 0; j < this.cols; ++j) {
                var b = new Block(0);
                l.push(b);
            }
            this.grid.push(l);
        }
    }

    getHTML() {
        var htmlstring = "";
        for (var i = 0; i < this.rows; ++i) {
            for (var j = 0; j < this.cols; ++j) {
                htmlstring += this.grid[i][j].getHTML(i, j);
            }
            htmlstring += "<br>";
        }
        return htmlstring;
    }

    static getRandint(a, b) {
        return Math.floor(Math.random() * (b - a) + a);
    }

    static isNeighbour(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) <= 1 && Math.abs(y1 - y2) <= 1;
    }

    populateGrid(clickx, clicky) {
        var count = 0;
        while (count < this.numberOfMines) {
            var randx = Grid.getRandint(0, this.rows - 1);
            var randy = Grid.getRandint(0, this.cols - 1);
            if (Grid.isNeighbour(clickx, clicky, randx, randy)) {
                continue;
            }

            if (this.grid[randx][randy].number === 0) {
                this.grid[randx][randy].number = -1;
                count += 1;
            }
        }

        var diffx = [-1, -1, -1, 0, 0, 1, 1, 1];
        var diffy = [-1, 0, 1, -1, 1, -1, 0, 1];
        for (var i = 0; i < this.rows; ++i) {
            for (var j = 0; j < this.cols; ++j) {
                if (this.grid[i][j].number === -1) {
                    continue;
                }
                var count = 0;
                for (var k = 0; k < 8; ++k) {
                    var newx = i + diffx[k];
                    var newy = j + diffy[k];
                    if (newx >= 0 && newx < this.rows - 1 && 
                        newy >= 0 && newy < this.cols - 1) {
                        if (this.grid[newx][newy].number === -1) {
                            count += 1;
                        }
                    }
                }

                this.grid[i][j].number = count;
            }
        }
    }

    floodFill(row, col) {
        if (this.grid[row][col].flagged === true) {return;}
        if (this.grid[row][col].number === -1) {return;}
        if (this.grid[row][col].unfolded === false) {return;}
        this.grid[row][col].reveal();
        if (this.grid[row][col].number != 0) {return;}
        var diffx = [-1, -1, -1, 0, 0, 1, 1, 1];
        var diffy = [-1, 0, 1, -1, 1, -1, 0, 1];
        for (var k = 0; k < 8; ++k) {
            var newrow = row + diffx[k];
            var newcol = col + diffy[k];
            if (newrow >= 0 && newrow <= this.rows - 1 && 
                newcol >= 0 && newcol <= this.cols - 1) {
                this.floodFill(newrow, newcol);
            }
        }
    }

    checkSolved() {
        var revealedcells = 0;
        for (var i = 0; i < this.rows; ++i) {
            for (var j = 0; j < this.cols; ++j) {
                if (this.grid[i][j].unfolded === false) {
                    revealedcells++;
                }
            }
        }
        if (revealedcells == ((this.rows * this.cols) - this.numberOfMines)) {
            return true;
        }
        else {
            return false;
        }
    }

    getRevealedGrid() {
        var res = [];
        for (var i = 0; i < this.rows; ++i) {
            var k = [];
            for (var j = 0; j < this.cols; ++j) {
                if (this.grid[i][j].string === this.grid[i][j].number.toString()) {
                    k.push(this.grid[i][j].number);
                }
                else if (this.grid[i][j].unfolded === false && this.grid[i][j].string === "<br>") {
                    k.push(0);
                }
                else {
                    k.push(-1);
                }
            }
            res.push(k);
        }
        return res;
    }

    revealSafe() {
        var changesMade = 1;
        while (changesMade > 0) {
            changesMade = 0;
            for (var i = 0; i < this.rows; ++i) {
                for (var j = 0; j < this.cols; ++j) {
                    if (this.grid[i][j].unfolded === true) {
                        continue;
                    }
                    var diffx = [-1, -1, -1, 0, 0, 1, 1, 1];
                    var diffy = [-1, 0, 1, -1, 1, -1, 0, 1];
                    var flagged = 0;
                    var unopened = 0;
                    for (var k = 0; k < 8; ++k) {
                        var row = i + diffx[k];
                        var col = j + diffy[k];
                        if (row >= 0 && row <= this.rows - 1 && col >= 0 && col <= this.cols - 1) {
                            if (this.grid[row][col].flagged === true) {
                                flagged++;
                            }
                            else if (this.grid[row][col].unfolded === true) {
                                unopened++;
                            }
                        }
                    }

                    if (this.grid[i][j].number === (flagged + unopened)) {
                        var diffx = [-1, -1, -1, 0, 0, 1, 1, 1];
                        var diffy = [-1, 0, 1, -1, 1, -1, 0, 1];
                        for (var k = 0; k < 8; ++k) {
                            var row = i + diffx[k];
                            var col = j + diffy[k];
                            if (row >= 0 && row <= this.rows - 1 && col >= 0 && col <= this.cols - 1) {
                                if (this.grid[row][col].unfolded === true && this.grid[row][col].flagged === false) {
                                    this.grid[row][col].flag();
                                    flagged++;
                                    changesMade++;
                                }
                            }
                        }
                    }

                    if (this.grid[i][j].number === flagged) {
                        var diffx = [-1, -1, -1, 0, 0, 1, 1, 1];
                        var diffy = [-1, 0, 1, -1, 1, -1, 0, 1];
                        for (var k = 0; k < 8; ++k) {
                            var row = i + diffx[k];
                            var col = j + diffy[k];
                            if (row >= 0 && row <= this.rows - 1 && col >= 0 && col <= this.cols - 1) {
                                if (this.grid[row][col].unfolded === true) {
                                    this.floodFill(row, col);
                                    changesMade++;
                                }
                            }
                        }
                    }
                }
            }
            console.log(changesMade);
        }
        return changesMade;
    }
}