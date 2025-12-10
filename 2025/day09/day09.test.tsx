import * as fs from 'fs';

type Position = {x: number, y: number};

function readInput(path: string): Position[] {
    let input = fs.readFileSync(path, 'utf-8');
    let lines = input.split(/\r?\n/);
    
    const positions = [];
    for (let line of lines) {
        let coords = line.split(',');
        positions.push({x: Number(coords[0]), y: Number(coords[1])});
    }
    return positions;
}

function getXMap(positions: Position[]): Map<number, number> {
    let sortedPositions = positions.toSorted((a, b) => a.x - b.x);
    let xMap = new Map<number, number>();
    let curX = 1; // Start at 1 so we have (0, 0) empty
    for (let position of sortedPositions) {
        if (xMap.has(position.x)) continue;
        xMap.set(position.x, curX);
        ++curX;
    }
    return xMap;
}

function getYMap(positions: Position[]): Map<number, number> {
    let sortedPositions = positions.toSorted((a, b) => a.y - b.y);
    let yMap = new Map<number, number>();
    let curY = 1;  // Start at 1 so we have (0, 0) empty
    for (let position of sortedPositions) {
        if (yMap.has(position.y)) continue;
        yMap.set(position.y, curY);
        ++curY;
    }
    return yMap;
}

function convertPosition(pos: Position, xMap: Map<number, number>, yMap: Map<number, number>): Position {
    return {
        x: xMap.get(pos.x)!,
        y: yMap.get(pos.y)!
    };
}

function getMinMax(pos1: Position, pos2: Position) {
    let minX = Math.min(pos1.x, pos2.x);
    let maxX = Math.max(pos1.x, pos2.x);
    let minY = Math.min(pos1.y, pos2.y);
    let maxY = Math.max(pos1.y, pos2.y);
    return {
        min: {x: minX, y: minY},
        max: {x: maxX, y: maxY}
    }
}

function fill(grid: string[][], pos1: Position, pos2: Position) {
    let {min, max} = getMinMax(pos1, pos2);
    for (let x = min.x; x <= max.x; ++x) {
        for (let y = min.y; y <= max.y; ++y) {
            grid[y][x] = '#';
        }
    }
}

function floodFill(grid: string[][], startPos: Position) {
    let stack = [startPos];
    while (stack.length > 0) {
        let pos = stack.pop()!;
        if (pos.y < 0 || pos.y >= grid.length) continue;
        if (pos.x < 0 || pos.x >= grid[pos.y].length) continue;
        if (grid[pos.y][pos.x] !== '.') continue;

        grid[pos.y][pos.x] = ' ';
        stack.push({x: pos.x, y: pos.y - 1});
        stack.push({x: pos.x, y: pos.y + 1});
        stack.push({x: pos.x - 1, y: pos.y});
        stack.push({x: pos.x + 1, y: pos.y});
    }
}

function getGrid(positions: Position[], xMap: Map<number, number>, yMap: Map<number, number>) {
    let maxX = 0;
    for (let x of xMap.values())
        maxX = Math.max(x, maxX);

    let maxY = 0;
    for (let y of yMap.values())
        maxY = Math.max(y, maxY);

    const grid = Array.from({length: maxY + 2}, (_, i) => new Array(maxX + 2).fill('.'));
    for (let i = 0; i < positions.length; ++i) {
        let next = (i + 1) % positions.length;
        let pos1 = convertPosition(positions[i], xMap, yMap);
        let pos2 = convertPosition(positions[next], xMap, yMap);
        fill(grid, pos1, pos2);
    }

    floodFill(grid, {x: 0, y: 0});
    return grid;
}

function getLargestArea(path: string, limitColors: boolean) {
    const positions = readInput(path);
    const xMap = getXMap(positions);
    const yMap = getYMap(positions);
    const grid = getGrid(positions, xMap, yMap);

    let largestArea = 0;
    for (let i = 0; i < positions.length - 1; ++i) {
        let pos1 = positions[i];
        for (let j = i + 1; j < positions.length; ++j) {
            let pos2 = positions[j];

            let {min, max} = getMinMax(pos1, pos2);
            if (limitColors) {
                let allInternal = true;
                let convertedMin = convertPosition(min, xMap, yMap);
                let convertedMax = convertPosition(max, xMap, yMap);
                for (let x = convertedMin.x; x <= convertedMax.x; ++x) {
                    for (let y = convertedMin.y; y <= convertedMax.y; ++y) {
                        allInternal &&= (grid[y][x] !== ' ');
                    }
                }

                if (!allInternal) continue;
            }

            let area = (max.x - min.x + 1) * (max.y - min.y + 1);
            largestArea = Math.max(area, largestArea);
        }
    }

    return largestArea;
}

describe('2025_day_09', () => {
    it('example1', async () => {
        const count = getLargestArea("2025/day09/example.txt", false);
        expect(count).toBe(50);
    });
    it('solution1', async () => {
        const count = getLargestArea("2025/day09/input.txt", false);
        expect(count).toBe(4786902990);
    });
    it('example2', async () => {
        const count = getLargestArea("2025/day09/example.txt", true);
        expect(count).toBe(24);
    });
    it('solution2', async () => {
        const count = getLargestArea("2025/day09/input.txt", true);
        expect(count).toBe(1571016172);
    });
});