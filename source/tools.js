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

    addPrayer: function (title, description, tags, inCallback) {
        enyo.log(title, description, tags);
        var sec = new Date().getTime();
        try {
            var sql = "INSERT INTO prayers (parent, title, description, answer, study, tags, time) VALUES (?,?,?,?,?,?,?)";
            this.db.transaction(
                enyo.bind(this,(function (transaction) {
                    transaction.executeSql(sql, [0, title, description, "", "", tags, sec],
                    enyo.bind(this, function () {
                        enyo.log("Successfully inserted prayer!");
                        inCallback();
                    }),
                    enyo.bind(this,this.errorHandler));
                }))
            );
        } catch (e) {
            enyo.log("ERROR", e);
        }
    },

    getPrayers: function (inCallback) {
        var prayers = [];
        try {
            var sql = "SELECT * FROM prayers";
            this.db.transaction(
                enyo.bind(this,(function (transaction) {
                    transaction.executeSql(sql, [],
                    enyo.bind(this, function (transaction, results) {
                        for (var j=0; j<results.rows.length; j++) {
                            prayers.push({"title": results.rows.item(j).title, "description": results.rows.item(j).description, "tags": results.rows.item(j).tags});
                        }
                        inCallback(prayers);
                    }),
                    enyo.bind(this,this.errorHandler));
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