(function($) {
    var pagify = {
        items: {},
        container: {},
        totalPages: {},
        perPage: {},
        currentPage: {},
        navigator: {},
        pageNavigator: {},
        createNavigation: function(id) {
            this.totalPages[id] = Math.ceil(this.items[id].length / this.perPage[id]);

            $('#'+id+"-pagination", this.container[id].parent()).remove();
            var pagination = $('<div class="pagination"></div>').append('<a class="nav prev disabled" data-next="false"><</a>');

            for (var i = 0; i < this.totalPages[id]; i++) {
                var pageElClass = "page";
                if (!i)
                    pageElClass = "page current";
                var pageEl = '<a class="' + pageElClass + '" data-page="' + (
                i + 1) + '">' + (
                i + 1) + "</a>";
                pagination.append(pageEl);
            }
            pagination.append('<a class="nav next" data-next="true">></a>');
            var pgId = id+"-pagination";
            pagination.attr("id", pgId);
            this.container[id].after(pagination);

            var that = this;
            $("#"+pgId).off("click", ".nav");
            this.navigator[id] = $("#"+pgId).on("click", ".nav", function() {
                var el = $(this);
                that.navigate(id, el.data("next"));
            });

            $("#"+pgId).off("click", ".page");
            this.pageNavigator[id] = $("#"+pgId).on("click", ".page", function() {
                var el = $(this);
                that.goToPage(id, el.data("page"));
            });
        },
        navigate: function(id, next) {
            // default perPage[id] to 5
            if (isNaN(next) || next === undefined) {
                next = true;
            }
            var pgId = id+"-pagination";
            $("#"+pgId+" > .nav").removeClass("disabled");
            if (next) {
                this.currentPage[id]++;
                if (this.currentPage[id] > (this.totalPages[id] - 1))
                    this.currentPage[id] = (this.totalPages[id] - 1);
                if (this.currentPage[id] == (this.totalPages[id] - 1))
                    $("#"+pgId+" > .nav.next").addClass("disabled");
                }
            else {
                this.currentPage[id]--;
                if (this.currentPage[id] < 0)
                    this.currentPage[id] = 0;
                if (this.currentPage[id] == 0)
                    $("#"+pgId+" > .nav.prev").addClass("disabled");
                }

            this.showItems(id);
        },
        updateNavigation: function(id) {

            var pgId = id+"-pagination";
            var pages = $("#"+pgId+" > .page");
            pages.removeClass("current");
            $("#"+pgId+" > .page[data-page=\"" + (
            this.currentPage[id] + 1) + '"]').addClass("current");
        },
        goToPage: function(id, page) {

            var pgId = id+"-pagination";
            this.currentPage[id] = page - 1;

            $("#"+pgId+" > .nav").removeClass("disabled");
            if (this.currentPage[id] == (this.totalPages[id] - 1))
                $("#"+pgId+" > .nav.next").addClass("disabled");

            if (this.currentPage[id] == 0)
                $("#"+pgId+" > .nav.prev").addClass("disabled");
            this.showItems(id);
        },
        showItems: function(id) {
            this.items[id].hide();
            var base = this.perPage[id] * this.currentPage[id];
            this.items[id].slice(base, base + this.perPage[id]).show();

            this.updateNavigation(id);
        },
        init: function(container, items, perPage) {
            var id = container.attr("id");
            gg = this;
            this.container[id] = container;
            this.currentPage[id] = 0;
            this.totalPages[id] = 1;
            this.perPage[id] = perPage;
            this.items[id] = items;
            this.createNavigation(id);
            this.showItems(id);
        }
    };

    // stuff it all into a jQuery method!
    $.fn.pagify = function(perPage, itemSelector) {
        var el = $(this);
        var items = $(itemSelector, el);

        // default perPage to 5
        if (isNaN(perPage) || perPage === undefined) {
            perPage = 3;
        }

        // don't fire if fewer items than perPage
        if (items.length <= perPage) {
            return true;
        }

        pagify.init(el, items, perPage);
    };
})(jQuery);

var currentLeaderBoard = "coins";
var isPaused = undefined;

function toggleRefresh() {
    if (Cookies.get("autorefresh") === undefined) {
        Cookies.set("autorefresh", "false", {expires: 0x1e}); 
        toggleRefresh(); /* Run function again now that there is a cookie */ 
    } else {
        let autorefresh = Cookies.get("autorefresh") === "true";

        let enable = document.getElementById("enableRefresh");
        let disable = document.getElementById("disableRefresh");

        if (autorefresh) {
            enable.style.border = "2px solid white";
            enable.style.cursor = "default";
            disable.style.border = "";
            disable.style.cursor = "pointer";
            isPaused = false;
        } else {
            enable.style.border = "";
            enable.style.cursor = "pointer";
            disable.style.border = "2px solid white";
            disable.style.cursor = "default";
            isPaused = true;
        }
    }
};

