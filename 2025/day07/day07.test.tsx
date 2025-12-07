import * as fs from 'fs';

function readGrid(path: string) {
    let input = fs.readFileSync(path, 'utf-8');
    let grid = input.split(/\r?\n/)
        .map(x => x.split(''));
    
    let start = Math.floor(grid[0].length / 2);
    grid[0][start] = '|';

    return grid;
}

function placeBeam(row: string[], col: number) {
    if (col < 0 || col >= row.length)
        return;
    if (row[col] === '.')
        row[col] = '|';
}

function advanceBeam(row: string[], col: number) {
    if (row[col] === '.') {
        placeBeam(row, col);
    } else if (row[col] === '^') {
        placeBeam(row, col - 1);
        placeBeam(row, col + 1);
        return 1;
    }
    return 0;
}

function getNumberSplits(path: string) {
    let grid = readGrid(path);

    let splits = 0;
    for (let i = 0; i < grid.length - 1; ++i) {
        let current = grid[i];
        let next = grid[i + 1];

        for (let j = 0; j < current.length; ++j) {
            if (current[j] !== '|')
                continue;
            splits += advanceBeam(next, j);
        }
    }
    return splits;
}

function getTimelinesRecursive(grid: string[][], timelines: Map<number, number>[], row: number, col: number) {
    if (row === grid.length - 1)
        return 1;
    if (col < 0 || col >= grid[row].length)
        return 0;
    if (timelines[row].has(col))
        return timelines[row].get(col)!;

    let numTimelines = 0;
    if (grid[row][col] === '.') {
        numTimelines = getTimelinesRecursive(grid, timelines, row + 1, col);
    } else if (grid[row][col] === '^') {
        numTimelines += getTimelinesRecursive(grid, timelines, row + 1, col - 1);
        numTimelines += getTimelinesRecursive(grid, timelines, row + 1, col + 1);
    }
    timelines[row].set(col, numTimelines);
    return numTimelines;
}

function getNumberTimelines(path: string) {
    let grid = readGrid(path);

    let timelines: Map<number, number>[] = [];
    grid.forEach(() => timelines.push(new Map<number, number>));

    let start = Math.floor(grid[0].length / 2);
    return getTimelinesRecursive(grid, timelines, 1, start);
}

describe('2025_day_07', () => {
    it('example1', async () => {
        const count = getNumberSplits("2025/day07/example.txt");
        expect(count).toBe(21);
    });
    it('solution1', async () => {
        const count = getNumberSplits("2025/day07/input.txt");
        expect(count).toBe(1690);
    });
    it('example2', async () => {
        const count = getNumberTimelines("2025/day07/example.txt");
        expect(count).toBe(40);
    });
    it('solution2', async () => {
        const count = getNumberTimelines("2025/day07/input.txt");
        expect(count).toBe(221371496188107);
    });
});