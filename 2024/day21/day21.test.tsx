let numpad = [
    '789',
    '456',
    '123',
    ' 0A'
];

let directions = [
    ' ^A',
    '<v>'
];

function getPosition(grid: string[], char: string): number[] {
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col] == char) {
                return [grid.length - 1 - row, col];
            }
        }
    }
    throw new Error();
}

function move(from: number[], to: number[], char: string): string {
    let directions = '';
    let count = 0;
    if (char == '<') {
        count = from[1] - to[1];
    } else if (char == '>') {
        count = to[1] - from[1];
    } else if (char == '^') {
        count = to[0] - from[0];
    } else if (char == 'v') {
        count = from[0] - to[0];
    }
    
    for (let x = 0; x < count; x++) {
        directions += char;
    }

    return directions;
}

function getMove(from: number[], to: number[], hole: number[]): string {
    let directions = '';

    if (from[0] == hole[0] && to[1] == hole[1]) {
        directions += move(from, to, '^');
        directions += move(from, to, 'v');
        directions += move(from, to, '<');
        directions += move(from, to, '>');
    } else if (from[1] == hole[1] && to[0] == hole[0]) {
        directions += move(from, to, '<');
        directions += move(from, to, '>');
        directions += move(from, to, '^');
        directions += move(from, to, 'v');
    } else {
        directions += move(from, to, '<');
        directions += move(from, to, 'v');
        directions += move(from, to, '^');
        directions += move(from, to, '>');
    }
    directions += 'A';

    return directions;
}

type Moves = Map<string, number>;

function getMoves(grid: string[], from: string, to: string): Moves {
    let fromPos = getPosition(grid, from);
    let toPos = getPosition(grid, to);
    let hole = getPosition(grid, ' ');

    let moves = getMove(fromPos, toPos, hole);
    let lookup = new Map<string, number>();

    let prev = 'A';
    for (let next of moves) {
        let combined = `${prev}${next}`;
        
        let total = lookup.get(combined) || 0;
        total++;
        lookup.set(combined, total);

        prev = next;
    }

    return lookup;
}

function combine(destination: Moves, newMoves: Moves, multiplier: number = 1)
{
    for (let [key, value] of newMoves) {
        let total = destination.get(key) || 0;
        total += value * multiplier;

        destination.set(key, total);
    }
}

function getDirectionCounts(): Map<string, Moves> {
    let directionCounts = new Map<string, Moves>();

    let directionCodes = '^v<>A';
    for (let from of directionCodes) {
        for (let to of directionCodes) {
            let moves = getMoves(directions, from, to);

            let combined = `${from}${to}`;
            directionCounts.set(combined, moves);
        }
    }

    return directionCounts;
}

function calculateComplexitySum(codes: string[], numRobots: number) {
    let directionCounts = getDirectionCounts();

    let sum = 0;
    for (let code of codes) {
        let commandCount = new Map<string, number>();

        let prev = 'A';
        for (let next of code) {
            let newCommands = getMoves(numpad, prev, next);
            combine(commandCount, newCommands);

            prev = next;
        }

        for (let robot = 0; robot < numRobots; robot++) {
            let newCommandCount = new Map<string, number>();

            for (let [command, value] of commandCount) {
                let subPaths = directionCounts.get(command)!;
                combine(newCommandCount, subPaths, value);
            }

            commandCount = newCommandCount;
        }

        let commandLength = 0;
        for (let moveCount of commandCount.values()) {
            commandLength += moveCount;
        }
        let numericPart = Number(code.substring(0, code.length - 1));

        sum += commandLength * numericPart;
    }

    return sum;
}

let day21Example = ["029A", "980A", "179A", "456A", "379A"];
let day21Input = ["826A", "341A", "582A", "983A", "670A"];

describe('2024_day_21', () => {
    it('example1', async () => {
        const result = calculateComplexitySum(day21Example, 2);
        expect(result).toBe(126384);
    });
    it('solution1', async () => {
        const result = calculateComplexitySum(day21Input, 2);
        expect(result).toBe(237342);
    });
    it('solution2', async () => {
        const result = calculateComplexitySum(day21Input, 25);
        expect(result).toBe(294585598101704);
    });
});