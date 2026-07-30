// Импортируем всё необходимое
import { Build, BuildBlocksSet, Teams, Damage, BreackGraph, Ui, Properties, GameMode, Spawns, room, Players, LeaderBoard, AreaPlayerTriggerService, Color } from 'pixel_combats/room';

// ===== 1. НАСТРОЙКИ КОМНАТЫ =====
room.PopupsEnable = true;
Damage.FriendlyFire = GameMode.Parameters.GetBool("FriendlyFire");
BreackGraph.OnlyPlayerBlocksDmg = GameMode.Parameters.GetBool("OnlyPlayerBlocksDmg");
BreackGraph.WeakBlocks = GameMode.Parameters.GetBool("LoosenBlocks");
BreackGraph.BreackAll = true;
Ui.GetContext().QuadsCount.Value = true;
Build.GetContext().BlocksSet.Value = BuildBlocksSet.AllClear;
Damage.GetContext().DamageOut.Value = false;

// Название режима
Properties.GetContext().GameModeName.Value = "🏗️ ПОЛИГОН";

// ===== 2. СОЗДАНИЕ КОМАНД =====
// Удаляем старые команды, если они есть
try { Teams.Remove("Red"); } catch(e) {}
try { Teams.Remove("Blue"); } catch(e) {}

// Создаем команды, только если соответствующие параметры включены
var red = GameMode.Parameters.GetBool("RedTeam");
var blue = GameMode.Parameters.GetBool("BlueTeam");

if (red || !red && !blue) {
    Teams.Add("Red", "🔴 Красные", new Color(1, 0, 0, 0));
    Teams.Get("Red").Spawns.SpawnPointsGroups.Add(2);
}
if (blue || !red && !blue) {
    Teams.Add("Blue", "🔵 Синие", new Color(0, 0, 1, 0));
    Teams.Get("Blue").Spawns.SpawnPointsGroups.Add(1);
}

// ===== 3. ОСНОВНЫЕ НАСТРОЙКИ =====
// Моментальный спавн
Spawns.GetContext().RespawnTime.Value = 0;

// Настройка инвентаря (лопата и блоки)
var roomInventory = Inventory.GetContext();
roomInventory.Main.Value = false;
roomInventory.Secondary.Value = false;
roomInventory.Melee.Value = true;
roomInventory.Explosive.Value = false;
roomInventory.Build.Value = true;
roomInventory.BuildInfinity.Value = true;

// Включаем инструменты строителя
Build.GetContext().Pipette.Value = true;
Build.GetContext().FloodFill.Value = true;
Build.GetContext().FillQuad.Value = true;
Build.GetContext().RemoveQuad.Value = true;
Build.GetContext().BalkLenChange.Value = true;
Build.GetContext().FlyEnable.Value = true;
Build.GetContext().SetSkyEnable.Value = true;
Build.GetContext().GenMapEnable.Value = true;
Build.GetContext().ChangeCameraPointsEnable.Value = true;
Build.GetContext().QuadChangeEnable.Value = true;
Build.GetContext().BuildModeEnable.Value = true;
Build.GetContext().CollapseChangeEnable.Value = true;
Build.GetContext().RenameMapEnable.Value = true;
Build.GetContext().ChangeMapAuthorsEnable.Value = true;
Build.GetContext().LoadMapEnable.Value = true;
Build.GetContext().ChangeSpawnsEnable.Value = true;
Build.GetContext().BuildRangeEnable.Value = true;

// ===== 4. ОБРАБОТКА ВХОДА ИГРОКА =====
Teams.OnRequestJoinTeam.add_Event(function(player, team) {
    team.Add(player);
});

Teams.OnPlayerChangeTeam.add_Event(function(player) {
    // Режим бога для твоего ID
    if (player.Id == "D31F98B53C846002") {
        player.Build.FlyEnable.Value = true;
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
    }
    player.Spawns.Spawn();
});

// ===== 5. ПРИВЕТСТВИЕ =====
Ui.GetContext().Hint.Value = "🏗️ Добро пожаловать в ПОЛИГОН! Выберите команду";

// ===== 6. (ОПЦИОНАЛЬНО) ПРОСТАЯ ЗОНА ДЛЯ ТЕСТА =====
try {
    var testZone = AreaPlayerTriggerService.Get("r");
    testZone.Tags = ["r"];
    testZone.Enable = true;
    testZone.OnEnter.add_Event(function(player, area) {
        player.Ui.Hint.Value = "✅ Ты зашёл в тестовую зону 'r'!";
        player.inventory.Main.Value = true;
        player.inventory.MainInfinity.Value = true;
    });
} catch(e) {
    // Если зоны нет на карте, просто игнорируем ошибку
}
