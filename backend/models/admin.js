import db from '../util/database.js';

export class admin {

    constructor() { }

    static getApiBalance() {
        return db.execute(
            `SELECT API_Provider.balance AS apiBalance FROM API_Provider WHERE  API_Provider.status = 1;`,
        )
    };

    static getTotalOrders() {
        return db.execute(
            `SELECT COUNT(orders.id) AS totalOrders FROM orders;`,
        )
    };

    static getTotalProfit() {
        return db.execute(
            // `SELECT SUM(orders.profit) AS totalProfit FROM orders WHERE status != 'Refunded';`,
            `SELECT SUM(orders.amount - orders.apiCharge) AS totalProfit FROM orders WHERE status != 'Refunded';`,
        )
    };

    static getMonthlyProfit() {
        return db.execute(
            `SELECT SUM(orders.amount - orders.apiCharge) AS monthlyProfit 
             FROM orders 
             WHERE status != 'Refunded'
             AND createdAt = ${new Date().getMonth()}
             ;
            `,
        )
    };
    
    static getTotalPayments() {
        return db.execute(
            `SELECT COUNT(payment_transactions.id) AS totalPayments FROM payment_transactions;`,
        )
    };

    static getTotalUsers() {
        return db.execute(
            `SELECT COUNT(users.id) AS totalUsers FROM users WHERE 1;`,
        )
    };

    static getTotalUserUsers() {
        return db.execute(
            `SELECT COUNT(users.id) AS totalUsers FROM users WHERE role != 'admin';`,
        )
    };

    static getTotalTickets() {
        return db.execute(
            `SELECT COUNT(tickets.id) AS totalTickets FROM tickets WHERE tickets.status = 1;`,
        )
    };

    static getDashboardOrders() {
        return db.execute(
            `SELECT * FROM orders LIMIT 10;`,
        )
    };

    static getAllActiveTicket() {
        return db.execute(
            `SELECT * FROM tickets WHERE tickets.status = 1;`,
        )
    };

    static getTicket(ticket) {
        return db.execute(
            'SELECT * FROM tickets WHERE ticketID = ?',
            [ticket.ticketID]
        );
    };

    static getTicketMessage(data) {
        return db.execute(
            'SELECT * FROM ticket_messages WHERE ticketID = ?',
            [data.ticketID]
        );
    };

    static closeTicket(ticketID) {
        return db.execute(
            `UPDATE tickets SET status = 0 WHERE tickets.ticketID = ${ticketID};`
        );
    };

    static getUserByID(userID) {
        return db.execute(
            'SELECT * FROM users WHERE userID = ?;',
            [`${userID}`]
        );
    };

    static deduct_upgradeUserBalance(user) {
        return db.execute(
            'UPDATE users SET balance = ? WHERE users.userID = ?;',
            // `UPDATE users SET balance = ${user.balance} WHERE users.userID = ${user.userID};`,
            [user.balance, user.userID]
        );
    };

    static getAllUsers() {
        return db.execute(
            'SELECT * FROM users WHERE 1;',
        );
    };

    static getAllUserUsers() {
        return db.execute(
            `SELECT * FROM users WHERE role != 'admin';`,
        );
    };

    static getAllOrders() {
        return db.execute(
            'SELECT * FROM orders WHERE 1;',
            // [user.userID]
        );
    };

    static getAllPayments() {
        return db.execute(
            'SELECT * FROM payment_transactions WHERE 1;',
            // [user.userID]
        );
    };

    static deleteService(data) {
        return db.execute(
            `DELETE FROM services WHERE services.serviceID = ?;`,
            [ data ]
        )
    };

    static getAllProviders() {
        return db.execute(
            'SELECT * FROM API_Provider;',
            // [user.userID]
        );
    };

    static changeProviderStatus(data) {
        return db.execute(
            `UPDATE API_Provider SET status = '${data.status}' WHERE API_Provider.id = '${data.id}';`
            // [data.status]
        );
    };

    static deleteApiProvider(data) {
        return db.execute(
            `DELETE FROM API_Provider WHERE API_Provider.id = '${data}';`
        );
    };

