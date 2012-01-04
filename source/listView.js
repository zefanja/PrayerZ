enyo.kind({
    name: "PrayerZ.list",
    kind: "VFlexBox",
    events: {
        onAdd: ""
    },
    components: [
        {name: "header", kind: "Header", content: "PrayerZ"},
        {name: "scrollerLeft", kind: "Scroller", flex: 1, components: [
            {name: "prayerList", kind: "VirtualRepeater", onSetupRow: "getPrayerListItem", components: [
                {name: "itemPrayer", kind: "Item", layoutKind: "VFlexLayout", tapHighlight: true, className: "list-item", components: [
                    {name: "title", className: "prayer-title"},
                    {name: "description", className: "prayer-description"},
                    {name: "tags", className: "prayer-tags"}
                ],
                onclick: ""
                }]
            },
            {name: "prayerHint", showing: false, className: "hint"}
        ]},
        {kind: "Toolbar", components: [
            {icon: "images/menu-icon-new.png", onclick: "doAdd"},
            {kind: "Spacer"}
        ]}
    ],

    prayers: [],

    handlePrayers: function (prayers) {
        enyo.log(prayers);
        //this.$.scrollerLeft.scrollTo(0,0);
        this.prayers = prayers;
        this.$.prayerList.render();
        if (prayers.length !== 0) {
            this.$.prayerHint.hide();
        } else {
            this.$.prayerHint.show();
            this.$.prayerHint.setContent($L("No prayers there. Please add one!"));
        }
    },

    getPrayerListItem: function(inSender, inIndex) {
        var r = this.prayers[inIndex];
        //this.tmpLang = "";
        if (r) {
            //console.log(r + " - " + this.tmpLang);
            this.$.title.setContent(r.title);
            this.$.description.setContent(r.description);
            this.$.tags.setContent(r.tags);
            //var isRowSelected = (inIndex == this.lastLangItem);
            //this.$.itemLang.applyStyle("background", isRowSelected ? "#3A8BCB" : null);
            return true;
        } else {
            return false;
        }
    }
});