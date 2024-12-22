import * as fs from 'fs';

function mix(secret: bigint, value: bigint): bigint {
    return value ^ secret;
}

function prune(secret: bigint): bigint {
    return secret % 16777216n;
}

function mixAndPrune(secret: bigint, value: bigint): bigint {
    secret = mix(secret, value);
    secret = prune(secret);
    return secret;
}

function getNextSecret(secret: bigint): bigint {
    let mult = secret * 64n;
    secret = mixAndPrune(secret, mult);

    let div = secret / 32n;
    secret = mixAndPrune(secret, div);

    let mult2 = secret * 2048n;
    secret = mixAndPrune(secret, mult2);

    return secret;
}

function getSecretSum(filePath: string): bigint {
    let file = fs.readFileSync(filePath, 'utf-8');
    let lines = file.split(/\r?\n/);

    let sum = 0n;
    for (let line of lines) {
        let secret = BigInt(line);
        for(let x = 0; x < 2000; x++) {
            secret = getNextSecret(secret);
        }

        sum += secret;
    }

    return sum;
}

function countMostBananas(filePath: string): bigint {
    let file = fs.readFileSync(filePath, 'utf-8');
    let lines = file.split(/\r?\n/);

    let lookup = new Map<string, bigint>();
    for (let line of lines) {
        let secret = BigInt(line);

        let visited = new Map<string, boolean>();
        let sequence: bigint[] = [];
        for(let x = 0; x < 2000; x++) {
            let previous = secret % 10n;
            secret = getNextSecret(secret);
            let digit = secret % 10n;
            
            let diff = digit - previous;
            sequence.push(diff);

            if (sequence.length > 4) {
                sequence.shift();
            }

            if (sequence.length == 4) {
                let key = sequence.join(',');
                let hasVisited = visited.get(key) || false;
                if (!hasVisited) {
                    visited.set(key, true);

                    let total = lookup.get(key) || 0n;
                    total += digit;

                    lookup.set(key, total);
                }
            }
        }
    }

    let bestScore = 0n;
    for (let score of lookup.values()) {
        if (bestScore < score) {
            bestScore = score;
        }
    }

    return bestScore;
}

describe('2024_day_22', () => {
    it('example1', async () => {
        const secretMix = mix(42n, 15n);
        expect(secretMix).toBe(37n);
    });
    it('example2', async () => {
        const secretPrune = prune(100000000n);
        expect(secretPrune).toBe(16113920n);
    });
    it('example3', async () => {
        let secret = getNextSecret(123n);
        expect(secret).toBe(15887950n);

        secret = getNextSecret(secret);
        expect(secret).toBe(16495136n);
            
        secret = getNextSecret(secret);
        expect(secret).toBe(527345n);

        secret = getNextSecret(secret);
        expect(secret).toBe(704524n);

        secret = getNextSecret(secret);
        expect(secret).toBe(1553684n);

        secret = getNextSecret(secret);
        expect(secret).toBe(12683156n);

        secret = getNextSecret(secret);
        expect(secret).toBe(11100544n);

        secret = getNextSecret(secret);
        expect(secret).toBe(12249484n);

        secret = getNextSecret(secret);
        expect(secret).toBe(7753432n);

        secret = getNextSecret(secret);
        expect(secret).toBe(5908254n);
    });
    it('example4', async () => {
        const result = getSecretSum("2024/day22/example1.txt");
        expect(result).toBe(37327623n);
    });
    it('solution1', async () => {
        const result = getSecretSum("2024/day22/input.txt");
        expect(result).toBe(15335183969n);
    });
    it('example5', async () => {
        const result = countMostBananas("2024/day22/example2.txt");
        expect(result).toBe(23n);
    });
    it('solution2', async () => {
        const result = countMostBananas("2024/day22/input.txt");
        expect(result).toBe(1696n);
    });
});