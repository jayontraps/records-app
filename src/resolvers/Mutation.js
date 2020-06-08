const cloudinary = require("../cloudinary");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { forwardTo } = require("prisma-binding");

const mutations = {
  async signin(parent, { email, password }, ctx, info) {
    // 1. check if there is a user with that email
    const user = await ctx.db.query.user({ where: { email } }, info);
    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }
    // 2. Check if their password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error("Invalid Password!");
    }
    // 3. generate the JWT Token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // 4. Set the cookie with the token
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
      domain: process.env.DOMAIN,
    });
    // 5. Return the user
    return user;
  },
  async signout(parent, args, ctx, info) {
    ctx.response.clearCookie("token");
    return { message: "Goodbye!" };
  },
  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, 10);
    // create the user
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ["USER"] },
        },
      },
      info
    );
    // create the JWT token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // set the JWT as cookie on the response
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
      domain: process.env.FRONTEND_URL,
    });

    return user;
  },

  async createRecordFromCSV(parent, args, ctx, info) {
    // SPECIES
    const [species] = await ctx.db.query
      .specieses({
        where: {
          name_contains: args.data.species,
        },
      })
      .catch((e) => {
        console.error(e.message);
      });

    // LOCATIOM
    const [location] = await ctx.db.query
      .locations({
        where: {
          siteCode: args.data.location,
        },
      })
      .catch((e) => {
        console.error(e.message);
      });

    // BREEDINGCODE
    let breeding_code = "";

    if (args.data.breedingCode) {
      const [breedingCode] = await ctx.db.query
        .breedingCodes({
          where: {
            code: args.data.breedingCode,
          },
        })
        .catch((e) => {
          console.error(e.message);
        });

      if (breedingCode) {
        if (breedingCode.id !== undefined) {
          breeding_code = {
            connect: {
              id: breedingCode.id,
            },
          };
        }
      }
    }

    // USER
    const [activeUser] = await ctx.db.query
      .users({
        where: {
          name_contains: args.data.observer,
        },
      })
      .catch((e) => {
        console.error(e.message);
      });

    const [user] = await ctx.db.query
      .users({
        where: {
          name_contains: "Legacy",
        },
      })
      .catch((e) => {
        console.error(e.message);
      });
    let legacyUserId = user.id;

    let author = {};
    let legacyObserver = "";

    if (activeUser) {
      author = {
        connect: {
          id: activeUser.id,
        },
      };
    } else {
      author = {
        connect: {
          id: legacyUserId,
        },
      };
      legacyObserver = args.data.observer;
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
      ...{ author },
      species: {
        connect: {
          id: species.id,
        },
      },
      location: {
        connect: {
          id: location.id,
        },
      },
      date: args.data.dateFrom,
      dateTo: args.data.dateTo ? args.data.dateTo : null,
      count: args.data.count,
      notes: args.data.notes,
    };

    if (breeding_code) {
      data.breeding_code = breeding_code;
    }
    if (legacyObserver) {
      data.legacyObserver = legacyObserver;
    }

    // console.log('data: ', data)

    const item = await ctx.db.mutation
      .createRecord({ data }, info)
      .catch((e) => {
        console.error(e.message);
      });
    return item;
    // return null
  },

  async addSpecies(parent, args, ctx, info) {
    // query for the types and set all new species to a bird for now
    const [bird] = await ctx.db.query
      .classifications({
        where: {
          name: "bird",
        },
      })
      .catch((e) => {
        console.error(e.message);
      });

    const item = await ctx.db.mutation
      .createSpecies(
        {
          data: {
            classification: {
              connect: {
                id: bird.id,
              },
            },
            ...args,
          },
        },
        info
      )
      .catch((e) => {
        console.error(e.message);
      });

    return item;
  },

  async deleteImageFromRecord(parent, args, ctx, info) {
    // delete from cloudinary store
    cloudinary.uploader.destroy(args.public_id, function(error, result) {
      console.log(result, error);
    });

    // find the image
    const [image] = await ctx.db.query
      .images(
        {
          where: {
            src_contains: args.public_id,
          },
        },
        info
      )
      .catch((e) => {
        console.error(e.message);
      });

    // find the record associated with the image
    if (image) {
      const [record] = await ctx.db.query
        .records(
          {
            where: {
              images_some: {
                id: image.id,
              },
            },
          },
          info
        )
        .catch((e) => {
          console.error(e.message);
        });
      const recordId = record.id;

      // delete the image
      const res = await ctx.db.mutation
        .deleteImage(
          {
            where: {
              id: image.id,
            },
          },
          info
        )
        .catch((e) => {
          console.error(e.message);
        });

      // return the updated record
      const newRecord = await ctx.db.query
        .record(
          {
            where: {
              id: recordId,
            },
          },
          info
        )
        .catch((e) => {
          console.error(e.message);
        });

      return newRecord;
    }

    return null;
  },

  createSpeciesStatus: forwardTo("db"),
  createBreedingCode: forwardTo("db"),
  createRecord: forwardTo("db"),
  deleteRecord: forwardTo("db"),
  updateRecord: forwardTo("db"),
  createSpecies: forwardTo("db"),
  createLocation: forwardTo("db"),
  createClassification: forwardTo("db"),
  createUser: forwardTo("db"),
  deleteImage: forwardTo("db"),
};

module.exports = mutations;
