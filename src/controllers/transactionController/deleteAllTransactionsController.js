const { TransactionInfo, TransactionDetail } = require('../../models/associations');

exports.deleteAllTransactions = async (req, res) => {
  try {
    await TransactionDetail.destroy({ where: {} });
    await TransactionInfo.destroy({ where: {} });

    res.status(200).json({ message: 'All transactions deleted successfully' });
  } catch (error) {
    console.error('Error deleting transactions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};