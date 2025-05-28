import { CustomGenerator } from "./custom-generator";
import { type InitGeneratorOptions, type CustomGeneratorOptions } from "./types";
export default class InitGenerator<T extends InitGeneratorOptions = InitGeneratorOptions, Z extends CustomGeneratorOptions<T> = CustomGeneratorOptions<T>> extends CustomGenerator<InitGeneratorOptions> {
    configurationPath: string | undefined;
    constructor(args: string | string[], opts: Z);
    prompting(): Promise<void>;
    installPlugins(): Promise<void>;
    writing(): void;
    end(): void;
}
