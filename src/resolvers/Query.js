const { forwardTo } = require('prisma-binding');

const Query = {
    recordsConnection: forwardTo('db'),
    users: forwardTo('db'),
    records: forwardTo('db'),
    species: forwardTo('db'),
    classifications: forwardTo('db'),
    specieses: forwardTo('db'),
    locations: forwardTo('db'),
    breedingCodes: forwardTo('db'),
    images: forwardTo('db'),
    async allSpecies(parent, args, ctx, info) {
        const items = await ctx.db.query.specieses().catch((e) => { console.error(e.message) });
        return items
    }
};

module.exports = Query;
