enyo.kind({
    name: "PrayerZ.add",
    kind: "VFlexBox",
    events: {
        onBack: ""
    },
    components: [
        {kind: "Header", components: [
            //{kind: "Spacer"},
            {name: "headerCaption", content: $L("New Prayer"), flex: 1},
            {kind: "Button", caption: $L("Back"), onclick: "doBack"}
        ]},
        {name: "scrollerLeft", kind: "Scroller", flex: 1, components: [
            {className: "add-container", kind: "RowGroup", components: [
                {name: "titleInput", kind: "Input", hint: "", components: [
                    {content: $L("Title"), className: "text-label"}
                ]},
                {name: "descrInput", kind: "RichText", hint: $L("Add your description here.")},
                {name: "tagsInput", kind: "RichText", hint: "", components: [
                    {content: $L("Tags"), className: "text-label"}
                ]}
            ]},
            {kind: "HFlexBox", className: "add-container info", components: [
                {kind: "Button", caption: $L("Cancel"), flex: 1, onclick: "doBack"},
                {name: "btAddPrayer", kind: "Button", caption: $L("Add Prayer"), flex: 1, onclick: "addPrayer", className: "enyo-button-affirmative"}
            ]}
        ]}
    ],

    edit: false,
    rowID: 0,

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
                tools.updatePrayer(this.$.titleInput.getValue(), this.$.descrInput.getValue().split(",")[0], this.$.tagsInput.getValue(), this.rowID, enyo.bind(this, this.addedPrayer));
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
    },

    clearInput: function () {
        this.edit = false;
        this.$.headerCaption.setContent($L("New Prayer"));
        this.$.btAddPrayer.setCaption($L("Add Prayer"));
        this.$.titleInput.setValue("");
        this.$.descrInput.setValue("");
        this.$.tagsInput.setValue("");
    },

    setFocus: function () {
        this.$.titleInput.forceFocusEnableKeyboard();
    }

});