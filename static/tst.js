import define1 from "../@sethpipho/gui.js";

export default function define(runtime, observer) {
    const main = runtime.module();

    main.variable(observer()).define(["md"], function (md) {
        return (
            md`# Fractal Tree`
        )
    });

    const child1 = runtime.module(define1);

    main.import("GUI", child1);

    main.import("Range", child1);

    main.variable(observer("render"))
        .define("render", ["DOM", "Random", "config", "tree"],
            function (DOM, Random, config, tree) {

                let ctx = DOM.context2d(1000, 600)
                let random = new Random(config.seed)
                let start_angle = -1 * (Math.PI / 2) + random.gaussian(0, .5)

                tree(300, 600, start_angle, 1, random, config, ctx)
                return ctx.canvas

            }
        );

    main.variable(observer("viewof config"))
        .define("viewof config", ["GUI", "Range"],
            function (GUI, Range) {

                return (GUI({
                        maxDepth: Range(0, 20, 1, 12),
                        scale: Range(0, 100, 1, 100),
                        lineWidth: Range(0, 30, 1, 22),
                        lineWidthFalloff: Range(1, 3, .01, 1.6),
                        lengthVar: Range(0, 10, .1, 3.8),
                        branchiness: Range(0, .5, .001, .044),
                        curveAmount: Range(0, 1, .01, .2),
                        upAmount: Range(0, .1, .0001, .0095),
                        spread: Range(0, 1, .01, .4),
                        seed: Range(1, 300, 1, 31)
                    })
                )
            });

    main.variable(observer("config"))
        .define("config", ["Generators", "viewof config"],
            (G, _) => G.input(_));

    main.variable(observer("tree"))
        .define("tree", function () {
            return (
                function tree(x, y, angle, depth, random, config, ctx) {
                    if (depth >= config.maxDepth) {
                        return
                    }

                    let _x = x
                    let _y = y
                    let _angle = angle
                    let length = (config.scale / depth) * random.gaussian(1, config.lengthVar)
                    let segments = length / 10

                    ctx.lineWidth = config.lineWidth / (Math.pow(config.lineWidthFalloff, depth))
                    ctx.strokeStyle = "rgb(60,60,60)"
                    ctx.lineCap = "round"

                    let curve_dir = (random.unif(0, 1) < .5) ? -1 : 1
                    let curve = config.curveAmount * curve_dir
                    if (depth == 1) {
                        curve *= .25
                    }

                    for (let i = 0; i < segments; i++) {

                        let up = (angle < -Math.PI / 2) ? Math.PI / 2 - angle : angle - Math.PI / 2

                        _angle += curve + (up * config.upAmount * depth)
                        _x = x + 10 * Math.cos(angle)
                        _y = y + 10 * Math.sin(angle)


                        ctx.beginPath()
                        ctx.moveTo(x, y)
                        ctx.lineTo(_x, _y)
                        ctx.stroke()
                        ctx.closePath()

                        x = _x
                        y = _y
                        angle = _angle

                        if (random.unif(0, 1) < config.branchiness) {
                            let dir = (random.unif(0, 1) < .5) ? -1 : 1
                            tree(x, y, angle + (config.spread / 2 * dir), depth + 1, random, config, ctx)
                            ctx.lineWidth = config.lineWidth / (Math.pow(config.lineWidthFalloff, depth))
                        }
                    }

                    let dir = (random.unif(0, 1) < .5) ? -1 : 1
                    tree(x, y, angle + (config.spread * dir), depth + 1, random, config, ctx)
                    tree(x, y, angle + (config.spread * -dir), depth + 1, random, config, ctx)

                    if (depth >= config.maxDepth - 2) {

                        let h = random.unif(160, 170)
                        let s = random.unif(65, 75)
                        let l = random.unif(60, 70)
                        ctx.fillStyle = `hsl(${h}, ${s}%, ${l}%)`

                        let r = random.gaussian(4, 1)
                        ctx.beginPath()
                        ctx.arc(x, y, r, 0, Math.PI * 2)
                        ctx.fill()
                    }
                }
            )
        });

    main.variable(observer("Random"))
        .define("Random", function () {

            return (
                function Random(seed) {
                    this.seed = seed

                    this.random = function () {
                        let x = Math.sin(this.seed) * 10000
                        this.seed++
                        return x - Math.floor(x)
                    }

                    this.gaussian = function (mean, std) {
                        var rand = 0;
                        for (var i = 0; i < 6; i += 1) {
                            rand += this.random();
                        }
                        return ((rand - 3) / 6) * std + mean;
                    }

                    this.unif = function (a, b) {
                        return this.random() * (b - a) + a
                    }
                }
            )
        });

    return main;

}
