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

function hasSolution(equation: Equation, concatenation: boolean): boolean {
    equation = structuredClone(equation);
    let operations = equation.operations;
    if (operations.length == 1) {
        return equation.result == operations[0];
    }

    if (operations[0] > equation.result) {
        return false;
    }

    let firstNumber = operations.shift();
    let secondNumber = operations[0];

    if (!firstNumber) {
        throw new Error("Expected a value.");
    }

    operations[0] = firstNumber + secondNumber;
    if (hasSolution(equation, concatenation)) {
        return true;
    }

    operations[0] = firstNumber * secondNumber;
    if (hasSolution(equation, concatenation)) {
        return true;
    }

    if (concatenation) {
        let concatenated = `${firstNumber}${secondNumber}`;
        operations[0] = parseInt(concatenated);
        if (hasSolution(equation, concatenation)) {
            return true;
        }
    }

    return false;
}

function getCalibrationResult(path: string, concatenation: boolean): number {
    let equations = readEquations(path);

    let result = 0;
    for (var equation of equations) {
        if (hasSolution(equation, concatenation)) {
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