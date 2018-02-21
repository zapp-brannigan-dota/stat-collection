// @ts-ignore
declare const statCollection: statCollection;

const statInfo = LoadKeyValues('scripts/vscripts/statcollection/settings.kv');
if (!statInfo) {
    print('Stat Collection: Critical Error, no settings.kv file found');
    // @ts-ignore
    return;
}

require('statcollection/schema');
require('statcollection/lib/statcollection');
require('statcollection/staging');
require('statcollection/lib/utilities');

const COLLECT_STATS = !Convars.GetBool('developer');
const TESTING = statInfo.TESTING === 'true';
const MIN_PLAYERS = Number(statInfo.MIN_PLAYERS);

if (COLLECT_STATS || TESTING) {
    ListenToGameEvent('game_rules_state_change', () => {
        const state = GameRules.State_Get();

        if (state >= DOTA_GameState.DOTA_GAMERULES_STATE_INIT && !statCollection.doneInit) {
            if (PlayerResource.GetPlayerCount() >= MIN_PLAYERS || TESTING) {
                // Init stat collection
                statCollection.init();
                customSchema.init();
            }
        }

    }, null);
}
