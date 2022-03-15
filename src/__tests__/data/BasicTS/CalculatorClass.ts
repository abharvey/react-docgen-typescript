export default class Calculator {
    private _history: String[];

    constructor() {
        this._history = [];
    }

    get history() {
        return this._history.map(h => h.toString()).join('');
    }

    public add(a: number, b: number) {
        const result = a + b
        this._history.push(`${a} + ${b} = ${result}`)
        return result;
    }

    public sub(a: number, b: number) {
        const result = a - b
        this._history.push(`${a} - ${b} = ${result}`)
        return result;
    }
}
