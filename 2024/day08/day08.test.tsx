import * as fs from 'fs';

function readGrid(path: string): string[][] {
    let input = fs.readFileSync(path, 'utf-8');
    return input.split(/\r?\n/)
        .map(x => x.split(''));
}

class Antenna {
    frequency: string;
    row: number;
    col: number;

    constructor(frequency: string, row: number, col: number) {
        this.frequency = frequency;
        this.row = row;
        this.col = col;
    }
}

function getAntennas(grid: string[][]): Antenna[] {
    let antennas: Antenna[] = [];
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            if (grid[r][c] != '.') {
                antennas.push(new Antenna(grid[r][c], r, c));
            }
        }
    }

    return antennas;
}

function createAntinode(antinodes: string[][], row: number, col: number) {
    let maxRows = antinodes.length;
    let maxCols = antinodes[0].length;
    if (row >= 0 && row < maxRows && col >= 0 && col < maxCols) {
        antinodes[row][col] = '#';
    }
}

function createAntinodes(antinodes: string[][], row: number, col: number, deltaRow: number, deltaCol: number) {
    let maxRows = antinodes.length;
    let maxCols = antinodes[0].length;
    
    let stepsR = Math.ceil(maxRows / deltaRow);
    let stepsC = Math.ceil(maxCols / deltaCol);
    let steps = Math.max(stepsR, stepsC);
    for (let x = -steps; x <= steps; x++) {
        let posR = row + x * deltaRow;
        let posC = col + x * deltaCol;
        createAntinode(antinodes, posR, posC);
    }
}

function countAntinodes(path: string, includeHarmonics: boolean): number {
    let grid = readGrid(path);
    let antinodeGrid = grid.map(x => x.map(y => '.'));

    let antennas = getAntennas(grid);
    for (let x = 0; x < antennas.length - 1; x++) {
        for (let y = x + 1; y < antennas.length; y++) {
            let antenna1 = antennas[x];
            let antenna2 = antennas[y];

            if (antenna1.frequency != antenna2.frequency) {
                continue;
            }

            let deltaR = antenna2.row - antenna1.row;
            let deltaC = antenna2.col - antenna1.col;
            if (includeHarmonics) {
                createAntinodes(antinodeGrid, antenna1.row, antenna1.col, deltaR, deltaC);
            } else {
                createAntinode(antinodeGrid, antenna1.row - deltaR, antenna1.col - deltaC);
                createAntinode(antinodeGrid, antenna2.row + deltaR, antenna2.col + deltaC);
            }
        }
    }

    let antinodes = 0;
    for (let r = 0; r < antinodeGrid.length; r++) {
        for (let c = 0; c < antinodeGrid[r].length; c++) {
            if (antinodeGrid[r][c] == '#') {
                antinodes++;
            }
        }
    }

    return antinodes;
}

describe('2024_day_08', () => {
    it('example1', async () => {
        const result = countAntinodes("2024/day08/example1.txt", false);
        expect(result).toBe(3);
    });
    it('example2', async () => {
        const result = countAntinodes("2024/day08/example2.txt", false);
        expect(result).toBe(14);
    });
    it('solution1', async () => {
        const result = countAntinodes("2024/day08/input.txt", false);
        expect(result).toBe(351);
    });
    it('example3', async () => {
        const result = countAntinodes("2024/day08/example1.txt", true);
        expect(result).toBe(9);
    });
    it('example4', async () => {
        const result = countAntinodes("2024/day08/example2.txt", true);
        expect(result).toBe(34);
    });
    it('solution2', async () => {
        const result = countAntinodes("2024/day08/input.txt", true);
        expect(result).toBe(1259);
    });
});