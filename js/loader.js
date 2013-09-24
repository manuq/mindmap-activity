requirejs.config({
    baseUrl: "lib",
    shim: {
        raphael_inlinetextediting: {
            deps: ['raphael']
        },
        raphael_connection: {
            deps: ['raphael']
        }
    },
    paths: {
        activity: "../js",
        raphael_inlinetextediting: "../lib/Raphael.InlineTextEditing/raphael.inline_text_editing",
        raphael_connection: "../lib/Raphael.GraphConnection"
    }
});

requirejs(["activity/activity"]);
