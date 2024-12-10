import * as fs from 'fs';

class Position {
    row: number;
    col: number;

    constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
    }
}

let directions = [
    new Position(-1, 0),
    new Position(1, 0),
    new Position(0, -1),
    new Position(0, 1)
];

function getStartLocations(trails: number[][]): Position[] {
    let positions: Position[] = [];

    for (let r = 0; r < trails.length; r++) {
        for (let c = 0; c < trails[r].length; c++) {
            if (trails[r][c] == 0) {
                positions.push(new Position(r, c));
            }
        }
    }

    return positions;
}

function getNeighbours(trails: number[][], start: Position) : Position[] {
    let neighbours: Position[] = [];
    for (let direction of directions) {
        let next = new Position(start.row + direction.row, start.col + direction.col);

        if (next.row < 0 || next.row >= trails.length) {
            continue;
        }
    
        if (next.col < 0 || next.col >= trails[next.row].length) {
            continue;
        }
    
        let prevValue = trails[start.row][start.col];
        let nextValue = trails[next.row][next.col];
        if (nextValue != prevValue + 1) {
            continue;
        }
    
        neighbours.push(next);
    }

    return neighbours;
}

function calculateTrailScore(trails: number[][], start: Position, uniqueOnly: boolean): number {
    let trailEnds: Position[] = [];

    let frontier = [start];
    while (frontier.length > 0) {
        let next = frontier.pop()!;
        
        let nextValue = trails[next.row][next.col];
        if (nextValue == 9) {
            if (!uniqueOnly || !trailEnds.find(x => x.row == next.row && x.col == next.col)) {
                trailEnds.push(next);
            }
            continue;
        }

        let neighbours = getNeighbours(trails, next);
        for (let neighbour of neighbours) {
            frontier.push(neighbour);
        }
    }

    return trailEnds.length;
}

function countTrailScores(path: string, uniqueOnly: boolean): number {
    let input = fs.readFileSync(path, 'utf-8');
    let trails = input.split(/\r?\n/)
        .map(x => x.split('').map(y => Number(y)));

    let trailScores = 0;
    var startPostions = getStartLocations(trails);
    for (let startPostion of startPostions) {
        trailScores += calculateTrailScore(trails, startPostion, uniqueOnly);
    }

    return trailScores;
}

describe('2024_day_10', () => {
    it('example1', async () => {
        const result = countTrailScores("2024/day10/example.txt", true);
        expect(result).toBe(36);
    });
    it('solution1', async () => {
        const result = countTrailScores("2024/day10/input.txt", true);
        expect(result).toBe(531);
    });
    it('example2', async () => {
        const result = countTrailScores("2024/day10/example.txt", false);
        expect(result).toBe(81);
    });
    it('solution2', async () => {
        const result = countTrailScores("2024/day10/input.txt", false);
        expect(result).toBe(1210);
    });
});