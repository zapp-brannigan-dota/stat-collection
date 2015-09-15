--[[
Usage:

This is an example custom schema. You must assemble your game and players tables, which
are submitted to the library via a call like:

statCollection:sendCustom(schemaAuthKey, game, players)

The schemaAuthKey is important, and can only be obtained via site admins.

Come bug us in our IRC channel or get in contact via the site chatbox. http://getdotastats.com/#contact

]]

-- The schema version we are currently using
local schemaAuthKey = 'XXXXXXXXX' -- GET THIS FROM AN ADMIN ON THE SITE, THAT APPROVES YOUR SCHEMA

-- Listen for changes in the current state
ListenToGameEvent('game_rules_state_change', function(keys)
-- Grab the current state
    local state = GameRules:State_Get()

    if state >= DOTA_GAMERULES_STATE_POST_GAME then

        -- Build game array
        local game = {}
        table.insert(game, {
            game_duration = GameRules:GetGameTime,
            game_picks_num = tonumber(Options.getOption('lod', MAX_REGULAR, maxSkills))
        })


        -- Build players array
        local players = {}
        for i = 1, (PlayerResource:GetPlayerCount() or 1) do
            table.insert(players, {
                player_hero_id = PlayerResource:GetSelectedHeroID(i - 1),
                player_kills = PlayerResource:GetKills(i - 1),
                player_assists = PlayerResource:GetAssists(i - 1),
                player_deaths = PlayerResource:GetDeaths(i - 1)
            })
        end

        -- Send custom stats
        statCollection:sendCustom(schemaAuthKey, game, players)
    end
end, nil)