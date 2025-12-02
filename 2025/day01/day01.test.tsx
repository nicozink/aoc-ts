import * as fs from 'fs';

function readLines(path: string) {
    let input = fs.readFileSync(path, 'utf-8');
    return input.split(/\r?\n/);
}

type DialCommand = {
    direction: string,
    clicks: number
};

function readInput(path: string): Array<DialCommand> {
    let commands = [];
    const input = readLines(path);
    for (var line of input) {
        let direction = line[0];
        let clicks = Number(line.substring(1));
        commands.push({direction, clicks});
    }
    return commands;
}

function getPassword(path: string) {
    let commands = readInput(path);
    let position = 50;
    let password1 = 0;
    let password2 = 0;
    for (let {direction, clicks} of commands) {
        while (clicks > 99) {
            clicks -= 100;
            ++password2;
        }

        let newPosition = position;
        if (direction === 'L')
            newPosition -= clicks;
        else
            newPosition += clicks;

        if (position !== 0 && (newPosition < 0 || newPosition > 99)) {
            password2++;
        } else if (newPosition === 0) {
            ++password2;
        }

        position = (newPosition + 100) % 100;
        if (position === 0) {
            ++password1;
        }
    }
    return {password1, password2};
}

describe('2025_day_01', () => {
    it('example1', async () => {
        const password = getPassword("2025/day01/example.txt").password1;
        expect(password).toBe(3);
    });
    it('solution1', async () => {
        const password = getPassword("2025/day01/input.txt").password1;
        expect(password).toBe(1018);
    });
    it('example2', async () => {
        const password = getPassword("2025/day01/example.txt").password2;
        expect(password).toBe(6);
    });
    it('solution2', async () => {
        const password = getPassword("2025/day01/input.txt").password2;
        expect(password).toBe(5815);
    });
});