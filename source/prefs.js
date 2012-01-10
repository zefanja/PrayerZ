enyo.kind({
    name: "PrayerZ.preferences",
    kind: "VFlexBox",
    events: {
        onBack: ""
    },
    components: [
        {kind: "Header", components: [
            //{kind: "Spacer"},
            {name: "btBack", kind: "Button", style: "margin-right: 20px;", caption: $L("Back"), onclick: "goBack"},
            {name: "headerCaption", content: $L("Preferences"), flex: 1}
        ]},
        {name: "scrollerLeft", kind: "Scroller", flex: 1, components: [
            {kind: "VFlexBox", className: "add-container", components: [
                {name: "tags", content: "", allowHtml: true, className: "info"}
            ]},
            {className: "add-container", kind: "RowGroup", caption: $L("Tags"), style: "margin-left: auto; margin-right: auto;", components: [
                {name: "monday", kind: "Input", hint: "", onblur: "saveTags", components: [
                    {content: $L("Monday"), className: "text-label"}
                ]},
                {name: "tuesday", kind: "Input", hint: "", onblur: "saveTags", components: [
                    {content: $L("Tuesday"), className: "text-label"}
                ]},
                {name: "wednesday", kind: "Input", hint: "", onblur: "saveTags", components: [
                    {content: $L("wednesday"), className: "text-label"}
                ]},
                {name: "thursday", kind: "Input", hint: "", onblur: "saveTags", components: [
                    {content: $L("Thursday"), className: "text-label"}
                ]},
                {name: "friday", kind: "Input", hint: "", onblur: "saveTags", components: [
                    {content: $L("Friday"), className: "text-label"}
                ]},
                {name: "saturday", kind: "Input", hint: "", onblur: "saveTags", components: [
                    {content: $L("Saturday"), className: "text-label"}
                ]},
                {name: "sunday", kind: "Input", hint: "", onblur: "saveTags", components: [
                    {content: $L("Sunday"), className: "text-label"}
                ]}
            ]},
            {className: "add-container", kind: "RowGroup", defaultKind: "HFlexBox", caption: $L("General"), style: "margin-left: auto; margin-right: auto;", components: [
                {align: "center", components: [
                    {flex: 1, name: "linebreak", content: $L("Show answered prayers")},
                    {name: "toggleAnswer", kind: "ToggleButton", state: false, onChange: "changeAnswer"}
                ]}
            ]}
        ]}
    ],

    create: function () {
        this.inherited(arguments);
        if (enyo.fetchDeviceInfo() && enyo.fetchDeviceInfo().keyboardAvailable)
            this.$.btBack.hide();
    },

    handleTags: function (tags) {
        enyo.log(tags);
        var str = "";
        for (var i=0; i<tags.length; i++) {
            if (str !== "")
                str += ", " + tags[i];
            else
                str += tags[i];
        }
        this.$.tags.setContent($L("Enter the tags, you want to pray for on a weekday!") + " " + $L("Available Tags") + ": <i>" + str + "</i>");
    },

    setTags: function () {
        enyo.log("Loading Tags...", enyo.application.prefs.tags);
        if (enyo.application.prefs.tags) {
            var tmp = enyo.json.parse(enyo.application.prefs.tags);
            this.$.sunday.setValue(tmp[0]);
            this.$.monday.setValue(tmp[1]);
            this.$.tuesday.setValue(tmp[2]);
            this.$.wednesday.setValue(tmp[3]);
            this.$.thursday.setValue(tmp[4]);
            this.$.friday.setValue(tmp[5]);
            this.$.saturday.setValue(tmp[6]);
        }
            
    },

    setShowAnswer: function () {
        //enyo.log(enyo.application.prefs.answer);
        if (enyo.application.prefs.answer)
            this.$.toggleAnswer.setState(enyo.json.parse(enyo.application.prefs.answer));
    },

    saveTags: function (inSender, inEvent) {
        var tmp = [
            this.$.sunday.getValue(),
            this.$.monday.getValue(),
            this.$.tuesday.getValue(),
            this.$.wednesday.getValue(),
            this.$.thursday.getValue(),
            this.$.friday.getValue(),
            this.$.saturday.getValue()
        ];

        enyo.application.prefs.tags = enyo.json.stringify(tmp);
        enyo.log("Saved Tags", enyo.application.prefs.tags);
    },

    changeAnswer: function (inSender, inState) {
        enyo.application.prefs.answer = enyo.json.stringify(inState);
    },

    goBack: function (inSender, inEvent) {
        this.saveTags();
        this.doBack();
    }
});