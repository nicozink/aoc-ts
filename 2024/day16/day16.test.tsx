import * as fs from 'fs';

type Grid = string[][];

type Position = {
    row: number;
    col: number;
};

type State = {
    position: Position;
    direction: string;
    score: number;
};

type Visited = {
    score: number;
    previous: State[];
}
type Lookup = Map<string, Visited>[][];

function readInput(path: string): Grid {
    let input = fs.readFileSync(path, 'utf-8');
    return input.split(/\r?\n/).map(x => x.split(''));
}

function getMoves(direction: string): string[] {
    let moves = [direction];
    if (direction == '^' || direction == 'v') {
        moves.push('<');
        moves.push('>');
    } else if (direction == '<' || direction == '>') {
        moves.push('^');
        moves.push('v');
    }
    return moves;
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

function solve(path: string): {bestScore: number, visited: Lookup} {
    let grid = readInput(path);

    let start: Position = {row: grid.length - 2, col: 1};
    let end: Position = {row: 1, col: grid[0].length - 2};
    
    let bestScore = Number.MAX_VALUE;
    let visited: Lookup = grid.map((r, row) => r.map((c, col) => new Map<string, Visited>()));

    let startState: State = {position: start, direction: '>', score: 0};
    type Frontier = { state: State, previous: State | null };
    let frontier: Frontier[] = [{state: startState, previous: null}];
    while (frontier.length != 0) {
        let {state, previous} = frontier.pop()!;
        let {position, direction, score} = state;

        if (score > bestScore) {
            continue;
        }

        let visitedNode = visited[position.row][position.col].get(direction);
        if (visitedNode == null || score < visitedNode.score) {
            visitedNode = {score, previous: previous != null ? [previous] : []};
            visited[position.row][position.col].set(direction, visitedNode);
        } else if (score == visitedNode.score) {
            if (previous != null) {
                visitedNode.previous.push(previous);
            }
            continue;
        } else {
            continue;
        }

        if (position.row == end.row && position.col == end.col) {
            if (score < bestScore) {
                bestScore = score;
            }

            continue;
        }

        for (let move of getMoves(direction)) {
            let nextPosition = getPosition(position, move);
            if (grid[nextPosition.row][nextPosition.col] == '#') {
                continue;
            }

            if (move == direction) {
                let nextState: State = {position: nextPosition, direction: move, score: score + 1};
                frontier.push({state: nextState, previous: state});
            } else {
                let nextState: State = {position: position, direction: move, score: score + 1000};
                frontier.push({state: nextState, previous: state});
            }
        }
    }

    return {bestScore, visited};
}

function calculateBestPath(path: string): number {
    let result = solve(path);
    return result.bestScore;
}

function countBestSeats(path: string): number {
    let {bestScore, visited} = solve(path);

    let end: Position = {row: 1, col: visited[0].length - 2};
    let frontier: State[] = [];
    for (let node of visited[end.row][end.col].values()) {
        if (node.score == bestScore) {
            frontier.push(...node.previous);
        }
    }

    let seats = visited.map(x => x.map(y => 0));
    let found = visited.map(x => x.map(y => new Map<string, boolean>()));
    while (frontier.length > 0) {
        let {position, direction} = frontier.pop()!;
        if (found[position.row][position.col].has(direction)) {
            continue;
        }
        found[position.row][position.col].set(direction, true);
        seats[position.row][position.col]++;
        
        let nextNode = visited[position.row][position.col].get(direction)!;
        for (let previousNode of nextNode.previous) {
            if (nextNode.score > previousNode.score) {
                frontier.push(previousNode);
            }
        }
    }

    let bestSeats = 0;
    for (let row = 0; row < seats.length; row++) {
        for (let col = 0; col < seats[0].length; col++) {
            if (seats[row][col] > 0) {
                bestSeats++;
            }
        }
    }

    return bestSeats + 1;
}

describe('2024_day_16', () => {
    it('example1', async () => {
        const result = calculateBestPath("2024/day16/example1.txt");
        expect(result).toBe(7036);
    });
    it('example2', async () => {
        const result = calculateBestPath("2024/day16/example2.txt");
        expect(result).toBe(11048);
    });
    it('solution1', async () => {
        const result = calculateBestPath("2024/day16/input.txt");
        expect(result).toBe(107512);
    });
    it('example3', async () => {
        const result = countBestSeats("2024/day16/example1.txt");
        expect(result).toBe(45);
    });
    it('example4', async () => {
        const result = countBestSeats("2024/day16/example2.txt");
        expect(result).toBe(64);
    });
    it('solution5', async () => {
        const result = countBestSeats("2024/day16/input.txt");
        expect(result).toBe(561);
    });
});