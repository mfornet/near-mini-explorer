import { Ast, Ast2, ReactComponentArgument } from "./types";

const SPECIAL_CHARACTERS = "$},";
const VALID_IDENTIFIERS_CHARACTERS =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_.";

function flush(output: Ast, token: string[]) {
    if (token.length > 0) {
        output.push(token.join(""));
        token.splice(0, token.length);
    }
}

export function collapseString(ast: Ast | Ast2): string {
    return ast
        .map((item) => {
            if (typeof item !== "string") {
                throw new Error("Ast elements must be string for collapsing");
            }
            return item;
        })
        .join("");
}

export class AstParser {
    pointer: number;
    buffer: string;
    variables: Map<string, Ast>;

    constructor(buffer: string, variables: Map<string, Ast>) {
        this.pointer = 0;
        this.buffer = buffer;
        this.variables = variables;
    }

    curChar(): string | null {
        if (this.pointer === this.buffer.length) {
            return null;
        } else {
            return this.buffer[this.pointer];
        }
    }

    nextChar(): string | null {
        if (this.pointer + 1 >= this.buffer.length) {
            return null;
        } else {
            return this.buffer[this.pointer + 1];
        }
    }

    parse(lastElement: string = ""): Ast {
        let currentToken: string[] = [];
        const output: Ast = [];

        do {
            const curChar = this.curChar();

            if (curChar === null || lastElement.indexOf(curChar) !== -1) {
                flush(output, currentToken);
                break;
            }

            if (curChar !== "$") {
                currentToken.push(curChar);
                this.pointer += 1;
            } else {
                const next = this.nextChar();

                if (next === null) {
                    throw Error(
                        "Invalid syntax. Found `$` at the end of the input."
                    );
                }

                // Handle escaped characters
                if (SPECIAL_CHARACTERS.indexOf(next) !== -1) {
                    currentToken.push(next);
                    this.pointer += 2;
                    continue;
                }

                flush(output, currentToken);

                // Handle React Components
                if (next === "{") {
                    this.pointer += 2;

                    const name = this.parse(",}");
                    const args: ReactComponentArgument[] = [];

                    while (this.curChar() === ",") {
                        this.pointer += 1;
                        const key = this.parse(":");
                        this.pointer += 1;
                        const value = this.parse(",}");
                        args.push({
                            key: collapseString(key),
                            value,
                        });
                    }

                    if (this.curChar() !== "}") {
                        throw Error(
                            "Invalid syntax. Expected `}` after React component arguments."
                        );
                    }

                    this.pointer += 1;
                    output.push({
                        name: collapseString(name),
                        arguments: args,
                    });
                    continue;
                }

                // Handle pure substitution
                this.pointer += 1;
                const identifier = [];
                do {
                    const curChar = this.curChar();
                    if (
                        curChar === null ||
                        VALID_IDENTIFIERS_CHARACTERS.indexOf(curChar) === -1
                    ) {
                        break;
                    }
                    identifier.push(curChar);
                    this.pointer += 1;
                } while (true);

                output.push(...this.substitute(identifier.join("")));
            }
        } while (true);

        flush(output, currentToken);

        return output;
    }

    substitute(key: string): Ast {
        const result = this.variables.get(key);
        return result ? result : [{ key }];
    }
}
