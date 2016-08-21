#!/usr/bin/env bash
mysql --defaults-file=/home/douglasmg7/.my.cnf -t -h hardplus.com.br hardplu1_loja << EOF

# use test;
# show tables;
desc produtos_vtabela;
EOF