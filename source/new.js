enyo.kind({
    name: "PrayerZ.new",
    kind: "VFlexBox",
    events: {
        onBack: ""
    },
    components: [
        {kind: "Header", components: [
            {kind: "Button", caption: $L("Back"), onclick: "doBack"},
            {kind: "Spacer"},
            {content: $L("New Prayer"), flex: 1}
        ]},
        {name: "scrollerLeft", kind: "Scroller", flex: 1, components: [
            {name: "titleInput", kind: "Input", hint: "", components: [
                {content: $L("Title"), className: "text-label"}
            ]},
            {name: "descrInput", kind: "RichText", hint: $L("Add your description here.")},
            /*{kind: "HFlexBox", components: [
                {name: "folderInput", flex: 10, hint: "", kind: "Input", components: [
                    {content: $L("Folder"), className: "text-label"}
                ]},
                {kind: "IconButton", flex: 1, icon: "images/folder.png", onclick: "openFolders"}
                
            ]}, */
            {name: "tagsInput", kind: "RichText", hint: "", components: [
                {content: $L("Tags"), className: "text-label"}
            ]},
            {kind: "HFlexBox", components: [
                {kind: "Button", caption: $L("Cancel"), flex: 1, onclick: "doBack"},
                {name: "btAddPrayer", kind: "Button", caption: $L("Add Prayer"), flex: 1, onclick: "addPrayer", className: "enyo-button-affirmative"}
            ]}
            
        ]}
    ],

    addPrayer: function (inSender, inEvent) {
        tools.addPrayer(this.$.titleInput.getValue(), this.$.descrInput.getValue(), this.$.tagsInput.getValue(), enyo.bind(this, this.addedPrayer));
        this.doBack();
    },

    addedPrayer: function () {
        enyo.log("Added Prayer");
    }

});