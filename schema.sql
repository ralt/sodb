create table quote (
    id serial primary key,
    created timestamp with timezone not null,
    text text not null
);
