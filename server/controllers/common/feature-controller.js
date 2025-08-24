const Feature = require("../../models/feature");

const addFeatureImage = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image || typeof image !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "image url is required" });
    }
    const featureImages = new Feature({ image });
    await featureImages.save();
    res.status(201).json({ success: true, data: featureImages });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Some error occured!" });
  }
};

const getFeatureImages = async (req, res) => {
  try {
    const images = await Feature.find({});
    res.status(200).json({ success: true, data: images });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Some error occured!" });
  }
};

const deleteFeatureImage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Feature.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Feature image not found" });
    }
    res.status(200).json({ success: true, message: "Feature image deleted" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Some error occured!" });
  }
};

module.exports = { addFeatureImage, getFeatureImages, deleteFeatureImage };


