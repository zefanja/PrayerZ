/**
    For simple applications, you might define all of your views in this file.
    For more complex applications, you might choose to separate these kind definitions
    into multiple files under this folder.
*/

enyo.kind({
    name: "prayerz.MainView",
    kind: "FittableRows",
    fit: true,
    bindings: [
        {from: '.app.$.prayers', to: '.$.prayerList.collection'}
    ],
    components:[
        {kind: "onyx.Toolbar", components: [
            {content: "PrayerZ"},
            {kind: "onyx.Button", content: "Tap Me", ontap: "tapped"}
        ]},
        {kind: "enyo.DataList", name: "prayerList", fit: true, components: [
            {components: [
                {name: "title"},
                {name: "tags"}
            ],
            bindings: [
                {from: ".model.title", to: ".$.title.content"},
                {from: ".model.tags", to: ".$.tags.content"}
            ]}
        ]}
    ],

    tapped: function () {
        //this.inherited(arguments);
        //this.get(".app.$.prayers").add({title: "Mein anderes Anliegen", tags: "Allgemein, Familie"});
        var prayer = new pz.Prayer({
            title: "Mein anderes Anliegen",
            tags: "Schule, Familie"
        });
        prayer.commit({
            source: "idb",
            success: function(rec, opts, res) {
                // Now add to the collection if new
                this.get('.app.$.prayers').add(prayer);

            }.bind(this),
            fail: function(rec, opts, res) {
                this.error('Failed to commit a user:', res);
            }.bind(this)
        });

    }
});
