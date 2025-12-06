import * as fs from 'fs';

type Range = {from: number, to: number};
function readInput(path: string) {
    const inputString = fs.readFileSync(path, 'utf-8');
    const input = inputString.split(/\r?\n/);

    let index = 0;
    let ranges: Range[] = [];
    while (input[index] !== '') {
        const row = input[index];
        let rangeString = row.split('-');
        ranges.push({from: Number(rangeString[0]), to: Number(rangeString[1])});
        ++index;
    }

    ++index;
    let ingredients = [];
    while (index < input.length) {
        const row = input[index];
        ingredients.push(Number(row));
        ++index;
    }

    return {ranges, ingredients};
}

function getFreshIngredients(path: string) {
    let input = readInput(path);
    let fresh = 0;
    for (let ingredient of input.ingredients) {
        let spoiled = true;
        for (let range of input.ranges) {
            if (ingredient < range.from)
                continue;
            if (ingredient > range.to)
                continue;
            spoiled = false;
        }
        if (!spoiled)
            ++fresh;
    }
    return fresh;
}

function rangesOverlap(range1: Range, range2: Range) {
    return range1.from <= range2.to && range2.from <= range1.to;
}

function getAllFreshIngredients(path: string) {
    let input = readInput(path);
    let ranges = input.ranges;
    for (let i = 0; i < ranges.length - 1; i++) {
        for (let j = i + 1; j < ranges.length; j++) {
            let range1 = ranges[i];
            let range2 = ranges[j];

            const overlap = rangesOverlap(range1, range2);
            if (!overlap) continue;
            
            range1.from = Math.min(range1.from, range2.from);
            range1.to = Math.max(range1.to, range2.to);

            ranges.splice(j, 1);
            j = i = 0;
        }
    }
    let fresh = 0;
    for (const range of ranges)
        fresh += range.to - range.from + 1;
    return fresh;
}

describe('2025_day_05', () => {
    it('example1', async () => {
        const count = getFreshIngredients("2025/day05/example.txt");
        expect(count).toBe(3);
    });
    it('solution1', async () => {
        const count = getFreshIngredients("2025/day05/input.txt");
        expect(count).toBe(577);
    });
    it('example2', async () => {
        const count = getAllFreshIngredients("2025/day05/example.txt");
        expect(count).toBe(14);
    });
    it('solution2', async () => {
        const count = getAllFreshIngredients("2025/day05/input.txt");
        expect(count).toBe(350513176552950);
    });
});