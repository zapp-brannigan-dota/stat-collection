require("statcollection/schema")
require('statcollection/lib/statcollection')

local statInfo = LoadKeyValues('scripts/vscripts/statcollection/settings.kv')
local COLLECT_STATS = not Convars:GetBool('developer')
local TESTING = tobool(statInfo.TESTING)
local MIN_PLAYERS = tonumber(statInfo.MIN_PLAYERS)

if COLLECT_STATS or TESTING then
    ListenToGameEvent('game_rules_state_change', function(keys)
        local state = GameRules:State_Get()
        
        if state == DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP then

            if (PlayerResource:GetPlayerCount >= MIN_PLAYERS) or TESTING then

                -- Init stat collection
                statCollection:init()
                customSchema:init()
            end
        end
    end, nil)
end