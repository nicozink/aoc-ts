import * as fs from 'fs';

function countCombinations(design: string, towels: string[], index: number, lookup: Map<number, number>): number {
    if (index == design.length) {
        return 1;
    }
    
    if (lookup.has(index)) {
        return lookup.get(index)!;
    }

    let combinations = 0;
    for (let towel of towels) {
        if (index + towel.length - 1 >= design.length) {
            continue;
        }

        let matches = true;
        for (let i = 0; i < towel.length; i++) {
            if (design[index + i] != towel[i]) {
                matches = false;
                break;
            }
        }

        if (matches) {
            combinations += countCombinations(design, towels, index + towel.length, lookup);
        }
    }

    lookup.set(index, combinations);
    return combinations;
}

function countValidDesigns(path: string): number {
    let file = fs.readFileSync(path, 'utf-8');
    let lines = file.split(/\r?\n/);

    let towels = lines[0].split(', ');

    let validDesigns = 0;
    for (let i = 2; i < lines.length; i++) {
        let lookup = new Map<number, number>();
        if (countCombinations(lines[i], towels, 0, lookup) > 0) {
            validDesigns++;
        }
    }

    return validDesigns;
}

function countAllCombinations(path: string): number {
    let file = fs.readFileSync(path, 'utf-8');
    let lines = file.split(/\r?\n/);

    let towels = lines[0].split(', ');

    let allDesigns = 0;
    for (let i = 2; i < lines.length; i++) {
        let lookup = new Map<number, number>();
        allDesigns += countCombinations(lines[i], towels, 0, lookup);
    }

    return allDesigns;
}

describe('2024_day_19', () => {
    it('example1', async () => {
        const result = countValidDesigns("2024/day19/example.txt");
        expect(result).toBe(6);
    });
    it('solution1', async () => {
        const result = countValidDesigns("2024/day19/input.txt");
        expect(result).toBe(206);
    });
    it('example2', async () => {
        const result = countAllCombinations("2024/day19/example.txt");
        expect(result).toBe(16);
    });
    it('solution2', async () => {
        const result = countAllCombinations("2024/day19/input.txt");
        expect(result).toBe(622121814629343);
    });
});