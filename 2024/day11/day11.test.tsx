function countStonesRecursive(stone: number, blinks: number, cache: Map<number, number>[]): number {
    if (blinks == 0) {
        return 1;
    }

    if (cache[blinks].has(stone)) {
        return cache[blinks].get(stone)!;
    }

    let stoneLength = Math.floor(Math.log10(stone)) + 1;
    let numStones = 0;
    if (stone == 0) {
        numStones = countStonesRecursive(1, blinks - 1, cache);
    } else if (stoneLength % 2 == 0) {
        var middle = stoneLength / 2;
        var middleFactor = Math.pow(10, middle);

        var first = Math.floor(stone / middleFactor);
        numStones += countStonesRecursive(first, blinks - 1, cache);
        
        var second = stone % middleFactor;
        numStones += countStonesRecursive(second, blinks - 1, cache);
    } else {
        numStones = countStonesRecursive(stone * 2024, blinks - 1, cache);
    }
    
    cache[blinks].set(stone, numStones);

    return numStones;
}

function countStones(stones: number[], blinks: number): number {
    let cache: Map<number, number>[] = [];
    for (let x = 0; x <= blinks; x++) {
        cache.push(new Map<number, number>());
    }

    let numStones = 0;
    for (let stone of stones) {
        numStones += countStonesRecursive(stone, blinks, cache);
    }

    return numStones;
}

let example = [125, 17];
let input = [1, 24596, 0, 740994, 60, 803, 8918, 9405859];
describe('2024_day_11', () => {
    it('example1', async () => {
        expect(countStones(example, 6)).toBe(22);
        expect(countStones(example, 25)).toBe(55312);
    });
    it('solution1', async () => {
        const result = countStones(input, 25);
        expect(result).toBe(203457);
    });
    it('solution2', async () => {
        const result = countStones(input, 75);
        expect(result).toBe(241394363462435);
    });
});