const CatchAsync = require("../utils/catch-async");
const QueryMethod = require("../utils/query");

//Get One
exports.getOne = (Model) =>
  CatchAsync(async (req, res, next) => {
    const user = await Model.findById(req.params.id);

    if (!user)
      return next(
        new ErrorObject(`User with the id ${req.params.id} not found`, 404)
      );

    res.status(200).json({
      status: "success",
      data: user,
    });
  });

  
//Get All
exports.getAll = (Model) =>
  CatchAsync(async (req, res) => {
    let filter = req.params.tourId ? { tourRef: req.params.tourId } : {};
    const features = new QueryMethod(Model.find(filter), req.query)
      .sort()
      .limit()
      .paginate()
      .filter();

    const users = await features.query;
    res.status(200).json({
      status: "success",
      results: users.length,

      data: users,
    });
  });

//Delete One
  exports.deleteOne = (Model) =>
  CatchAsync(async (req, res, next) => {
    const user = await Model.findByIdAndDelete(req.params.id, {
      strict: true,
    });
    if (!user)
      return next(
        new ErrorObject(`User with the id ${req.params.id} not found`, 404)
      );
    res.status(204).json({
      status: "deleted",
      data: null,
    });
  });
