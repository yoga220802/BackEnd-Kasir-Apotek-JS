const { Categories, MedicineData, MedicineCategory } = require("../../models/medicines/associations");

exports.getMedicineCategories = async (req, res) => {
 try {
  // Ambil semua data kategori
  const categories = await Categories.findAll({
   attributes: ["categoryid", "categoryname", "categorydescription"],
  });

  // Jika tidak ada kategori ditemukan
  if (!categories || categories.length === 0) {
   return res.status(404).json({ message: "No categories found" });
  }

  // Kirimkan respons sukses dengan data kategori
  res.status(200).json({
   message: "Categories retrieved successfully",
   data: categories,
  });
 } catch (error) {
  console.error("Error fetching categories:", error);
  res.status(500).json({ message: "Internal server error" });
 }
};


exports.getMedicinesByCategoryId = async (req, res) => {
    const { categoryid } = req.params;
  
    try {
      // Cari kategori berdasarkan categoryid
      const category = await Categories.findOne({
        where: { categoryid },
        attributes: ["categoryid", "categoryname", "categorydescription"],
        include: [
          {
            model: MedicineData,
            through: { attributes: [] }, // Abaikan tabel junction
            attributes: ["medicineid", "medicinename"],
            as: "Medicines",
          },
        ],
      });
  
      // Jika kategori tidak ditemukan
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
  
      // Format data respons
      const formattedResponse = {
        categoryid: category.categoryid,
        categoryname: category.categoryname,
        categorydescription: category.categorydescription,
        medicines: category.Medicines.map((medicine) => ({
          medicineid: medicine.medicineid,
          medicineName: medicine.medicinename,
        })),
      };
  
      // Kirimkan respons berhasil
      res.status(200).json({
        message: "Medicines retrieved successfully",
        data: formattedResponse,
      });
    } catch (error) {
      console.error("Error fetching medicines by category ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };