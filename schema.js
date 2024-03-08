const Joi=require("joi");

module.exports.listingSchema= Joi.object({
    title: Joi.string()
        .required(),
    
    description: Joi.string()
        .required(),

    location: Joi.string()
        .required(),
    
    country: Joi.string()
        .required(),

    url: Joi.string()
        .allow("",null),

    price: Joi.number()
        .min(0)
        .required(),
    
});

module.exports.categorySchema= Joi.object({
        Economic: Joi.string()
                .allow("on",null),
        Adventure: Joi.string()
                .allow("on",null),
        Sea: Joi.string()
                .allow("on",null),
        Snow: Joi.string()
                .allow("on",null),
        Forest: Joi.string()
                .allow("on",null),
        Camping: Joi.string()
                .allow("on",null),
        Farm: Joi.string()
                .allow("on",null),
        Mountain: Joi.string()
                .allow("on",null),
        City: Joi.string()
                .allow("on",null),
        Monument: Joi.string()
                .allow("on",null),
})

module.exports.reviewSchema=Joi.object({
    review: Joi.object({
        rating: Joi.number()
            .min(1)
            .max(5)
            .required(),
        comment: Joi.string()
            .required(),
    })
    .required(),
});