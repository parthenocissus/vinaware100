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
var dts = 0.8;
var maxDepth = 7;
let baseSpur = 10;
var currentDepth = maxDepth;

//var punct = '!"#$%&()*+,-./:;<=>?@[\]^_`{|}~\\n\\t\'‘’“”’–—';
var punctBeforeSpace = '(‘“';
var punctAfterSpace = '!"#$%&)*+,-./:;<=>?@^_`{|}~’”’–—';

var longWordList = [];

var seed = {
    id: 0,
    x: 50,
    y: 400,
    baseAngle: 0,
    a: Math.PI / 2,
    l: 80,
    d: 0,
    node: data,
    txtSize: 60,
    targetDepth: maxDepth,
    ext: false
};

var generateText = function (wordVector, init) {

    let url = $SCRIPT_ROOT + pathToGenerate;
    let dataToGo = {vector: JSON.stringify({"seedwords": wordVector, "depth": maxDepth})};
    let onReceive = function (result) {
        // console.log(result);
        data = result;
    };

    $.getJSON(url, dataToGo, onReceive)
        .done(function () {
            // loading(false);
            init();
        });
};

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
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

function unselectedIds(ids) {
    let xids = [];
    for (let k = 0; k < branches.length; k++) {
        if (!ids.includes(k)) {
            xids.push(k);
        }
    }
    return xids;
}

function getBranchById(id) {
    for (let k = 0; k < branchesCopy.length; k++)
        if (branchesCopy[k].id === id)
            return branchesCopy[k];
    return -1;
}

$(document).ready(function () {

    seed.y = $("body").innerHeight() / 2;
    // maybe to go
    data = originalData;
    branches = [];
    seed.ext = false;
    seed.node = data;
    seed.targetDepth = currentDepth;
    // ...

    let text = "isprobavanje";

    const s = (p) => {

        let t = 0;
        let tIterator = 0.01;

        p.setup = () => {

            p.createCanvas(1000, 600);

            seed.y = p.height/2;
            seed.node = data;
            seed.targetDepth = maxDepth;
            branches = [];
            branch(seed);
            data = seed.node;
            branchesCopy = branches;
            currentDepth = maxDepth;

            p.frameRate(1);
            p.textAlign(p.LEFT, p.CENTER);
            p.noLoop();

        };

        p.draw = () => {
            // console.log(data);
            // console.log(branches);

            p.background(210);
            p.fill(0);
            // p.textSize(40);

            seed.node = data;
            seed.targetDepth = maxDepth;
            branches = [];
            branch(seed);
            data = seed.node;
            branchesCopy = branches;
            currentDepth = maxDepth;

            branches.forEach(function (br) {
                p.textSize(br.txtSize);
                br.letters.forEach(function (letter) {
                    p.push();
                    p.translate(letter.x, letter.y);
                    p.rotate(letter.angle);
                    p.text(letter.char, 0, 0);
                    p.pop();
                });
                //p.text(br.name, br.x, br.y);
            });

            t = p.random(0, 1000);
        };

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

            p.textSize(b.txtSize);
            b.l = p.textWidth(b.name);

            b.letters = [];

            let point = { x: b.x, y: b.y };
            let currentAngle = b.baseAngle;

            for (let i = 0; i < b.name.length; i++) {

                t += tIterator;

                let currentChar = b.name.charAt(i);
                let w = p.textWidth(currentChar);

                currentAngle += p.map(p.noise(t), 0, 1, -p.PI / 8, p.PI / 8);
                // currentAngle += b.baseAngle;

                let dx = p.cos(currentAngle) * w;
                let dy = p.sin(currentAngle) * w;

                b.letters.push({
                    char: currentChar,
                    // angle: dAngle + b.baseAngle,
                    angle: currentAngle,
                    x: point.x,
                    y: point.y
                });

                point = {
                    x: point.x + dx,
                    y: point.y + dy
                };
            }

            branches.push(b);

            //let end = endPt(b);
            let end = point;

            let minusSpur = p.textWidth("   ");
            let minusAngle = currentAngle - p.PI;
            let spurStem = {
                x: point.x + (p.cos(minusAngle) * minusSpur),
                y: point.y + (p.sin(minusAngle) * minusSpur)
            };

            // let baseAngleUp = currentAngle + p.random(-p.PI/8, -p.PI/16);
            // let baseAngleDown = currentAngle + p.random(p.PI/16, p.PI/8);

            let baseAngleUp = currentAngle + p.random(-p.PI/8, 0);
            let baseAngleDown = currentAngle + p.random(0, p.PI/8);

            // baseAngleUp = currentAngle - p.PI/16;
            // baseAngleDown = currentAngle + p.PI/16;

            // let spur = baseSpur * dts;
            let spur = p.textWidth("   ") * 1.2;
            let endUp = {
                x: spurStem.x + (p.cos(baseAngleUp) * spur),
                y: spurStem.y + (p.sin(baseAngleUp) * spur)
            };
            let endDown = {
                x: spurStem.x + (p.cos(baseAngleDown) * spur),
                y: spurStem.y + (p.sin(baseAngleDown) * spur)
            };

            if (b.d === maxDepth)
                return;

            let daR, newB;

            daR = ar * Math.random() - ar * 0.5;
            newB = {
                id: branches.length,
                x: endUp.x,
                y: endUp.y,
                baseAngle: baseAngleUp,
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
                x: endDown.x,
                y: endDown.y,
                baseAngle: baseAngleDown,
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

    };

    generateText(['лутам'], function () {
        console.log(data);
        new p5(s, document.getElementById('p5sketch'));
    });


});