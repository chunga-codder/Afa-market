const Escrow = require('../models/Escrow');
const axios = require('axios'); // For optional Flutterwave transaction verification

// Webhook to handle Flutterwave payment updates
const handleFlutterwaveWebhook = async (req, res) => {
    const hash = req.headers['verif-hash'];

    if (!hash || hash !== process.env.FLUTTERWAVE_WEBHOOK_SECRET) {
        console.warn('Unauthorized webhook attempt');
        return res.status(403).json({ error: 'Unauthorized' });
    }

    const { tx_ref, status, transaction_id } = req.body;

    try {
        // Find the escrow record
        const escrow = await Escrow.findOne({ paymentReference: tx_ref });

        if (!escrow) {
            console.error(`Escrow not found for tx_ref: ${tx_ref}`);
            return res.status(404).json({ error: 'Escrow not found' });
        }

        // (Optional) Verify the transaction directly with Flutterwave API
        const FLW_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;
        const verificationUrl = `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`;

        const response = await axios.get(verificationUrl, {
            headers: { Authorization: `Bearer ${FLW_SECRET_KEY}` },
        });

        if (response.data.status !== 'success' || response.data.data.status !== 'successful') {
            console.warn(`Payment verification failed for tx_ref: ${tx_ref}`);
            return res.status(400).json({ error: 'Payment verification failed' });
        }

        // Update escrow status based on payment status
        if (status === 'successful') {
            escrow.status = 'released';
        } else if (status === 'failed') {
            escrow.status = 'failed';
        }

        await escrow.save();

        console.log(`Escrow updated successfully: ${tx_ref}, status: ${escrow.status}`);
        res.json({ message: 'Payment status updated' });

    } catch (error) {
        console.error('Error handling Flutterwave webhook:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { handleFlutterwaveWebhook };
