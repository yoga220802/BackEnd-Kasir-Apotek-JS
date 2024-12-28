const { Categories } = require('../../models/medicines/associations');

exports.addCategory = async (req, res) => {
  const body = Array.isArray(req.body) ? req.body : [req.body];
  const errors = [];
  const successes = [];

  for (const category of body) {
    const { categoryname, categorydescription } = category;

    if (!categoryname || !categorydescription) {
      errors.push("Both 'categoryname' and 'categorydescription' are required.");
      continue;
    }

    // Generate categoryid from categoryname
    const categoryid = categoryname.toUpperCase().replace(/\s+/g, '_');

    try {
      // Check if category already exists
      const existingCategory = await Categories.findOne({ where: { categoryid } });

      if (existingCategory) {
        errors.push(`Category "${categoryname}" already exists.`);
        continue;
      }

      // Create new category
      await Categories.create({
        categoryid,
        categoryname,
        categorydescription,
      });

      successes.push(`Category "${categoryname}" added successfully.`);
    } catch (error) {
      errors.push(`Failed to add category "${categoryname}". Error: ${error.message}`);
    }
  }

  return res.status(200).json({ successes, errors });
};
