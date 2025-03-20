// API call for Deposit
export const depositFunds = async (amount, mobileMoneyNumber, provider) => {
    try {
        const response = await axios.post('/api/payment/deposit', {
            amount,
            mobileMoneyNumber,
            provider,
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Something went wrong during deposit');
    }
};

// API call for Withdraw
export const withdrawFunds = async (amount, mobileMoneyNumber, provider) => {
    try {
        const response = await axios.post('/api/payment/withdraw', {
            amount,
            mobileMoneyNumber,
            provider,
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Something went wrong during withdrawal');
    }
};

// API call for Transfer Funds
export const transferFunds = async (amount, recipientId) => {
    try {
        const response = await axios.post('/api/payment/transfer', {
            amount,
            recipientId,
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Something went wrong during transfer');
    }
};
