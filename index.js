const express = require("express");
const mongoose = require("mongoose");
const { db } = require("./models/galleryitem");
const app = express();
const port = 3002;
const GalleryItem = require("./models/galleryitem");
const dbUri =
  "mongodb+srv://m001-student:m001-mongodb-basics@cluster0.ksm7m.mongodb.net/ShopCollections?retryWrites=true&w=majority";
mongoose
  .connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("db connected");
    app.listen(3002, () => {
      console.log(` listening at http://localhost:${port}`);
    });
  })
  .catch((err) => console.log(err));

//view engine
app.set("view engine", "ejs");

//Middleware
app.use(express.static("public"));
//Same as Body-parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  GalleryItem.find()
    .then((result) => {
      res.render("index", { gallery: result });
    })
    .catch((err) => console.log(err));
});

app.get("/add", (req, res) => {
  GalleryItem.aggregate([{ $sample: { size: 6 } }])
    .then((result) => {
      res.render("add", { gallery: result });
    })
    .catch((err) => console.log(err));
});
app.get("/less", (req, res) => {
  GalleryItem.aggregate([{ $match: { Price: { $lte: 30 } } }])
    .then((result) => {
      res.render("less", { gallery: result });
    })
    .catch((err) => console.log(err));
});

app.post("/add", (req, res) => {
  const newArticle = new GalleryItem({
    Product_pictureLink: req.body.Product_pictureLink,
    product_name: req.body.product_name,
    Price: req.body.Price,
    Link_shop: req.body.Link_shop,
  });
  newArticle
    .save()
    .then((result) => {
      console.log("new Article Saved");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
});

app.get("/less", (req, res) => {
  GalleryItem.aggregate([{ Price: { $lte: 120 } }, { $sample: { size: 6 } }])
    .then((result) => {
      res.render("less", { gallery: result });
    })
    .catch((err) => console.log(err));
});

app.get("/single/:_id", (req, res) => {
  console.log(req.params._id);

  GalleryItem.findById(req.params._id)
    .then((result) => {
      res.render("single", { gallery: result });
    })
    .catch((err) => console.log(err));
});

app.get("/single/:_id/delete", (req, res) => {
  GalleryItem.findByIdAndDelete(req.params._id)
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
});

app.post("/single/:_id/edit", (req, res) => {
  const updatedGalleryItem = {
    product_name: req.body.product_name,
    Link_shop: req.body.Link_shop,
    Price: req.body.Price,
    Product_pictureLink: req.body.Product_pictureLink,
  };
  GalleryItem.findByIdAndUpdate(req.params._id, updatedGalleryItem)
    .then((result) => {
      res.redirect(`/single/${req.params._id}`);
    })
    .catch((err) => console.log(err));
});
