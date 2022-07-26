import db from '../util/database.js';

// module.exports = class user {
export class services {

    constructor() { }

    static getSpecificService(services) {
        return db.execute(
            `SELECT * FROM services WHERE ${services.tbColomb} = ?`,
            [services.value]
        );
    };

    static getServiceByID(serviceID) {
        return db.execute(
            `SELECT * FROM services WHERE serviceID = ?`,
            [`${serviceID}`]
        );
    };

    static getAllServices() {
        return db.execute(
            'SELECT * FROM services WHERE 1;'
        );
    };


    static deleteService(services) {
        return db.execute(
            `DELETE FROM services WHERE (${services.key}) = ${services.keyValue}`,
            [ services.value ]
        )
    };

    static updateService(services) {
        return db.execute(
            `UPDATE services SET ${services.name} = ? WHERE ${services.key} = ?;`,
            [ services.value, services.keyValue ]
        )
    };

    static updateMultipleServices(services) {
        let sqlText = this.multipleUpdate(services, 'OR', 'services');

        return db.execute(
            `${sqlText}`,
            services.NewColombNameValue
        )
    };

    static addService(services) {
        return db.execute(
            'INSERT INTO services (serviceID, serviceProvider, serviceCategory, serviceType, providerRate, resellRate, minOrder, maxOrder, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [ 
                services.serviceID, 
                services.serviceProvider, 
                services.serviceCategory, 
                services.serviceType, 
                services.providerRate, 
                services.resellRate, 
                services.minOrder, 
                services.maxOrder, 
                services.description, 
                // services.updatedAt, 
                // services.updatedAt 
            ]
        )
    };




    static multipleUpdate(data, condition, tableName) {
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