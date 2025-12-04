import * as fs from 'fs';

function readGrid(path: string) {
    let input = fs.readFileSync(path, 'utf-8');
    return input.split(/\r?\n/)
        .map(x => x.split(''));
}

type Position = {x: number, y: number};
let neighbours: Position[] = [
    {x: -1, y: -1}, {x: 0, y: -1}, {x: 1, y: -1},
    {x: -1, y: 0},                {x: 1, y: 0},
    {x: -1, y: 1}, {x: 0, y: 1}, {x: 1, y: 1}
];

function isValid(grid: string[][], position: Position) {
    if (position.y < 0 || position.y >= grid.length)
        return false;
    if (position.x < 0 || position.x >= grid[position.y].length)
        return false;
    return true;
}

function countNeighbours(grid: string[][], position: Position) {
    let countNeighbours = 0;
    for (let neighbour of neighbours) {
        const nPosition = {x: position.x + neighbour.x, y: position.y + neighbour.y};
        if (!isValid(grid, nPosition))
            continue;
        if (grid[nPosition.y][nPosition.x] === '@')
            ++countNeighbours;
    }
    return countNeighbours;
}

function getAccessibleRolls(path: string) {
    let count = 0;
    let grid = readGrid(path);
    for (let y = 0; y < grid.length; ++y) {
        for (let x = 0; x < grid[y].length; ++x) {
            if (grid[y][x] === '.')
                continue;

            let neighbours = countNeighbours(grid, {x, y});
            if (neighbours < 4)
                ++count;
        }
    }
    return count;
}

function getRemovableRolls(path: string) {
    let removed = 0;
    let grid = readGrid(path);
    let previousRemoved = -1;
    while (removed !== previousRemoved) {
        previousRemoved = removed;
        for (let y = 0; y < grid.length; ++y) {
            for (let x = 0; x < grid[y].length; ++x) {
                if (grid[y][x] === '.')
                    continue;
                let neighbours = countNeighbours(grid, {x, y});
                if (neighbours < 4) {
                    grid[y][x] = '.';
                    ++removed;
                }
            }
        }
    }
    return removed;
}

describe('2025_day_03', () => {
    it('example1', async () => {
        const count = getAccessibleRolls("2025/day04/example.txt");
        expect(count).toBe(13);
    });
    it('solution1', async () => {
        const count = getAccessibleRolls("2025/day04/input.txt");
        expect(count).toBe(1393);
    });
    it('example2', async () => {
        const count = getRemovableRolls("2025/day04/example.txt");
        expect(count).toBe(43);
    });
    it('solution2', async () => {
        const count = getRemovableRolls("2025/day04/input.txt");
        expect(count).toBe(8643);
    });
});