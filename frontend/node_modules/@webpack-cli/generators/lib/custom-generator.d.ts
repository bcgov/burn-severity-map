import Generator from "yeoman-generator";
import { type IWebpackCLI } from "webpack-cli";
import { BaseCustomGeneratorOptions, CustomGeneratorOptions } from "./types";
export declare class CustomGenerator<T extends BaseCustomGeneratorOptions = BaseCustomGeneratorOptions, Z extends CustomGeneratorOptions<T> = CustomGeneratorOptions<T>> extends Generator<Z> {
    cli: IWebpackCLI;
    template: string;
    dependencies: string[];
    force: boolean;
    answers: Record<string, unknown>;
    generationPath: string;
    supportedTemplates: string[];
    packageManager: string | undefined;
    constructor(args: string | string[], opts: Z);
}
