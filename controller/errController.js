const appError = require("../utils/appErrors");

exports.indexError = (err, req, res, next) => {
	try {
		if (!err.statusCode) {
			if (req.params.lang === "fr")
			  return next(new appError("Quelque chose a mal tourné. Veuillez réessayer", 500));
			if (req.params.lang === "ar")
				return next(new appError("حدث خطأ ما. لم يتم إنشاء الحساب، أعد المحاولة من فضلك", 500));
		  }
		
		  else if (err.statusCode === 500 || err.statusCode === 404) return next();
		
		  else if (err.kind && err.kind === "ObjectId") {
			if (req.params.lang === "ar")
			  return next(new appError("هذه الخدمة غير موجودة", 404));
			if (req.params.lang === "fr")
			  return next(new appError("Ce service n'existe pas", 404));
		  }
		
		  res.redirect(`/?message=${err.message.split(" ").join("-")}&status=${err.statusCode}`);
	} catch (error) {
		next(error)
	}
};

exports.globalError = (err, req, res, next) => {
	try {
		res.status(err.statusCode).render("404", {
			title: "⚠️ خطأ -- error ⚠️",
			status: err.statusCode,
			message: err.message,
		  });
	} catch (error) {
		next(error)
	}

};
