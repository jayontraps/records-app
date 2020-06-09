const { forwardTo } = require("prisma-binding");
const { hasPermission } = require("../utils");

const Query = {
  record: forwardTo("db"),
  recordsConnection: forwardTo("db"),
  users: forwardTo("db"),
  records: forwardTo("db"),
  species: forwardTo("db"),
  classifications: forwardTo("db"),
  specieses: forwardTo("db"),
  locations: forwardTo("db"),
  breedingCodes: forwardTo("db"),
  images: forwardTo("db"),
  async allSpecies(parent, args, ctx, info) {
    const items = await ctx.db.query.specieses().catch((e) => {
      console.error(e.message);
    });
    return items;
  },
  me(parent, args, ctx, info) {
    console.log(">>>>>>>>>>>>> FROM ME: ", ctx.request.userId);
    // check if there is a current user ID
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId },
      },
      info
    );
  },
  async usersAdmin(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error("You must be logged in!");
    }

    hasPermission(ctx.request.user, ["ADMIN", "PERMISSIONUPDATE"]);
    return ctx.db.query.users({}, info);
  },
};

module.exports = Query;
