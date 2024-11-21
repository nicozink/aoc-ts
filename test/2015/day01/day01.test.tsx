import * as fs from 'fs';

function count_stuff(pattern: string): number {
    const upMatches = pattern.match(/\(/g)||[];
    const downMatches = pattern.match(/\)/g)||[];
    return upMatches.length - downMatches.length;
}

function findBasementPosition(pattern: string): number {
    let position = 0;
    for (let i = 0; i < pattern.length; i++) {
        position += pattern[i] == '(' ? 1 : -1;

        if (position == -1) {
            return i + 1;
        }
    }
    throw new Error("Did not reach the basement");
}

describe('2025_day_01', () => {
    it('example1', async () => {
        expect(count_stuff("(())")).toBe(0);
        expect(count_stuff("()()")).toBe(0);
        expect(count_stuff("(((")).toBe(3);
        expect(count_stuff("(()(()(")).toBe(3);
        expect(count_stuff("))(((((")).toBe(3);
        expect(count_stuff("())")).toBe(-1);
        expect(count_stuff("))(")).toBe(-1);
        expect(count_stuff(")))")).toBe(-3);
        expect(count_stuff(")())())")).toBe(-3);
    });
    it('part1', async () => {
        const input = fs.readFileSync("test/2015/day01/input.txt", 'utf-8');
        expect(count_stuff(input)).toBe(74);
    });
    it('example2', async () => {
        expect(findBasementPosition(")")).toBe(1);
        expect(findBasementPosition("()())")).toBe(5);
    });
    it('part2', async () => {
        const input = fs.readFileSync("test/2015/day01/input.txt", 'utf-8');
        expect(findBasementPosition(input)).toBe(1795);
    });
});