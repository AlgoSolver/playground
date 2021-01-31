const express = require("express");
const app = express();
app.use(express.json());
const Joi = require("joi");
const fs = require("fs");
const util = require("util");
const exec = util.promisify(require('child_process').exec);
const writeFile = util.promisify(fs.writeFile);

function validateSubmission(body) {
    const schema = Joi.object({
        lang: Joi.string().equal("C++").required(),// programming lanugage initially we support only C++
        timeLimit: Joi.number().min(.5).max(10).required(),// the timelimit to run code in seconds
        memoryLimit: Joi.number().min(1024).max(1024*1024), // number of KBs maximum is 1G isn't supported initially
        sourceCode: Joi.string().max(100000).required(), // the source code to run
        input: Joi.string().max(1000000).required()// the input to the program
    });
    return schema.validate(body);
}

function validateChecker(body) {
    const schema = Joi.object({
        lang: Joi.string().equal("C++").required(),// programming lanugage initially we support only C++
        timeLimit: Joi.number().min(.5).max(10).required(),// the timelimit to run code in seconds
        memoryLimit: Joi.number().min(1024).max(1024*1024), // number of KBs maximum is 1G isn't supported initially
        sourceCode: Joi.string().max(100000).required(), // the source code to run
        input: Joi.string().max(1000000).required(),// the input to the program
        // all obove is the same as problems.
        userOutput: Joi.string().max(1000000).required(),// the answer from user
        juryOutput: Joi.string().max(1000000).required(),// the expected answer from jury
    });
}

let countSubmissions = 0;
const submissionsDirectory = "submissions/";

if(!fs.existsSync(submissionsDirectory))// create a directory to store submissions
    fs.mkdirSync(submissionsDirectory);


async function runCPPCode(sourceCode, input, timeLimit, memoryLimit = 512){//memory limit is not handled yet
    const mySubmission = countSubmissions++;// current submission number not same as code ID
    const myDirectory = `${submissionsDirectory}${mySubmission}/`;// the directory of storing submission data
    const codePath = `${myDirectory + mySubmission}.cpp`;
    const programPath = `${myDirectory + mySubmission}`; 
    const inputFilePath = `${myDirectory + mySubmission}.in`;

    if(!fs.existsSync(myDirectory))// create the directory to run my code
        fs.mkdirSync(myDirectory);

    try{
        await writeFile(codePath, sourceCode);// write the code to codePath
        await writeFile(inputFilePath, input);// write input to input path
    }
    catch(err){
        if(err){
            console.error(err);// log the error on the system
            throw err;
        }
    }

    try{
        // Compile the C++ Code with a maximum of 3 secnods in compilation
        await exec(`timeout 3 g++ ${codePath} -o ${programPath}`);// compile
    }
    catch(err) {
        if(err){
            // status is 200 as no errors occured
            return {codeStatus : "Compilation Error!"};
        }
    }

    const time_before = Date.now();
    // give extra .5 second to make sure that the exit was made by TLE not RTE
    try{
        console.log("Time limit :", timeLimit);
        const {stdout} = await exec(`timeout ${parseFloat(timeLimit) + .5} ./${programPath} < ${inputFilePath}`);
        const time_after = Date.now();
        // used time computation is not very accurate but ok for now, should be updated in the future.
        const used_time = (time_after - time_before);
        // used time is in ms while timeLimit is in seconds
        if(used_time > timeLimit * 1000){
            console.log("used time :", used_time);
            return {codeStatus: "Time Limit Exceeded!"};
        }
        return {codeStatus : "Accepted", output : stdout, usedTime : used_time};
        // we should decide whether we will remove the sumbission code after or not
    }
    catch(err){
        const time_after = Date.now();
        const used_time = (time_after - time_before);
        if(used_time > timeLimit * 1000){
            return {codeStatus: "Time Limit Exceeded!"};
        }
        else {
            return {codeStatus: "Run Time Error!"};
        }
    }
}

app.post("/api/runCode", async (req, res) => {
    try{
        const {error} = validateSubmission(req.body);
        if(error){
            return res.status(400).send(error.details[0].message);
        }
        const results = await runCPPCode(req.body.sourceCode, req.body.input, req.body.timeLimit);
        res.status(200).send(results);
    }

    catch(err){
        if(err){
            console.error(err);
            res.status(500).send({message : "Sorry We are facing an internal error! please try again later"});
        }
    }
});

const PORT = process.env.PORT || 3000;

app.listen( PORT, () => console.log(`Listening on port ${PORT}`));

// just for testing
const data = require('./data.json'); 
app.get('/test', (req, res) => {
    res.send(data);
});