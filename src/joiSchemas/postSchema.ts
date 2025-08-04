import joi from 'joi'
export const PostDtoSchema = joi.object({
    id: joi.number().min(1).max(1000),
    userId: joi.number().min(1).max(200).required(),
    title: joi.string().required(),
    text: joi.string().required()
});

export const postIDQueryValidation = {
    query: joi.object({
        postId: joi.string().optional()
    }),
};

export const postUserNameQueryValidation = {
    query: joi.object({
        userName: joi.string().required()
    }),
};