type RoundWinnerArray = (1 | 0)[]
type GameArray = {[key: string]: any}
type PlayerArray = [{[key: string]: any}]

// @ts-ignore
declare class statCollection {
    init(): void;
    calcWinnersByTeam(): RoundWinnerArray;
    hookFunctions(): void;
    findWinnerUsingForts(): void;
    setFlags(flags: {[key: string]: any}): void;
    sendStage1(): void;
    sendStage2(): void;
    sendStage3(winners: RoundWinnerArray, lastRound: boolean): void;
    submitRound(lastRound: boolean): void;
    sendCustom(args: {game: GameArray, players: PlayerArray}): void;
    sendHostCheckIn(): void;
    sendStage(stageName: string, payload: any, callback: (err: boolean, obj: any) => void, override_host?: string): void;
    ReturnedErrors(err: boolean, res: any): boolean;
    printError(where: any, msg: any): void;
    printError(s1: any, s2: any): void;
    tobool(s: string): boolean;

    doneInit: boolean;
    HAS_SCHEMA: boolean;
    HAS_ROUNDS: boolean;
    GAME_WINNER: boolean;
    ANCIENT_EXPLOSION: boolean;
    OVERRIDE_AUTOMATIC_SEND_STAGE_2: boolean;
    TESTING: boolean;

    modIdentifier: string;
    SCHEMA_KEY: string;
    winner: number;
    roundID: number;

    flags: {[key: string]: any};

    sentStage1: boolean;
    sentStage2: boolean;
    sentStage3: boolean;
    sentCustom: boolean;
}

// @ts-ignore
declare const statCollection: statCollection;
