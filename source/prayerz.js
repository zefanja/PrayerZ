enyo.kind({    name: "PrayerZ.main",    kind: enyo.VFlexBox,    components: [        {kind: "AppMenu", components: [            {caption: $L("Preferences"), onclick: "openPrefs"},            {caption: $L("Help"), onclick: "openHelp"},            {caption: $L("Leave A Review"), onclick: "openReview"},            {caption: $L("About"), onclick: "openAbout"}        ]},        {name: "main", flex: 1, kind: "Pane", transitionKind: "enyo.transitions.Simple", onSelectView: "viewSelected", components: [            {name: "list", kind: "PrayerZ.list", onAdd: "openNewPrayer", onEdit: "editPrayer"},            {name: "add", kind: "PrayerZ.add", onBack: "openListView"},            {name: "prefs", kind: "PrayerZ.preferences", onBack: "openListView"}        ]}    ],    create: function () {        this.inherited(arguments);        tools.createDB();        tools.getPrayers(enyo.bind(this.$.list, this.$.list.handlePrayers));    },    openListView: function (inSender, inEvent) {        this.$.main.selectViewByName("list");    },    openNewPrayer: function (inSender, inEvent) {        this.$.main.selectViewByName("add");        this.$.add.clearInput();        this.$.add.setFocus();    },    openPrefs: function (inSender, inEvent) {        this.$.main.selectViewByName("prefs");        tools.getTags(enyo.bind(this.$.prefs, this.$.prefs.handleTags));    },    editPrayer: function (inSender, inEvent) {        enyo.log(inSender.rowIndex);        this.$.main.selectViewByName("add");        this.$.add.setPrayer(inSender.allPrayers[inSender.rowIndex]);    },    viewSelected: function (inSender, inView, inPreviousView) {        //enyo.log(inView.name);        switch (inView.name) {            case "list":                tools.getPrayers(enyo.bind(this.$.list, this.$.list.handlePrayers));            break;        }    },    openAppMenuHandler: function() {        this.$.appMenu.open();    },        closeAppMenuHandler: function() {        this.$.appMenu.close();    }});