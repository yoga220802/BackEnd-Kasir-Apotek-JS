const { Categories } = require("../../models/medicines/associations");

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
		const categoryid = categoryname.toUpperCase().replace(/\s+/g, "_");

		try {
			const existingCategory = await Categories.findOne({ where: { categoryid } });

			if (existingCategory) {
				errors.push(`Category "${categoryname}" already exists.`);
				continue;
			}

			await Categories.create({
				categoryid,
				categoryname,
				categorydescription,
			});

			successes.push(`Category "${categoryname}" added successfully.`);
		} catch (error) {
			errors.push(
				`Failed to add category "${categoryname}". Error: ${error.message}`
			);
		}
	}

	if (errors.length > 0 && successes.length === 0) {
		return res.status(400).json({ successes, errors });
	} else if (errors.length > 0 && successes.length > 0) {
		return res.status(207).json({ successes, errors });
	} else {
		return res.status(200).json({ successes, errors });
	}
};
