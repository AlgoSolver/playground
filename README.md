# playground
  ![Success](https://img.shields.io/badge/GitHub_Actions-CI/CD-success.svg?logo=github&logoColor=white)
  
the API for running code submitted by user.
currently supports C++ only

# calling the API 
send post request to http://localhost:3000/api/runCode with Body as JSON  
attributes :  
  lang => the language of the source code currently we support only "C++"  
  timeLimit => the limit on time to run your code in seconds.  
  sourceCode => the source code you wan't to run.  
  input => the input to the program.  
  
response JSON object with the folowing atributes:
  codeStatus: "Accepted" or "Compilation Error!" or "Run Time Error!" or "Time Limit Exceeded!"
  other attributes only if codeStatus is "Accepted"
  output => the output of you program.
  usedTime => the time your program used in ms.
  
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
  # Production
  [AlgoSolver-playground](https://algosolver-playground.herokuapp.com/) 
