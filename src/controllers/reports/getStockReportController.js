const MedicineStockHistory = require('../../models/reports/medicineStockHistory');
const ExcelJS = require('exceljs');
const { Parser } = require('json2csv');

exports.getStockReport = async (req, res) => {
  try {
    const stockHistory = await MedicineStockHistory.findAll({
      attributes: ['recorddate', 'medicineid', 'stockin', 'stockout', 'remainingstock'],
      order: [['recorddate', 'ASC']],
    });

    if (!stockHistory || stockHistory.length === 0) {
      return res.status(404).json({ message: 'No stock history found' });
    }

    const groupedStockHistory = stockHistory.reduce((acc, record) => {
      const recordDate = new Date(record.recorddate).toISOString().split('T')[0];
      if (!acc[recordDate]) {
        acc[recordDate] = [];
      }
      acc[recordDate].push({
        medicineid: record.medicineid,
        stockin: record.stockin,
        stockout: record.stockout,
        remainingStock: record.remainingstock,
      });
      return acc;
    }, {});

    const formattedResponse = Object.keys(groupedStockHistory).map(recordDate => ({
      recordDate,
      medicines: groupedStockHistory[recordDate],
    }));

    res.status(200).json(formattedResponse);
  } catch (error) {
    console.error('Error fetching stock report:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.exportStockReport = async (req, res) => {
  try {
    const stockHistory = await MedicineStockHistory.findAll({
      attributes: ['recorddate', 'medicineid', 'stockin', 'stockout', 'remainingstock'],
      order: [['recorddate', 'ASC']],
    });

    if (!stockHistory || stockHistory.length === 0) {
      return res.status(404).json({ message: 'No stock history found' });
    }

    const format = req.query.format || 'excel';

    if (format === 'csv') {
      const fields = ['recorddate', 'medicineid', 'stockin', 'stockout', 'remainingstock'];
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(stockHistory.map(record => record.dataValues));

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=stock_report.csv');
      res.status(200).end(csv);
    } else if (format === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Stock Report');

      worksheet.columns = [
        { header: 'Record Date', key: 'recorddate', width: 15 },
        { header: 'Medicine ID', key: 'medicineid', width: 36 },
        { header: 'Stock In', key: 'stockin', width: 10 },
        { header: 'Stock Out', key: 'stockout', width: 10 },
        { header: 'Remaining Stock', key: 'remainingstock', width: 15 },
      ];

      stockHistory.forEach((record) => {
        worksheet.addRow(record.dataValues);
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=stock_report.xlsx');

      await workbook.xlsx.write(res);
      res.end();
    } else {
      res.status(400).json({ message: 'Unsupported format. Please use "excel" or "csv".' });
    }
  } catch (error) {
    console.error('Error exporting stock report:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};