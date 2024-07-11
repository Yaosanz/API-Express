const axios = require('axios');

class BiteshipAPI {
    constructor(apiKey) {
        this.client = axios.create({
            baseURL: 'https://api.biteship.com', // Replace with the actual API base URL
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        this.couriers = "paxel,jne,jnt"; // available couriers https://biteship.com/id/docs/api/couriers/retrieve
    }

    async getRatesByCoordinates(origin, destination, catalog) {
        const bodyReq = {
            "origin_latitude": origin.latitude,
            "origin_longitude": origin.longitude,
            "destination_latitude": destination.latitude,
            "destination_longitude": destination.longitude,
            "couriers": this.couriers,
            "items": [{
                "name": catalog.name,
                "description": catalog.description,
                "value": catalog.price * 10,
                "weight": 1000,
                "quantity": 1
            }]
        }
        try {
            const response = await this.client.post(`/v1/rates/couriers`, bodyReq);
            return response.data;
        } catch (error) {
            // Handle error appropriately
            console.error(error);
            throw error;
        }
    }


    async createShipment(origin, destination, catalog, courier) {
        const bodyReq = {
            "shipper_contact_name": origin.recipient_name,
            "shipper_contact_phone": origin.number_phone,
            "shipper_contact_email": origin.email,
            "shipper_organization": "Sewain",
            "origin_contact_name": origin.recipient_name,
            "origin_contact_phone": origin.number_phone,
            "origin_address": origin.full_address,
            "origin_note": "",
            "origin_coordinate": {
                latitude: origin.latitude,
                longitude: origin.longitude
            },
            "destination_contact_name": destination.recipient_name,
            "destination_contact_phone": destination.number_phone,
            "destination_contact_email": destination.email,
            "destination_address": destination.full_address,
            "destination_coordinate": {
                latitude : destination.latitude,
                longitude: destination.latitude
            },
            "destination_note":"",
            "courier_company": courier.company,
            "courier_type": courier.type,
            "courier_insurance": catalog.price * 10,
            "delivery_type":"now",
            "order_note": "Please be careful",
            "metadata":{},
            "items": [
                {
                    "name" : catalog.name,
                    "description" : catalog.description,
                    "value" : catalog.price * 10,
                    "quantity" : 1,
                    "weight" : 1000,
                }
            ]
        }
        try {
            const response = await this.client.post(`/v1/orders`, bodyReq);
            return response.data;
        } catch (error) {
            // Handle error appropriately
            console.error(error);
            throw error;
        }
    }

    // Add more methods for other API functionalities like trackOrder, manageOrder, etc.

}

module.exports = BiteshipAPI;