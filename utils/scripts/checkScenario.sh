
echo " --------------------------------";
echo " Testing your SmartContract .... ";
echo " --------------------------------";
printf "
 Test Summary : 
"
echo " ------------------";
./utils/smartpy-cli/SmartPy.sh test ./contract/pokemon.py ./test-build;
printf "
 Test Scenarios :
";
echo " -------------------"
cat ./test-build/AdvancedTest_interpreted/scenario-interpreter-log.txt;
printf "

"
