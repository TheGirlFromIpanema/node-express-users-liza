import joi from 'joi'
export const PostDtoSchema = joi.object({
    id: joi.number().min(1).max(1000),
    userId: joi.number().min(1).max(200),
    title: joi.string(),
    text: joi.string()
})