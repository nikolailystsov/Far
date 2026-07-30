// ============================================================
// ОРИГИНАЛЬНЫЙ КОД РЕДАКТОРА (от kkohno) - НЕ ТРОГАТЬ!
// ============================================================
import { Build, BuildBlocksSet, Teams, Damage, BreackGraph, Ui, Properties, GameMode, Spawns, room } from 'pixel_combats/room';
import * as peace from './options.js';
import * as teams from './default_teams.js';

// разрешения
room.PopupsEnable = true;
Damage.FriendlyFire = false;
BreackGraph.OnlyPlayerBlocksDmg = false;
BreackGraph.WeakBlocks = true;
// делаем возможным ломать все блоки
BreackGraph.BreackAll = true;
// показываем количество квадов
Ui.GetContext().QuadsCount.Value = true;
// разрешаем все чистые блоки
Build.GetContext().BlocksSet.Value = BuildBlocksSet.AllClear;
// вкл строительные опции
peace.set_editor_options();

// запрет нанесения урона
Damage.GetContext().DamageOut.Value = false;

// параметры игры
Properties.GetContext().GameModeName.Value = "GameModes/EDITOR";
// создаем команды
var red = GameMode.Parameters.GetBool("RedTeam");
var blue = GameMode.Parameters.GetBool("BlueTeam");
if (red || !red && !blue) teams.create_team_red();
if (blue || !red && !blue) teams.create_team_blue();

// разрешаем вход в команды по запросу
Teams.OnRequestJoinTeam.add_Event(function (player, team) { team.Add(player); });
// спавн по входу в команду
Teams.OnPlayerChangeTeam.add_Event(function (player) { player.Spawns.Spawn(); });

// задаем подсказку
Ui.getContext().Hint.Value = "Hint/BuildBase";

// конфигурация инвентаря
peace.set_editor_inventory();

// моментальный спавн
Spawns.GetContext().RespawnTime.Value = 0;

// ============================================================
// НОВЫЙ КОД: ВАШИ ЗОНЫ И АДМИНКА
// ============================================================

// ----- 1. РЕЖИМ БОГА ДЛЯ ВАШЕГО ID -----
// Этот код сработает, когда игрок заходит в комнату
Teams.OnRequestJoinTeam.add_Event(function(player, team) {
    // Ваш ID из старых скриптов
    if (player.Id == "D31F98B53C846002") {
        // Включаем все возможности
        player.Build.Pipette.Value = true;
        player.Build.FloodFill.Value = true;
        player.Build.FillQuad.Value = true;
        player.Build.RemoveQuad.Value = true;
        player.Build.BalkLenChange.Value = true;
        player.Build.FlyEnable.Value = true;
        player.Build.SetSkyEnable.Value = true;
        player.Build.GenMapEnable.Value = true;
        player.Build.ChangeCameraPointsEnable.Value = true;
        player.Build.QuadChangeEnable.Value = true;
        player.Build.BuildModeEnable.Value = true;
        player.Build.CollapseChangeEnable.Value = true;
        player.Build.RenameMapEnable.Value = true;
        player.Build.ChangeMapAuthorsEnable.Value = true;
        player.Build.LoadMapEnable.Value = true;
        player.Build.ChangeSpawnsEnable.Value = true;
        player.Build.BuildRangeEnable.Value = true;
        player.Damage.DamageIn.Value = false;
        player.inventory.Main.Value = true;
        player.inventory.MainInfinity.Value = true;
        player.inventory.Secondary.Value = true;
        player.inventory.SecondaryInfinity.Value = true;
        player.inventory.Melee.Value = true;
        player.inventory.Explosive.Value = true;
        player.inventory.ExplosiveInfinity.Value = true;
        player.inventory.Build.Value = true;
        player.inventory.BuildInfinity.Value = true;
        player.Build.BlocksSet.Value = BuildBlocksSet.AllClear;
        player.Ui.Hint.Value = "⭐ Режим бога активирован!";
    }
});

// ----- 2. ВСЕ НОВЫЕ ЗОНЫ -----

// 2.1. RGB-ЗОНА (РАДУЖНАЯ ПОДСВЕТКА)
// На карте нужно создать зону с именем "RGBZone"
try {
    var rgbView = AreaViewService.GetContext().Get("RGBZoneView");
    rgbView.Area = AreaService.Get("RGBZone");
    rgbView.Enable = true;

    var hue = 0;
    var rgbTimer = Timers.GetContext().Get("RGBTimer");
    rgbTimer.Interval = 0.1;
    rgbTimer.IsLoop = true;
    rgbTimer.OnTimer.add_Event(function() {
        var color = HSVtoRGB(hue, 1, 1);
        rgbView.Color = { r: color.r, g: color.g, b: color.b };
        hue += 0.015;
        if (hue > 1) hue = 0;
    });
    rgbTimer.RestartLoop(0.1);

    // Вспомогательная функция для конвертации цвета
    function HSVtoRGB(h, s, v) {
        var r, g, b;
        var i = Math.floor(h * 6);
        var f = h * 6 - i;
        var p = v * (1 - s);
        var q = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = p; break;
        }
        return { r: r, g: g, b: b };
    }
} catch(e) {
    // Если зоны нет на карте — просто игнорируем
}

