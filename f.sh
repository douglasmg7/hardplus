#!/usr/bin/env bash

while read line; do
	echo console.log\(\'des: \' + \$\(el\).find\(\'$line\'\).text\(\)\);
	# echo console.log(\'des: \' + \$(el).find(\'$line\').text());
done < tags
