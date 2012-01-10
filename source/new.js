enyo.kind({
    name: "PrayerZ.add",
    kind: "VFlexBox",
    events: {
        onBack: ""
    },
    components: [
        {kind: "Header", components: [
            //{kind: "Spacer"},
            {name: "btBack", kind: "Button", style: "margin-right: 20px;", caption: $L("Back"), onclick: "doBack"},
            {name: "headerCaption", content: $L("New Prayer"), flex: 1}
        ]},
        {name: "scrollerLeft", kind: "Scroller", flex: 1, components: [
            {className: "add-container", kind: "RowGroup", components: [
                {name: "titleInput", kind: "Input", hint: "", components: [
                    {content: $L("Title"), className: "text-label"}
                ]},
                {name: "descrInput", kind: "RichText", hint: $L("Add your description here.")},
                {name: "tagsInput", kind: "RichText", hint: "", components: [
                    {content: $L("Tags"), className: "text-label"}
                ]},
                {name: "studyInput", kind: "RichText", hint: $L("Add your notes here."), showing: false}
            ]},
            {kind: "HFlexBox", className: "add-container info", components: [
                {kind: "Button", caption: $L("Cancel"), flex: 1, onclick: "doBack"},
                {name: "btAddPrayer", kind: "Button", caption: $L("Add Prayer"), flex: 1, onclick: "addPrayer", className: "enyo-button-affirmative"}
            ]}
        ]}
    ],

    edit: false,
    rowID: 0,

    create: function () {
        this.inherited(arguments);
        if (enyo.fetchDeviceInfo() && enyo.fetchDeviceInfo().keyboardAvailable)
            this.$.btBack.hide();
    },

    addPrayer: function (inSender, inEvent) {
        var tmp = this.$.descrInput.getValue().split(",");
        enyo.log(tmp.length);
        if (tmp.length > 1 && !this.edit) {
            for (var i=0; i<tmp.length; i++) {
                enyo.log(tmp[i]);
                tools.addPrayer(this.$.titleInput.getValue(), tmp[i], this.$.tagsInput.getValue(), enyo.bind(this, this.addedPrayer));
            }
        } else {
            if (!this.edit)
                tools.addPrayer(this.$.titleInput.getValue(), this.$.descrInput.getValue(), this.$.tagsInput.getValue(), enyo.bind(this, this.addedPrayer));
            else
                tools.updatePrayer(this.$.titleInput.getValue(), this.$.descrInput.getValue().split(",")[0], this.$.tagsInput.getValue(), this.$.studyInput.getValue(), this.rowID, enyo.bind(this, this.addedPrayer));
        }
        this.doBack();
    },

    addedPrayer: function () {
        enyo.log("Added Prayer");
    },

    setPrayer: function (prayer) {
        this.edit = true;
        this.rowID = prayer.id;
        this.$.headerCaption.setContent($L("Edit Prayer"));
        this.$.btAddPrayer.setCaption($L("Edit Prayer"));
        this.$.titleInput.setValue(prayer.title);
        this.$.descrInput.setValue(prayer.description);
        this.$.tagsInput.setValue(prayer.tags);
        this.$.studyInput.show();
        this.$.studyInput.setValue(prayer.study);
    },

    clearInput: function () {
        this.edit = false;
        this.$.headerCaption.setContent($L("New Prayer"));
        this.$.btAddPrayer.setCaption($L("Add Prayer"));
        this.$.titleInput.setValue("");
        this.$.descrInput.setValue("");
        this.$.tagsInput.setValue("");
        this.$.studyInput.hide();
        this.$.studyInput.setValue("");
    },

    setFocus: function () {
        this.$.titleInput.forceFocusEnableKeyboard();
    }

});