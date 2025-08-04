import joi from 'joi'
export const UserDtoSchema = joi.object({
    id: joi.number().min(1).max(200).required(),
    userName: joi.string().required(),
});

export const userIDQueryValidation = {
    query: joi.object({
        userId: joi.string().required()
    }),
};