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
            var sql = "CREATE TABLE IF NOT EXISTS prayers (id INTEGER PRIMARY KEY AUTOINCREMENT, parent INTEGER, title TEXT, description TEXT, answer TEXT, study TEXT, tags TEXT, time INTEGER);";
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
        //enyo.log(title, description, tags);
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

    updatePrayer: function (title, description, tags, id, inCallback) {
        //enyo.log(title, description, tags);
        try {
            //var sql = "INSERT INTO prayers (parent, title, description, answer, study, tags, time) VALUES (?,?,?,?,?,?,?)";
            var sql = 'UPDATE prayers SET title = "' + title + '", description = "' + description + '", tags = "' + tags + '" WHERE id = "' + id + '"';
            this.db.transaction(
                enyo.bind(this,(function (transaction) {
                    transaction.executeSql(sql, [],
                    enyo.bind(this, function () {
                        enyo.log("Successfully updated prayer!");
                        inCallback();
                    }),
                    enyo.bind(this,this.errorHandler));
                }))
            );
        } catch (e) {
            enyo.log("ERROR", e);
        }
    },

    deletePrayer: function (id, inCallback) {
        //enyo.log(title, description, tags);
        try {
            //var sql = "INSERT INTO prayers (parent, title, description, answer, study, tags, time) VALUES (?,?,?,?,?,?,?)";
            var sql = 'DELETE FROM prayers WHERE id = "' + id + '"';
            this.db.transaction(
                enyo.bind(this,(function (transaction) {
                    transaction.executeSql(sql, [],
                    enyo.bind(this, function () {
                        enyo.log("Successfully deleted prayer!");
                        inCallback();
                    }),
                    enyo.bind(this,this.errorHandler));
                }))
            );
        } catch (e) {
            enyo.log("ERROR", e);
        }
    },

    getPrayers: function (day, inCallback) {
        var prayers = [];
        var split = [];
        var tags = [];
        var exp = null;
        var tmp = "";
        if (enyo.application.prefs.tags)
            tags = enyo.json.parse(enyo.application.prefs.tags);

        try {
            var sql = "SELECT * FROM prayers ORDER BY title, tags ASC";
            this.db.transaction(
                enyo.bind(this,(function (transaction) {
                    transaction.executeSql(sql, [],
                    enyo.bind(this, function (transaction, results) {
                        for (var j=0; j<results.rows.length; j++) {
                            if (day !== "all") {
                                if (tags[day] !== "") {
                                    split = tags[day].split(",");
                                    tmp = "";
                                    for (var k=0; k<split.length; k++) {
                                        if (k !== 0)
                                            tmp += "|\\b" + split[k].replace(/^\s/, "") + "\\b";
                                        else
                                            tmp += "\\b" + split[k].replace(/^\s/, "") + "\\b";
                                    }
                                    exp = new RegExp(tmp);
                                    if (results.rows.item(j).tags.search(exp) != -1)
                                        prayers.push({"id": results.rows.item(j).id, "title": results.rows.item(j).title, "description": results.rows.item(j).description, "tags": results.rows.item(j).tags});
                                }
                            } else {
                                prayers.push({"id": results.rows.item(j).id, "title": results.rows.item(j).title, "description": results.rows.item(j).description, "tags": results.rows.item(j).tags});
                            }
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

    getTags: function (inCallback) {
        var tags = [];
        var tmp = "";
        var tmpTags = [];
        var split = [];
        try {
            var sql = "SELECT tags FROM prayers ORDER BY tags ASC";
            this.db.transaction(
                enyo.bind(this,(function (transaction) {
                    transaction.executeSql(sql, [],
                    enyo.bind(this, function (transaction, results) {
                        for (var j=0; j<results.rows.length; j++) {
                            if (results.rows.item(j).tags.split(",").length > 1) {
                                split = results.rows.item(j).tags.split(",");
                                for (var k=0; k<split.length; k++) {
                                    tmpTags.push(split[k].replace(/^\s/, ""));
                                }
                            } else {
                                tmpTags.push(results.rows.item(j).tags.replace(/^\s/, ""));
                            }
                        }
                        tmpTags = tmpTags.sort();
                        for (var i=0;i<tmpTags.length; i++) {
                            if (i !== 0 && tmpTags[i] !== tmpTags[i-1]) {
                                tags.push(tmpTags[i]);
                            } else if (i === 0) {
                                tags.push(tmpTags[i]);
                            }
                        }
                        inCallback(tags);
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