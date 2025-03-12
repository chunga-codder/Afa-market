const Escrow = require('../models/Escrow'); // Assuming you have the Escrow model

// Webhook to handle Flutterwave payment updates
const handleFlutterwaveWebhook = async (req, res) => {
    const hash = req.headers['verif-hash'];
    
    if (!hash || hash !== process.env.FLUTTERWAVE_WEBHOOK_SECRET) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    const { tx_ref, status } = req.body;

    try {
        // Find the corresponding escrow entry by the transaction reference
        const escrow = await Escrow.findOne({ paymentReference: tx_ref });
        
        if (!escrow) {
            return res.status(404).json({ error: 'Escrow not found' });
        }
        
        if (status === 'successful') {
            // Mark escrow as 'released' if payment is successful
            escrow.status = 'released';
        } else if (status === 'failed') {
            // Handle failed payments, e.g., cancel the escrow
            escrow.status = 'failed';
        }
        
        await escrow.save();
        res.json({ message: 'Payment status updated' });
    } catch (error) {
        console.error('Error handling Flutterwave webhook:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports= {handleFlutterwaveWebhook}
