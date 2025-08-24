const injectPrisma = (req, res, next) => {
  // Inject Prisma client from app.locals into request object
  req.prisma = req.app.locals.prisma;
  next();
};

module.exports = { injectPrisma };
