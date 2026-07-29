// входим в команду по запросу и сразу спавнимся
Teams.OnRequestJoinTeam.Add(function(player, team) { team.Add(player); });
Teams.OnPlayerChangeTeam.Add(function(player) { player.Spawns.Spawn(); });

// создаем 2 команды и группы спавна
Teams.Add("Blue", "Teams/Blue", { b: 1 });
Teams.Add("Red", "Teams/Red", { r: 1 });
Teams.Get("Blue").Spawns.SpawnPointsGroups.Add(1);
Teams.Get("Red").Spawns.SpawnPointsGroups.Add(2);

// включаем моментальный респавн
Spawns.GetContext().RespawnTime.Value = 0;

// простая подсказка
Ui.GetContext().Hint.Value = "Hint/AttackEnemies";
