const fs = require("fs");
const user = require("../model/userModel");
const authToken = require("../utils/authToken");
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
    cb(new appError("Not a picture! Please upload only pictures", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadStoreLogo = upload.single("picture");

exports.resizeStoreLogo = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `worker-${req.query.phone}-${Date.now()}.png`;
  await sharp(req.file.buffer)
    .resize(200, 200)
    .toFormat("png")
    .jpeg({ quality: 90 })
    .toFile(`${__dirname}/../graphics/worker/${req.file.filename}`);
  next();
});

// ========================= GET

exports.inscrirePage = (req, res) => {
  res.status(200).render("inscrire", {
    title: {
      ar: "m3allam.ma | انشاء حساب",
      ar: "m3allam.ma | créer un compte",
    },
    jobs,
    jihat,
    phone: req.query.phone,
    lang: req.params.lang,
  });
};

exports.seConnecterPage = (req, res) => {
  res.status(200).render("seConnecter", {
    title: {
      ar: "m3allam.ma | تسجيل الدخول",
      fr: "m3allam.ma | Se connecter",
    },
    lang: req.params.lang,
  });
};

// ========================= POST

exports.inscrireSave = catchAsync(async (req, res, next) => {
  const userConnect = await user.findOneAndUpdate(
    { phone: `+212${req.query.phone.substring(1)}` },
    {
      name: req.body.name,
      jiha: req.body.jiha,
      city: JSON.parse(req.body.city),
      whatsapp: req.body.whatsapp,
      valid: "oui",
      photo: req.file.filename,
    }
  );

  if (!userConnect) {
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

  const token = authToken.createSendToken(userConnect._id);
  const cookieOptions = authToken.cookieOptions;
  res.cookie("cookie", token, cookieOptions);
  res.redirect(`/${req.params.lang}/mon-compte/${userConnect.id}`);
});

exports.seConnecterPost = catchAsync(async (req, res, next) => {
  console.log(req.params.lang);

  const existUser = await user.findOne({
    phone: `+212${req.body.phone.substring(1)}`,
  });

  if (existUser && existUser.valid === "oui") {
    const token = authToken.createSendToken(existUser._id);
    const cookieOptions = authToken.cookieOptions;
    res.cookie("cookie", token, cookieOptions);
    return res.redirect(`/${req.params.lang}`);
  }

  if (existUser && existUser.valid === "non") {
    return res.redirect(`/${req.params.lang}/inscrire?phone=${req.body.phone}`);
  }

  const newUser = await user.create({
    name: "xxxxx",
    jiha: "xxxxx",
    city: "xxxxx",
    phone: "+212" + req.body.phone.substring(1),
  });
  if (!newUser) {
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

  res.redirect(`/${req.params.lang}/inscrire?phone=${req.body.phone}`);
});
