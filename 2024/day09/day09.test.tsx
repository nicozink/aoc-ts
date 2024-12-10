import * as fs from 'fs';

function createFileBlocks(diskMap: string): number[] {
    let fileBlocks: number[] = [];
    let isFile = true;
    let fileId = 0;
    for (let num of diskMap.split('').map(x => Number(x))) {
        for (let x = 0; x < num; x++) {
            if (isFile) {
                fileBlocks.push(fileId);
            } else {
                fileBlocks.push(-1);
            }
        }

        if (isFile) {
            fileId++;
        }

        isFile = !isFile;
    }

    return fileBlocks;
}

function findEmptyBlock(fileBlocks: number[], requiredSize: number = 1): number {
    for (let x = 0; x < fileBlocks.length - requiredSize + 1; x++) {
        if (fileBlocks[x] == -1) {
            let sizeFits = true;
            for (let y = 0; y < requiredSize; y++) {
                if (fileBlocks[x + y] != -1) {
                    sizeFits = false;
                    break;
                }
            }

            if (sizeFits) {
                return x;
            }
        }
    }

    return -1;
}

function findLastBlock(fileBlocks: number[]): number {
    for (let x = fileBlocks.length - 1; x >= 0; x--) {
        if (fileBlocks[x] != -1) {
            return x;
        }
    }

    throw new Error("Could not find a block.");
}

function moveBlocks(fileBlocks: number[]) {
    while (true) {
        let firstSpace = findEmptyBlock(fileBlocks);
        let lastBlock = findLastBlock(fileBlocks);

        if (firstSpace > lastBlock) {
            return;
        }

        fileBlocks[firstSpace] = fileBlocks[lastBlock];
        fileBlocks[lastBlock] = -1;
    }
}

function calculateChecksum(fileBlocks: number[]): number {
    let checksum = 0;
    for (let x = 0; x < fileBlocks.length; x++) {
        let fileBlock = fileBlocks[x];
        if (fileBlock == -1) {
            continue;
        }

        checksum += fileBlock * x;
    }

    return checksum;
}

function compactWithFragmenting(diskMap: string): number {
    let fileBlocks = createFileBlocks(diskMap);
    moveBlocks(fileBlocks);
    return calculateChecksum(fileBlocks);
}

function findBlock(fileBlocks: number[], id: number): [number, number] {
    let index = fileBlocks.findIndex(x => x == id);
    let size = 1;
    while (index + size < fileBlocks.length && fileBlocks[index + size] == id) {
        size++;
    }

    return [index, size];
}

function compactWithoutFragmenting(diskMap: string): number {
    let fileBlocks = createFileBlocks(diskMap);
    
    let maxId = Math.max(...fileBlocks);
    for (let id = maxId; id >= 0; id--) {
        let [index, size] = findBlock(fileBlocks, id);
        let emptyBlock = findEmptyBlock(fileBlocks, size);
        if (emptyBlock == -1 || emptyBlock > index) {
            continue;
        }

        for (let x = 0; x < size; x++) {
            fileBlocks[emptyBlock + x] = id;
            fileBlocks[index + x] = -1;
        }
    }

    return calculateChecksum(fileBlocks);
}

describe('2024_day_09', () => {
    it('example1', async () => {
        const result = compactWithFragmenting("2333133121414131402");
        expect(result).toBe(1928);
    });
    it('solution1', async () => {
        let input = fs.readFileSync("2024/day09/input.txt", 'utf-8');
        const result = compactWithFragmenting(input);
        expect(result).toBe(6448989155953);
    });
    it('example2', async () => {
        const result = compactWithoutFragmenting("2333133121414131402");
        expect(result).toBe(2858);
    });
    it('solution2', async () => {
        let input = fs.readFileSync("2024/day09/input.txt", 'utf-8');
        const result = compactWithoutFragmenting(input);
        expect(result).toBe(6476642796832);
    });
});