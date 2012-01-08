enyo.kind({
    name: "PrayerZ.list",
    kind: "VFlexBox",
    events: {
        onAdd: "",
        onEdit: "",
        onPrefs: ""
    },
    components: [
        {name: "header", kind: "Toolbar", components: [
            //{content: "PrayerZ"},
            {kind: "RadioToolButtonGroup", value: 1, components: [
                //{icon: "images/menu-icon-back.png", onclick: "goBack"},
                //{icon: "images/menu-icon-forward.png", onclick: "goForward"}
                {caption: "S", onclick: "showAll"},
                {caption: "G", onclick: "showDefault"}
            ]},
            {caption: $L("All"), toggling: true, onclick: "toggleAll"},
            {kind: "Spacer"},
            {icon: "images/menu-icon-new.png", onclick: "doAdd"}
        ]},
        {name: "scrollerLeft", kind: "Scroller", flex: 1, components: [
            {name: "prayerList", kind: "VirtualRepeater", onSetupRow: "getPrayerListItem", components: [
                {name: "itemPrayer", kind: "SwipeableItem", layoutKind: "VFlexLayout", tapHighlight: true, className: "list-item", components: [
                    {name: "title", className: "prayer-title"},
                    {name: "description", className: "prayer-description"},
                    {name: "tags", className: "prayer-tags"}
                ],
                onclick: "editPrayer",
                onConfirm: "deletePrayer"
                }]
            },
            {name: "prayerHint", showing: false, className: "hint"}
        ]}
    ],

    published: {
        allPrayers: [],
        prayers: [],
        combinePrayers: true,
        rowIndex: null,
        today: new Date().getDay()
    },

    handlePrayers: function (prayers) {
        enyo.log(prayers);
        var tmpTitle = {};
        var tmpTags = {};
        this.allPrayers = prayers;
        this.prayers = [];
        
        if (this.allPrayers.length !== 0) {
            this.$.prayerHint.hide();
            for (var i=0; i<this.allPrayers.length; i++) {
                if (!tmpTitle[this.allPrayers[i].title])
                    tmpTitle[this.allPrayers[i].title] = [];
                tmpTitle[this.allPrayers[i].title].push(this.allPrayers[i].description);
                
                //Tags
                if (!tmpTags[this.allPrayers[i].title])
                    tmpTags[this.allPrayers[i].title] = [];
                tmpTags[this.allPrayers[i].title].push(this.allPrayers[i].tags);
            }
            for (var j=0; j<this.allPrayers.length; j++) {
                if (j !== 0 && this.allPrayers[j].title != this.allPrayers[j-1].title) {
                    this.prayers.push({"title": this.allPrayers[j].title, "description" : tmpTitle[this.allPrayers[j].title], "tags": tmpTags[this.allPrayers[j].title]});
                } else if (j === 0) {
                    this.prayers.push({"title": this.allPrayers[j].title, "description" : tmpTitle[this.allPrayers[j].title], "tags": tmpTags[this.allPrayers[j].title]});
                }
            }
        } else {
            this.$.prayerHint.show();
            this.$.prayerHint.setContent($L("No prayers there. Please add one!"));
        }
        this.$.prayerList.render();
    },

    getPrayerListItem: function(inSender, inIndex) {
        var r = (this.combinePrayers) ? this.prayers[inIndex]: this.allPrayers[inIndex];
        var descr = "";
        var tmpTags = "";
        //this.tmpLang = "";
        if (r) {
            //console.log(r + " - " + this.tmpLang);
            this.$.title.setContent(r.title);
            if (this.combinePrayers) {
                this.$.itemPrayer.setSwipeable(false);
                this.$.itemPrayer.setTapHighlight(false);
                for (var i=0; i<r.description.length; i++) {
                    descr += r.description[i];
                    if (i !== r.description.length -1)
                        descr += ", ";
                }
                this.$.description.setContent(descr);
                
                //Tags
                for (var j=0; j<r.tags.length; j++) {
                    if (j !== 0 && r.tags[j] != r.tags[j-1]) {
                        if (r.tags[j] !== "")
                            tmpTags += (tmpTags !== "") ? ", " + r.tags[j] : r.tags[j];
                    } else if (j === 0) {
                        if (r.tags[j] !== "")
                            tmpTags += r.tags[j];
                    }
                }
                this.$.tags.setContent(tmpTags);
            } else {
                this.$.itemPrayer.setSwipeable(true);
                this.$.itemPrayer.setTapHighlight(true);
                this.$.description.setContent(r.description);
                this.$.tags.setContent(r.tags);
            }
                
            //var isRowSelected = (inIndex == this.lastLangItem);
            //this.$.itemLang.applyStyle("background", isRowSelected ? "#3A8BCB" : null);
            return true;
        } else {
            return false;
        }
    },

    showAll: function (inSender, inEvent) {
        this.combinePrayers = false;
        this.$.itemPrayer.setSwipeable(true);
        this.$.prayerList.render();
    },

    showDefault: function (inSender, inEvent) {
        this.combinePrayers = true;
        this.$.prayerList.render();
    },

    editPrayer: function (inSender, inEvent) {
        this.rowIndex = inEvent.rowIndex;
        if (!this.combinePrayers)
            this.doEdit();
    },

    deletePrayer: function (inSender, inIndex) {
        tools.deletePrayer(this.allPrayers[inIndex].id, enyo.bind(this, this.handleDelete));
    },

    handleDelete: function () {
        enyo.log("Deleted Prayer");
        tools.getPrayers(enyo.bind(this, this.handlePrayers));
    },

    toggleAll: function (inSender, inEvent) {
        if (inSender.depressed) {
            tools.getPrayers("all", enyo.bind(this, this.handlePrayers));
        } else {
            tools.getPrayers(this.today, enyo.bind(this, this.handlePrayers));
        }
    }
});