const { restockMedicine } = require("./addMedicineBatchController");
const {
	MedicineData,
	MedicineCategory,
	Categories,
} = require("../../models/associations");
const { v4: uuidv4 } = require("uuid");
const sequelize = require("sequelize");

exports.addMedicine = async (req, res) => {
	console.log(req.body);
	const body = Array.isArray(req.body) ? req.body : [req.body];
	const errors = [];
	const successes = [];

	for (const medicine of body) {
		const {
			medicinename,
			brand,
			price,
			stock,
			unit,
			createdat,
			updatedat,
			expirationdate,
			categories,
		} = medicine;

		const normalizedMedicineName = medicinename.toLowerCase().replace(/\s+/g, "");

		try {
			const existingMedicine = await MedicineData.findOne({
				where: sequelize.where(
					sequelize.fn(
						"REPLACE",
						sequelize.fn("LOWER", sequelize.col("medicinename")),
						" ",
						""
					),
					normalizedMedicineName
				),
			});
			if (existingMedicine) {
				errors.push(`Medicine with name "${medicinename}" already exists.`);
				continue;
			}
			const newMedicine = await MedicineData.create({
				medicineid: uuidv4(),
				medicinename,
				brand,
				price,
				unit,
				createdat,
				updatedat,
			});

			successes.push(`Medicine "${medicinename}" added successfully.`);

			if (categories && Array.isArray(categories)) {
				for (const categoryid of categories) {
					const categoryExists = await Categories.findByPk(categoryid);
					if (!categoryExists) {
						errors.push(
							`Category with ID "${categoryid}" not found for medicine "${medicinename}".`
						);
						continue;
					}

					await MedicineCategory.create({
						medicineid: newMedicine.medicineid,
						categoryid: categoryid,
					});
				}
			}

			if (stock && expirationdate) {
				const restockResult = await restockMedicine({
					body: [
						{
							medicineid: newMedicine.medicineid,
							medicinename,
							amount: stock,
							expirationdate,
						},
					],
				});

				successes.push(
					...restockResult.successfulRestocks.map(
						(item) =>
							`Restock for medicine "${item.medicinename}" added successfully.`
					)
				);
				errors.push(
					...restockResult.failedRestocks.map(
						(item) =>
							`Restock failed for medicine "${item.medicinename}": ${item.reason}`
					)
				);
			}
		} catch (error) {
			errors.push(
				`Failed to process medicine "${medicinename}". Error: ${error.message}`
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
