var originalData = {
    "name": " ",
    "children": [
        {
            "name": " ",
            "children": [
                {
                    "name": " ",
                    "children": [
                        {
                            "name": " ",
                            "children": [
                                {
                                    "name": " ",
                                    "children": [
                                        {
                                            "name": " ",
                                            "children": []
                                        }, {
                                            "name": " ",
                                            "children": []
                                        }
                                    ]
                                }, {
                                    "name": " ",
                                    "children": [
                                        {
                                            "name": " ",
                                            "children": []
                                        }, {
                                            "name": " ",
                                            "children": []
                                        }
                                    ]
                                }
                            ]
                        }, {
                            "name": " ",
                            "children": [
                                {
                                    "name": " ",
                                    "children": [
                                        {
                                            "name": " ",
                                            "children": []
                                        }, {
                                            "name": " ",
                                            "children": []
                                        }
                                    ]
                                }, {
                                    "name": " ",
                                    "children": [
                                        {
                                            "name": " ",
                                            "children": []
                                        }, {
                                            "name": " ",
                                            "children": []
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }, {
                    "name": " ",
                    "children": [
                        {
                            "name": " ",
                            "children": [
                                {
                                    "name": " ",
                                    "children": [
                                        {
                                            "name": " ",
                                            "children": []
                                        }, {
                                            "name": " ",
                                            "children": []
                                        }
                                    ]
                                }, {
                                    "name": " ",
                                    "children": [
                                        {
                                            "name": " ",
                                            "children": []
                                        }, {
                                            "name": " ",
                                            "children": []
                                        }
                                    ]
                                }
                            ]
                        }, {
                            "name": " ",
                            "children": [
                                {
                                    "name": " ",
                                    "children": [
                                        {
                                            "name": " ",
                                            "children": []
                                        }, {
                                            "name": " ",
                                            "children": []
                                        }
                                    ]
                                }, {
                                    "name": " ",
                                    "children": [
                                        {
                                            "name": " ",
                                            "children": []
                                        }, {
                                            "name": " ",
                                            "children": []
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "name": " ",
            "children": [
                {
                    "name": " ",
                    "children": [
                        {
                            "name": " ",
                            "children": [
                                {
                                    "name": " ",
                                    "children": [
                                        {
                                            "name": " ",
                                            "children": []
                                        },
                                        {
                                            "name": " ",
                                            "children": []
                                        }
                                    ]
                                },
                                {
                                    "name": " ",
                                    "children": [
                                        {
                                            "name": " ",
                                            "children": []
                                        },
                                        {
                                            "name": " ",
                                            "children": []
                                        }
                                    ]
                                }
                            ]
                        }, {
                            "name": " ",
                            "children": [
                                {
                                    "name": " ",
                                    "children": [
                                        {
                                            "name": " ",
                                            "children": []
                                        }, {
                                            "name": " ",
                                            "children": []
                                        }
                                    ]
                                }, {
                                    "name": " ",
                                    "children": [
                                        {
                                            "name": " ",
                                            "children": []
                                        }, {
                                            "name": " ",
                                            "children": []
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": " ",
                    "children": [
                        {
                            "name": " ",
                            "children": [
                                {
                                    "name": " ",
                                    "children": [
                                        {
                                            "name": " ",
                                            "children": []
                                        }, {
                                            "name": " ",
                                            "children": []
                                        }
                                    ]
                                }, {
                                    "name": " ",
                                    "children": [
                                        {
                                            "name": " ",
                                            "children": []
                                        }, {
                                            "name": " ",
                                            "children": []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "name": " ",
                            "children": [
                                {
                                    "name": " ",
                                    "children": [
                                        {
                                            "name": " ",
                                            "children": []
                                        }, {
                                            "name": " ",
                                            "children": []
                                        }
                                    ]
                                }, {
                                    "name": " ",
                                    "children": [
                                        {
                                            "name": " ",
                                            "children": []
                                        }, {
                                            "name": " ",
                                            "children": []
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

var pathToGenerate = "_generate";
var fontName = "PlanGrotesquePro-Light";

var data = originalData;
var branches = [];
var branchesCopy = branches;
var count = 0;

var da = 0.3;
var dl = 0.8;
var ar = 0.9;
var dts = 0.76;
var maxDepth = 7;
var currentDepth = maxDepth;

var tremble = true;
//var punct = '!"#$%&()*+,-./:;<=>?@[\]^_`{|}~\\n\\t\'‘’“”’–—';
var punctBeforeSpace = '(‘“';
var punctAfterSpace = '!"#$%&)*+,-./:;<=>?@^_`{|}~’”’–—';

var longWordList = [];

var seed = {
    id: 0,
    x: 50,
    y: 400,
    a: Math.PI / 2,
    l: 80,
    d: 0,
    node: data,
    txtSize: 100,
    targetDepth: maxDepth,
    ext: false
};

var updateDataDuration = 1000;
var lineGenerator = d3.line().curve(d3.curveCatmullRom);

var generateText = function (wordVector, init) {

    loading(true);

    let url = $SCRIPT_ROOT + pathToGenerate;
    let dataToGo = {vector: JSON.stringify({"seedwords": wordVector, "depth": maxDepth})};
    let onReceive = function (result) {
        console.log(result);
        data = result;
    };

    $.getJSON(url, dataToGo, onReceive)
        .done(function () {
            loading(false);
            init();
        });
};

function timeToTitle() {
    let now = new Date();
    let dateDiv = $("#title-date").empty();

    let add0 = function (number) {
        return (number < 10) ? ("0" + number) : ("" + number);
    };

    dateDiv.append(add0(now.getHours()) + ":" +
        add0(now.getMinutes()) + ":" +
        add0(now.getSeconds()) + " | " +
        now.getDate() + "." +
        (now.getMonth() + 1) + "." +
        (now.getFullYear() + "."));
}

function branch(b) {

    if (!b.ext) {

        if ((b.d <= b.targetDepth) && (b.node != undefined)) {
            b.node.id = b.id;
            b.name = b.node.name;
        } else {
            b.name = "";
            b.node = {};
            b.node.name = b.name;
            b.node.id = b.id;
            b.node.children = [];
        }

    } else {

        if (b.d > b.targetDepth) {
            b.name = b.node.name;
        } else {
            let dt = getBranchById(b.id);
            b.name = dt.name;
            b.node.name = b.name;
        }
        b.node.id = b.id;

    }

    //b.l = getTextWidth(b.name, "bold " + b.txtSize + "pt " + fontName) + 17 * Math.pow(dl, b.d);
    let wordWidth = getTextWidth(b.name, "" + b.txtSize + "pt " + fontName);
    let widthPonder;
    switch (b.d) {
        case 0:
            widthPonder = 1;
            break;
        case 1:
            widthPonder = 1.1;
            break;
        case 2:
            widthPonder = 1.15;
            break;
        default:
            widthPonder = 1.2;
    }
    b.l = widthPonder * wordWidth;

    branches.push(b);

    var end = endPt(b), daR, newB;

    if (b.d === maxDepth)
        return;

    daR = ar * Math.random() - ar * 0.5;
    newB = {
        id: branches.length,
        x: end.x,
        y: end.y,
        a: b.a - da + daR,
        d: b.d + 1,
        targetDepth: b.targetDepth,
        ext: b.ext,
        parent: b.id,
        txtSize: b.txtSize * dts,
        node: b.node.children[0]
    };
    branch(newB);

    daR = ar * Math.random() - ar * 0.5;
    newB = {
        id: branches.length,
        x: end.x,
        y: end.y,
        a: b.a + da + daR,
        d: b.d + 1,
        targetDepth: b.targetDepth,
        ext: b.ext,
        parent: b.id,
        txtSize: b.txtSize * dts,
        node: b.node.children[1]
    };
    branch(newB);

}

function subtreeIndices(node) {
    let selectedIds = [], unselectIds = [], newFullIds = [], newEmptyIds = [];
    let counter = -1;

    function traverse(node, depth) {
        counter++;
        if (depth <= currentDepth) {
            selectedIds.push(node.id);
            newFullIds.push(counter)
        } else {
            newEmptyIds.push(counter);
        }
        if (depth === maxDepth) return;
        if (node.children.length === 0) {
            node.children[0] = {"name": "", "children": []};
            node.children[1] = {"name": "", "children": []};
        }
        traverse(node.children[0], depth + 1);
        traverse(node.children[1], depth + 1);
    }

    traverse(node, 0);
    unselectIds = unselectedIds(selectedIds);
    return {
        "selectedIds": selectedIds, "unselectedIds": unselectIds,
        "newFullIds": newFullIds, "newEmptyIds": newEmptyIds
    };
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function endPt(b) {
    var x = b.x + b.l * Math.sin(b.a);
    var y = b.y - b.l * Math.cos(b.a);
    return {x: x, y: y};
}

function x1(d) {
    return d.x;
}

function y1(d) {
    return d.y;
}

function x2(d) {
    return endPt(d).x;
}

function y2(d) {
    return endPt(d).y;
}

function pathD(d) {
    let points = [[d.x, d.y], [endPt(d).x, endPt(d).y]];
    return lineGenerator(points);
}

function getText(d) {
    let depth = d.d;
    let txt = {"string": "", "words": []}
    let space = " ";
    for (let i = 0; i <= depth; i++) {
        space = (punctBeforeSpace.includes(d.name.charAt(0))) ? "" : space;
        txt.words.unshift(d.name);
        if (i != 0) txt.string = d.name + space + txt.string;
        space = (punctAfterSpace.includes(d.name.charAt(0))) ? "" : " ";
        d = branches[d.parent];
    }
    return txt;
}

function highlight(d) {

    $("#generated-text").append("<span class='ghost-text'>" + getText(d).string + "</span>");

    let depth = d.d;
    d3.selectAll("textPath").classed("defaultText", false);
    let selectedIds = [];
    for (let i = 0; i <= depth; i++) {
        selectedIds.push(d.id);
        d3.select("#textId-" + d.id).classed("selectedText", true);
        d = branches[d.parent];
    }
    let xids = unselectedIds(selectedIds);
    xids.forEach(function (item) {
        d3.select("#textId-" + item).classed("unselectedText", true);
    });
}

function unhighlight() {
    $(".ghost-text").remove();

    d3.selectAll("textPath")
        .classed("defaultText", true)
        .classed("selectedText", false)
        .classed("unselectedText", false);
}

function unselectedIds(ids) {
    let xids = [];
    for (let k = 0; k < branches.length; k++) {
        if (!ids.includes(k)) {
            xids.push(k);
        }
    }
    return xids;
}

function dataUpdate(d) {

    $(".ghost-text").remove();
    let txt = getText(d);
    let txtDiv = $("#generated-text");
    let newTxt = txtDiv.text() + txt.string;
    txtDiv.text(newTxt);

    if (longWordList.length > 0) longWordList.splice(-1, 1);
    longWordList.push.apply(longWordList, txt.words);

    if (longWordList.length > 40) {
        longWordList.splice(0, longWordList.length - 40);
    }

    //generateText(txt.words, onGenerated);
    generateText(longWordList, onGenerated);

    tremble = false;
    currentDepth = currentDepth - d.d;

    let pack = subtreeIndices(d.node);
    let ids = pack.selectedIds;
    let newIds = pack.newFullIds;
    let xids = pack.unselectedIds;
    let ghostIds = pack.newEmptyIds;

    xids.forEach(function (xid, i) {
        let ghostId = ghostIds[i];
        d3.select("textPath[prevId='pTextId-" + xid + "']")
            .attr("id", "textId-" + ghostId)
            .attr("xlink:href", "#textPathId" + ghostId)
            //.style("opacity", 0.2)
            .on("mouseover", null)
            .on("mouseout", null)
            .on("click", null);
        d3.select("path[prevId='pTextPathId" + xid + "']")
            .attr("id", "textPathId" + ghostId);
    });
    ids.forEach(function (id, i) {
        let newId = newIds[i];
        d3.select("textPath[prevId='pTextId-" + id + "']")
            .attr("id", "textId-" + newId)
            .attr("xlink:href", "#textPathId" + newId)
            .on("mouseover", null)
            .on("mouseout", null)
            .on("click", null);
        d3.select("path[prevId='pTextPathId" + id + "']")
            .attr("id", "textPathId" + newId);
    });

    data = d.node;
    seed.node = data;
    seed.ext = false;
    seed.targetDepth = currentDepth;
    branches = [];
    branch(seed);
    data = seed.node;
    branchesCopy = branches;

    newIds.forEach(function (newId, i) {
        d3.select("#textId-" + newId).attr("prevId", "pTextId-" + newId);
        d3.select("#textPathId" + newId).attr("prevId", "pTextPathId" + newId);
    });
    ghostIds.forEach(function (ghostId, i) {
        d3.select("#textId-" + ghostId).attr("prevId", "pTextId-" + ghostId);
        d3.select("#textPathId" + ghostId).attr("prevId", "pTextPathId" + ghostId);
    });

    greatUpdate();
    //setTimeout(onGenerated, updateDataDuration*3);
}

var onGenerated = function () {

    d3.selectAll("textPath")
        .on("mouseover", null)
        .on("mouseout", null)
        .on("click", null);

    seed.node = data;
    seed.ext = true;
    seed.targetDepth = currentDepth;

    branches = [];
    branch(seed);
    data = seed.node;
    branchesCopy = branches;
    currentDepth = maxDepth;
    seed.ext = false;
    unhighlight();

    greatUpdate();
}

var onGeneratedInit = function () {

    timeToTitle();

    seed.node = data;
    //seed.ext = true;f
    seed.targetDepth = maxDepth;

    branches = [];
    branch(seed);
    data = seed.node;
    branchesCopy = branches;
    currentDepth = maxDepth;
    //seed.ext = false;
    unhighlight();

    greatUpdate();
}

function create() {

    let g = d3.select("svg").append("g");

    g.append("defs").selectAll("path")
        .data(branches)
        .enter()
        .append("path")
        .attr("prevId", d => "pTextPathId" + d.id)
        .attr("id", d => "textPathId" + d.id)
        .attr("d", pathD);

    g.append("text").selectAll("textPath")
        .data(branches)
        .enter()
        .append("textPath")
        .attr("startOffset", "100%")
        .attr("xlink:href", d => "#textPathId" + d.id)
        .style("font-size", d => d.txtSize + "pt")
        .text(d => d.name)
        .attr("prevId", d => "pTextId-" + d.id)
        .attr("id", d => "textId-" + d.id)
        .classed("defaultText", true)
        .on("mouseover", highlight)
        .on("mouseout", unhighlight)
        .on("click", dataUpdate);
}

var greatUpdate = function () {

    branches.forEach(function (d, i) {

        d3.select("#textPathId" + d.id)
            .transition().duration(updateDataDuration)
            .attr("d", pathD(d));

        let txt = d3.select("#textId-" + d.id);
        txt.transition().duration(updateDataDuration)
            .text(d.name)
            .style("font-size", d.txtSize + "pt")
            .on("end", function () {
                txt
                    .on("mouseover", () => {
                        highlight(d)
                    })
                    .on("mouseout", () => {
                        unhighlight(d)
                    })
                    .on("click", () => {
                        dataUpdate(d)
                    });
                tremble = true;
            });
    });

};

var update = function () {

    branches.forEach(function (d, i) {
        d3.select("#textPathId" + d.id)
            .transition()
            .duration(updateDataDuration)
            .attr("d", function () {
                return pathD(d);
            });
    });
}

function getTextWidth(text, font) {
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
};

function getBranchById(id) {
    for (let k = 0; k < branchesCopy.length; k++)
        if (branchesCopy[k].id === id)
            return branchesCopy[k];
    return -1;
}

function getDataById(id) {
    for (let k = 0; k < data.length; k++)
        if (data[k].id === id)
            return data[k];
    return -1;
}

function getBranches(idList) {
    let list = [];
    for (let k = 0; k < branches.length; k++)
        if (idList.includes(branches[k].id))
            list.push(branches[k]);
    return list;
}

function treeGeneration() {
    branches = [];
    seed.ext = false;
    seed.node = data;
    seed.targetDepth = currentDepth;
    branch(seed);
    branchesCopy = branches;
}

function initTreeGeneration() {
    //timeToTitle();
    data = originalData;
    treeGeneration();
    create();
}

function updateTreeGeneration() {
    if (tremble) {
        treeGeneration();
        update();
    }
}

var mainContentSaved, aboutFlag = false, play;

function realReload() {
    sendLogText();
    location.reload();
}

function sendLogText() {
    let txtDiv = $("#generated-text").text();
    let url = $SCRIPT_ROOT + "_log";
    let dataToGo = {vector: JSON.stringify({"text": txtDiv, "author": true})};
    let onReceive = function (result) {
        console.log("SUCCESS LOGGING.");
        console.log(result);
    };
    $.getJSON(url, dataToGo, onReceive)
        .done(function () {
        });
}

function setupMenu() {

    let xFn = function () {
        aboutFlag = false;
        //location.reload();
        realReload();
    };

    ["logo", "about", "help", "wind", "new", "save"].forEach(function (item, i) {
        let shift = (i === 0) ? [42, -300] : [0, 0];
        $("#" + item).mouseenter(function () {
            let y = $(this).offset().top;
            let itemTooltip = $("#" + item + "-tooltip");
            itemTooltip.css({top: y + shift[0]});
            itemTooltip.animate({left: 56}, 200);
        }).mouseleave(function () {
            let itemTooltip = $("#" + item + "-tooltip");
            itemTooltip.animate({left: -300 + shift[1]}, 200);
        });
    });

    ["about", "help"].forEach(function (item) {
        $("#" + item).click(function () {
            let central = $("#central-content");
            if (!aboutFlag) {
                mainContentSaved = central.html();
            }
            let about = $("." + item + "-text");
            central.empty().append(about.html());
            $(".headx").click(xFn);
            aboutFlag = true;
        });
    });

    $("#wind").click(function () {
        updateTreeGeneration();
    });

    $("#new").click(function () {
        realReload();
        //location.reload();
    });

    let menuActive = false;
    let symbols = {"plus": "+", "minus": "-"};
    $("#plus").click(function () {
        if (menuActive) {
            menuActive = false;
            $("#lilmenu").fadeOut(100);
            $("#plushref").text(symbols.plus);
        } else {
            menuActive = true;
            $("#lilmenu").fadeIn(100);
            $("#plushref").text(symbols.minus);
        }
    });
    $("#central-content").click(function () {
        menuActive = false;
        $("#lilmenu").fadeOut(100);
        $("#plushref").text(symbols.plus);
    });

    // $("#save").click(function() {
    //     printJS({
    //         printable: "main-article",
    //         type: "html",
    //         style: '#text-title { font-size: 14px; padding-bottom: 10px; margin-bottom: 10px; } ' +
    //             '#text-date { font-size: 14px; } ' +
    //             '#main-article { margin: 50px 50px 50px 50px; }'
    //     })
    // });

    $("article").mouseenter(updateTreeGeneration).mouseleave(updateTreeGeneration);
    $(".spine").mouseenter(updateTreeGeneration).mouseleave(updateTreeGeneration);

}

function loading(please) {
    let spin = $("#loading");
    please ? spin.show() : spin.hide();
}

// Idle Automation
let randomBranch;
let idleTime = 0;
let waitForIt = false;

var idleAutomation = function () {

    var idleInterval = setInterval(timerIncrement, 2000);

    $(this).mousemove(function (e) {
        console.log("mouse moved");
        idleTime = 0;
    });
    $(this).keypress(function (e) {
        idleTime = 0;
    });

}

function timerIncrement() {
    console.log("idleTime: " + idleTime);
    let times = 4;
    if (idleTime > 3) {
        updateTreeGeneration();
        if (idleTime % times == 0) {
            randomBranch = branches[Math.floor(Math.random() * branches.length)];
            highlight(randomBranch);
            waitForIt = true;
        }
        if ((idleTime % times == 1) && (waitForIt)) {
            waitForIt = false;
            dataUpdate(randomBranch);
        }
    }
    if (idleTime > 50) {
        realReload();
    }
    idleTime = idleTime + 1;
}

// End of Idle Automation

$(document).ready(function () {

    seed.y = $("body").innerHeight() / 2;
    //generateText(['јесен'], initTreeGeneration);
    initTreeGeneration();
    generateText([''], onGeneratedInit);
    setupMenu();

    idleAutomation();
});