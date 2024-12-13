import * as fs from 'fs';

type Location = {
    x: number;
    y: number;
}

function readButton(line: string): Location {
    let padding = 12; // Length of 'Button A: X+'
    line = line.substring(padding);
    let split = line.split(', Y+').map(x => parseInt(x));
    return { x: split[0], y: split[1] };
}

function readPrize(line: string, addUnits: number): Location {
    let padding = 9; // Length of 'Prize: X='
    line = line.substring(padding);
    let split = line.split(', Y=').map(x => parseInt(x) + addUnits);
    return { x: split[0], y: split[1] };
}

function calculateTokens(a: Location, b: Location, p: Location): number {
    let denom = a.x * b.y - b.x * a.y;
    let pa = (p.x * b.y - b.x * p.y) / denom;
    let pb = (p.x - pa * a.x) / b.x;

    if (Number.isInteger(pa) && Number.isInteger(pb)) {
        return pa * 3 + pb * 1;
    }

    return 0;
}

function countTokens(path: string, addUnits: number): number {
    let input = fs.readFileSync(path, 'utf-8');
    let lines = input.split(/\r?\n/);
    
    let tokens = 0;
    for (let x = 0; x < lines.length; x += 4) {
        let buttonA = readButton(lines[x]);
        let buttonB = readButton(lines[x + 1]);
        let prize = readPrize(lines[x + 2], addUnits);

        tokens += calculateTokens(buttonA, buttonB, prize);
    }

    return tokens;
}

describe('2024_day_12', () => {
    it('example1', async () => {
        const result = countTokens("2024/day13/example.txt", 0);
        expect(result).toBe(480);
    });
    it('solution1', async () => {
        const result = countTokens("2024/day13/input.txt", 0);
        expect(result).toBe(33481);
    });
    it('solution2', async () => {
        const result = countTokens("2024/day13/input.txt", 10000000000000);
        expect(result).toBe(92572057880885);
    });
});