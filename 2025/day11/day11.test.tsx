import * as fs from 'fs';

function readInput(path: string): Map<string, string[]> {
    let input = fs.readFileSync(path, 'utf-8');
    let lines = input.split(/\r?\n/);
    
    const connections = new Map();
    for (let line of lines) {
        let firstSplit = line.split(": ");
        let secondSplit = firstSplit[1].split(" ");
        connections.set(firstSplit[0], secondSplit);
    }
    return connections;
}

function countPathsRecursive(connections: Map<string, string[]>, lookup: Map<string, number>, start: string, end: string) {
    if (start === end) {
        return 1;
    }
    if (lookup.has(start)) {
        return lookup.get(start)!;
    }
    let count = 0;
    const nextConnections = connections.get(start);
    if (!nextConnections) {
        return 0;
    }
    for (let connection of nextConnections) {
        count += countPathsRecursive(connections, lookup, connection, end);
    }
    lookup.set(start, count);
    return count;
}

function countPossiblePaths1(path: string) {
    const connections = readInput(path);
    return countPathsRecursive(connections, new Map<string, number>(), "you", "out");
}

function countPossiblePaths2(path: string) {
    const connections = readInput(path);
    let part1 = countPathsRecursive(connections, new Map<string, number>(), "svr", "fft");
    let part2 = countPathsRecursive(connections, new Map<string, number>(), "fft", "dac");
    let part3 = countPathsRecursive(connections, new Map<string, number>(), "dac", "out");
    return part1 * part2 * part3;
}

describe('2025_day_11', () => {
    it('example1', async () => {
        const count = countPossiblePaths1("2025/day11/example1.txt");
        expect(count).toBe(5);
    });
    it('solution1', async () => {
        const count = countPossiblePaths1("2025/day11/input.txt");
        expect(count).toBe(791);
    });
    it('example2', async () => {
        const count = countPossiblePaths2("2025/day11/example2.txt");
        expect(count).toBe(2);
    });
    it('solution2', async () => {
        const count = countPossiblePaths2("2025/day11/input.txt");
        expect(count).toBe(520476725037672);
    });
});