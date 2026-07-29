import { Build, Inventory, Damage, BreackGraph, Ui, BuildBlocksSet } from 'pixel_combats/room';

// Настройка инвентаря для редактора
export function setEditorInventory() {
    var roomInventory = Inventory.GetContext();
    roomInventory.Main.Value = false;
    roomInventory.Secondary.Value = false;
    roomInventory.Melee.Value = true;
    roomInventory.Explosive.Value = false;
    roomInventory.Build.Value = true;
    roomInventory.BuildInfinity.Value = true;
}

// Включение всех инструментов строителя
export function setEditorOptions() {
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
}

// Настройка режима "Режим бога" для админа
export function giveGodMode(player) {
    var adminID = "D31F98B53C846002";
    if (player.Id == adminID) {
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
    }
}
