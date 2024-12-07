import * as fs from 'fs';

function readLines(path: string) {
    let input = fs.readFileSync(path, 'utf-8');
    return input.split(/\r?\n/);
}

function isReportSafe(levels: number[]): boolean {
    const decreasing = levels[0] > levels[1];
    for (var x = 1; x < levels.length; x++) {
        var prev = levels[x - 1];
        var next = levels[x];
        var diff = Math.abs(next - prev);
        if (diff < 1 || diff > 3)
        {
            return false;
        }
        if (decreasing && prev < next) {
            return false;
        }
        if (!decreasing && prev > next) {
            return false;
        }
    }

    return true;
}

function isReportSafeWithDampener(levels: number[]): boolean {
    if (isReportSafe(levels)) {
        return true;
    }
    for (var x = 0; x < levels.length; x++) {
        var copy = levels.slice();
        copy.splice(x, 1);
        if (isReportSafe(copy)) {
            return true;
        }
    }
    return false;
}

function countSafeReports(path: string, useDampener: boolean): Number {
    var safeReports = 0;
    const lines = readLines(path);
    for (var line of lines) {
        let numbers = line.split(" ").map(Number);
        if (isReportSafe(numbers) || (useDampener && isReportSafeWithDampener(numbers))) {
            safeReports++;
        }
    }
    return safeReports;
}

describe('2024_day_01', () => {
    it('example1', async () => {
        expect(isReportSafe([7, 6, 4, 2, 1])).toBe(true);
        expect(isReportSafe([1, 2, 7, 8, 9])).toBe(false);
        expect(isReportSafe([9, 7, 6, 2, 1])).toBe(false);
        expect(isReportSafe([1, 3, 2, 4, 5])).toBe(false);
        expect(isReportSafe([8, 6, 4, 4, 1])).toBe(false);
        expect(isReportSafe([1, 3, 6, 7, 9])).toBe(true);
        const safeReports = countSafeReports("2024/day02/example.txt", false);
        expect(safeReports).toBe(2);
    });
    it('solution1', async () => {
        const safeReports = countSafeReports("2024/day02/input.txt", false);
        expect(safeReports).toBe(359);
    });
    it('example2', async () => {
        expect(isReportSafeWithDampener([7, 6, 4, 2, 1])).toBe(true);
        expect(isReportSafeWithDampener([1, 2, 7, 8, 9])).toBe(false);
        expect(isReportSafeWithDampener([9, 7, 6, 2, 1])).toBe(false);
        expect(isReportSafeWithDampener([1, 3, 2, 4, 5])).toBe(true);
        expect(isReportSafeWithDampener([8, 6, 4, 4, 1])).toBe(true);
        expect(isReportSafeWithDampener([1, 3, 6, 7, 9])).toBe(true);
        const safeReports = countSafeReports("2024/day02/example.txt", true);
        expect(safeReports).toBe(4);
    });
    it('solution2', async () => {
        const safeReports = countSafeReports("2024/day02/input.txt", true);
        expect(safeReports).toBe(418);
    });
});