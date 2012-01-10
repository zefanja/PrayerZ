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
            var sql = "CREATE TABLE IF NOT EXISTS prayers (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, answer INTEGER NOT NULL DEFAULT 0, study TEXT, tags TEXT, time INTEGER, answerTime INTEGER);";
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
            var sql = "INSERT INTO prayers (title, description, tags, time) VALUES (?,?,?,?)";
            this.db.transaction(
                enyo.bind(this,(function (transaction) {
                    transaction.executeSql(sql, [title, description, tags, sec],
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

    updatePrayer: function (title, description, tags, study, id, inCallback) {
        //enyo.log(title, description, tags);
        try {
            //var sql = "INSERT INTO prayers (parent, title, description, answer, study, tags, time) VALUES (?,?,?,?,?,?,?)";
            var sql = 'UPDATE prayers SET title = "' + title + '", description = "' + description + '", tags = "' + tags + '", study = "' + study + '" WHERE id = "' + id + '"';
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

    answerPrayer: function (answer, id, inCallback) {
        try {
            var sec = new Date().getTime();
            var sql = 'UPDATE prayers SET answerTime = "' + sec + '", answer = "' + answer + '" WHERE id = "' + id + '"';
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

    getPrayers: function (day, answer, inCallback) {
        var prayers = [];
        var split = [];
        var tags = [];
        var exp = null;
        var tmp = "";
        var tmpTags = "";
        var find = 0;

        if (enyo.application.prefs.tags)
            tags = enyo.json.parse(enyo.application.prefs.tags);

        if (day !== "all" && tags.length !== 0) {
            if (tags[day] !== "") {
                split = tags[day].split(",");
                tmp = "";
                for (var k=0; k<split.length; k++) {
                    tmp += (k !== 0) ? "|\\b" + split[k].replace(/^\s/, "") + "\\b" : "\\b" + split[k].replace(/^\s/, "") + "\\b";
                }
                exp = new RegExp(tmp);
            } else {
                for (var r=0;r<tags.length;r++) {
                    if (tags[r] !== "") {
                        tmpTags += (tmpTags !== "") ? "," + tags[r] : tags[r];
                    }
                }
                split = tmpTags.split(",");
                tmp = "";
                for (var l=0; l<split.length; l++) {
                    if (split[l].replace(/^\s/, "") !== "")
                        tmp += (l !== 0) ? "|\\b" + split[l].replace(/^\s/, "") + "\\b" : "\\b" + split[l].replace(/^\s/, "") + "\\b";
                }
                exp = new RegExp(tmp);
            }
        }
        
        try {
            var sql = "";
            sql = (answer !== "true") ? "SELECT * FROM prayers WHERE answer != '1' ORDER BY title, tags ASC": "SELECT * FROM prayers ORDER BY title, tags ASC";
            //enyo.log(sql);
            this.db.transaction(
                enyo.bind(this,(function (transaction) {
                    transaction.executeSql(sql, [],
                    enyo.bind(this, function (transaction, results) {
                        for (var j=0; j<results.rows.length; j++) {
                            if (day !== "all" && tags.length !== 0 && tmp !== "") {
                                if (tags[day] !== "") {
                                    if (results.rows.item(j).tags.search(exp) != -1)
                                        prayers.push({"id": results.rows.item(j).id, "title": results.rows.item(j).title, "description": results.rows.item(j).description, "tags": results.rows.item(j).tags, "study": results.rows.item(j).study, "time": results.rows.item(j).time, "answerTime": results.rows.item(j).answerTime, "answer": results.rows.item(j).answer});
                                } else {
                                    split = results.rows.item(j).tags.split(",");
                                    find = 0;
                                    for (var l=0; l<split.length; l++) {
                                        if (split[l].replace(/^\s/, "") !== "" && split[l].search(exp) === -1)
                                            find += 1;
                                    }
                                    //enyo.log(split, find, exp);
                                    if (find > 0)
                                        prayers.push({"id": results.rows.item(j).id, "title": results.rows.item(j).title, "description": results.rows.item(j).description, "tags": results.rows.item(j).tags, "study": results.rows.item(j).study, "time": results.rows.item(j).time, "answerTime": results.rows.item(j).answerTime, "answer": results.rows.item(j).answer});
                                }
                            } else {
                                prayers.push({"id": results.rows.item(j).id, "title": results.rows.item(j).title, "description": results.rows.item(j).description, "tags": results.rows.item(j).tags, "study": results.rows.item(j).study, "time": results.rows.item(j).time, "answerTime": results.rows.item(j).answerTime, "answer": results.rows.item(j).answer});
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