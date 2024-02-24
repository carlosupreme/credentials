drop schema if exists credenciales;
create schema credenciales;
use credenciales;

create table users(
    id varchar(255) primary key not null,
    email varchar(255) unique not null,
    password varchar(255) not null,
    is_admin tinyint not null 
);

CREATE INDEX idx_email ON users(email);

create table seasons(
    id varchar(255) primary key not null,
    name varchar(255) not null,
    start_date date,
    end_date date
);

create table teams(
    id varchar(255) primary key not null,
    season_id varchar(255) not null,
    name varchar(255) not null,
    logo varchar(255) not null,
    foreign key (season_id) references seasons(id)
);

create table matches(
    id varchar(255) primary key not null,
    season_id varchar(255) not null,
    home_team_id varchar(255) not null,
    away_team_id varchar(255) not null,
    attendance_list_id varchar(255) not null,
    name varchar(255) not null,
    home_score int not null default 0,
    away_score int not null default 0,
    date timestamp not null,
    foreign key (season_id) references seasons(id),
    foreign key (home_team_id) references teams(id),
    foreign key (away_team_id) references teams(id),
    foreign key (attendance_list_id) references attendance_lists(id)
);

create table player_team_details(
    id varchar(255) primary key not null,
    team_id varchar(255),
    position varchar(255),
    jersey_number int,
    foreign key (team_id) references teams(id)
);

create table players(
    id varchar(255) primary key not null,
    user_id varchar(255) not null,
    team_details varchar(255) not null,
    full_name varchar(255) not null,
    age int not null,
    photo varchar(255) not null,
    foreign key (user_id) references users(id),
    foreign key (team_details) references player_team_details(id)
);

create table attendance_lists(
    id varchar(255) primary key not null,
    match_id varchar(255) not null,
    player_id varchar(255) not null,
    assist tinyint not null default 0,
    foreign key (player_id) references players(id),
    foreign key (match_id) references matches(id)
);