enyo.kind({
    name: "PrayerZ.preferences",
    kind: "VFlexBox",
    events: {
        onBack: ""
    },
    components: [
        {kind: "Header", components: [
            //{kind: "Spacer"},
            {name: "headerCaption", content: $L("Preferences"), flex: 1},
            {kind: "Button", caption: $L("Back"), onclick: "doBack"}
        ]},
        {name: "scrollerLeft", kind: "Scroller", flex: 1, components: [
            {className: "add-container", kind: "RowGroup", components: [
                {name: "monday", kind: "Input", hint: "", components: [
                    {content: $L("Monday"), className: "text-label"}
                ]},
                {name: "thuesday", kind: "Input", hint: "", components: [
                    {content: $L("Thuesday"), className: "text-label"}
                ]},
                {name: "wednesday", kind: "Input", hint: "", components: [
                    {content: $L("wednesday"), className: "text-label"}
                ]},
                {name: "thursday", kind: "Input", hint: "", components: [
                    {content: $L("Thursday"), className: "text-label"}
                ]},
                {name: "friday", kind: "Input", hint: "", components: [
                    {content: $L("Friday"), className: "text-label"}
                ]},
                {name: "saturday", kind: "Input", hint: "", components: [
                    {content: $L("Saturday"), className: "text-label"}
                ]},
                {name: "sunday", kind: "Input", hint: "", components: [
                    {content: $L("Sunday"), className: "text-label"}
                ]}
            ]},
            {kind: "VFlexBox", className: "add-container", components: [
                {content: $L("Enter the tags, you want to pray for on a weekday!"), className: "info"},
                {name: "tags", content: "", className: "info"}
            ]}
        ]}
    ],

    handleTags: function (tags) {
        enyo.log(tags);
        var str = "";
        for (var i=0; i<tags.length; i++) {
            if (str !== "")
                str += ", " + tags[i];
            else
                str += tags[i];
        }
        this.$.tags.setContent($L("Available Tags") + ": " + str);
    }
});