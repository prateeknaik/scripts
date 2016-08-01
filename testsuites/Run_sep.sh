#!/usr/bin/bash

sudo libreoffice --headless --convert-to csv Details.ods --outdir 

INPUT_FILE='Details.csv'
i=0
IFS=','
while read U P T C
do 
U1[$i]=$U
P1[$i]=$P
T1[$i]=$T
Choice[$i]=$C
i=$((i+1))
done <$INPUT_FILE

echo "username: $U1"
echo "password: $P1"
counter=0
j=0
while [ $j -lt $i ]
do
if [ ${Choice[j]} == "TRUE" ]
then
	echo "Current Testsuite: ${T1[j]}"
	for file in ${T1[j]}/*.js
	do
		if [ ! -d "Reports/${T1[j]}" ]
		then
			mkdir "Reports/${T1[j]}"
		fi
		echo $file
		sudo xvfb-run -a casperjs test --engine=slimerjs $file --username=$U1 --password=$P1 --url=http://127.0.0.1:8080/login.R --xunit=Reports/$file.xml
	done
	counter=$((counter+1))
fi
j=$((j+1));
done
if [ $counter == 0 ] 
then
	echo "No Testsuite selected....!!!! Please Select the testsuites from Details1.ods file...!!!! "
fi
