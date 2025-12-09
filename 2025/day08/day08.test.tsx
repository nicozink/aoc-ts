import * as fs from 'fs';

type Position = {x: number, y: number, z: number};
type PositionCombo = {pos1: number, pos2: number, distance: number};
type JunctionBoxes = {
    positions: Position[],
    combos: PositionCombo[],
    connections: Set<number>[]
}

function readInput(path: string): JunctionBoxes {
    let input = fs.readFileSync(path, 'utf-8');
    let lines = input.split(/\r?\n/);
    
    const positions = [];
    for (let line of lines) {
        let coords = line.split(',');
        positions.push({x: Number(coords[0]), y: Number(coords[1]), z: Number(coords[2])});
    }

    let combos = [];
    for (let i = 0; i < positions.length - 1; ++i) {
        let pos1 = positions[i];
        for (let j = i + 1; j < positions.length; ++j) {
            let pos2 = positions[j];

            const dx = pos1.x - pos2.x;
            const dy = pos1.y - pos2.y;
            const dz = pos1.z - pos2.z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

            combos.push({pos1: i, pos2: j, distance});
        }
    }
    combos.sort((pos1, pos2) => pos1.distance - pos2.distance);

    let connections: Set<number>[] = [];
    for (let i = 0; i < positions.length; ++i) {
        const set = new Set<number>();
        set.add(i);
        connections.push(set);
    }

    return {positions, combos, connections};
}

function addConnection(connections: Set<number>[], combo: PositionCombo) {
    const set1 = connections[combo.pos1];
    const set2 = connections[combo.pos2];
    if (set1 === set2)
        return;

    const newSet = new Set<number>([...set1, ...set2]);
    for (let pos of newSet) {
        connections[pos] = newSet;
    }
}

function getConnectionCounts(connections: Set<number>[]) {
    return connections.filter((value, index) => connections.indexOf(value) === index)
        .map(x => x.size);
}

function getCircuitProduct(path: string, numConnections: number) {
    let {positions, combos, connections} = readInput(path);

    for (let i = 0; i < numConnections; ++i) {
        addConnection(connections, combos[i]);
    }

    const connectionCounts = getConnectionCounts(connections);
    const sortedCounts = connectionCounts.sort((a, b) => b - a);
    let product = 1;
    for (let i = 0; i < 3; ++i) {
        product *= sortedCounts[i];
    }
    return product;
}

function getDistanceToWall(path: string) {
    let {positions, combos, connections} = readInput(path);

    for (let i = 0; i < combos.length; ++i) {
        addConnection(connections, combos[i]);

        const connectionCounts = getConnectionCounts(connections);
        if (connectionCounts.length === 1) {
            let pos1 = positions[combos[i].pos1];
            let pos2 = positions[combos[i].pos2];
            return pos1.x * pos2.x;
        }
    }
}

describe('2025_day_08', () => {
    it('example1', async () => {
        const count = getCircuitProduct("2025/day08/example.txt", 10);
        expect(count).toBe(40);
    });
    it('solution1', async () => {
        const count = getCircuitProduct("2025/day08/input.txt", 1000);
        expect(count).toBe(29406);
    });
    it('example2', async () => {
        const count = getDistanceToWall("2025/day08/example.txt");
        expect(count).toBe(25272);
    });
    it('solution2', async () => {
        const count = getDistanceToWall("2025/day08/input.txt");
        expect(count).toBe(7499461416);
    });
});