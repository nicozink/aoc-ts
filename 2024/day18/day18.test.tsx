import * as fs from 'fs';

type Position = {
    x: number;
    y: number;
};

type Input = {
    bytes: Position[];
    grid: string[][];
    start: Position;
    end: Position;
}

function readInput(path: string): Input {
    let file = fs.readFileSync(path, 'utf-8');
    let lines = file.split(/\r?\n/);

    let bytes: Position[] = [];
    for (let line of lines) {
        let split = line.split(',')
            .map(x => Number(x));
        
        bytes.push({
            x: split[0], y: split[1]
        });
    }

    let start: Position = {x: 0, y: 0};
    
    let maxX = Math.max(...bytes.map(byte => byte.x));
    let maxY = Math.max(...bytes.map(byte => byte.y));
    let end: Position = {x: maxX, y: maxY};

    let grid: string[][] = [];
    for (let y = 0; y <= end.y; y++) {
        let row: string[] = [];
        for (let x = 0; x <= end.x; x++) {
            row.push('.');
        }
        grid.push(row);
    }

    return {bytes, grid, start, end};
}

function canMove(pos: Position, grid: string[][]): boolean {
    if (pos.y < 0 || pos.y >= grid.length) {
        return false;
    }
    if (pos.x < 0 || pos.x >= grid[pos.y].length) {
        return false;
    }
    
    if (grid[pos.y][pos.x] == '#') {
        return false;
    }

    return true;
}

function getNeighbours(pos: Position, grid: string[][]) : Position[] {
    let neighbours: Position[] = [
        {x: pos.x, y: pos.y - 1},
        {x: pos.x, y: pos.y + 1},
        {x: pos.x - 1, y: pos.y},
        {x: pos.x + 1, y: pos.y}
    ];

    let validNeighbours: Position[] = [];
    for (let neighbour of neighbours) {
        if (canMove(neighbour, grid)) {
            validNeighbours.push(neighbour);
        }
    }
    
    return validNeighbours;
}

function getPathDistance(bytes: Position[], grid: string[][], start: Position, end: Position) {
    let visited = grid.map(x => x.map(() => Number.MAX_VALUE));
    visited[0][0] = 0;

    let frontier: Position[] = [start];
    while (frontier.length > 0) {
        let nextFrontier: Position[] = [];
        for (let position of frontier) {
            let distance = visited[position.y][position.x];
            if (position.x == end.x && position.y == end.y) {
                return distance;
            }

            for (let neighbour of getNeighbours(position, grid)) {
                let newDistance = distance + 1;
                if (visited[neighbour.y][neighbour.x] > newDistance) {
                    visited[neighbour.y][neighbour.x] = newDistance;
                    nextFrontier.push(neighbour);
                }
            }
        }
        frontier = nextFrontier;
    }

    return -1;
}

function getShortestPath(path: string, numFallen: number): number {
    let {bytes, grid, start, end} = readInput(path);

    for (let i = 0; i < numFallen; i++) {
        let {x, y} = bytes[i];
        grid[y][x] = '#';
    }

    return getPathDistance(bytes, grid, start, end);
}

function findWayBlocker(path: string, numFallen: number) {
    let {bytes, grid, start, end} = readInput(path);

    for (let i = 0; i < numFallen; i++) {
        let {x, y} = bytes[i];
        grid[y][x] = '#';
    }
    numFallen++;

    while (numFallen < bytes.length) {
        let {x, y} = bytes[numFallen];
        grid[y][x] = '#';

        if (getPathDistance(bytes, grid, start, end) == -1) {
            return `${x},${y}`;
        }

        numFallen++;
    }

    throw new Error();
}

describe('2024_day_18', () => {
    it('example1', async () => {
        const result = getShortestPath("2024/day18/example.txt", 12);
        expect(result).toBe(22);
    });
    it('solution1', async () => {
        const result = getShortestPath("2024/day18/input.txt", 1024);
        expect(result).toBe(326);
    });
    it('example2', async () => {
        const result = findWayBlocker("2024/day18/example.txt", 12);
        expect(result).toBe("6,1");
    });
    it('solution2', async () => {
        const result = findWayBlocker("2024/day18/input.txt", 1024);
        expect(result).toBe("18,62");
    });
});