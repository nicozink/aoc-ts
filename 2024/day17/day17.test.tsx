import * as fs from 'fs';

type Program = {
    registers: bigint[];
    input: bigint[];
};

function readProgram(path: string): Program {
    let file = fs.readFileSync(path, 'utf-8');
    let lines = file.split(/\r?\n/);

    let registers: bigint[] = [];
    for (let register = 0; register < 3; register++) {
        let registerPrefix = 12; // length of 'Register A: '
        let valueString = lines[register].substring(registerPrefix);
        let value = BigInt(valueString);
        registers.push(value);
    }

    let programPrefix = 9; // length of 'Program: '
    let input = lines[4]
        .substring(programPrefix)
        .split(',')
        .map(x => BigInt(x));

    return {registers, input};
}

function getOperand(value: bigint, registers: bigint[]): bigint {
    if (value <= 3) {
        return value;
    }

    if (value <= 6) {
        return registers[Number(value) - 4];
    }

    throw new Error("Got an incorrect value.");
}

function simulate(program: Program): bigint[] {
    let input = program.input;
    let registers = structuredClone(program.registers);

    let pointer = 0n;

    let output: bigint[] = [];
    while (pointer < input.length) {
        let instruction = input[Number(pointer)];
        let literalOperand = input[Number(pointer + 1n)];
        let comboOperand = getOperand(literalOperand, registers);

        if (instruction == 0n) {
            registers[0] = registers[0] / 2n ** comboOperand;
        } else if (instruction == 1n) {
            registers[1] ^= literalOperand;
        }  else if (instruction == 2n) {
            registers[1] = comboOperand % 8n;
        }  else if (instruction == 3n && registers[0] != 0n) {
            pointer = literalOperand - 2n;
        }  else if (instruction == 4n) {
            registers[1] ^= registers[2];
        }  else if (instruction == 5n) {
            output.push(comboOperand % 8n);
        }  else if (instruction == 6n) {
            registers[1] = registers[0] / 2n ** comboOperand;
        }  else if (instruction == 7n) {
            registers[2] = registers[0] / 2n ** comboOperand;
        }
        pointer += 2n;
    }

    return output
}

function getProgramOutput(path: string): string {
    let program = readProgram(path);
    let output = simulate(program);

    return output.join(',');
}

function searchDigits(program: Program, guess: bigint, index: number): number | undefined {
    let input = program.input;

    for (let x = 0n; x < 8n; x++) {
        let bitShift = (BigInt(index) * 3n);
        let nextGuess = guess + (x << bitShift);

        program.registers[0] = nextGuess;
        program.registers[1] = 0n;
        program.registers[2] = 0n;
        let output = simulate(program);

        let outputOffset = output.length - (input.length - 1 - Number(index)) - 1;
        if (outputOffset < output.length && input[index] == output[outputOffset]) {
            if (index == 0) {
                return Number(nextGuess);
            }

            let result = searchDigits(program, nextGuess, index - 1);
            if (result) {
                return result!;
            }
        }
    }

    return;
}

function findProgramInit(path: string): number {
    let program = readProgram(path);
    return searchDigits(program, 0n, program.input.length - 1)!;
}

describe('2024_day_17', () => {
    it('example1', async () => {
        const result = getProgramOutput("2024/day17/example1.txt");
        expect(result).toBe("4,6,3,5,6,3,5,2,1,0");
    });
    it('solution1', async () => {
        const result = getProgramOutput("2024/day17/input.txt");
        expect(result).toBe("3,5,0,1,5,1,5,1,0");
    });
    it('example3', async () => {
        const result = findProgramInit("2024/day17/example2.txt");
        expect(result).toBe(117440);
    });
    it('solution2', async () => {
        const result = findProgramInit("2024/day17/input.txt");
        expect(result).toBe(107413700225434);
    });
});