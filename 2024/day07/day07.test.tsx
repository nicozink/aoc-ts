import * as fs from 'fs';

class Equation {
    result: number;
    operations: number[];

    constructor(result: number, operations: number[]) {
        this.result = result;
        this.operations = operations;
    }
}

function readEquations(path: string): Equation[] {
    let input = fs.readFileSync(path, 'utf-8');
    let lines = input.split(/\r?\n/);

    let equations: Equation[] = [];
    for (var line of lines) {
        let split = line.split(": ");

        let result = Number(split[0]);
        let operations = split[1].split(" ")
            .map(x => Number(x));
        
        let equation = new Equation(result, operations);
        equations.push(equation);
    }

    return equations;
}

function hasSolution(equation: Equation, startIndex: number, startTotal: number, concatenation: boolean): boolean {
    let operations = equation.operations;

    let stack = [[startIndex, startTotal]];
    while (stack.length > 0) {
        let next = stack.pop()!;
        let index = next[0];
        let total = next[1];

        if (index == operations.length) {
            if (equation.result == total) {
                return true;
            } else {
                continue;
            }
        }
    
        if (total > equation.result) {
            continue;
        }
    
        let firstNumber = total;
        let secondNumber = operations[index];
    
        index++;
        total = firstNumber + secondNumber;
        stack.push([index, total]);
    
        total = firstNumber * secondNumber;
        stack.push([index, total]);
    
        if (concatenation) {
            let length = Math.floor(Math.log10(secondNumber)) + 1;
            total = firstNumber * Math.pow(10, length) + secondNumber;
            stack.push([index, total]);
        }
    }

    return false;
}

function getCalibrationResult(path: string, concatenation: boolean): number {
    let equations = readEquations(path);

    let result = 0;
    for (var equation of equations) {
        if (hasSolution(equation, 1, equation.operations[0], concatenation)) {
            result += equation.result;
        }
    }

    return result;
}

describe('2024_day_07', () => {
    it('example1', async () => {
        const result = getCalibrationResult("2024/day07/example.txt", false);
        expect(result).toBe(3749);
    });
    it('solution1', async () => {
        const result = getCalibrationResult("2024/day07/input.txt", false);
        expect(result).toBe(3119088655389);
    });
    it('example2', async () => {
        const result = getCalibrationResult("2024/day07/example.txt", true);
        expect(result).toBe(11387);
    });
    it('solution2', async () => {
        const result = getCalibrationResult("2024/day07/input.txt", true);
        expect(result).toBe(264184041398847);
    });
});