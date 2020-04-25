const { forwardTo } = require('prisma-binding');

const mutations = {
  // async addRecord(parent, args, ctx, info) {
  //   console.log(args)
  //   // temporarily asign a user to the author field
  //   // const [me] = await ctx.db.query.users({
  //   //   where: {
  //   //     name: "Jason Righelato"
  //   //   }
  //   // })

  //   // if no location id provided, create a new one
  //   let location
  //   if (args.location.id) {
  //     location = {
  //       connect: {
  //         id: args.location.id
  //       }
  //     }
  //   } else {
  //     location = {
  //       create: {
  //         site: args.location.site
  //       }
  //     }
  //   }

  //   // if no author id provided, create a new one
  //   let author
  //   if (args.author.id) {
  //     author = {
  //       connect: {
  //         id: args.author.id
  //       }
  //     }
  //   } else {
  //     author = {
  //       create: {
  //         name: args.author.name
  //       }
  //     }
  //   }

  //   // temporarily aisign a species with bird class
  //   const [sp] = await ctx.db.query.specieses({
  //     where: {
  //       class: {
  //         name: "bird"
  //       }
  //     }
  //   })

  //   // asign all new records to DRAFT status
  //   const status = "DRAFT"
    
  //   const item = await ctx.db.mutation.createRecord({
  //     data: {
  //       species: {
  //         connect: {
  //           id: sp.id
  //         }
  //       },
  //       ...args,
  //       status,
  //       location,
  //       author
  //     }
  //   }, info)

  //   return item

  // },
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
  createSpeciesStatus: forwardTo('db'),
  createBreedingCode: forwardTo('db'),
  createRecord: forwardTo('db'),
  createSpecies: forwardTo('db'),
  createLocation: forwardTo('db'),
  createClass: forwardTo('db'),
  createUser: forwardTo('db')
}

module.exports = mutations;
