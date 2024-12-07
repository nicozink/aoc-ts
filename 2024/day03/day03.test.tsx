import * as fs from 'fs';

function calculateMultiplications(path: string, handleConditionals: boolean): Number {
    let multiplications = 0;
    let conditionalEnabled = true;

    let input = fs.readFileSync(path, 'utf-8');

    const regex: RegExp = /do\(\)|don't\(\)|mul\((\d+),(\d+)\)/g;
    let result;
    while (result = regex.exec(input)) {
        const command = result[0];
        if (command == "do()") {
            conditionalEnabled = true;
        } else if (command == "don't()") {
            conditionalEnabled = false;
        } else {
            let num1 = Number(result[1]);
            let num2 = Number(result[2]);

            if (!handleConditionals || conditionalEnabled) {
                multiplications += num1 * num2;
            }
        }
    }

    return multiplications;
}

describe('2024_day_03', () => {
    it('example1', async () => {
        const mul = calculateMultiplications("2024/day03/example1.txt", false);
        expect(mul).toBe(161);
    });
    it('solution1', async () => {
        const mul = calculateMultiplications("2024/day03/input.txt", false);
        expect(mul).toBe(161289189);
    });
    it('example2', async () => {
        const mul = calculateMultiplications("2024/day03/example2.txt", true);
        expect(mul).toBe(48);
    });
    it('solution2', async () => {
        const mul = calculateMultiplications("2024/day03/input.txt", true);
        expect(mul).toBe(83595109);
    });
});