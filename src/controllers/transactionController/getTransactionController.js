const { TransactionInfo, TransactionDetail, User } = require('../../models/associations');

exports.getTransactionInfo = async (req, res) => {
  try {
    const transactions = await TransactionInfo.findAll({
      attributes: ['trid', 'trdate', 'total', 'payment', 'change', 'amount_given', 'buyername', 'userid'],
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['fullname'],
        },
      ],
    });

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found' });
    }

    res.status(200).json({
      message: 'Transactions retrieved successfully',
      data: transactions.map(transaction => ({
        trid: transaction.trid,
        trdate: transaction.trdate,
        total: transaction.total,
        payment: transaction.payment,
        change: transaction.change,
        amount_given: transaction.amount_given,
        buyername: transaction.buyername,
        userid: transaction.userid,
        cashier: transaction.User.fullname,
      })),
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getTransactionById = async (req, res) => {
  const { trid } = req.params;

  try {
    const transaction = await TransactionInfo.findOne({
      where: { trid },
      attributes: ['trid', 'trdate', 'total', 'payment', 'change', 'amount_given', 'buyername', 'userid'],
      include: [
        {
          model: TransactionDetail,
          as: 'Details',
          attributes: ['medicineid', 'batchid', 'amount'],
        },
        {
          model: User,
          as: 'User',
          attributes: ['fullname'],
        },
      ],
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json({
      message: 'Transaction retrieved successfully',
      data: {
        trid: transaction.trid,
        trdate: transaction.trdate,
        total: transaction.total,
        payment: transaction.payment,
        change: transaction.change,
        amount_given: transaction.amount_given,
        buyername: transaction.buyername,
        userid: transaction.userid,
        cashier: transaction.User.fullname,
        medicines: transaction.Details.map(detail => ({
          medicineid: detail.medicineid,
          batchid: detail.batchid,
          amount: detail.amount,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};