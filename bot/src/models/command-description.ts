export class CommandDescription {

    private lines: string[];
    constructor(){
        this.lines = [];
    }

    public addLine(line: string): CommandDescription {
        this.lines.push(line);
        return this;
    }

    public addLines(lines: string[]): CommandDescription {
        this.lines = this.lines.concat(lines);
        return this;
    }

    public addList(list : string[]): CommandDescription {
        list.map((item) => {
            let newLine = '\t ■ ' + item;
            this.addLine(newLine);
        })
        return this;
    }

    public prettyPrint(prefixedTabs: number = 0): string {
        let multipleTabs = '\t'.repeat(prefixedTabs);
        return this.lines.reduce((text, line) => text.concat(`${multipleTabs}${line}\n`), '');
    }

}