import * as fs from 'fs';

class Rule {
    first: number;
    second: number;

    constructor(first: number, second: number) {
        this.first = first;
        this.second = second;
    }
}

class PrintOrder {
    rules: Rule[];
    updates: number[][];

    constructor(rules: Rule[], updates: number[][]) {
        this.rules = rules;
        this.updates = updates;
    }
}

function readInput(path: string): PrintOrder {
    let input = fs.readFileSync(path, 'utf-8');
    let lines = input.split(/\r?\n/);

    let rules: Rule[] = [];
    let updates: number[][] = [];

    let currentRow = 0;
    while (lines[currentRow] != "") {
        var rule = lines[currentRow].split("|")
            .map(x => Number(x));
        rules.push(new Rule(rule[0], rule[1]));
        currentRow++;
    }

    currentRow++;

    while (currentRow < lines.length) {
        let line = lines[currentRow];
        let pages = line.split(",")
            .map(x => Number(x));
        updates.push(pages)
        currentRow++;
    }

    return new PrintOrder(rules, updates);
}

function countCorrectUpdates(path: string): number {
    let printOrder = readInput(path);

    let count = 0;
    for (let update of printOrder.updates) {
        let valid = true;
        for (let rule of printOrder.rules) {
            let index1 = update.findIndex(x => x == rule.first);
            let index2 = update.findIndex(x => x == rule.second);

            if (index1 == -1 || index2 == -1) {
                continue;
            }

            if (index1 > index2) {
                valid = false;
            }
        }

        if (valid) {
            var midPoint = Math.floor(update.length / 2);
            count += update[midPoint];
        }
    }

    return count;
}

function countFixedUpdates(path: string): number {
    let printOrder = readInput(path);

    let count = 0;
    for (let update of printOrder.updates) {
        let fixed = false;
        for (let x = 0; x < printOrder.rules.length; x++) {
            let rule = printOrder.rules[x];
            let index1 = update.findIndex(x => x == rule.first);
            let index2 = update.findIndex(x => x == rule.second);

            if (index1 == -1 || index2 == -1) {
                continue;
            }

            if (index1 > index2) {
                let temp = update[index1];
                update[index1] = update[index2];
                update[index2] = temp;

                fixed = true;
                x = -1;
            }
        }

        if (fixed) {
            var midPoint = Math.floor(update.length / 2);
            count += update[midPoint];
        }
    }

    return count;
}

describe('2024_day_05', () => {
    it('example1', async () => {
        const count = countCorrectUpdates("2024/day05/example.txt");
        expect(count).toBe(143);
    });
    it('solution1', async () => {
        const count = countCorrectUpdates("2024/day05/input.txt");
        expect(count).toBe(6034);
    });
    it('example2', async () => {
        const count = countFixedUpdates("2024/day05/example.txt");
        expect(count).toBe(123);
    });
    it('solution2', async () => {
        const count = countFixedUpdates("2024/day05/input.txt");
        expect(count).toBe(6305);
    });
});