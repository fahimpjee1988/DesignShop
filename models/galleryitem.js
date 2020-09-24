const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const galleryItemSchema = new Schema(
  {
    Product_pictureLink: {
      type: String,
      required: true,
    },
    product_name: {
      type: String,
      required: true,
    },
    Price: {
      type: String,
      required: true,
    },
    Link_shop: {
      type: String,
      required: true,
    },
  },
  { collection: "shopitems" }
);

//Modell Erstellen
const GalleryItem = mongoose.model("GalleryDb", galleryItemSchema);

//Modul Exportieren

module.exports = GalleryItem;
