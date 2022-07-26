import db from '../util/database.js';

export class auth {

    constructor() {}

    static findEmail(email) {
        return db.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
    };

    static findUsername(username) {
        return db.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
    };

    static find(usernameEmail) {
        return db.execute(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [usernameEmail, usernameEmail]
        );
    };

    static findByID(userID) {
        return db.execute(
            'SELECT * FROM users WHERE userID = ?',
            [`${userID}`]
        );
    };

    static findByApiKey(apiKey) {
        return db.execute(
            'SELECT * FROM users WHERE apiKey = ?',
            [`${apiKey}`]
        );
    };


    static save(user) {
        return db.execute(
            'INSERT INTO users (userID, name, username, email, phoneNumber, apiKey, ipHistory, country, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [ user.userID, user.name, user.username, user.email, user.phoneNumber, user.apiKey, user.ipHistory, user.country, user.password ]
        );
    };

    static updateUser(user, condition="AND") {
        let sqlText = this.multipleUpdate(user, "users", condition);

        return db.execute(
            sqlText,
            user.NewColombNameValue
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

export class user {

    constructor() {}

    static orderBalDeduction(data, condition="AND") {
        let sqlText = this.multipleUpdate(data, "users", condition);

        return db.execute(
            sqlText,
            data.NewColombNameValue
        );
    };

    static getCurrentUser(user) {
        return db.execute(
            'SELECT * FROM users WHERE userID = ?',
            [user.userID]
        );
    };

    static getUserOrders(user) {
        return db.execute(
            'SELECT * FROM orders WHERE userID = ?',
            [user.userID]
        );
    };

    static getOrderById(order) {
        return db.execute(
            'SELECT * FROM orders WHERE id = ?',
            [`${order}`]
        );
    };

    static getOrderByOrderID(orderID) {
        return db.execute(
            'SELECT * FROM orders WHERE orderID = ?',
            [`${orderID}`]
        );
    };

    static getUserTickets(user) {
        return db.execute(
            'SELECT * FROM tickets WHERE userID = ?',
            [user.userID]
        );
    };

    static getTicket(ticket) {
        return db.execute(
            'SELECT * FROM tickets WHERE ticketID = ?',
            [ticket.ticketID]
        );
    };

    static getUserTicketMessage(data) {
        return db.execute(
            'SELECT * FROM ticket_messages WHERE ticketID = ?',
            [data.ticketID]
        );
    };

    static getUserPayments(user) {
        return db.execute(
            'SELECT * FROM payment_transactions WHERE userID = ?',
            [user.userID]
        );
    };

    static addFunds(funds) {
        return db.execute(
            'INSERT INTO payment_transactions (transactionID, userID, currency, paymentMethod, extraData, amount, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [ funds.transactionID, funds.userID, funds.currency, funds.paymentMethod, funds.extraData, funds.amount, funds.status, ]
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
    };
}