const { forwardTo } = require('prisma-binding');

const Query = {
    species: forwardTo('db'),
    classes: forwardTo('db'),
    specieses: forwardTo('db'),
    locations: forwardTo('db'),
    async allSpecies(parent, args, ctx, info) {
        const items = await ctx.db.query.specieses();
        return items
    },

};

module.exports = Query;
