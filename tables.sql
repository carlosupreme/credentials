create schema if not exists credenciales;
use credenciales;

drop table if exists users;
create table users(
    id varchar(255) primary key not null,
    email varchar(255) unique not null,
    password varchar(255) not null,
    is_admin tinyint not null,
    photo varchar(255) not null,
    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

CREATE INDEX idx_email ON users(email);

drop table if exists seasons;
create table seasons(
    id varchar(255) primary key not null,
    name varchar(255) not null,
    startAt timestamp,
    endsAt timestamp,
    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

drop table if exists teams;
create table teams(
    id varchar(255) primary key not null,
    name varchar(255) not null,
    logo varchar(255) not null,
    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp
);

create table attendance_lists(
    id varchar(255) primary key not null,
    game_id varchar(255) not null,
    user_id varchar(255) not null,
    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp,
    foreign key (game_id) references games(id),
    foreign key (user_id) references users(id),
);

drop table if exists games;
create table games(
    id varchar(255) primary key not null,
    attendanceListId varchar(255) not null,
    name varchar(255) not null,
    homeTeamId varchar(255) not null,
    awayTeamId varchar(255) not null,
    homeTeamScore int not null default 0,
    awayTeamScore int not null default 0
);

drop table if exists players;
create table players(
    id varchar(255) primary key not null,
    user_id varchar(255) not null,
    fullName varchar(255) not null,
    team_id varchar(255) not null,
    createdAt timestamp default current_timestamp,
    updatedAt timestamp default current_timestamp on update current_timestamp,
    foreign key (user_id) references users(id),
    foreign key (team_id) references teams(id)
);

drop table if exists team_players;
CREATE TABLE team_players (
    team_id varchar(255) not null,
    player_id varchar(255) not null,
    FOREIGN KEY (team_id) REFERENCES teams(team_id),
    FOREIGN KEY (player_id) REFERENCES players(player_id),
    PRIMARY KEY (team_id, player_id)
);

drop table if exists season_teams;
CREATE TABLE season_teams (
    id varchar(255) primary key not null,
    season_id varchar(255) not null,
    team_id varchar(255) not null,
    FOREIGN KEY (season_id) REFERENCES seasons(season_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id),
);
