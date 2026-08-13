-- 1. Crear la base de datos
IF DB_ID('SoccerDB') IS NULL
BEGIN
    CREATE DATABASE SoccerDB;
END
GO

USE SoccerDB;
GO

-- Limpieza previa 
IF OBJECT_ID('LeagueTeam', 'U') IS NOT NULL DROP TABLE LeagueTeam;
IF OBJECT_ID('League', 'U') IS NOT NULL DROP TABLE League;
IF OBJECT_ID('Team', 'U') IS NOT NULL DROP TABLE Team;
GO

-- 2. Tabla LEAGUE
CREATE TABLE League
(
    Id        INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    Name      VARCHAR(50) NOT NULL,
    Country   VARCHAR(50) NOT NULL,
    StartDate DATETIME    NOT NULL DEFAULT GETDATE(),
    EndDate   DATETIME    NOT NULL DEFAULT GETDATE(),
    Enabled   BIT         NOT NULL DEFAULT 1,

    CONSTRAINT CK_League_Name    CHECK (LEN(LTRIM(RTRIM(Name))) BETWEEN 2 AND 50),
    CONSTRAINT CK_League_Country CHECK (LEN(LTRIM(RTRIM(Country))) BETWEEN 2 AND 50),
    CONSTRAINT CK_League_Dates   CHECK (EndDate >= StartDate)
);

-- 3. Tabla TEAM
CREATE TABLE Team
(
    Id              INT         NOT NULL IDENTITY(1,1) PRIMARY KEY,
    Name            VARCHAR(50) NOT NULL,
    Country         VARCHAR(50) NOT NULL,
    PlayersQuantity INT         NOT NULL,
    Enabled         BIT         NOT NULL DEFAULT 1,

    CONSTRAINT CK_Team_Name            CHECK (LEN(LTRIM(RTRIM(Name))) BETWEEN 2 AND 50),
    CONSTRAINT CK_Team_Country         CHECK (LEN(LTRIM(RTRIM(Country))) BETWEEN 2 AND 50),
    CONSTRAINT CK_Team_PlayersQuantity CHECK (PlayersQuantity BETWEEN 11 AND 22)
);

-- 4. Tabla intermedia LEAGUETEAM (relacion muchos a muchos)
CREATE TABLE LeagueTeam
(
    LeagueId INT NOT NULL,
    TeamId   INT NOT NULL,

    CONSTRAINT PK_LeagueTeam PRIMARY KEY (LeagueId, TeamId),
    CONSTRAINT FK_LeagueTeam_League FOREIGN KEY (LeagueId) REFERENCES League(Id),
    CONSTRAINT FK_LeagueTeam_Team   FOREIGN KEY (TeamId)   REFERENCES Team(Id)
);

-- 5. Datos de prueba
INSERT INTO League (Name, Country, StartDate, EndDate, Enabled) VALUES
('UEFA Champions League', 'Europe', '2026-09-16', '2027-06-05', 1),
('La Liga',             'Spain',   '2026-08-15', '2027-05-23', 1),
('Premier League',      'England', '2026-08-08', '2027-05-23', 1);

INSERT INTO Team (Name, Country, PlayersQuantity, Enabled) VALUES
('Real Madrid',        'Spain',   22, 1),
('AC Milan',           'Italy',   22, 1),
('Liverpool',          'England', 20, 1),
('Bayern Munich',      'Germany', 22, 1),
('Barcelona',          'Spain',   21, 1),
('Manchester United',  'England', 21, 1),
('Inter',              'Italy',   20, 1),
('Chelsea',            'England', 19, 1),
('Manchester City',    'England', 22, 1),
('Borussia Dortmund',  'Germany', 20, 1);

INSERT INTO LeagueTeam (LeagueId, TeamId) VALUES
-- UEFA Champions League (Id 1)
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 7), (1, 9),
-- La Liga (Id 2)
(2, 1), (2, 5),
-- Premier League (Id 3)
(3, 3), (3, 6), (3, 8), (3, 9);
GO