exports.formatMedicine = (medicine) => ({
  medicineID: medicine.medicineid,
  medicineName: medicine.medicinename,
  brand: medicine.brand,
  price: medicine.price,
  stock: medicine.stock,
  unit: medicine.unit,
  createdat: medicine.createdat,
  updatedat: medicine.updatedat,
  batches: medicine.Batches?.map(batch => ({
    batchid: batch.batchid,
    expirationdate: batch.expirationdate,
  })) || [],
  categories: medicine.Categories?.map(category => ({
    categoryID: category.categoryid,
    categoryName: category.categoryname,
  })) || [],
});
