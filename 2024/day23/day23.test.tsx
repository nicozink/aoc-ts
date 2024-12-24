import * as fs from 'fs';

function readInput(filePath: string): Map<string, Set<string>> {
    let file = fs.readFileSync(filePath, 'utf-8');
    let lines = file.split(/\r?\n/);

    let map = new Map<string, Set<string>>();
    for (let line of lines) {
        let nodes = line.split('-');
        
        let node0 = map.get(nodes[0]) || new Set<string>();
        node0.add(nodes[1]);
        map.set(nodes[0], node0);

        let node1 = map.get(nodes[1]) || new Set<string>();
        node1.add(nodes[0]);
        map.set(nodes[1], node1);
    }

    return map;
}

function intersection(setA: string[], setB: Set<string>): string[] {
    return setA.filter(item => setB.has(item));
}

function getConnections(filePath: string): string[][] {
    let map = readInput(filePath);

    let connections: string[][] = [];
    for (let start of map.keys()) {

        let frontier: string[][] = [];
        for (let next of map.get(start)!) {
            if (start > next) {
                continue;
            }
            frontier.push([start, next]);
        }

        while (frontier.length > 0) {
            let path = frontier.pop()!;

            let intersections = [...map.get(path[0])!];
            for (let value of path) {
                intersections = intersection(intersections, map.get(value)!);
            }

            let previous = path[path.length - 1];
            for (let next of intersections) {
                if (previous > next) {
                    continue;
                }
                let nextIntersection = intersection(path, map.get(next)!);
                if (nextIntersection.length != path.length) {
                    continue;
                }

                let newPath = [...path];
                newPath.push(next);

                connections.push(newPath);
                frontier.push(newPath);
            }
        }
    }

    return connections;
}

function countTGroups(filePath: string): number {
    let connections = getConnections(filePath);

    let connectionStrings = new Set<string>();
    for (let connection of connections) {
        if (connection.length == 3) {
            connectionStrings.add([...connection].sort().join('-'));
        }
    }
 
    let foundT: string[] = [];
    for (let sequence of connectionStrings) {
        if (sequence[0] == 't' || sequence.includes('-t')) {
            foundT.push(sequence);
        }
    }

    return foundT.length;
}

function calculatePassword(filePath: string) : string {
    let connections = getConnections(filePath);
    
    let maxLength = 0;
    let password = '';
    for (let connection of connections) {
        if (connection.length > maxLength) {
            password = [...connection].sort().join(',');
            maxLength = connection.length;
        }
    }

    return password;
}

describe('2024_day_23', () => {
    it('example1', async () => {
        const result = countTGroups("2024/day23/example.txt");
        expect(result).toBe(7);
    });
    it('solution1', async () => {
        const result = countTGroups("2024/day23/input.txt");
        expect(result).toBe(1170);
    });
    it('example2', async () => {
        const result = calculatePassword("2024/day23/example.txt");
        expect(result).toBe('co,de,ka,ta');
    });
    it('solution2', async () => {
        const result = calculatePassword("2024/day23/input.txt");
        expect(result).toBe('bo,dd,eq,ik,lo,lu,ph,ro,rr,rw,uo,wx,yg');
    });
});