    static getQueriedProvider(data) {
        return db.execute(
            'SELECT * FROM API_Provider WHERE APIproviderID = ?;',
            [data]
        );
    };

    // Add New Provider API to the Database
    static addNewApiProvider(data) {
        return db.execute(
            'INSERT INTO API_Provider (APIproviderID, userID, name, url, apiKey, balance, currency, description, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);',
            [ 
                data.APIproviderID, 
                data.userID, 
                data.name, 
                data.url, 
                data.apiKey, 
                data.balance, 
                data.currency, 
                data.description, 
                data.status
            ]
        )
    };

    // Update Multiple API Provider colomb
    static updateApiProvider(data, condition) {
        let sqlText = this.multipleUpdate(data, "API_Provider" || data.tableName, condition);

        return db.execute(
            sqlText,
            data.NewColombNameValue
        )
    };

    static updateUserRole(user) {
        return db.execute(
            'UPDATE users SET role = ? WHERE users.userID = ?;',
            [user.role, user.userID]
        );
    };

    static getAllPaymentMethods() {
        return db.execute(
            'SELECT * FROM payment_method;',
            // [user.userID]
        );
    };

    static getQueriedPaymentMethod(data) {
        return db.execute(
            'SELECT * FROM payment_method WHERE paymentMethodID = ?;',
            [data]
        );
    };


    // Add New Payment Method to the Database
    static addNewPaymentMethod(data) {
        return db.execute(
            'INSERT INTO payment_method (paymentMethodID, name, currency, minAmount, maxAmount, exchangeRate, data, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
            [ 
                data.paymentMethodID, 
                data.name, 
                data.currency, 
                data.minAmount, 
                data.maxAmount, 
                data.exchangeRate, 
                data.data, 
                data.status
            ]
        )
    };

    // update Payment Method
    static updatePaymentMethod(data, condition) {
        let sqlText = this.multipleUpdate(data, "payment_method" || data.tableName, condition);

        return db.execute(
            sqlText,
            data.NewColombNameValue
        )
    };

    static deletePaymentMethod(data) {
        return db.execute(
            `DELETE FROM payment_method WHERE payment_method.id = '${data}';`
        );
    };

    static getReportYears(createdAt = 'createdAt', tbName = 'users') {
        return db.execute(
            `SELECT DISTINCT YEAR(${createdAt}) AS years FROM ${tbName};`,
            // [data]
        );
    };

    // get Users Report data
    static getUsersReport(data, colombName='createdAt') {
        // updatedAt, createdAt, 
        let sqlText = `
            SELECT 
                DATE_FORMAT(updatedAt, '%m/%d/%y') AS updatedAt,
                DATE_FORMAT(createdAt, '%m/%d/%y') AS createdAt,
                SUM(balance) AS totalBalance, 
                COUNT(${colombName}) AS numCount
            FROM users
        `;
        
        switch (data.date) {
            case 'year':
                sqlText += ` GROUP BY EXTRACT(YEAR FROM ${colombName});`;
                break;
        
            case 'month':
                sqlText += ` 
                    WHERE EXTRACT(YEAR FROM ${colombName}) = ${data.year} 
                    GROUP BY EXTRACT(MONTH FROM ${colombName});
                `;
                break;
        
            case 'day':
                sqlText += ` 
                    WHERE EXTRACT(YEAR FROM ${colombName}) = ${data.year}
                    AND EXTRACT(MONTH FROM ${colombName}) = ${data.month}
                    GROUP BY EXTRACT(DAY FROM ${colombName});
                `;
                break;
        
            default:
                // AND EXTRACT(MONTH FROM ${data.colombName}) = ${data.month}
                sqlText += ` 
                    WHERE ${colombName} > (curdate() - interval 30 day)
                    AND EXTRACT(YEAR FROM ${colombName}) = ${data.year}
                    GROUP BY EXTRACT(DAY FROM ${colombName});
                `;
                break;
        }

        return db.execute(
            sqlText,
        );
    }