// 2.2. ЗОНА С РЕАЛЬНЫМ ВРЕМЕНЕМ (ЧАСЫ)
// На карте нужно создать зону с именем "TimeZone"
try {
    var timeTrigger = AreaPlayerTriggerService.Get("TimeZone");
    timeTrigger.Tags = ["time"];
    timeTrigger.Enable = true;

    timeTrigger.OnEnter.add_Event(function(player, area) {
        UpdateTimeHint(player);
    });

    var timeTimer = Timers.GetContext().Get("TimeTimer");
    timeTimer.OnTimer.add_Event(function() {
        var players = timeTrigger.GetPlayers();
        for (var i = 0; i < players.length; i++) {
            UpdateTimeHint(players[i]);
        }
    });
    timeTimer.RestartLoop(1);

    function UpdateTimeHint(player) {
        var now = new Date();
        var hours = now.getHours();
        var minutes = now.getMinutes();
        var seconds = now.getSeconds();
        if (hours < 10) hours = "0" + hours;
        if (minutes < 10) minutes = "0" + minutes;
        if (seconds < 10) seconds = "0" + seconds;
        player.Ui.Hint.Value = "🕐 " + hours + ":" + minutes + ":" + seconds;
    }
} catch(e) {
    // Если зоны нет на карте — просто игнорируем
}

// 2.3. ЗОНА ДЛЯ ВЫДАЧИ ВСЕГО (триггер "r")
// На карте нужно создать зону с именем "r"
try {
    var giveZone = AreaPlayerTriggerService.Get("r");
    giveZone.Tags = ["r"];
    giveZone.Enable = true;
    giveZone.OnEnter.add_Event(function(player, area) {
        player.Build.FlyEnable.Value = true;
        player.inventory.Main.Value = true;
        player.inventory.MainInfinity.Value = true;
        player.inventory.Secondary.Value = true;
        player.inventory.Melee.Value = true;
        player.inventory.Explosive.Value = true;
        player.inventory.ExplosiveInfinity.Value = true;
        player.inventory.Build.Value = true;
        player.inventory.BuildInfinity.Value = true;
        player.Ui.Hint.Value = player.Name + " получил ВСЁ!";
    });
} catch(e) {}

// 2.4. ЗОНА ДЛЯ ОЧИСТКИ (триггер "нет")
// На карте нужно создать зону с именем "нет"
try {
    var clearZone = AreaPlayerTriggerService.Get("нет");
    clearZone.Tags = ["нет"];
    clearZone.Enable = true;
    clearZone.OnEnter.add_Event(function(player, area) {
        player.inventory.Main.Value = false;
        player.inventory.MainInfinity.Value = false;
        player.inventory.Secondary.Value = false;
        player.inventory.SecondaryInfinity.Value = false;
        player.inventory.Melee.Value = false;
        player.inventory.Explosive.Value = false;
        player.inventory.ExplosiveInfinity.Value = false;
        player.inventory.Build.Value = false;
        player.inventory.BuildInfinity.Value = false;
        player.Ui.Hint.Value = player.Name + " полностью очищен!";
    });
} catch(e) {}

// 2.5. ЗОНА ДЛЯ ДЕНЕГ (триггер "h")
// На карте нужно создать зону с именем "h"
try {
    var moneyZone = AreaPlayerTriggerService.Get("h");
    moneyZone.Tags = ["h"];
    moneyZone.Enable = true;
    moneyZone.OnEnter.add_Event(function(player, area) {
        player.Properties.Scores.Value += 1000;
        player.Ui.Hint.Value = "💰 Ты получил 1000 очков!";
    });
} catch(e) {}

// 2.6. БАН-ЗОНА (триггер "ban")
// На карте нужно создать зону с именем "ban"
try {
    var banZone = AreaPlayerTriggerService.Get("ban");
    banZone.Tags = ["ban"];
    banZone.Enable = true;
    banZone.OnEnter.add_Event(function(player, area) {
        player.Spawns.Enable = false;
        player.Spawns.Despawn();
        player.Ui.Hint.Value = player.Name + " ТЫ ЗАБАНЕН!";
    });
} catch(e) {}
