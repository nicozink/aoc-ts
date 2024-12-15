import * as fs from 'fs';

type Position = {
    row: number;
    col: number;
};

type Input = {
    grid: string[][];
    position: Position;
    moves: string;
}

function readInput(path: string, extraWide: boolean): Input {
    let input = fs.readFileSync(path, 'utf-8');
    let lines = input.split(/\r?\n/);

    let rowIndex = 0;
    let position: Position = {row: 0, col: 0};
    let grid: string[][] = [];
    while (lines[rowIndex] != '') {
        let row: string[] = [];
        for (let value of lines[rowIndex]) {
            if (value == '@') {
                position.row = rowIndex;
                position.col = row.length;
                row.push('.');
                if (extraWide) {
                    row.push('.');
                }
            } else if (extraWide && value == 'O') {
                row.push('[');
                row.push(']');
            } else {
                row.push(value);
                if (extraWide) {
                    row.push(value);
                }
            }
        }
        grid.push(row);
        rowIndex++;
    }

    rowIndex++;

    let moves = '';
    for (; rowIndex < lines.length; rowIndex++) {
        moves += lines[rowIndex];
    }

    return {grid, position, moves};
}

function getPosition(position: Position, direction: string): Position {
    if (direction == '^') {
        return {row: position.row - 1, col: position.col};
    } else if (direction == 'v') {
        return {row: position.row + 1, col: position.col};
    } else if (direction == '<') {
        return {row: position.row, col: position.col - 1};
    } else if (direction == '>') {
        return {row: position.row, col: position.col + 1};
    }
    throw new Error("Invalid direction");
}

type Move = {
    position: Position;
    value: string;
};

function getNextMove(grid: string[][], position: Position, direction: string): Move {
    let nextPosition = getPosition(position, direction);
    let nextValue = grid[nextPosition.row][nextPosition.col];
    return {
        position: nextPosition,
        value: nextValue
    }
}

function getAdjacent(grid: string[][], position: Position, direction: string): Move[] | undefined {
    let firstMove = getNextMove(grid, position, direction);
    let frontier: Move[] = [firstMove];

    let moves: Move[] = [];
    while (frontier.length != 0) {
        let nextMove = frontier.pop()!;
        let nextPosition = nextMove.position;
        let nextValue = grid[nextPosition.row][nextPosition.col];
        if (nextValue == '.') {
            continue;
        } else if (nextValue == '#') {
            return;
        }

        if ((direction == '>' && nextValue == '[') || (direction == '<' && nextValue == ']')) {
            moves.push(nextMove);
            nextMove = getNextMove(grid, nextMove.position, direction);
            moves.push(nextMove);

            frontier.push(getNextMove(grid, nextMove.position, direction));

            continue;
        }

        moves.push(nextMove);
        frontier.push(getNextMove(grid, nextMove.position, direction));
        
        if (nextValue == '[') {
            let otherPosition: Position = {
                row: nextPosition.row,
                col: nextPosition.col + 1
            };
            moves.push({
                position: otherPosition,
                value: ']'
            });
            frontier.push(getNextMove(grid, otherPosition, direction));
        } else if (nextValue == ']') {
            let otherPosition: Position = {
                row: nextPosition.row,
                col: nextPosition.col - 1
            };
            moves.push({
                position: otherPosition,
                value: '['
            });
            frontier.push(getNextMove(grid, otherPosition, direction));
        }
    }

    return moves;
}

function calculateCoordinates(path: string, extraWide: boolean): number {
    let input = readInput(path, extraWide);

    let grid = input.grid;
    let moves = input.moves;
    for (let direction of moves) {
        let adjacent = getAdjacent(grid, input.position, direction);
        if (!adjacent) {
            continue;
        }

        input.position = getPosition(input.position, direction);
        for (let move of adjacent) {
            grid[move.position.row][move.position.col] = '.';
        }
        for (let move of adjacent) {
            let nextPosition = getPosition(move.position, direction);
            grid[nextPosition.row][nextPosition.col] = move.value;
        }
    }
    
    let sum = 0;
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col] == 'O' || grid[row][col] == '[') {
                sum += row * 100 + col;
            }
        }
    }

    return sum;
}

describe('2024_day_15', () => {
    it('example1', async () => {
        const result = calculateCoordinates("2024/day15/example1.txt", false);
        expect(result).toBe(2028);
    });
    it('example2', async () => {
        const result = calculateCoordinates("2024/day15/example2.txt", false);
        expect(result).toBe(10092);
    });
    it('solution1', async () => {
        const result = calculateCoordinates("2024/day15/input.txt", false);
        expect(result).toBe(1487337);
    });
    it('example3', async () => {
        const result = calculateCoordinates("2024/day15/example2.txt", true);
        expect(result).toBe(9021);
    });
    it('solution2', async () => {
        const result = calculateCoordinates("2024/day15/input.txt", true);
        expect(result).toBe(1521952);
    });
});