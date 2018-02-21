declare function DeepPrintTable(msg: any): void;

class customSchema {

    // Check the schema_examples folder for different implementations

    // Flag Example
    // statCollection.setFlags({version: GetVersion()})

    static init(): void {
        // Listen for changes in the current state
        ListenToGameEvent("game_rules_state_change", () => {
            const state = GameRules.State_Get();

            // Send custom stats when the game ends
            if (state === DOTA_GameState.DOTA_GAMERULES_STATE_POST_GAME) {
                const game = BuildGameArray();
                const players = BuildPlayersArray();

                // Print the schema data to the console
                if (statCollection.TESTING) {
                    PrintSchema(game, players);
                }
            }
        }, null);
    }

    /**
     * If your gamemode is round-based, you can use statCollection:submitRound(bLastRound) at any point of your main
     * game logic code to send a round
     *
     * If you intend to send rounds, make sure your settings.kv has the 'HAS_ROUNDS' set to true. Each round will send
     * the game and player arrays defined earlier
     *
     * The round number is incremented internally, lastRound can be marked to notify that the game ended properly
     */
    static submitRound(): void {
        const winners = BuildRoundWinnerArray();
        const game = BuildGameArray();
        const players = BuildPlayersArray();

        statCollection.sendCustom({
            game: game,
            players: players,
        });
    }
}

// -------------------------------------
//
// In the statcollection/lib/utilities.ts, you'll find many useful functions to build your schema.
// You are also encouraged to call your custom mod-specific functions

/**
 * Returns a table with our custom game tracking.
 */
function BuildGameArray(): GameArray {
    const game: GameArray = {};

    // Add game values here as game.someValue = GetSomeGameValue()

    return game;
}

/**
 * Returns a table containing data for every player in the game
 */
function BuildPlayersArray(): PlayerArray {
    const players: PlayerArray = [{}];

    for (let playerID = 0; playerID < DOTALimits_t.DOTA_MAX_PLAYERS; playerID++) {
        if (PlayerResource.IsValidPlayer(playerID as PlayerID)) {
            if (!PlayerResource.IsBroadcaster(playerID as PlayerID)) {
                const hero = PlayerResource.GetSelectedHeroEntity(playerID as PlayerID);

                players.push({
                    // steamID32 required in here
                    steamID32: PlayerResource.GetSteamAccountID(playerID as PlayerID),

                    // Example functions for generic stats are defined in statcollection/lib/utilities.lua
                    // Add player values here as someValue: GetSomePlayerValue(),
                });
            }
        }
    }

    return players;
}

/**
 * Prints the custom schema, required to get an schemaID
 */
function PrintSchema(gameArray: GameArray, playerArray: PlayerArray) {
    print("-------- GAME DATA --------");
    DeepPrintTable(gameArray);
    print();
    print("-------- PLAYER DATA --------");
    DeepPrintTable(playerArray);
    print("-------------------------------------");
}

/**
 * A list of players marking who won this round
 */
function BuildRoundWinnerArray(): RoundWinnerArray {
    const winners: RoundWinnerArray = [];

    const currentWinnerTeam = 0; // You'll need to provide your own way of determining which team won the round

    for (let playerID = 0; playerID < DOTALimits_t.DOTA_MAX_PLAYERS; playerID++) {
        if (PlayerResource.IsValidPlayer(playerID as PlayerID)) {
            if (!PlayerResource.IsBroadcaster(playerID as PlayerID)) {
                const steamAccountID = PlayerResource.GetSteamAccountID(playerID as PlayerID);
                const playerTeam = PlayerResource.GetTeam(playerID as PlayerID);
                const playerIsOnWinningTeam = playerTeam === currentWinnerTeam ? 1 : 0;

                winners[steamAccountID + 1] = playerIsOnWinningTeam;
            }
        }
    }

    return winners;
}
