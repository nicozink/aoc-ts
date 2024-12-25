import * as fs from 'fs';

type Operation = {
    lhs: string;
    operator: string;
    rhs: string;
    result: string;
}

type Input = {
    values: Map<string, number>;
    operations: Operation[];
}

function readInput(filePath: string): Input {
    let file = fs.readFileSync(filePath, 'utf-8');
    let lines = file.split(/\r?\n/);

    let values = new Map<string, number>();

    let index = 0;
    while (lines[index] != '') {
        let line = lines[index];
        let split = line.split(': ');
        values.set(split[0], Number(split[1]));
        index++;
    }
    index++;

    let operations: Operation[] = [];
    while (index < lines.length) {
        let line = lines[index];
        let split1 = line.split(' -> ');
        let split2 = split1[0].split(' ');

        let lhs = split2[0];
        let operator = split2[1];
        let rhs = split2[2];
        let result = split1[1];

        operations.push({lhs, operator, rhs, result})
        index++;
    }
 
    return {values, operations};
}

function getNumber(values: Map<string, number>, char: string) {
    let number = 0;
    let numIndex = 0;
    while (true) {
        let numString = numIndex.toString();
        if (numString.length == 1) {
            numString = '0' + numString;
        }
        numString = char + numString;

        if (values.has(numString)) {
            let value = values.get(numString)!;
            number += Math.pow(2, numIndex) * value;
        }
        else {
            break;
        }

        numIndex++;
    }

    return number;
}

function solve(values: Map<string, number>, operations: Operation[]) {
    let hasUpdates = true;
    while (hasUpdates) {
        hasUpdates = false;

        for (let operation of operations) {
            if (values.has(operation.result)) {
                continue;
            }

            if (!values.has(operation.lhs) || !values.has(operation.rhs)) {
                continue;
            }

            let lhs = values.get(operation.lhs)!;
            let rhs = values.get(operation.rhs)!;
            if (operation.operator == 'AND') {
                let result = lhs && rhs;
                values.set(operation.result, result);
            } else if (operation.operator == 'OR') {
                let result = lhs || rhs;
                values.set(operation.result, result);
            } else if (operation.operator == 'XOR') {
                let result = lhs ^ rhs;
                values.set(operation.result, result);
            }

            hasUpdates = true;
        }
    }
}

function calculateDecimalNumber(inputPath: string) {
    let {values, operations} = readInput(inputPath);
    solve(values, operations);
    
    return getNumber(values, 'z');
}

function findSwappedWires(inputPath: string, numBytes: number, numSwaps: number): string {
    let {values, operations} = readInput(inputPath);

    let result: Operation[] = [];
    for (let operation of operations) {
        if (operation.result[0] == 'z') {
            if (operation.result != 'z45' && operation.operator != 'XOR') {
                result.push(operation);
            }
        } else if (operation.lhs[0] != 'x' && operation.rhs[0] != 'x' && 
            operation.lhs[0] != 'y' && operation.rhs[0] != 'y' &&
            operation.operator == 'XOR')
        {
            result.push(operation);
        } else if (operation.lhs != 'x00' && operation.lhs != 'y00' &&
            operation.rhs != 'x00' && operation.rhs != 'y00' &&
            (operation.lhs[0] == 'x' || operation.rhs[0] == 'x') && 
            (operation.lhs[0] == 'y' || operation.rhs[0] == 'y'))
        {
            let nextOperator = operation.operator == 'XOR' ? 'XOR' : 'OR';
            let nextOperation = operations.find(x => x.operator == nextOperator &&
                (x.lhs == operation.result || x.rhs == operation.result));
            if (!nextOperation) {
                result.push(operation);
            }
        }
    }

    return result.map(x => x.result)
        .sort()
        .join(',');
}

describe('2024_day_24', () => {
    it('example1', async () => {
        const result = calculateDecimalNumber("2024/day24/example1.txt");
        expect(result).toBe(4);
    });
    it('example2', async () => {
        const result = calculateDecimalNumber("2024/day24/example2.txt");
        expect(result).toBe(2024);
    });
    it('solution1', async () => {
        const result = calculateDecimalNumber("2024/day24/input.txt");
        expect(result).toBe(53190357879014);
    });
    it('solution2', async () => {
        const result = findSwappedWires("2024/day24/input.txt", 45, 4);
        expect(result).toBe('bks,hnd,nrn,tdv,tjp,z09,z16,z23');
    });
});