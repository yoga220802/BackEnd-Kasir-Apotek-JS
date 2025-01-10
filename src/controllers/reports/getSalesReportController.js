const DailySalesSummary = require('../../models/reports/dailySalesSummary');
const ExcelJS = require('exceljs');
const { Parser } = require('json2csv');

exports.getSalesReport = async (req, res) => {
  try {
    const salesReports = await DailySalesSummary.findAll();

    if (!salesReports || salesReports.length === 0) {
      return res.status(404).json({ message: 'No sales reports found' });
    }

    res.status(200).json({
      message: 'Sales reports retrieved successfully',
      data: salesReports,
    });
  } catch (error) {
    console.error('Error fetching sales reports:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.exportSalesReport = async (req, res) => {
  try {
    const salesReports = await DailySalesSummary.findAll();

    if (!salesReports || salesReports.length === 0) {
      return res.status(404).json({ message: 'No sales reports found' });
    }

    const format = req.query.format || 'excel';

    if (format === 'csv') {
      const fields = [
        'summarydate', 'totalincome', 'totalmedicinessold', 'totaltransactions',
        'topmedicine', 'totalcashpayments', 'totalqrispayments', 'cashpaymentcount', 'qristransactioncount'
      ];
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(salesReports.map(report => report.dataValues));

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=sales_report.csv');
      res.status(200).end(csv);
    } else if (format === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Sales Report');

      worksheet.columns = [
        { header: 'Summary Date', key: 'summarydate', width: 15 },
        { header: 'Total Income', key: 'totalincome', width: 15 },
        { header: 'Total Medicines Sold', key: 'totalmedicinessold', width: 20 },
        { header: 'Total Transactions', key: 'totaltransactions', width: 20 },
        { header: 'Top Medicine', key: 'topmedicine', width: 30 },
        { header: 'Total Cash Payments', key: 'totalcashpayments', width: 20 },
        { header: 'Total QRIS Payments', key: 'totalqrispayments', width: 20 },
        { header: 'Cash Payment Count', key: 'cashpaymentcount', width: 20 },
        { header: 'QRIS Transaction Count', key: 'qristransactioncount', width: 20 },
      ];

      salesReports.forEach((report) => {
        worksheet.addRow(report.dataValues);
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=sales_report.xlsx');

      await workbook.xlsx.write(res);
      res.end();
    } else {
      res.status(400).json({ message: 'Unsupported format. Please use "excel" or "csv".' });
    }
  } catch (error) {
    console.error('Error exporting sales reports:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};