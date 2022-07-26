import db from '../util/database.js';

export class general {

    constructor() { }

    static getSpecificService(services) {
        return db.execute(
            `SELECT * FROM services WHERE ${services.tbColomb} = ?`,
            [services.value]
        );
    };

    // get Active Api Provider
    static getActiveApiProvider(data) {
        return db.execute(
            `SELECT * FROM API_Provider WHERE ${data.tbName} = ?`,
            [data.tbValue]
        );
    };

    // get All Api Provider
    static getAllApiProvider() {
        return db.execute(
            'SELECT * FROM API_Provider WHERE 1'
        );
    };

    // delete Api Provider
    static deleteApiProvider(data) {
        return db.execute(
            `DELETE FROM API_Provider WHERE (${data.key}) = ${data.keyValue}`,
            [ data.value ]
        )
    };

    // update Api Provider
    static updateApiProvider(data) {
        return db.execute(
            `UPDATE API_Provider SET (${data.name}) VALUES (?) WHERE (${data.key}) VALUES (?)`,
            [ data.value, data.keyValue ]
        )
    };

    // Add New Provider API to the Database
    static addNewApiProvider(data) {
        return db.execute(
            'INSERT INTO API_Provider (APIproviderID, userID, name, url, key, balance, currency, description, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [ 
                data.APIproviderID, 
                data.userID, 
                data.name, 
                data.url, 
                data.key, 
                data.balance, 
                data.currency, 
                data.description, 
                data.status, 
                // data.updatedAt, 
                // data.updatedAt 
            ]
        )
    };

    // add new order to the DB
    static placeOrder(order) {
        return db.execute(
            'INSERT INTO orders (orderID, serviceID, type, APIproviderID, userID, link, quantity, amount, costAmount, apiCharge, profit, note, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [ order.orderID, order.serviceID, order.type, order.APIproviderID, order.userID, order.link, order.quantity, order.amount, order.costAmount, null, order.profit, order.note, order.status ]
        )
    };

    // update order records to the DB
    static updateOrder(data, condition="AND") {
        let sqlText = this.multipleUpdate(data, "orders", condition);

        return db.execute(
            sqlText,
            data.NewColombNameValue
        )
    };

    // create New Ticket
    static createNewTicket(ticket) {
        return db.execute(
            'INSERT INTO tickets (ticketID, userID, subject, message, attachedFile) VALUES (?, ?, ?, ?, ?)',
            [ ticket.ticketID, ticket.userID, ticket.subject, ticket.message, ticket.attachedFile]
        );
    };

    // create ticket messages
    static ticket_messages(ticketMsg) {
        return db.execute(
            'INSERT INTO ticket_messages (userID, ticketID, message, attachedFile) VALUES (?, ?, ?, ?)',
            [ ticketMsg.userID, ticketMsg.ticketID, ticketMsg.message, ticketMsg.attachedFile ]
        )
    };

    // update Ticket records on the DB
    static updateTicket(data, condition="AND") {
        let sqlText = this.multipleUpdate(data, "tickets", condition);

        return db.execute(
            sqlText,
            data.NewColombNameValue
        );
    };

    // update ticket messages records on the DB
    static updateTicketMessages(data, condition="AND") {
        let sqlText = this.multipleUpdate(data, "ticket_messages", condition);

        return db.execute(
            sqlText,
            data.NewColombNameValue
        );
    };

    // get Payment Method
    static getPaymentMethods() {
        return db.execute(
            'SELECT * FROM payment_method WHERE 1',
        );
    };


    // API section

    // get order by orderID
    static getOrder(orderID) {
        return db.execute(
            'SELECT * FROM orders WHERE orderID = ?',
            [`${orderID}`]
        );
    };

    // get order by id
    static getOrderBy_id(id) {
        return db.execute(
            'SELECT * FROM orders WHERE id = ?',
            [`${id}`]
        );
    };

    // get user orders
    static getUserOrderBy(userID) {
        return db.execute(
            'SELECT * FROM orders WHERE userID = ?',
            [`${userID}`]
        );
    };

    // get user orders by status (pending/processing )
    static getUserOrderByStatus(data) {
        return db.execute(
            `SELECT * FROM orders WHERE userID = ? AND (status = ? OR status = ?)`,
            [`${data.userID}`, `${data.status1}`, `${data.status2}`]
        );
    };

    // get all orders by status (pending/processing)
    static getAllOrderByStatus(status) {
        return db.execute(
            'SELECT * FROM orders WHERE status = ?',
            [`${status}`]
        );
    };



    static multipleUpdate(data, tableName, condition) {
        let sqlText = `UPDATE ${tableName} SET `

        for (let i = 0; i < data.colombName.length; i++) {
            const element = data.colombName[i];

            if (i === 0) {
                sqlText += `${element} = ?`;
            } else {
                sqlText += `, ${element} = ?`;
            }
        }

        for (let i = 0; i < data.conditionColombName.length; i++) {
            const conditionName = data.conditionColombName[i];
            const elconditionValue = data.conditionColombValue[i];

            if (i === 0) {
                sqlText += ` WHERE ${tableName}.${conditionName} = '${elconditionValue}'`;
            } else {
                sqlText += ` ${condition} ${tableName}.${conditionName} =' ${elconditionValue}'`;
            }
        }

        return sqlText;
    }
}
	