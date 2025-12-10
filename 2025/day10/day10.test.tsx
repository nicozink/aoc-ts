import * as fs from 'fs';

type Machine = {goal: string, buttons: number[][], joltage: number[]};

function readInput(path: string): Machine[] {
    let input = fs.readFileSync(path, 'utf-8');
    let lines = input.split(/\r?\n/);
    
    const machines = [];
    for (let line of lines) {
        let subString = line.substring(1, line.length - 1)
            .replaceAll(') (', ';');
        let firstSplit = subString.split("] (");
        let secondSplit = firstSplit[1].split(") {");

        let goal = firstSplit[0];
        let buttons = [];
        for (let buttonString of secondSplit[0].split(';')) {
            let buttonNumbers = [];
            for (let number of buttonString.split(',')) {
                buttonNumbers.push(Number(number));
            }
            buttons.push(buttonNumbers);
        }
        let joltage = [];
        for (let joltageString of secondSplit[1].split(',')) {
            joltage.push(Number(joltageString));
        }
        machines.push({goal, buttons, joltage});
    }
    return machines;
}

function solve1(machine: Machine) {
    let goal = machine.goal.split('');
    let start = new Array(goal.length).fill('.');
    let pushes = 1;
    let stack = [start];
    while (true) {
        let newStack = [];
        for (let current of stack) {
            for (let button of machine.buttons) {
                let newLights = current.slice();
                for (let lightIndex of button) {
                    if (newLights[lightIndex] === '.')
                        newLights[lightIndex] = '#';
                    else
                        newLights[lightIndex] = '.';
                }
                newStack.push(newLights);

                let equals = true;
                for (let i = 0; i < newLights.length; i++) {
                    if (newLights[i] !== goal[i])
                        equals = false;
                }
                if (equals) return pushes;
            }
        }
        stack = newStack;
        ++pushes;
    }
}

function countButtonPushes1(path: string) {
    const machines = readInput(path);

    let pushes = 0;
    for (let machine of machines) {
        pushes += solve1(machine);
    }
    return pushes;
}

async function countButtonPushes2(path: string) {
    const machines = readInput(path);

    const {init} = require('z3-solver');
    const {Context} = await init();
    const {Int, Optimize} = Context("main");

    let pushes = 0;
    for (let machine of machines) {
        const solver = new Optimize();
        
        const buttonVariables = [];
        for (let i = 0; i < machine.buttons.length; i++) {
            const buttonVariable = Int.const(`n${i}`);
            solver.add(buttonVariable.ge(0));
            buttonVariables.push(buttonVariable);
        }

        for (let i = 0; i < machine.joltage.length; i++) {
            let condition = Int.val(0);
            for (let j = 0; j < machine.buttons.length; j++) {
                let buttonLights = machine.buttons[j];
                if (buttonLights.includes(i))
                    condition = condition.add(buttonVariables[j]);
            }
            condition = condition.eq(Int.val(machine.joltage[i]));
            solver.add(condition);
        }

        let buttonPresses = Int.val(0);
        for (var variable of buttonVariables) {
            buttonPresses = buttonPresses.add(variable);
        }
        solver.minimize(buttonPresses);

        let solverResult = await solver.check();
        if (solverResult !== "sat")
            throw "Error returned by solver";
        
        let result = solver.model().eval(buttonPresses);
        pushes += Number(result.toString());
    }
    return pushes;
}

describe('2025_day_10', () => {
    it('example1', async () => {
        const count = countButtonPushes1("2025/day10/example.txt");
        expect(count).toBe(7);
    });
    it('solution1', async () => {
        const count = countButtonPushes1("2025/day10/input.txt");
        expect(count).toBe(417);
    });
    it('example2', async () => {
        const count = await countButtonPushes2("2025/day10/example.txt");
        expect(count).toBe(33);
    });
    it('solution2', async () => {
        const count = await countButtonPushes2("2025/day10/input.txt");
        expect(count).toBe(16765);
    });
});