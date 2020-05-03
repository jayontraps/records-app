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
        // species: {
        //   connect: {
        //     id: sp.id
        //   }
        // },
  //       ...args,
  //       status,
  //       location,
  //       author
  //     }
  //   }, info)

  //   return item

  // },

  async createRecordFromCSV(parent, args, ctx, info) {    
    console.log('args: ', args)
    // SPECIES
    const [species] = await ctx.db.query.specieses({
      where: {
        name_contains: args.data.species
      }
    })
    
    // LOCATIOM
    const [location] = await ctx.db.query.locations({
      where: {
        siteCode: args.data.location
      }
    })
    
    // BREEDINGCODE
    let breeding_code = ''
    
    if (args.data.breedingCode) {
      const [breedingCode] = await ctx.db.query.breedingCodes({
        where: {
          code: args.data.breedingCode
        }
      })

      if (breedingCode) {
        if (breedingCode.id !== undefined) {
          breeding_code = {
            connect: {
              id: breedingCode.id
            }
          }
        }
      }      
    }


    // USER
    const [activeUser] = await ctx.db.query.users({
      where: {
        name_contains: args.data.observer
      }
    })

    const [user] = await ctx.db.query.users({
      where: {
        name_contains: 'Legacy'
      }
    })
    let legacyUserId = user.id

    let author = {}
    let legacyObserver = ''

    if (activeUser) {      
      author = {        
        connect: {
          id: activeUser.id
        }        
      }
    } else {
      author = {        
        connect: {
          id: legacyUserId
        }        
      }
      legacyObserver = args.data.observer
    }




    // console.log('speciesID: ', species.id)
    // console.log('locationID: ', location.id)
    // console.log('breedingCode: ', codeId)
    // console.log('breedingCode: ', codeId)
    // console.log('legacyUserId: ', legacyUserId)

    // console.log('observer: ', args.data.observer)
    // console.log('author: ', author)

    

    let data = {
      status: "DRAFT", 
      ...{author},
      species: {
        connect: {
          id: species.id
        }
      },
      location: {
        connect: {
          id: location.id
        }
      },      
      date: args.data.dateFrom,
      dateTo: args.data.dateTo ? args.data.dateTo : null,
      count: args.data.count,
      notes: args.data.notes       
    }

    if (breeding_code) {
      data.breeding_code = breeding_code
    }
    if (legacyObserver) {
      data.legacyObserver = legacyObserver
    }

    // console.log('data: ', data)
       
    const item = await ctx.db.mutation.createRecord({ data }, info)
    return item
    // return null
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
  createSpeciesStatus: forwardTo('db'),
  createBreedingCode: forwardTo('db'),
  createRecord: forwardTo('db'),
  createSpecies: forwardTo('db'),
  createLocation: forwardTo('db'),
  createClass: forwardTo('db'),
  createUser: forwardTo('db')
}

module.exports = mutations;
