create database chat_app;

create table roles (
    id serial primary key,
    name varchar(255) not null
);

create table users (
    id serial primary key,
    name varchar(255) not null,
    phone_number varchar(255) not null,
    dob date not null,
    address varchar(255),
    email varchar(255) not null unique,
    password varchar(255) not null,
    activation_code varchar(255),
    --password_reset_code varchar(255), Because new password will be sent to user's email, so we don't need this field anymore
    is_active boolean default false,
    created_at timestamp default current_timestamp,
    updated_at timestamp,
    role_id int not null
);

create table rooms(
    id serial primary key,
    name varchar(255) not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp,
    creator_id int not null
);

create table room_users(
    room_id int not null,
    user_id int not null,
    primary key (room_id, user_id)
);

create table files(
    id serial primary key,
    name varchar(255) not null,
    url varchar(255) not null,
    owner_id int not null,
    room_id int not null,
    created_at timestamp default current_timestamp
);

create table refresh_tokens(
    id serial primary key,
    user_id int not null,
    token varchar(255) not null,
    expires_at timestamp not null
);

create table messages(
    id serial primary key,
    content text not null,
    sender_id int not null,
    room_id int not null,
    pinned_at timestamp default current_timestamp,
    created_at timestamp default current_timestamp
);

create table message_status(
    user_id int,
    message_id int,
    status varchar(255),
    primary key(user_id, message_id)
);

alter table users add constraint fk_role_id foreign key (role_id) references roles(id);
alter table rooms add constraint fk_creator_id foreign key (creator_id) references users(id);
alter table room_users add constraint fk_room_id foreign key (room_id) references rooms(id);
alter table room_users add constraint fk_user_id foreign key (user_id) references users(id);
alter table files add constraint fk_owner_id foreign key (owner_id) references users(id);
alter table files add constraint fk_room_id foreign key (room_id) references rooms(id);
alter table refresh_tokens add constraint fk_user_id foreign key (user_id) references users(id);
alter table messages add constraint fk_sender_id foreign key (sender_id) references users(id);
alter table messages add constraint fk_room_id foreign key (room_id) references rooms(id);
alter table message_status add constraint fk_message_id foreign key (message_id) references messages(id);
alter table message_status add constraint fk_user_id foreign key (user_id) references users(id);
