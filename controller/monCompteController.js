const fs = require("fs");
const user = require("../model/userModel");
const service = require("../model/serviceModel");
const appError = require("../utils/appErrors");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const sharp = require("sharp");
const slugify = require("slugify");

const jobs = JSON.parse(fs.readFileSync(`${__dirname}/../json/jobs.json`));
const jihat = JSON.parse(fs.readFileSync(`${__dirname}/../json/jiha.json`));

// ========================= PICTURE CROP

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new appError("ليست صورة! يرجى تحميل الصور فقط", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadStoreLogo = upload.single("picture");

exports.resizeStoreLogo = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `service-${res.locals.user.id}-${Date.now()}.png`;

  await sharp(req.file.buffer)
    .resize(750, 463)
    .toFormat("png")
    .jpeg({ quality: 90 })
    .toFile(`${__dirname}/../graphics/service/${req.file.filename}`);
  next();
});

// ========================= GET

exports.monComptePage = async (req, res) => {
	try {
		const services = await service.find({ user: req.params.id }).populate("user");

		res.status(200).render("monCompte", {
		  title: {
			ar: "m3allam.ma | حسابي",
			fr: "m3allam.ma | mon compte",
		  },
		  services,
		  jobs,
		  lang: req.params.lang,
		})
	} catch (error) {
		next(error)
	}
;
};

exports.ajouterService = (req, res) => {
  res.status(200).render("ajouterService", {
    title: {
      ar: "m3allam.ma | أضف خدمة",
      fr: "m3allam.ma | ajouter un service",
    },
    jobs,
    lang: req.params.lang,
  });
};

exports.mesInfos = (req, res) => {
  res.status(200).render("mesInfos", {
    title: {
      ar: "m3allam.ma | معلوماتي",
      fr: "m3allam.ma | mes informations",
    },
    jobs,
    jihat,
    lang: req.params.lang,
  });
};

// =================== POST

exports.saveService = catchAsync(async (req, res, next) => {
	try {
		const addService = await service.create({
			service: req.body.service,
			experience: req.body.experience,
			explain: slugify(req.body.explain, " ", { lower: true }),
			diploma: req.body.diploma,
			user: req.params.id,
			picture: req.file.filename,
		  });
		
		  if (!addService)
			return next(
			  new appError("حدث خطأ ما. لم يتم إنشاء خدمة، أعد المحاولة من فضلك", 500)
			);
		
		  res.redirect(`/${req.params.lang}/mon-compte/${req.params.id}`);
	} catch (error) {
		next(error)
	}
});

exports.changeInfos = catchAsync(async (req, res, next) => {
	try {
		if (!req.file) var photo = res.locals.user.photo;
		else {
		  var photo = req.file.filename;
		  fs.unlink(
			`${__dirname}/../graphics/worker/${res.locals.user.photo}`,
			(err) => {
			  if (err)
				if (req.params.lang === "fr")
				  return next(
					new appError(
					  "Quelque chose a mal tourné. Veuillez réessayer",
					  500
					)
				  );
			  if (req.params.lang === "ar")
				return next(
				  new appError(
					"حدث خطأ ما. لم يتم إنشاء الحساب، أعد المحاولة من فضلك",
					500
				  )
				);
			}
		  );
		}
	  
		const updateUser = await user.findByIdAndUpdate(
		  req.params.id,
		  {
			name: req.body.name,
			jiha: req.body.jiha,
			city: JSON.parse(req.body.city),
			whatsapp: req.body.whatsapp,
			phone: "+212" + req.body.phone.substring(1),
			photo,
		  },
		  { new: true }
		);
	  
		if (!updateUser) {
		  if (req.params.lang === "fr")
			return next(
			  new appError("Quelque chose a mal tourné. Veuillez réessayer", 500)
			);
		  if (req.params.lang === "ar")
			return next(
			  new appError(
				"حدث خطأ ما. لم يتم إنشاء الحساب، أعد المحاولة من فضلك",
				500
			  )
			);
		}
	  
		res.redirect(
		  `/${req.params.lang}/mon-compte/${req.params.id}/mes-informations`
		);
	} catch (error) {
		next(error)
	}
});

// =================== DELETE

exports.deleteService = catchAsync(async (req, res, next) => {
	try {
		const deleteServ = await service.findByIdAndDelete(req.query.sid);
		if (!deleteServ)
		  return next(
			new appError("حدث خطأ ما. لم يتم إنشاء خدمة، أعد المحاولة من فضلك", 500)
		  );
		fs.unlink(`${__dirname}/../graphics/service/${deleteServ.picture}`, (err) => {
		  if (err) {
			if (req.params.lang === "fr")
			  return next(
				new appError("Quelque chose a mal tourné. Veuillez réessayer", 500)
			  );
			if (req.params.lang === "ar")
			  return next(
				new appError(
				  "حدث خطأ ما. لم يتم إنشاء الحساب، أعد المحاولة من فضلك",
				  500
				)
			  );
		  }
		});
		res.redirect(`/${req.params.lang}/mon-compte/${req.params.id}`);
	} catch (error) {
		next(error)
	}
});

exports.deleteAccount = catchAsync(async (req, res, next) => {
	try {
		const deleteAcc = await user.findByIdAndDelete(req.params.id);
		if (!deleteAcc) {
		  if (req.params.lang === "fr")
			return next(
			  new appError("Quelque chose a mal tourné. Veuillez réessayer", 500)
			);
		  if (req.params.lang === "ar")
			return next(
			  new appError(
				"حدث خطأ ما. لم يتم إنشاء الحساب، أعد المحاولة من فضلك",
				500
			  )
			);
		}
		fs.unlink(`${__dirname}/../graphics/worker/${deleteAcc.photo}`, (err) => {
		  if (err) {
			if (req.params.lang === "fr")
			  return next(
				new appError("Quelque chose a mal tourné. Veuillez réessayer", 500)
			  );
			if (req.params.lang === "ar")
			  return next(
				new appError(
				  "حدث خطأ ما. لم يتم إنشاء الحساب، أعد المحاولة من فضلك",
				  500
				)
			  );
		  }
		});
	  
		var i = 0;
		const services = await service.find({ user: req.params.id });
		while (i < services.length) {
		  var ok = await service.findByIdAndDelete(services[i].id);
		  fs.unlink(`${__dirname}/../graphics/service/${ok.picture}`, (err) => {
			if (err) {
			  if (req.params.lang === "fr")
				return next(
				  new appError("Quelque chose a mal tourné. Veuillez réessayer", 500)
				);
			  if (req.params.lang === "ar")
				return next(
				  new appError(
					"حدث خطأ ما. لم يتم إنشاء الحساب، أعد المحاولة من فضلك",
					500
				  )
				);
			}
		  });
		  i++;
		}
	  
		res.clearCookie("cookie");
		res.redirect(`/${req.params.lang}`);
	} catch (error) {
		next(error)
	}
});
