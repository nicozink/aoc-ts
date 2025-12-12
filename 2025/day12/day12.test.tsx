import * as fs from 'fs';

type GridSize = {x: number, y: number};
type Grid = {
    size: GridSize,
    blockCounts: number[]
};
type Puzzle = {
    tileCounts: number[],
    grids: Grid[]
}

function countCharacters(str: string) {
    let count = 0;
    for (let i = 0; i < str.length; ++i) {
        if (str[i] === '#') {
            ++count;
        }
    }
    return count;
}

function readInput(path: string): Puzzle {
    let input = fs.readFileSync(path, 'utf-8');
    let lines = input.split(/\r?\n/);
    
    let i = 0;
    let tileCounts = [];
    while (lines[i].length === 2) {
        let tileCount = 0;
        for (let j = i + 1; j < i + 4; ++j) {
            tileCount += countCharacters(lines[j]);
        }
        tileCounts.push(tileCount);
        i += 5;
    }

    let grids = [];
    while (i < lines.length) {
        let line = lines[i];
        let split = line.split(': ');

        let sizes = split[0].split('x');
        let size = {x: Number(sizes[0]), y: Number(sizes[1])};

        let counts = split[1].split(' ');
        let blockCounts = [];
        for (let countsStr of counts) {
            blockCounts.push(Number(countsStr));
        }
        grids.push({size, blockCounts});

        ++i;
    }
    return {tileCounts, grids};
}

function countFittingRegions(path: string) {
    let puzzle = readInput(path);
    let fittingRegions = 0;
    for (let grid of puzzle.grids) {
        let gridSize = grid.size;
        let actualArea = gridSize.x * gridSize.y;

        let requiredArea = 0;
        for (let i = 0; i < grid.blockCounts.length; ++i) {
            requiredArea += puzzle.tileCounts[i] * grid.blockCounts[i];
        }

        if (requiredArea <= actualArea) {
            ++fittingRegions;
        }
    }
    return fittingRegions;
}

describe('2025_day_12', () => {
    it('solution', async () => {
        const count = countFittingRegions("2025/day12/input.txt");
        expect(count).toBe(497);
    });
});