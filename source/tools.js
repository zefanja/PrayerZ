var tools = {
    createDB: function() {
        try {
            this.db = openDatabase('ext:data', '', 'PrayerZ Data', 200000);
            enyo.log("Created/Opened database");
        } catch (e) {
            enyo.log("ERROR", e);       
        }
        
        switch (this.db.version) {
            case '':
                enyo.log("Create Tables...");
                this.dbCreateTables('', "1");
            break;
            /*case "1":
                enyo.log("Update Tables to 2");
                this.dbCreateTables("1", "2");
            break;
            case "2":
                enyo.log("Update Tables to 3");
                //this.dbCreateTables("2", "3");
            break; */
        }
    },
    
    dbCreateTables: function(oldVersion, newVersion) {
        try {
            var sql = "CREATE TABLE IF NOT EXISTS prayers (parent INTEGER, title TEXT, description TEXT, answer TEXT, study TEXT, tags TEXT, time INTEGER);";
            this.db.changeVersion(oldVersion, newVersion,
                enyo.bind(this,(function (transaction) { 
                    transaction.executeSql(sql, [], 
                        enyo.bind(this, function () {enyo.log("SUCCESS: Created prayers table");}),
                        enyo.bind(this,this.errorHandler)
                    ); 
                }))
            );
        } catch (e) {
            enyo.log("ERROR", e);
        }
    },

    errorHandler: function (transaction, error) {
        enyo.log("ERROR", error.message);
    }
};