function enableRefresh() {
    Cookies.set("autorefresh", "true", {expires: 0x1e});
    toggleRefresh();
};

function disableRefresh() {
    Cookies.set("autorefresh", "false", {expires: 0x1e})
    toggleRefresh();
};

function setLeaderBoard(type) {
    var currSelect = document.getElementById(currentLeaderBoard);
    var nextSelect = document.getElementById(type);

    currSelect.style.border = "";
    currSelect.style.cursor = "pointer";

    nextSelect.style.border = "2px solid white";
    nextSelect.style.cursor = "default";

    var curr = document.getElementById("leaderboard-content-"+currentLeaderBoard);
    curr.style.display = "none";
    var next = document.getElementById("leaderboard-content-"+type);
    next.style.display = "";
    currentLeaderBoard = type;
}

function showLeaderBoard() {
    var elem = document.getElementById("leaderboard");
    elem.style.display = "";
    
    refreshLeaderBoard();
    if (isPaused === undefined) /* Make sure refreshing cant happen multiple times due to showing it */ {
        setInterval(() => {
            if (!isPaused && !app.ingame()) { refreshLeaderBoard(); };
        }, 5000);
    }
}

function refreshLeaderBoard() {
    var leaderBoard;
    $.ajax({
            type: "GET",
            url: "leaderboard.json", 
            success: function(result) {
                $("loading").hide();
                leaderBoard = result;
                var updateLeaderBoard = function (type, values) {
                    var elem2 = document.getElementById("leaderboard-content-"+type);
                    elem2.innerHTML = "";
                    var tab = document.createElement("table");
                    tab.style.color = "white";
                    var th = document.createElement("tr");
                    th.innerHTML = "<th>#</th><th>name</th><th>"+type+"</th>";
                    tab.appendChild(th);
                    for (var p of values) {
                        var tr = document.createElement("tr");
                        var td = document.createElement("td");
                        td.innerHTML = p.pos;
                        switch(p.pos) {
                            case 1 : {td.style.color = 'yellow';break;}
                            case 2 : {td.style.color = 'silver';break;}
                            case 3 : {td.style.color = '#CD7F32';break;}
                            default : {td.style.color = 'white';break;}
                        }
                        tr.appendChild(td);
                        td = document.createElement("td");
                        p.nickname = p.nickname.substring(0, 20);
                        td.innerText = ""+p.nickname;
                        td.style["padding-left"] = "10px";
                        td.style["padding-right"] = "10px";
                        switch(p.pos) {
                            case 1 : {td.style.color = 'yellow';break;}
                            case 2 : {td.style.color = 'silver';break;}
                            case 3 : {td.style.color = '#CD7F32';break;}
                            default : {td.style.color = 'white';break;}
                        }
                        tr.appendChild(td);
                        td = document.createElement("td");
                        td.innerText = ""+p[type];
                        tr.appendChild(td);
                        tab.appendChild(tr);
                    }
                    elem2.appendChild(tab);
                };
                updateLeaderBoard("coins", result.coinLeaderBoard);
                updateLeaderBoard("wins", result.winsLeaderBoard);
                updateLeaderBoard("kills", result.killsLeaderBoard);
            },
            error: function() {
                $(".loading").text("Failed to load content...")
            },
            dataType: "json",
            cache: false
    });
    return;
}

function hideLeaderBoard() {
    var elem = document.getElementById("leaderboard");
    elem.style.display = "none";
    isPaused = true;
}

var VERSION = (function() {
    return Date.now();
})();

var scripts = {
    "jsons": ["https://raw.githubusercontent.com/mroyale/assets/master/assets/assets.json"],
    "app": ["js/url.js", "js/game.js"],
    "objects": ["js/scripts/plant.js", "js/scripts/firebar.js", "js/scripts/fireball.js", "js/scripts/spiny.js", "js/scripts/beetle.js"]
}

var resources = {}
var jsons = scripts["jsons"];
var gamescripts = scripts["app"];
var objects = scripts["objects"];

function loadNext() {
    if (jsons.length) {
        var next = jsons.shift();
        $.ajax({
            type: "GET",
            url: next + '?v=' + VERSION, 
            success: function(result) {
                resources[next] = result;
                loadNext();
            },
            dataType: "json",
            cache: true
        });
        return;
    }
    if (gamescripts.length > 0) {
        var next = gamescripts.shift();
        $.ajax({
            type: "GET",
            url: next + '?v=' + VERSION, 
            success: function() {
                loadNext();
            },
            dataType: "script",
            cache: true
        });
    } else if (objects.length > 0) {
        var nextobj = objects.shift();
        $.ajax({
            type: "GET",
            url: nextobj + '?v=' + VERSION,
            success: function() {
                loadNext();
            },
            dataType: "script",
            cache: true
        });
    }
};

function load() {
    document.body.style.backgroundColor = "#000000";
    loadNext();
    body.style.display = '';
    document.body.style.backgroundColor = "";
}

load();