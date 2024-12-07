import * as fs from 'fs';

class Position {
    r: number;
    c: number;

    constructor(r: number, c: number) {
        this.r = r;
        this.c = c;
    }
}

class Direction {
    r: number;
    c: number;

    constructor(r: number, c: number) {
        this.r = r;
        this.c = c;
    }
}

let directions: Direction[] = [
    new Direction(-1, 0),
    new Direction(0, 1),
    new Direction(1, 0),
    new Direction(0, -1)
];

let directionMarkers: string[] = [ '^', '>', 'v', '<' ];

function readLines(path: string): string[][] {
    let input = fs.readFileSync(path, 'utf-8');
    return input.split(/\r?\n/)
        .map(x => x.split(''));
}

function findStart(lines: string[][]): Position {
    for (let r = 0; r < lines.length; r++) {
        for (let c = 0; c < lines[r].length; c++) {
            if (lines[r][c] == '^') {
                return new Position(r, c);
            }
        }
    }

    throw new Error("Could not find start.");
}

function isPositionValid(lines: string[][], position: Position): boolean {
    return (position.r >= 0 && position.r < lines.length && position.c >= 0 && position.c < lines[0].length);
}

function patrol(lines: string[][], position: Position): Position {
    let direction = 0;
    while (true) {
        let directionDelta = directions[direction];
        let newPosition = new Position(position.r + directionDelta.r, position.c + directionDelta.c);
        if (!isPositionValid(lines, newPosition)) {
            return newPosition;
        }

        if (lines[newPosition.r][newPosition.c] == directionMarkers[direction]) {
            return newPosition;
        }

        if (lines[newPosition.r][newPosition.c] == '#') {
            direction = (direction + 1) % 4;
            continue;
        }

        lines[newPosition.r][newPosition.c] = directionMarkers[direction];
        position = newPosition;
    }
}

function countPositions(path: string): number {
    let lines = readLines(path);
    
    let position = findStart(lines);
    let direction = 0;
    lines[position.r][position.c] = directionMarkers[direction];

    patrol(lines, position);

    let count = 0;
    for (let r = 0; r < lines.length; r++) {
        for (let c = 0; c < lines[r].length; c++) {
            if (directionMarkers.find(x => x == lines[r][c])) {
                count++;
            }
        }
    }
    return count;
}

function countLoopObstructions(path: string): number {
    let startLines = readLines(path);

    let startPosition = findStart(startLines);
    startLines[startPosition.r][startPosition.c] = '|';

    let loops = 0;
    for (let r = 0; r < startLines.length; r++) {
        for (let c = 0; c < startLines[r].length; c++) {
            if (startLines[r][c] == '#') {
                continue;
            }

            let lines = startLines.map(x => x.map(y => y));
            lines[r][c] = '#';

            let position = startPosition;
            let endPosition = patrol(lines, position);

            if (isPositionValid(lines, endPosition)) {
                loops++;
            }
        }
    }
    return loops;
}

describe('2024_day_06', () => {
    it('example1', async () => {
        const count = countPositions("2024/day06/example.txt");
        expect(count).toBe(41);
    });
    it('solution1', async () => {
        const count = countPositions("2024/day06/input.txt");
        expect(count).toBe(4890);
    });
    it('example2', async () => {
        const count = countLoopObstructions("2024/day06/example.txt");
        expect(count).toBe(6);
    });
    it('solution2', async () => {
        const count = countLoopObstructions("2024/day06/input.txt");
        expect(count).toBe(1995);
    });
});