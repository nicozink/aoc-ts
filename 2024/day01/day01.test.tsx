import * as fs from 'fs';

function readLines(path: string) {
    let input = fs.readFileSync(path, 'utf-8');
    return input.split(/\r?\n/);
}

function readInput(path: string): [number[], number[]] {
    let list1: number[] = [];
    let list2: number[] = [];

    const input = readLines(path);
    for (var line of input) {
        let [first, second] = line.split("   ");
        list1.push(Number(first));
        list2.push(Number(second));
    }

    return [list1, list2];
}

function calculateTotalDistance(path: string): number {
    let [list1, list2] = readInput(path);
    list1 = list1.sort();
    list2 = list2.sort();

    let sum = 0;
    for (let x = 0; x < list1.length; x++) {
        sum += Math.abs(list2[x] - list1[x]);
    }

    return sum;
}

function calculateSimilarityScore(path: string): number {
    let [list1, list2] = readInput(path);
    
    let score = 0;
    for (let x = 0; x < list1.length; x++) {
        let count = 0;
        for (let y = 0; y < list2.length; y++) {
            if (list1[x] == list2[y]) {
                count++;
            }
        }

        score += list1[x] * count;
    }

    return score;
}

describe('2024_day_01', () => {
    it('example1', async () => {
        const totalDistance = calculateTotalDistance("2024/day01/example.txt");
        expect(totalDistance).toBe(11);
    });
    it('solution1', async () => {
        const totalDistance = calculateTotalDistance("2024/day01/input.txt");
        expect(totalDistance).toBe(1319616);
    });
    it('example2', async () => {
        const similarityScore = calculateSimilarityScore("2024/day01/example.txt");
        expect(similarityScore).toBe(31);
    });
    it('solution2', async () => {
        const similarityScore = calculateSimilarityScore("2024/day01/input.txt");
        expect(similarityScore).toBe(27267728);
    });
});