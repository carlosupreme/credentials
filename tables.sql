drop schema if exists credenciales;
create schema credenciales;
use credenciales;

create table users(
    id varchar(255) primary key not null,
    email varchar(255) unique not null,
    password varchar(255) not null,
    is_admin tinyint not null,
    photo varchar(255) not null
);

CREATE INDEX idx_email ON users(email);

create table seasons(
    id varchar(255) primary key not null,
    name varchar(255) not null,
    start_at timestamp,
    ends_at timestamp
);

create table teams(
    id varchar(255) primary key not null,
    season_id varchar(255) not null,
    name varchar(255) not null,
    logo varchar(255) not null,
    foreign key (season_id) references seasons(id)
);

create table games(
    id varchar(255) primary key not null,
    season_id varchar(255) not null,
    name varchar(255) not null,
    homeTeamId varchar(255) not null,
    awayTeamId varchar(255) not null,
    homeTeamScore int not null default 0,
    awayTeamScore int not null default 0,
    date timestamp not null,
    foreign key (season_id) references seasons(id),
    foreign key (homeTeamId) references teams(id),
    foreign key (awayTeamId) references teams(id)
);

create table players(
    id varchar(255) primary key not null,
    user_id varchar(255) not null,
    team_id varchar(255) not null,
    fullName varchar(255) not null,
    jerseyNumber int not null,
    foreign key (user_id) references users(id),
    foreign key (team_id) references teams(id)
);

create table attendance_lists(
    id varchar(255) primary key not null,
    game_id varchar(255) not null,
    player_id varchar(255) not null,
    foreign key (game_id) references games(id),
    foreign key (player_id) references players(id)
);