const Joi = require('joi');
const persons = require('../store');

const postValidation = (post) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        age: Joi.number().required(),
        hobbies: Joi.array().items(Joi.string()).required()
    });
    return schema.validate(post);
}

const putValidation = (put) => {
    const schema = Joi.object({
        name: Joi.string(),
        age: Joi.number(),
        hobbies: Joi.array().items(Joi.string())
    });
    return schema.validate(put);
}

module.exports = {
    postValidation,
    putValidation
}