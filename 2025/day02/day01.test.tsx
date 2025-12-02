import * as fs from 'fs';

type NumberRange = {
    start: number,
    end: number
};

function readInput(path: string): Array<NumberRange> {
    let ranges = [];
    let input = fs.readFileSync(path, 'utf-8');
    let inputRanges = input.split(',');
    for (var inputRange of inputRanges) {
        let startEnd = inputRange.split('-');
        let start = Number(startEnd[0]);
        let end = Number(startEnd[1]);
        ranges.push({start, end});
    }
    return ranges;
}

type checkFunction = (id: string) => boolean;
function getInvalidIds(path: string, isInvalid: checkFunction) {
    let sum = 0;
    let ranges = readInput(path);
    for (let {start, end} of ranges) {
        for (let val = start; val <= end; val++) {
            let id = String(val);
            if (isInvalid(id))
                sum += val;
        }
    }
    return sum;
}

function isInvalidPart1(id: string) {
    if (id.length % 2 !== 0) return false;
    for (let i = 0; i < id.length / 2; ++i) {
        if (id[i] !== id[i + id.length / 2]) {
            return false;
        }
    }
    return true;
}

function isInvalidPart2(id: string) {
    for (let subLength = 1; subLength <= id.length / 2; ++subLength) {
        if (id.length % subLength !== 0) continue;

        let isInvalid = true;
        let subPart = id.substring(0, subLength);
        for (let i = subLength; i < id.length; i += subLength) {
            let otherPart = id.substring(i, i + subLength);
            if (subPart !== otherPart) {
                isInvalid = false;
            }
        }
        if (isInvalid) {
            return true;
        }
    }
    return false;
}

describe('2025_day_02', () => {
    it('example1', async () => {
        const sum = getInvalidIds("2025/day02/example.txt", isInvalidPart1);
        expect(sum).toBe(1227775554);
    });
    it('solution1', async () => {
        const sum = getInvalidIds("2025/day02/input.txt", isInvalidPart1);
        expect(sum).toBe(9188031749);
    });
    it('example2', async () => {
        const sum = getInvalidIds("2025/day02/example.txt", isInvalidPart2);
        expect(sum).toBe(4174379265);
    });
    it('solution2', async () => {
        const sum = getInvalidIds("2025/day02/input.txt", isInvalidPart2);
        expect(sum).toBe(11323661261);
    });
});