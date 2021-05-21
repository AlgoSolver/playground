# playground
  [![CI](https://github.com/AlgoSolver/playground/actions/workflows/node.js.yml/badge.svg)](https://github.com/AlgoSolver/playground/actions/workflows/node.js.yml)  [![Docker Image CI/CD](https://github.com/AlgoSolver/playground/actions/workflows/docker-image.yml/badge.svg)](https://github.com/AlgoSolver/playground/actions/workflows/docker-image.yml)
  
***The API for running code submitted by user, currently supports C++ only***

# calling the API 
***send*** post request to http://localhost:3000/api/runCode with Body as JSON  
- Attributes:  
  1. lang => the language of the source code currently we support only "C++"  
  2. timeLimit => the limit on time to run your code in seconds.  
  3. sourceCode => the source code you wan't to run.  
  4. input => the input to the program.  
  
***response*** JSON object with the folowing 
- Atributes:
  1. codeStatus: "Accepted" or "Compilation Error!" or "Run Time Error!" or "Time Limit Exceeded!"
  2. other attributes only if codeStatus is "Accepted"
  3. output => the output of you program.
  4. usedTime => the time your program used in ms.
  
# example request body: 
```json
{
    "lang": "C++",
    "timeLimit" : 10,
    "sourceCode": "#include<iostream> \n using namespace std; int main(){ long long n, k, ans = 0; cin >> n >> k; for(long long i = 1; i <= n; i++) ans += (i % k) == 0; cout << ans << endl;   return 0;}",
    "input" : "5000 10" 
}
```
  
# response body :
```json
{
    "codeStatus": "Accepted",
    "output": "500\n",
    "usedTime": 5
}
```

# running checker code
send post request to http://localhost:3000/api/runChecker with body containing the checker source code, input, userOutput, juryOutput
note source code should read input, userOutput, juryOutput from files with same name.
response will be JSON object
codeStatus: "Accepted" or "Compilation Error!" or "Run Time Error!" or "Time Limit Exceeded!"
response will be the same as for calling the runCode api.

# Example Checker Request
```json
{
    "lang": "C++",
    "sourceCode": "#include<bits/stdc++.h>\nusing namespace std;\nvector < string > readFile(const string &fileName){\n ifstream file(fileName);\n  string s;\n vector < string > lines;\n  while(file >> s){\n     lines.push_back(s);\n   }\n return lines;\n}\n\nint main(){\n   vector < string > jury = readFile(\"juryOutput\");\n    vector < string > user = readFile(\"userOutput\");\n    if(jury == user){\n     cout << \"Accepted\";\n }\n else{\n     cout << \"WA\";\n }\n   return 0;\n}",
    "input" : "5",
    "userOutput" : "1\n2\n3\n4\n5",
    "juryOutput" : "1\n2\n3\n4\n7"
}
```

#Response Body 
```json
{
    "codeStatus": "Accepted",
    "output": "WA",
    "usedTime": 4
}
```

# Production
  [AlgoSolver-playground](https://algosolver-playground.herokuapp.com/)
  ### Run Docker
  ```
  ./run_docker.sh
  ```
***After Running Container You Should Listening At*** [http://0.0.0.0:1234/](http://0.0.0.0:1234/)
