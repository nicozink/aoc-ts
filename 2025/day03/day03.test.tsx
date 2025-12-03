import * as fs from 'fs';

function readLines(path: string) {
    let input = fs.readFileSync(path, 'utf-8');
    return input.split(/\r?\n/);
}

function getMaxIndex(battery: string, start: number, end: number) {
    let maxValue = -1;
    let maxPosition = -1;
    for (let i = start; i <= end; ++i) {
        let digit = Number(battery[i]);
        if (digit > maxValue) {
            maxValue = digit;
            maxPosition = i;
        }
    }
    return maxPosition;
}

function getTotalJolts(path: string, numBatteries: number) {
    let sum = 0;
    let banks = readLines(path);
    for (const bank of banks) {
        let batteriesLeft = numBatteries;
        let lastBatteryIndex = -1;
        let joltage = "";
        while (batteriesLeft > 0) {
            lastBatteryIndex = getMaxIndex(bank, lastBatteryIndex + 1, bank.length - batteriesLeft);
            joltage += bank[lastBatteryIndex];
            --batteriesLeft;
        }
        sum += Number(joltage);
    }
    return sum;
}

describe('2025_day_03', () => {
    it('example1', async () => {
        const sum = getTotalJolts("2025/day03/example.txt", 2);
        expect(sum).toBe(357);
    });
    it('solution1', async () => {
        const sum = getTotalJolts("2025/day03/input.txt", 2);
        expect(sum).toBe(17430);
    });
    it('example2', async () => {
        const sum = getTotalJolts("2025/day03/example.txt", 12);
        expect(sum).toBe(3121910778619);
    });
    it('solution2', async () => {
        const sum = getTotalJolts("2025/day03/input.txt", 12);
        expect(sum).toBe(171975854269367);
    });
});