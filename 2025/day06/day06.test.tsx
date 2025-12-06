import * as fs from 'fs';

type Operation = {symbol: string, numbers: number[]};

function readInputByRow(path: string) {
    let inputString = fs.readFileSync(path, 'utf-8');
    while (inputString.includes('  ')) {
        inputString = inputString.replace('  ', ' ');
    }

    const lines = inputString.split(/\r?\n/);
    let grid = [];
    for (let line of lines) {
        const trimLine = line.trim();
        grid.push(trimLine.split(' '));
    }

    let result: Operation[] = [];
    for (let i = 0; i < grid[0].length; ++i) {
        const symbol = grid[grid.length - 1][i];
        const numbers = [];
        for (let j = 0; j < grid.length - 1; ++j)
            numbers.push(Number(grid[j][i]));
        result.push({symbol, numbers});
    }    
    return result;
}

function readInputByColumn(path: string) {
    let inputString = fs.readFileSync(path, 'utf-8');
    const lines = inputString.split(/\r?\n/);

    let result: Operation[] = [];
    let symbol = '';
    let numbers = [];
    for (let i = 0; i < lines[0].length; ++i) {
        const newSymbol = lines[lines.length - 1][i];
        if (newSymbol !== ' ') {
            symbol = newSymbol;
            numbers = [];
        }
        let number = '';
        for (let j = 0; j < lines.length - 1; ++j) {
            let char = lines[j][i];
            if (char !== ' ')
                number += char;
        }

        if (number !== '') {
            numbers.push(Number(number));
        } else {
            result.push({symbol, numbers});
        }
    }
    result.push({symbol, numbers});
    return result;
}

function getGrandTotal(path: string, readRows: boolean) {
    let input = readRows ? readInputByRow(path) : readInputByColumn(path);
    let grandTotal = 0;
    for (let operation of input) {
        if (operation.symbol === '+') {
            let sum = 0;
            for (let number of operation.numbers)
                sum += number;
            grandTotal += sum;
        } else  {
            let product = 1;
            for (let number of operation.numbers)
                product *= number;
            grandTotal += product;
        }
    }
    return grandTotal;
}

describe('2025_day_06', () => {
    it('example1', async () => {
        const count = getGrandTotal("2025/day06/example.txt", true);
        expect(count).toBe(4277556);
    });
    it('solution1', async () => {
        const count = getGrandTotal("2025/day06/input.txt", true);
        expect(count).toBe(5171061464548);
    });
    it('example2', async () => {
        const count = getGrandTotal("2025/day06/example.txt", false);
        expect(count).toBe(3263827);
    });
    it('solution2', async () => {
        const count = getGrandTotal("2025/day06/input.txt", false);
        expect(count).toBe(10189959087258);
    });
});