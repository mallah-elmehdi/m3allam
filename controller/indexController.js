const fs = require("fs");
const service = require("../model/serviceModel");
const user = require("../model/userModel");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appErrors");
const slugify = require("slugify");

const jobs = JSON.parse(fs.readFileSync(`${__dirname}/../json/jobs.json`));
const jihat = JSON.parse(fs.readFileSync(`${__dirname}/../json/jiha.json`));

var g_jiha;
var g_city;
var g_service;

// =============================================================== INDEX PAGE

exports.indexRedirect = (req, res) => {
	try {
		return res.redirect(`/fr${req.originalUrl}`)
	} catch (error) {
		next(error)
	}

};

exports.indexPage = catchAsync(async (req, res, next) => {
	try {
		if (req.params.lang != "fr" && req.params.lang != "ar")  return next(new appError("الصفحة غير موجودة", 404));
		var message = "";
		var status = 200;
		var i = 0;
		var j = 0;
	  
		if (req.query.message) message = req.query.message.split("-").join(" ");
		if (req.query.status) status = req.query.status;
		var services = [];
	  
		while (i < jobs.length) {
		  var ele = await service
			.find({ service: jobs[i].fr })
			.populate("user")
			.limit(8);
	  
		  if (ele.length >= 4) {
			services[j] = { id: jobs[i].fr, service: jobs[i].ar, content: ele };
			j++;
		  }
		  i++;
		}
	  
		res.status(status).render("index", {
		  title: {
			ar : "m3allam.ma | أفضل خدمات الأشغال عمومية",
			fr : "m3allam.ma | Les meilleurs services de travaux publics",
		  },
		  jobs,
		  services,
		  message,
		  jihat,
		  lang: req.params.lang
		});
	} catch (error) {
		next(error)
	}
});

// =============================================================== RESULTAT PAGE

exports.resultatPage = catchAsync(async (req, res, next) => {
	try {
		var services = [];
		var ele;
		var i = 0;
	  
		if (req.params.service && req.params.search) {
		  var expression = req.params.search.split("-");
		  var exp = [];
		  while (i < expression.length) {
			exp[i] = new RegExp(expression[i]);
			i++;
		  }
		  ele = await service
			.find({ service: g_service, explain: { $in: exp } })
			.populate("user");
		} 
		
		else if (req.params.searchANDservice) {
	  
		  if (g_service)
			ele = await service.find({ service: g_service }).populate("user");
	  
		  else {
			var expression = req.params.searchANDservice.split("-");
			var exp = [];
			while (i < expression.length) {
			  exp[i] = new RegExp(expression[i]);
			  i++;
			}
			ele = await service.find({ explain: { $in: exp } }).populate("user");
		  }
		} 
		
		else {
		  ele = await service.find().populate("user");
		}
	  
		var a = 0;
		var k = 0;
		
		while (a < ele.length) {
		  if (ele[a].user.city.fr === g_city) {
			services[k] = ele[a];
			k++;
		  }
		  a++;
		}
	  
		res.status(200).render("resultat", {
		  title: {
			ar : "m3allam.ma | أفضل خدمات الأشغال عمومية | الخدمات", 
			fr : "m3allam.ma | Les services | Les meilleurs services de travaux publics", 
		  },
		  jobs,
		  jihat,
		  services,
		  g_jiha,
		  g_city,
		  lang: req.params.lang
		});
	} catch (error) {
		next(error)
	}
});

// =============================================================== POST

exports.indexSearch = (req, res) => {
	try {
  
		g_jiha = req.body.jiha;
		g_city = JSON.parse(req.body.city).fr;
		g_service = req.body.service;
	  
		if (req.body.service && req.body.search != "") {
		  res.redirect(`/${req.params.lang}/resultat/${slugify(g_city, { lower: true })}/${slugify(req.body.service,{ lower: true })}/${slugify(req.body.search, {lower: true,})}`);
		} 
		
		else if (req.body.service && req.body.search === "") {
		  res.redirect(`/${req.params.lang}/resultat/${slugify(g_city, { lower: true })}/${slugify(req.body.service,{ lower: true })}`);
		} 
		
		else if (!req.body.service && req.body.search != "") {
		  res.redirect(`/${req.params.lang}/resultat/${slugify(g_city, { lower: true })}/${slugify(req.body.search,{lower: true,})}`);
		} 
		
		else {
		  res.redirect(`/${req.params.lang}/resultat/${slugify(g_city, { lower: true })}`);
		}
	} catch (error) {
		next(error)
	}
};

// =============================================================== PRIVACY

exports.privacyPage = (req, res) => {
	try {
		res.status(200).render("privacy", {
			title : "m3allam.ma | Politique de confidentialité",
			// title: {
			//   ar : "m3allam.ma | سياسة الخصوصية",
			//   fr : "m3allam.ma | Politique de confidentialité",
			// }
		  });
	} catch (error) {
		next(error)
	}
};

exports.logOut = (req, res, next) => {
  try {
    if (!res.locals.user) return res.redirect(`/${req.params.lang}`);
    res.clearCookie("cookie");
    return res.redirect(`/${req.params.lang}`);
  } catch (err) {
    next(err);
  }
};

// =============================================================== SERVICE PAGE

exports.servicePage = catchAsync(async (req, res, next) => {
	try {
		const serv = await service.findById(req.query.id).populate("user");

		if (!serv){
		  if (req.params.lang === "ar")
			return next(new appError("هذه الخدمة غير موجودة", 404));
		  if (req.params.lang === "fr")
			return next(new appError("Ce service n'existe pas", 404));
		}
	  
		const services = await service
		  .find({ user: serv.user.id })
		  .populate("user");
	  
		res.status(200).render("service", {
		  title: {
			ar : "m3allam.ma | الخدمة",
			fr : "m3allam.ma | Service",
		  },
		  jobs,
		  serv,
		  services,
		  lang: req.params.lang
		});
	} catch (error) {
		next(error)
	}

});

// =============================================================== OUVRIER PAGE

exports.ouvrierPage = catchAsync(async (req, res, next) => {
	try {
		const services = await service.find({ user: req.query.id }).populate("user");
		if (!services){
		  if (req.params.lang === "ar")
			return next(new appError("هذه الخدمة غير موجودة", 404));
		  if (req.params.lang === "fr")
			return next(new appError("Ce service n'existe pas", 404));
		} 
	  
		const auser = await user.findById(req.query.id);
		if (!auser) {
		  if (req.params.lang === "ar")
			return next(new appError("هذا العامل غير موجود", 404));
		  if (req.params.lang === "fr")
			return next(new appError("Ce m3allam n'existe pas", 404));
		} 
	  
		res.status(200).render("ouvrier", {
		  title: {
			ar : `m3allam.ma | ${auser.name}`,
			fr : `m3allam.ma | ${auser.name}`,
		  },
		  jobs,
		  services,
		  auser,
		  lang: req.params.lang
		});
	} catch (error) {
		next(error)
	}
});
