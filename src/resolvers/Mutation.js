const { forwardTo } = require('prisma-binding');

const mutations = {
  async createRecordFromCSV(parent, args, ctx, info) {        
    // SPECIES
    const [species] = await ctx.db.query.specieses({
      where: {
        name_contains: args.data.species
      }
    }).catch((e) => { console.error(e.message) })
    
    // LOCATIOM
    const [location] = await ctx.db.query.locations({
      where: {
        siteCode: args.data.location
      }
    }).catch((e) => { console.error(e.message) })
    
    // BREEDINGCODE
    let breeding_code = ''
    
    if (args.data.breedingCode) {
      const [breedingCode] = await ctx.db.query.breedingCodes({
        where: {
          code: args.data.breedingCode
        }
      }).catch((e) => { console.error(e.message) })

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
    }).catch((e) => { console.error(e.message) })

    const [user] = await ctx.db.query.users({
      where: {
        name_contains: 'Legacy'
      }
    }).catch((e) => { console.error(e.message) })
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
       
    const item = await ctx.db.mutation.createRecord(
      { data }, 
      info).catch((e) => { console.error(e.message) })
    return item
    // return null
  },


  async addSpecies(parent, args, ctx, info) {       
    // query for the types and set all new species to a bird for now
    const [bird] = await ctx.db.query.classes({
      where: {
        name: "bird"
      }
    }).catch((e) => { console.error(e.message) })

    const item = await ctx.db.mutation.createSpecies({            
      data: {      
        class: {
          connect: { 
            id: bird.id 
          },
        },
        ...args
      }
    }, info).catch((e) => { console.error(e.message) });

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