    // get Payments Report data
    static getPaymentsReport(data, colombName='createdAt') {
        // updatedAt, createdAt, 
        let sqlText = `
            SELECT 
                DATE_FORMAT(updatedAt, '%m/%d/%y') AS updatedAt,
                DATE_FORMAT(createdAt, '%m/%d/%y') AS createdAt,
                COUNT(${colombName}) AS numCount, 
                SUM(amount) as totalAmount
            FROM payment_transactions
        `;

        switch (data.date) {
            case 'year':
                sqlText += ` GROUP BY EXTRACT(YEAR FROM ${colombName});`;
                break;
        
            case 'month':
                sqlText += ` 
                    WHERE EXTRACT(YEAR FROM ${colombName}) = ${data.year} 
                    GROUP BY EXTRACT(MONTH FROM ${colombName});
                `;
                break;
        
            case 'day':
                sqlText += ` 
                    WHERE EXTRACT(YEAR FROM ${colombName}) = ${data.year}
                    AND EXTRACT(MONTH FROM ${colombName}) = ${data.month}
                    GROUP BY EXTRACT(DAY FROM ${colombName});
                `;
                break;
        
            default:
                // AND EXTRACT(MONTH FROM ${colombName}) = ${data.month}
                sqlText += ` 
                    WHERE ${colombName} > (curdate() - interval 30 day)
                    AND EXTRACT(YEAR FROM ${colombName}) = ${data.year}
                    GROUP BY EXTRACT(DAY FROM ${colombName});
                `;
                break;
        }

        return db.execute(
            sqlText,
        );
    }

    // get Orders Report data
    static getOrdersReport(data, colombName='createdAt') {
        // updateAt, createdAt, 
        let sqlText = `
            SELECT 
                SUM(quantity) AS totalProccessed, 
                SUM(amount) AS totalAmount, 
                SUM(costAmount) AS totalCost, 
                SUM(apiCharge) AS totalSpent, 
                SUM(profit) AS sumProfit, 
                DATE_FORMAT(updateAt, '%m/%d/%y') AS updatedAt,
                DATE_FORMAT(createdAt, '%m/%d/%y') AS createdAt,
                COUNT(${colombName}) AS numCount, 
                SUM(apiCharge - amount) AS totalProfit
            FROM orders
        `;
        
        switch (data.date) {
            case 'year':
                sqlText += ` GROUP BY EXTRACT(YEAR FROM ${colombName});`;
                break;
        
            case 'month':
                sqlText += ` 
                    WHERE EXTRACT(YEAR FROM ${colombName}) = ${data.year} 
                    GROUP BY EXTRACT(MONTH FROM ${colombName});
                `;
                break;
        
            case 'day':
                sqlText += ` 
                    WHERE EXTRACT(YEAR FROM ${colombName}) = ${data.year}
                    AND EXTRACT(MONTH FROM ${colombName}) = ${data.month}
                    GROUP BY EXTRACT(DAY FROM ${colombName});
                `;
                break;
        
            default:
                // AND EXTRACT(MONTH FROM ${colombName}) = ${data.month}
                sqlText += ` 
                    WHERE ${colombName} > (curdate() - interval 30 day)
                    AND EXTRACT(YEAR FROM ${colombName}) = ${data.year}
                    GROUP BY EXTRACT(DAY FROM ${colombName});
                `;

                break;
        }

        return db.execute(
            sqlText,
        );
    }




    static sdfsdeletdfgdfeService(data) {
        for (let i = 0; i < data.length; i++) {
            const element = data[i];

            let opr = i+1; 
            if (opr  == data.length) {
                return db.execute(
                    `DELETE FROM services WHERE serviceID = ${element};`,
                    // `DELETE FROM services WHERE serviceID = ${data.keyValue}`,
                    // [ data.value ]
                )
            } else {
                db.execute(
                    `DELETE FROM services WHERE serviceID = ${element};`,
                    // `DELETE FROM services WHERE serviceID = ${data.keyValue}`,
                    // [ data.value ]
                )
            }
  
        }
    };


    // static deleteApiProvider(data) {
    //     return db.execute(
    //         `DELETE FROM API_Provider WHERE (${data.key}) = ${data.keyValue}`,
    //         [ data.value ]
    //     )
    // };


    static multipleUpdate(data, tableName, condition="AND") {
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