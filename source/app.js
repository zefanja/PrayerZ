/**
    Define and instantiate your enyo.Application kind in this file.  Note,
    application rendering should be deferred until DOM is ready by wrapping
    it in a call to enyo.ready().
*/
enyo.kind({
    name: 'prayerz.App',
    kind: 'enyo.Application',
    autoStart: false,
    components: [
        {kind: 'enyo.Signals', onIDBOpened: 'onIDBReady'},
        {name: 'prayers', kind: 'enyo.Collection', model: 'pz.Prayer', url: 'prayer'},
        {name: 'tags', kind: 'enyo.Collection', model: 'pz.Tag', url: 'tag'}
    ],

    create: enyo.inherit(function(sup) {
        return function() {
            var idbSource;
            sup.apply(this, arguments);

            try {
                var idbPrayerz = new indexeddb.Source({
                    dbName: 'prayerz',
                    dbVersion: 1,
                    dbInitSchema: this.initSchema.bind(this)
                });

                enyo.store.addSources({
                    'idb': idbPrayerz
                });
            } catch(error) {
                this.error('Failed to initialize IDB:', error);
            }
        };
    }),

    view: 'prayerz.MainView',
    onIDBReady: function(sender, event) {
        if (event.error) {
            this.error('Failed to initialize IndexedDB:', event.error);
            return true;
        }

        this.$.prayers.fetch({
            source: 'idb',
            success: function(rec, opts, res) {
                this.log('Great success, starting...');
                this.start();
            }.bind(this),
            fail: function(rec, opts, error) {
                this.error(error);
            }.bind(this)
        });

        return true;
    },

    initSchema: function(error, db, oldVer, newVer) {
        if (error) {
            this.error('Failed to open IndexedDB:', error);
            return;
        }

        // Create 'prayer' store if doesn't exist
        if (!db.objectStoreNames.contains('prayers')) {
            db.createObjectStore('prayer', {keyPath: 'id', autoIncrement: true});
        }

        // Create 'tag' store if doesn't exist
        if (!db.objectStoreNames.contains('prayers')) {
            db.createObjectStore('tag', {keyPath: 'id', autoIncrement: true});
        }
    }
});

enyo.kind({
    name: 'pz.Prayer',
    kind: 'enyo.Model',
    url: 'prayer'
});

enyo.kind({
    name: 'pz.Tag',
    kind: 'enyo.Model',
    url: 'tag'
});

enyo.ready(function() {
    new prayerz.App().renderInto(document.body);
});