var rows = 16;
var cols = 30;

var grid = new Grid(rows, cols, 0.25);
var flagsUsed = grid.numberOfMines;

$("#mineGrid").append(grid.getHTML());

var marginheight = rows * 2 * 2;
var paddingheight = rows * 2 * 10;
var blockheight = Math.floor((window.innerHeight - marginheight - paddingheight) / (rows));
blockheight -= blockheight / rows;

var marginwidth = cols * 2 * 2;
var paddingwidth = cols * 2 * 10;
var blockwidth = Math.floor((window.innerWidth - marginwidth - paddingwidth) / cols);
blockwidth -= blockwidth / cols;

var XXX = Math.min(blockheight, blockwidth);
var totalWidth = XXX * cols + marginwidth + paddingwidth;
var totalHeight = XXX * rows + marginheight + paddingheight;

var leftmargin = (window.innerWidth - totalWidth) / 2;

$(".block").css("height", XXX.toString() + "px");
$(".block").css("width", XXX.toString() + "px");
$(".block").css("font-size", (XXX - 2).toString() + "px");
$("#mineGrid").css("min-width", (totalWidth).toString() + "px");
$("#mineGrid").css("min-height", (totalHeight).toString() + "px");

$("#HUD").css("margin-left", leftmargin.toString() + "px");

function updateMineGrid() {
    $("#mineGrid").empty();
    $("#mineGrid").append(grid.getHTML());
    $(".block").css("height", XXX.toString() + "px");
    $(".block").css("width", XXX.toString() + "px");
    $(".block").css("font-size", (XXX - 2).toString() + "px");
}

function handleClick(row, col) {
    if (grid.firstClick === true) {
        grid.firstClick = false;
        grid.populateGrid(row, col);
    }
    // grid.grid[row][col].reveal();
    if (grid.grid[row][col].flagged) {return;}
    if (grid.grid[row][col].number === -1) {
        alert("BOMB! GAME OVER!");
        window.location.reload();
        return;
    }
    grid.floodFill(row, col);
    updateMineGrid();
    grid.revealSafe();
    updateMineGrid();
    if (grid.checkSolved()) {
        alert("You Win!");
        window.location.reload();
    }
}

function handleRightClick(row, col) {
    if (grid.grid[row][col].unfolded === false) {return;}
    grid.grid[row][col].flag();
    updateMineGrid();
    grid.revealSafe();
    updateMineGrid();
    return false;
}
