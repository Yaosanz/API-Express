const axios = require('axios');

class XenditAPI {
  constructor(apiKey) {
    this.encodedKey = btoa(apiKey + ':');

    this.client = axios.create({
      baseURL: 'https://api.xendit.co',
      headers: {
        Authorization: `Basic ${this.encodedKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async createInvoice(data) {
    try {
      const response = await this.client.post('/v2/invoices', data);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getInvoiceById(invoiceId) {
    try {
      const response = await this.client.get(`/v2/invoices/${invoiceId}`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

module.exports = XenditAPI;
