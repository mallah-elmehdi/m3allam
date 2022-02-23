const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const user = require("../model/userModel");
const service = require("../model/serviceModel");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appErrors");

exports.userLoggedIn = catchAsync(async (req, res, next) => {
  try {
  if (req.cookies.cookie) {
    const decoded = await promisify(jwt.verify)(
      req.cookies.cookie,
      process.env.JWT_SECRET
    );
    const userConnect = await user.findById(decoded.id);
    if (!userConnect) {
      return next();
    }
    res.locals.user = userConnect;
    return next();
  }
  next();
	  
  } catch (error) {
	  next(error)
  }
});

exports.restricto = (req, res, next) => {
	try {
  if (req.cookies.cookie) {
    if (req.params.lang === "ar")
      return next(new appError("ليس لديك الحق في الدخول إلى هذه الصفحة", 400));
    if (req.params.lang === "fr")
      return next(new appError("Vous n'avez pas le droit d'accéder à cette page", 400));
  }
  next();
	} catch (error) {
  next(error);
		
	}

};

exports.inscrireRestriction = catchAsync(async (req, res, next) => {
	try {
  const userEx = await user.findOne({
    phone: `+212${req.query.phone.substring(1)}`,
    valid: "non",
  });
  if (!userEx) {
    if (req.params.lang === "ar")
      return next(new appError("هذا المستخدم غير موجود", 404));
    if (req.params.lang === "fr")
      return next(new appError("Ce m3allam n'existe pas", 404));
  }
  next();
	} catch (error) {
  next(error);
		
	}
});

exports.accountAccess = catchAsync(async (req, res, next) => {
	try {
  if (!res.locals.user || res.locals.user.id != req.params.id) {
    if (req.params.lang === "ar")
      return next(new appError("ليس لديك الحق في الدخول إلى هذه الصفحة", 400));
    if (req.params.lang === "fr")
      return next(new appError("Vous n'avez pas le droit d'accéder à cette page", 400));
  }

  if (req.query.sid) {
    const serv = await service.findById(req.query.sid);

    if (!serv){
      if (req.params.lang === "ar")
        return next(new appError("هذه الخدمة غير موجودة", 404));
      if (req.params.lang === "fr")
        return next(new appError("Ce service n'existe pas", 404));
    }

    if (serv.user != req.params.id) {
      if (req.params.lang === "ar")
        return next(new appError("Vous ne pouvez pas supprimer ce service", 400));
      if (req.params.lang === "fr")
        return next(new appError("Ce service n'existe pas", 404));
    }
  }
  next();
	} catch (error) {
		next(error)
	}
});
