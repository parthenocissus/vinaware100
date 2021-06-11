$(document).ready(function () {

    const sketch = (p) => {

        let azbuka_cela = "абвгдђежзијклљмнњопрстћуфхцчџш";
        let recenica = "разбарушеност";

        let fnt;
        let fntSize = 120;
        let letters = [];
        let letterX = 30;

        let t1 = 0, t2 = 0;

        p.preload = () => {
            fnt = p.loadFont("/static/fonts/singleline/PlanGrotesqueSingleLine.otf");
        };

        p.setup = () => {

            p.createCanvas(930, 170);
            // p.frameRate(1);
            p.textAlign(p.LEFT, p.CENTER);
            // p.noLoop();

            for (let i = 0; i < recenica.length; i++) {
                p.textSize(fntSize);
                let letterWidth = p.textWidth(recenica[i]);
                let letter = fnt.textToPoints(recenica[i], letterX, 110, fntSize, {
                    sampleFactor: 0.7, simplifyThreshold: 0
                });
                if (letter.length > 0) {
                    letters.push(fixLetterPoints(letter));
                    letterX += letterWidth;
                }
            }

        };

        p.draw = () => {

            t1 = 0;
            t2 += 0.03;

            p.background(0);
            p.noFill();
            p.stroke(255);
            p.strokeWeight(2);

            letters.forEach(function (letter) {
                p.beginShape();
                letter.forEach(function (pt) {
                    let trb = tremble();
                    // p.vertex(pt.x + trb.dx, pt.y + trb.dy);
                    p.curveVertex(pt.x + trb.dx, pt.y + trb.dy);
                });
                p.endShape();
            });
            // letters = [];

        };

        let fixLetterPoints = (letter, threshold = 1) => {
            const lastAngle = letter[letter.length - 1].alpha;
            let countToDel = 1;
            for (let i = letter.length - 2; i >= 0; i--) {
                if (Math.abs(letter[i].alpha - lastAngle) > threshold) break;
                countToDel++;
            }
            letter.splice(-countToDel, countToDel);
            return letter;
        };

        let tremble = () => {
            t1 += 0.01;
            let dev = p.map(p.noise(t1, t2), 0, 1, 5, 50);
            let dx = p.map(p.noise(t1, t2), 0, 1, -dev, dev);
            let dy = p.map(p.noise(t1 + 100, t2), 0, 1, -dev, dev);
            return {dx: dx, dy: dy};
        }

    };

    new p5(sketch, document.getElementById('p5sketch'));

});