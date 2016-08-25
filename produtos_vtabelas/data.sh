#!/usr/bin/env bash

mysql --defaults-file=/home/douglasmg7/.my.cnf -t -h hardplus.com.br hardplu1_loja << EOF
# use test;
# show tables;
# desc produtos_vtabela;
# select count(*) from produtos_vtabela;
select * from produtos_vtabela limit 50;
EOF
