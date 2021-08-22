export class CommandDescription {

    private lines: string[];
    constructor(){
        this.lines = [];
    }

    public addLine(line: string): void {
        this.lines.push(line);
    }

    public addLines(lines: string[]): void {
        this.lines = this.lines.concat(lines);
    }

    public addList(list : string[]): void {
        list.map((item) => {
            let newLine = '\t ■ ' + item;
            this.addLine(newLine);
        })
    }

    public prettyPrint(prefixedTabs: number = 0): string {
        let multipleTabs = '\t'.repeat(prefixedTabs);
        return this.lines.reduce((text, line) => text.concat(`${multipleTabs}${line}\n`), '');
    }

}