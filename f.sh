#!/usr/bin/env bash

while read w1 w2; do
	# echo "console.log('des ' + \$(el).find('$line').text();"
	echo "$w1: \${(\$(el).find('$w2').text()).trim()},"
done < tags

# while read line; do
# 	echo "console.log('des ' + \$(el).find('$line').text();"
# done < tags
