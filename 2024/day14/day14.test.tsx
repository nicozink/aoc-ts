import * as fs from 'fs';

type Robot = {
    px: number;
    py: number;
    vx: number;
    vy: number
}

function readInput(path: string, numX: number, numY: number): Robot[] {
    let input = fs.readFileSync(path, 'utf-8');
    let lines = input.split(/\r?\n/);

    let robots: Robot[] = [];
    for (let line of lines) {
        line = line.replace('p=', '');
        line = line.replace(' v=', ',');

        let values = line.split(',').map(x => Number(x));
        let robot: Robot = {
            px: values[0], py: values[1], vx: values[2], vy: values[3]
        };
        // Avoid negative numbers by wrapping them around
        robot.vx = (robot.vx + numX) % numX;
        robot.vy = (robot.vy + numY) % numY;

        robots.push(robot);
    }

    return robots;
}

function countRobots(robots: Robot[], startX: number, endX: number, startY: number, endY: number): number {
    let numRobots = 0;

    for (let robot of robots) {
        if (robot.px < startX || robot.px > endX) {
            continue;
        }

        if (robot.py < startY || robot.py > endY) {
            continue;
        }

        numRobots++;
    }

    return numRobots;
}

function getQuadOffsets(numX: number, numY: number): number[][] {
    let quadOffsets: number[][] = [];
    quadOffsets.push([0, 0]);
    quadOffsets.push([0, numY + 1]);
    quadOffsets.push([numX + 1, 0]);
    quadOffsets.push([numX + 1, numY + 1]);

    return quadOffsets;
}

function advanceRobots(robots: Robot[], numX: number, numY: number, turns: number) {
    for (let robot of robots) {
        robot.px = (robot.px + robot.vx * turns) % numX;
        robot.py = (robot.py + robot.vy * turns) % numY;
    }
}

function countSafetyFactor(path: string, numX: number, numY: number): number {
    let robots = readInput(path, numX, numY);
    
    advanceRobots(robots, numX, numY, 100);

    let halfX = Math.floor(numX / 2);
    let halfY = Math.floor(numY / 2);

    let safetyFactor = 1;
    for (let quad of getQuadOffsets(halfX, halfY)) {
        safetyFactor *= countRobots(
            robots,
            quad[0], quad[0] + halfX - 1,
            quad[1], quad[1] + halfY - 1);
    }

    return safetyFactor;
}

function printRobots(robots: Robot[], numX: number, numY: number) {
    let grid: number[][] = [];
    for (let x = 0; x < numX; x++) {
        let row: number[] = [];
        for (let y = 0; y < numY; y++) {
            row.push(0);
        }
        grid.push(row);
    }

    for (let robot of robots) {
        grid[robot.px][robot.py]++;
    }

    let str = '';
    for (let y = 0; y < numY; y++) {
        for (let x = 0; x < numX; x++) {
            let numRobots = grid[x][y];
            if (numRobots == 0) {
                str += '.';
            } else {
                str += numRobots.toString();
            }
        }

        str += '\n'
    }

    console.log(str);
}

function findTree(path: string, numX: number, numY: number): number {
    let robots = readInput(path, numX, numY);
    
    let turns = 8280;
    advanceRobots(robots, numX, numY, turns);
    printRobots(robots, numX, numY);

    return turns;
}

describe('2024_day_14', () => {
    it('example1', async () => {
        const result = countSafetyFactor("2024/day14/example.txt", 11, 7);
        expect(result).toBe(12);
    });
    it('solution1', async () => {
        const result = countSafetyFactor("2024/day14/input.txt", 101, 103);
        expect(result).toBe(231019008);
    });
    it('solution2', async () => {
        const result = findTree("2024/day14/input.txt", 101, 103);
        expect(result).toBe(8280);
    });
});