const { forwardTo } = require('prisma-binding');

const Query = {
    recordsConnection: forwardTo('db'),
    users: forwardTo('db'),
    records: forwardTo('db'),
    species: forwardTo('db'),
    classes: forwardTo('db'),
    specieses: forwardTo('db'),
    locations: forwardTo('db'),
    breedingCodes: forwardTo('db'),
    async allSpecies(parent, args, ctx, info) {
        const items = await ctx.db.query.specieses();
        return items
    },

};

module.exports = Query;
