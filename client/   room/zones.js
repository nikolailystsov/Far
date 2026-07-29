import { AreaViewService, AreaService, AreaPlayerTriggerService, Timers } from 'pixel_combats/room';

// ===== 1. RGB-ЗОНА (РАДУЖНАЯ ПОДСВЕТКА) =====
export function setupRGBZone() {
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
}

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

// ===== 2. ЗОНА С РЕАЛЬНЫМ ВРЕМЕНЕМ (ЧАСЫ) =====
export function setupTimeZone() {
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
}

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

// ===== 3. ЗОНА ДЛЯ ВЫДАЧИ ВСЕГО =====
export function setupGiveZone() {
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
}

// ===== 4. ЗОНА ДЛЯ ОЧИСТКИ =====
export function setupClearZone() {
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
}

// ===== 5. ЗОНА ДЛЯ ДЕНЕГ =====
export function setupMoneyZone() {
    var moneyZone = AreaPlayerTriggerService.Get("h");
    moneyZone.Tags = ["h"];
    moneyZone.Enable = true;
    moneyZone.OnEnter.add_Event(function(player, area) {
        player.Properties.Scores.Value += 1000;
        player.Ui.Hint.Value = "💰 Ты получил 1000 очков!";
    });
}

// ===== 6. БАН-ЗОНА =====
export function setupBanZone() {
    var banZone = AreaPlayerTriggerService.Get("ban");
    banZone.Tags = ["ban"];
    banZone.Enable = true;
    banZone.OnEnter.add_Event(function(player, area) {
        player.Spawns.Enable = false;
        player.Spawns.Despawn();
        player.Ui.Hint.Value = player.Name + " ТЫ ЗАБАНЕН!";
    });
}
