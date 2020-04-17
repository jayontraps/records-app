const { forwardTo } = require('prisma-binding');

const mutations = {
  async createRecord(parent, args, ctx, info) {
    // temporarily asign a user to the observer field
    const [me] = await ctx.db.query.users({
      where: {
        name: "Jason Righelato"
      }
    })

    // temporarily aisign a location
    const [loc] = await ctx.db.query.locations({
      where: {
        site: "Dinton marshes"
      }
    })

    // temporarily aisign a species with bird class
    const [sp] = await ctx.db.query.specieses({
      where: {
        class: {
          name: "bird"
        }
      }
    })

    const item = await ctx.db.mutation.createRecord({
      data: {
        observer: {
          connect: {
            id: me.id
          }
        },
        location: {
          connect: {
            id: loc.id
          }
        },
        species: {
          connect: {
            id: sp.id
          }
        },
        ...args
      }
    }, info)

    return item
  },
  async addSpecies(parent, args, ctx, info) {       
    // query for the types and set all new species to a bird for now
    const [bird] = await ctx.db.query.classes({
      where: {
        name: "bird"
      }
    })

    const item = await ctx.db.mutation.createSpecies({            
      data: {      
        class: {
          connect: { 
            id: bird.id 
          },
        },
        ...args
      }
    }, info);

    return item

  },  
  createLocation: forwardTo('db'),
  createClass: forwardTo('db'),
  createUser: forwardTo('db')
}

module.exports = mutations;
