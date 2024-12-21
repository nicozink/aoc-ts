import * as fs from 'fs';

type Position = {
    row: number;
    col: number;
};

type Input = {
    grid: string[][];
    start: Position;
    end: Position;
}

function readInput(path: string): Input {
    let file = fs.readFileSync(path, 'utf-8');
    let grid = file.split(/\r?\n/)
        .map(row => row.split(''));

    let start: Position = {row: 0, col: 0};
    let end: Position = {row: 0, col: 0};
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            if (grid[r][c] == 'S') {
                start = {row: r, col: c};
                grid[r][c] = '.';
            } else if (grid[r][c] == 'E') {
                end = {row: r, col: c};
                grid[r][c] = '.';
            }
        }
    }

    return {grid, start, end};
}

function canMove(pos: Position, grid: string[][]): boolean {
    if (pos.row < 0 || pos.row >= grid.length) {
        return false;
    }
    if (pos.col < 0 || pos.col >= grid[pos.col].length) {
        return false;
    }
    
    if (grid[pos.row][pos.col] == '#') {
        return false;
    }

    return true;
}

function getNeighbours(pos: Position, grid: string[][]) : Position[] {
    let neighbours: Position[] = [
        {row: pos.row, col: pos.col - 1},
        {row: pos.row, col: pos.col + 1},
        {row: pos.row - 1, col: pos.col},
        {row: pos.row + 1, col: pos.col}
    ];

    let validNeighbours: Position[] = [];
    for (let neighbour of neighbours) {
        if (canMove(neighbour, grid)) {
            validNeighbours.push(neighbour);
        }
    }
    
    return validNeighbours;
}

function getPath(grid: string[][], start: Position, end: Position): Position[] {
    let visited = grid.map(x => x.map(() => false));
    visited[start.row][start.col] = true;

    let path: Position[] = [start];

    let position = start;
    while (position.row != end.row || position.col != end.col) {
        for (let neighbour of getNeighbours(position, grid)) {
            if (!visited[neighbour.row][neighbour.col]) {
                path.push(neighbour);
                visited[neighbour.row][neighbour.col] = true;

                position = neighbour;                    
            }
        }
    }

    return path;
}

function countCheats(filePath: string, picoseconds: number, saving: number): number {
    let {grid, start, end} = readInput(filePath);
    let path = getPath(grid, start, end);

    let numCheats = 0;
    for (let x = 0; x < path.length - saving; x++) {
        for (let y = x + saving; y < path.length; y++) {
            let pos1 = path[x];
            let pos2 = path[y];

            let rowDiff = pos2.row - pos1.row;
            if (rowDiff < 0) {
                rowDiff *= -1;
            }
            
            let colDiff = pos2.col - pos1.col;
            if (colDiff < 0) {
                colDiff *= -1;
            }
            
            let shortcutDistance = rowDiff + colDiff;
            if (shortcutDistance <= picoseconds) {
                let stepsDiff = y - x;
                if (stepsDiff - shortcutDistance >= saving) {
                    numCheats++;
                }
            }
        }
    }

    return numCheats;
}

describe('2024_day_20', () => {
    it('example1', async () => {
        const result = countCheats("2024/day20/example.txt", 2, 20);
        expect(result).toBe(5);
    });
    it('solution1', async () => {
        const result = countCheats("2024/day20/input.txt", 2, 100);
        expect(result).toBe(1511);
    });
    it('example2', async () => {
        const result = countCheats("2024/day20/example.txt", 20, 72 );
        expect(result).toBe(29);
    });
    it('solution2', async () => {
        const result = countCheats("2024/day20/input.txt", 20, 100);
        expect(result).toBe(1020507);
    });
});