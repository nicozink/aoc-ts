import * as fs from 'fs';

type Input = {
    keys: number[][];
    locks: number[][];
    size: number;
};

function readInput(filePath: string): Input {
    let file = fs.readFileSync(filePath, 'utf-8');
    let groups = file.split('\r\n\r\n')
        .map(x => x.split('\r\n'));

    let keys: number[][] = [];
    let locks: number[][] = [];
    let size = groups[0].length;
    for (let group of groups) {
        let values: number[] = [];
        for (let col = 0; col < group[0].length; col++) {
            let count = 0;
            for (let row = 0; row < group.length; row++) {
                if (group[row][col] == '#') {
                    count++;
                }
            }
            values.push(count);
        }

        if (group[0][0] == '#') {
            keys.push(values);
        } else {
            locks.push(values);
        }
    }

    return {keys, locks, size};
}

function countPairs(filePath: string): number {
    let input = readInput(filePath);

    let count = 0;
    for (let key of input.keys) {
        for (let lock of input.locks) {
            let match = true;
            for (let x = 0; x < key.length; x++) {
                if (key[x] + lock[x] > input.size) {
                    match = false;
                }
            }

            if (match) {
                count++;
            }
        }
    }

    return count;
}

describe('2024_day_25', () => {
    it('example', async () => {
        const result = countPairs("2024/day25/example.txt");
        expect(result).toBe(3);
    });
    it('solution', async () => {
        const result = countPairs("2024/day25/input.txt");
        expect(result).toBe(3525);
    });
});