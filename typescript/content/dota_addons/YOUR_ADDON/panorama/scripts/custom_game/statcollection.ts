interface IClientCheckInArgs {
    modID: string;
    matchID: string;
    schemaVersion: string;
}

function OnClientCheckIn(args: IClientCheckInArgs): void {
    const playerInfo = Game.GetLocalPlayerInfo();
    let hostInfo = 0;
    if (playerInfo) {
        hostInfo = playerInfo.player_has_host_privileges ? 1 : 0;
    }

    const payload = {
        modIdentifier: args.modID,
        steamID32: GetSteamID32(),
        isHost: hostInfo,
        matchID: args.matchID,
        schemaVersion: args.schemaVersion,
    };

    $.Msg('Sending: ', payload);

    $.AsyncWebRequest('https://api.getdotastats.com/s2_check_in.php',
        {
            type: 'POST',
            data: {payload: JSON.stringify(payload)},
            success: (data: any) => {
                $.Msg('GDS Reply: ', data);
            },
        });
}

function GetSteamID32(): string {
    const playerInfo = Game.GetPlayerInfo(Game.GetLocalPlayerID());

    const steamID64 = playerInfo.player_steamid;
    const steamIDPart = Number(steamID64.substring(3));
    const steamID32 = String(steamIDPart - 61197960265728);

    return steamID32;
}

function Print(msg: {content: string}): void {
    $.Msg(msg.content);
}

(() => {
    $.Msg("StatCollection Client Loaded");

    GameEvents.Subscribe("statcollection_client", OnClientCheckIn);
    GameEvents.Subscribe("statcollection_print", Print);
})();
