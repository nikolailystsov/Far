import { Build, BuildBlocksSet, Teams, Damage, BreackGraph, Ui, Properties, GameMode, Spawns, room, Players, LeaderBoard, AreaPlayerTriggerService } from 'pixel_combats/room';

// Импортируем наши модули
import * as teams from './default_teams.js';
import * as options from './options.js';
import * as zones from './zones.js';

// ===== 1. НАСТРОЙКИ КОМНАТЫ =====
room.PopupsEnable = true;
Damage.FriendlyFire = GameMode.Parameters.GetBool("FriendlyFire");
BreackGraph.OnlyPlayerBlocksDmg = GameMode.Parameters.GetBool("OnlyPlayerBlocksDmg");
BreackGraph.WeakBlocks = GameMode.Parameters.GetBool("LoosenBlocks");
BreackGraph.BreackAll = true;
Ui.GetContext().QuadsCount.Value = true;
Build.GetContext().BlocksSet.Value = BuildBlocksSet.AllClear;

// Включаем все инструменты строителя
options.setEditorOptions();

// Запрет урона
Damage.GetContext().DamageOut.Value = false;

// Название режима
Properties.GetContext().GameModeName.Value = "mode.name";

// ===== 2. СОЗДАНИЕ КОМАНД =====
var red = GameMode.Parameters.GetBool("RedTeam");
var blue = GameMode.Parameters.GetBool("BlueTeam");
if (red || !red && !blue) teams.createTeamRed();
if (blue || !red && !blue) teams.createTeamBlue();

// ===== 3. НАСТРОЙКА ИНВЕНТАРЯ =====
options.setEditorInventory();

// Моментальный спавн
Spawns.GetContext().RespawnTime.Value = 0;

// ===== 4. ВХОД В КОМАНДУ И СПАВН =====
Teams.OnRequestJoinTeam.add_Event(function(player, team) {
    team.Add(player);
});

Teams.OnPlayerChangeTeam.add_Event(function(player) {
    options.giveGodMode(player); // Режим бога для админа
    player.Spawns.Spawn();
});

// ===== 5. НАСТРОЙКА ВСЕХ ЗОН =====
zones.setupRGBZone();
zones.setupTimeZone();
zones.setupGiveZone();
zones.setupClearZone();
zones.setupMoneyZone();
zones.setupBanZone();

// ===== 6. ЛИДЕРБОРД =====
Players.OnSpawn.add_Event(function(player) {
    player.Properties.Get("Kills").Value = 0;
    player.Properties.Get("Deaths").Value = 0;
    player.Properties.Get("Scores").Value = 0;
    player.Properties.Get("ZoneEnters").Value = 0;
});

// Счётчик заходов в зоны
AreaPlayerTriggerService.OnAnyEnter.add_Event(function(player, area) {
    player.Properties.Get("ZoneEnters").Value += 1;
});

LeaderBoard.PlayerLeaderBoardValues = [
    {
        Value: "Kills",
        DisplayName: "Statistics/Kills",
        ShortDisplayName: "Statistics/KillsShort"
    },
    {
        Value: "Deaths",
        DisplayName: "Statistics/Deaths",
        ShortDisplayName: "Statistics/DeathsShort"
    },
    {
        Value: "Scores",
        DisplayName: "Statistics/Scores",
        ShortDisplayName: "Statistics/ScoresShort"
    },
    {
        Value: "ZoneEnters",
        DisplayName: "Statistics/ZoneEnters",
        ShortDisplayName: "Statistics/ZoneEntersShort"
    }
];

// Сортировка по очкам
LeaderBoard.PlayersWeightGetter.set_Event(function(player) {
    return player.Properties.Get("Scores").Value;
});

// ===== 7. СЧЁТЧИКИ УБИЙСТВ И СМЕРТЕЙ =====
Damage.OnKill.add_Event(function(player, killed) {
    if (killed.Team != null && killed.Team != player.Team) {
        ++player.Properties.Kills.Value;
        player.Properties.Scores.Value += 100;
    }
});

Damage.OnDeath.add_Event(function(player) {
    ++player.Properties.Deaths.Value;
});

// ===== 8. ПРИВЕТСТВИЕ =====
Ui.GetContext().Hint.Value = "Hint/Welcome";
