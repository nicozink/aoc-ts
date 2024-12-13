import * as fs from 'fs';

type Position = {
    row: number;
    col: number;
};

function getNextPlot(plots: string[][]): Position | undefined {
    for (let row = 0; row < plots.length; row++) {
        for (let col = 0; col < plots[row].length; col++) {
            if (plots[row][col] != '.') {
                return {row, col};
            }
        }
    }

    return;
}

function isValid(garden: string[][], position: Position) {
    if (position.row < 0 || position.row >= garden.length) {
        return false;
    }

    if (position.col < 0 || position.col >= garden[position.row].length) {
        return false;
    }

    return true;
}

function hasFence(garden: string[][], first: Position, second: Position) {
    if (!isValid(garden, second)) {
        return true;
    }

    if (garden[first.row][first.col] != garden[second.row][second.col]) {
        return true;
    }

    return false;
}

function getNeighhbours(garden: string[][], position: Position): Position[] {
    let neighbourOffsets: Position[] = [
        {row: -1, col: 0},
        {row: 1, col: 0},
        {row: 0, col: 1},
        {row: 0, col: -1}
    ];

    let validNeighbours: Position[] = [];    
    for (var neighbourPosition of neighbourOffsets) {
        let neighbour = {
            row: position.row + neighbourPosition.row,
            col: position.col + neighbourPosition.col
        };
        if (!hasFence(garden, position, neighbour)) {
            validNeighbours.push(neighbour);
        }
    }

    return validNeighbours;
}

function isCorner(garden: string[][], first: Position, second: Position): boolean {
    let deltaRow = second.row - first.row;
    let deltaCol = second.col - first.col;

    let position1 = {row: first.row + deltaRow, col: first.col};
    let position2 = {row: first.row, col: first.col + deltaCol};
    if (hasFence(garden, first, position1) && hasFence(garden, first, position2)) {
            return true;
    }
    
    if (!isValid(garden, second)) {
        return false;
    }

    if (!hasFence(garden, first, position1) && !hasFence(garden, first, position2) &&
        hasFence(garden, second, position1) && hasFence(garden, second, position2)) {
        return true;
    }

    return false;
}

function getCorners(garden: string[][], position: Position): Position[] {
    let cornerOffsets: Position[] = [
        {row: -1, col: -1},
        {row: -1, col: 1},
        {row: 1, col: -1},
        {row: 1, col: 1}
    ];
    
    let validCorners: Position[] = [];    
    for (var cornerPosition of cornerOffsets) {
        let corner = {
            row: position.row + cornerPosition.row,
            col: position.col + cornerPosition.col
        };
        if (isCorner(garden, position, corner)) {
            validCorners.push(corner);
        }
    }

    return validCorners;
}

type Region = {
    plots: number;
    fences: number;
};

function evaluateRegion(garden: string[][], visited: string[][], startPosition: Position, countCorners: boolean): Region {
    let plots = 0;
    let fences = 0;

    let stack: Position[] = [startPosition];
    while (stack.length > 0) {
        let next = stack.pop()!;
        if (visited[next.row][next.col] == '.') {
            continue;
        }
        visited[next.row][next.col] = '.';

        let neighbours = getNeighhbours(garden, next);
        let corners = getCorners(garden, next);
        if (countCorners) {
            fences += corners.length;
        } else {
            fences += 4 - neighbours.length;
        }

        for (var neighbour of neighbours) {
            stack.push(neighbour);
        }

        plots++;
    }

    return {plots, fences};
}

function countFencePrices(path: string, countCorners: boolean): number {
    let input = fs.readFileSync(path, 'utf-8');
    let garden = input.split(/\r?\n/)
        .map(x => x.split(''));
    let visited = garden.map(x => x.map(y => ''));

    let totalPrice = 0;
    while (true) {
        let next = getNextPlot(visited);
        if (!next) {
            break;
        }

        let {plots, fences} = evaluateRegion(garden, visited, next, countCorners);
        totalPrice += plots * fences;
    }

    return totalPrice;
}

describe('2024_day_12', () => {
    it('example1', async () => {
        const result = countFencePrices("2024/day12/example1.txt", false);
        expect(result).toBe(140);
    });
    it('example2', async () => {
        const result = countFencePrices("2024/day12/example2.txt", false);
        expect(result).toBe(772);
    });
    it('example3', async () => {
        const result = countFencePrices("2024/day12/example3.txt", false);
        expect(result).toBe(1930);
    });
    it('solution1', async () => {
        const result = countFencePrices("2024/day12/input.txt", false);
        expect(result).toBe(1363682);
    });
    it('example4', async () => {
        const result = countFencePrices("2024/day12/example1.txt", true);
        expect(result).toBe(80);
    });
    it('example5', async () => {
        const result = countFencePrices("2024/day12/example2.txt", true);
        expect(result).toBe(436);
    });
    it('example6', async () => {
        const result = countFencePrices("2024/day12/example3.txt", true);
        expect(result).toBe(1206);
    });
    it('solution2', async () => {
        const result = countFencePrices("2024/day12/input.txt", true);
        expect(result).toBe(787680);
    });
});