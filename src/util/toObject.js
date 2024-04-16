module.exports = {
    convertArrayToObjects: function (array, fields) {
        const objects = [];
    
        for (const record of array) {
            const object = {};
    
            fields.forEach((field, index) => {
                object[field] = record[index];
            });
    
            objects.push(object);
        }
    
        return objects;
    }
}


 