import * as fs from 'fs';

function readLines(path: string): string[] {
    let input = fs.readFileSync(path, 'utf-8');
    return input.split(/\r?\n/);
}

function getPart1Patterns(): string[][] {
    let patterns: string[][] = [];
    patterns.push(["XMAS"]);
    patterns.push(["SAMX"]);
    patterns.push(["X", "M", "A", "S"]);
    patterns.push(["S", "A", "M", "X"]);
    patterns.push([
        "X...",
        ".M..",
        "..A.",
        "...S"
    ]);
    patterns.push([
        "S...",
        ".A..",
        "..M.",
        "...X"
    ]);
    patterns.push([
        "...X",
        "..M.",
        ".A..",
        "S..."
    ]);
    patterns.push([
        "...S",
        "..A.",
        ".M..",
        "X..."
    ]);
    return patterns;
}

function getPart2Patterns(): string[][] {
    let patterns: string[][] = [];
    patterns.push([
        "M.S",
        ".A.",
        "M.S"
    ]);
    patterns.push([
        "S.S",
        ".A.",
        "M.M"
    ]);
    patterns.push([
        "M.M",
        ".A.",
        "S.S"
    ]);
    patterns.push([
        "S.M",
        ".A.",
        "S.M"
    ]);
    return patterns;
}

function doesPatternExist(lines: string[], r: number, c: number, pattern: string[]): boolean {
    for (let pR = 0; pR < pattern.length; pR++) {
        for (let pC = 0; pC < pattern[pR].length; pC++) {
            if (pattern[pR][pC] != '.' && pattern[pR][pC] != lines[r + pR][c + pC]) {
                return false;
            }
        }
    }

    return true;
}

function countPatterns(path: string, patterns: string[][]): Number {
    let lines = readLines(path);

    let count = 0;
    for (let pattern of patterns) {
        for (let r = 0; r < lines.length - pattern.length + 1; r++) {
            for (let c = 0; c < lines[r].length - pattern[0].length + 1; c++) {
                if (doesPatternExist(lines, r, c, pattern)) {
                    count++;
                }
            }
        }
    }
    return count;
}

describe('2024_day_04', () => {
    it('example1', async () => {
        const count = countPatterns("2024/day04/example.txt", getPart1Patterns());
        expect(count).toBe(18);
    });
    it('solution1', async () => {
        const mul = countPatterns("2024/day04/input.txt", getPart1Patterns());
        expect(mul).toBe(2573);
    });
    it('example2', async () => {
        const count = countPatterns("2024/day04/example.txt", getPart2Patterns());
        expect(count).toBe(9);
    });
    it('solution2', async () => {
        const mul = countPatterns("2024/day04/input.txt", getPart2Patterns());
        expect(mul).toBe(1850);
    });
});