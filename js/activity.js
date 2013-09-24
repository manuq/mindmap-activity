define(function (require) {
    var activity = require("sugar-web/activity/activity");
    var raphael = require("raphael");
    require("raphael_inlinetextediting");
    require("raphael_connection");

    // Manipulate the DOM only when it is ready.
    require(['domReady!'], function (doc) {

        // Initialize the activity.
        activity.setup();

        THOUGHT_WIDTH = 180;
        THOUGHT_HEIGHT = 60;
        BOX_FILL_COLOR = "#fff";
        BOX_STROKE_COLOR = "#444";
        BOX_SELECTED_COLOR = "#ff0";
        LINE_COLOR = "#333";
        var paperWidth;
        var paperHeight;
        var toolbarHeight;
        var dragging = false;
        var editing = false;
        var connections = [];
        var selectedThought;
        var editingThought;

        function updatePaperSize() {
            toolbarHeight = document.getElementById("main-toolbar").
                offsetHeight;
            paperWidth = window.innerWidth;
            paperHeight = window.innerHeight - toolbarHeight - 1;
        }
        updatePaperSize();

        function onPaperClick(event) {
            if (dragging) {
                return;
            }
            if (event.offsetY < toolbarHeight) {
                return;
            }
            if (editing) {
                cancelEdit();
            }
            console.log("onPaperClick");
            addThought("Hello World", event.offsetX, event.offsetY);
        }

        var paper = Raphael("paper", paperWidth, paperHeight);
        paper.raphael.click(onPaperClick);

        function cancelEdit() {
            editing = false;
            editingThought.textElem.inlineTextEditing.stopEditing();
            editingThought = undefined;
        }

        function onDragMove(dx, dy, x, y, event) {
            this.set.moved = true;
            cursorX = x - THOUGHT_WIDTH / 2;
            cursorY = y - THOUGHT_HEIGHT / 2 - toolbarHeight;
            this.set.transform("t" + cursorX + "," + cursorY);

            for (var i = 0; i < connections.length; i++) {
                paper.connection(connections[i]);
            }
        };

        function onDragStart(x, y, event) {
            this.set.moved = false;
            console.log("onDragStart");
            dragging = true;
            this.set.animate({"opacity": 0.3}, 500);
        };

        function onDragEnd(x, y, event) {
            setTimeout(function () {
                dragging = false;
            }, 1000);
            if (!this.set.moved) {
                if (selectedThought == this.set) {
                    editing = true;
                    editingThought = this.set;
                    var input = editingThought.textElem.inlineTextEditing.
                        startEditing();

                    // input.addEventListener("blur", function(e){
                    //     // Stop inline editing after blur on the text field
                    //     editingThought.textElem.inlineTextEditing.stopEditing();
                    // }, true);

                } else {
                    if (editing) {
                        cancelEdit();
                    }
                    if (selectedThought !== undefined) {
                        selectedThought.rectElem.animate({
                            "stroke": BOX_STROKE_COLOR}, 300);
                    }
                    selectedThought = this.set;
                    selectedThought.rectElem.animate({
                        "stroke": BOX_SELECTED_COLOR}, 300);
                }
            }
            console.log("onDragEnd");
            this.set.animate({"opacity": 1}, 500);
        };

        function addThought(text, x, y) {
            var rectElem = paper.rect(0, 0, THOUGHT_WIDTH, THOUGHT_HEIGHT, 11);
            rectElem.attr("fill", BOX_FILL_COLOR);
            rectElem.attr("stroke", BOX_STROKE_COLOR);
            rectElem.attr("stroke-width", 3);
            var textElem = paper.text(90, 30, text);
            textElem.attr("font-size", 22);
            textElem.attr("text-anchor", "middle");
            paper.inlineTextEditing(textElem);
            var set = paper.set();
            set.push(rectElem, textElem);
            var set = set;
            var dx = x - THOUGHT_WIDTH / 2;
            var dy = y - THOUGHT_HEIGHT / 2;
            set.transform("t" + dx + "," + dy);
            textElem.set = set;
            rectElem.set = set;
            set.textElem = textElem;
            set.rectElem = rectElem;
            set.drag(onDragMove, onDragStart, onDragEnd);

            if (selectedThought === undefined) {
                selectedThought = set;
                selectedThought.rectElem.attr("stroke", BOX_SELECTED_COLOR);
            } else {
                var conn = paper.connection(selectedThought, set);
                conn.line.toBack();
                connections.push(conn);
            }
        };
    });
});
