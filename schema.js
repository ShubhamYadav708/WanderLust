const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null)
    }).required(),
});
module.exports.updateListingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string(),
        description: Joi.string(),
        location: Joi.string(),
        country: Joi.string(),
        price: Joi.number().min(0),
        image: Joi.string().allow("", null)
    }).optional()
}).options({ allowUnknown: true });


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required()
});
