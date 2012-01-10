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
            /*{kind: "RadioToolButtonGroup", value: 1, components: [
                //{icon: "images/menu-icon-back.png", onclick: "goBack"},
                //{icon: "images/menu-icon-forward.png", onclick: "goForward"}
                {icon: "images/down.png", onclick: "showAll"},
                {icon: "images/right.png", onclick: "showDefault"}
            ]}, */
            {icon: "images/right.png", toggling: true, onclick: "showDefault"},
            {caption: $L("All"), toggling: true, onclick: "toggleAll"},
            {kind: "Spacer"},
            {icon: "images/menu-icon-new.png", onclick: "doAdd"}
        ]},
        {name: "scrollerMain", kind: "Scroller", flex: 1, components: [
            {name: "prayerList", kind: "VirtualRepeater", onSetupRow: "getPrayerListItem", components: [
                {name: "itemPrayer", kind: "SwipeableItem", layoutKind: "HFlexLayout", tapHighlight: true, className: "list-item", components: [
                    {kind: "VFlexBox", flex: 1, components: [
                        {name: "title", className: "prayer-title"},
                        {name: "description", className: "prayer-description"},
                        {name: "tags", className: "prayer-tags"}
                    ]},
                    {kind: "VFlexBox", components: [
                        {kind: "Spacer"},
                        {name: "checkbox", kind: "CheckBox", onclick: "checkboxClicked"},
                        {kind: "Spacer"}
                    ]}
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
        today: new Date().getDay(),
        tappedCB: false,
        day: new Date().getDay()
    },

    handlePrayers: function (prayers) {
        //enyo.log(prayers);
        var tmpTitle = {};
        var tmpTags = {};
        var split = [];
        var tmpStr = "";
        var exp = null;
        this.allPrayers = prayers;
        this.prayers = [];
        
        if (this.allPrayers.length !== 0) {
            this.$.prayerHint.hide();
            for (var i=0; i<this.allPrayers.length; i++) {
                if (!tmpTitle[this.allPrayers[i].title])
                    tmpTitle[this.allPrayers[i].title] = [];
                tmpTitle[this.allPrayers[i].title].push(this.allPrayers[i].description);
                
                //Tags
                if (!tmpTags[this.allPrayers[i].title]) {
                    tmpStr = "";
                    tmpTags[this.allPrayers[i].title] = [];
                }
                split = this.allPrayers[i].tags.split(",");
                for (var k=0; k<split.length; k++) {
                    exp = new RegExp("\\b" + split[k].replace(/^\s/, "") + "\\b");
                    if (tmpStr.search(exp) === -1) {
                        tmpStr += (tmpStr !== "") ? "," + split[k].replace(/^\s/, "") : split[k].replace(/^\s/, "");
                        tmpTags[this.allPrayers[i].title].push(split[k].replace(/^\s/, ""));
                    }
                }
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
            this.$.prayerHint.setContent($L("No prayers"));
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
                this.$.checkbox.hide();
                for (var i=0; i<r.description.length; i++) {
                    descr += r.description[i];
                    if (i !== r.description.length -1)
                        descr += ", ";
                }
                this.$.description.setContent(descr);
                
                //Tags
                for (var j=0; j<r.tags.length; j++) {
                    if (r.tags[j] !== "")
                        if (j !== 0 && r.tags[j] != r.tags[j-1]) {
                            tmpTags += (tmpTags !== "") ? ", " + r.tags[j] : r.tags[j];
                        } else if (j === 0) {
                            tmpTags += r.tags[j];
                    }
                }
                this.$.tags.setContent(tmpTags);
            } else {
                this.$.itemPrayer.setSwipeable(true);
                this.$.itemPrayer.setTapHighlight(true);
                this.$.checkbox.show();
                this.$.checkbox.setChecked((r.answer === 1) ? true : false);
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
        this.$.prayerList.render();
    },

    showDefault: function (inSender, inEvent) {
        if (!inSender.depressed) {
            this.$.scrollerMain.scrollIntoView(0,0);
            this.combinePrayers = true;
            inSender.setIcon("images/right.png");
        } else {
            this.combinePrayers = false;
            inSender.setIcon("images/down.png");
        }
        
        this.$.prayerList.render();
    },

    checkboxClicked: function (inSender, inEvent) {
        this.tappedCB = true;
        //enyo.log(inEvent.rowIndex, inSender.getChecked());
        if (inSender.getChecked())
            tools.answerPrayer(1, this.allPrayers[inEvent.rowIndex].id, enyo.bind(this, this.handleAnswer));
        else
            tools.answerPrayer(0, this.allPrayers[inEvent.rowIndex].id, enyo.bind(this, this.handleAnswer));

    },

    handleAnswer: function () {
        //enyo.log("Answered Prayer");
        tools.getPrayers("all", enyo.application.prefs.answer, enyo.bind(this, this.handlePrayers));
    },

    editPrayer: function (inSender, inEvent) {
        this.rowIndex = inEvent.rowIndex;
        if (!this.combinePrayers && !this.tappedCB)
            this.doEdit();
        this.tappedCB = false;
    },

    deletePrayer: function (inSender, inIndex) {
        tools.deletePrayer(this.allPrayers[inIndex].id, enyo.bind(this, this.handleDelete));
    },

    handleDelete: function () {
        enyo.log("Deleted Prayer");
        tools.getPrayers(this.today, enyo.application.prefs.answer, enyo.bind(this, this.handlePrayers));
    },

    toggleAll: function (inSender, inEvent) {
        this.$.scrollerMain.scrollIntoView(0,0);
        this.day = (inSender.depressed) ? "all" : this.today;
        tools.getPrayers(this.day, enyo.application.prefs.answer, enyo.bind(this, this.handlePrayers));
    }
});