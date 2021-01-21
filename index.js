const Joi = require("joi"); // for validation

function validate_submission(body) {
    const schema = Joi.object({
        lang: Joi.string().equal("C++").required(),// programming lanugage initially we support only C++
        timeLimit: Joi.number().min(.5).max(10).required(),// the timelimit to run code in seconds
        memoryLimit: Joi.number().min(1024).max(1024*1024), // number of KBs maximum is 1G isn't supported initially
        sourceCode: Joi.string().max(100000).required(), // the source code to run
        input: Joi.string().max(1000000).required()// the input to the program
    });
    return schema.validate(body);
}

