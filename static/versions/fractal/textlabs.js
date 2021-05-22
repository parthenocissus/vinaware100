$(document).ready(function () {

    const sketch = (p) => {

        let azbuka = "абвгдђежзијклљмнњопрстћуфхцчџш";

        let fnt;
        let fntSize = 66;
        let letters = [];
        let letterX = 20;

        p.preload = () => {
            fnt = p.loadFont("/static/fonts/singleline/PlanGrotesqueSingleLine.otf");
        };

        p.setup = () => {

            p.createCanvas(1200, 200);
            p.frameRate(1);
            p.textAlign(p.LEFT, p.CENTER);
            p.noLoop();

            for (let i = 0; i < azbuka.length; i++) {
                p.textSize(fntSize);
                let letterWidth = p.textWidth(azbuka[i]);
                let letter = fnt.textToPoints(azbuka[i], letterX, 70, fntSize, {
                    sampleFactor: 0.7, simplifyThreshold: 0
                });
                if (letter.length > 0) {
                    letters.push(fixLetterPoints(letter));
                    letterX += letterWidth;
                }
            }

        };

        p.draw = () => {

            p.background(0);
            p.noFill();
            p.stroke(255);
            p.strokeWeight(1);

            letters.forEach(function (letter) {
                p.beginShape();
                letter.forEach(function (pt) {
                    p.vertex(pt.x, pt.y);
                });
                p.endShape();
            });
            letters = [];

            // let testLetter = fnt.textToPoints("г", 20, 100, 100, {
            //     sampleFactor: 0.2, simplifyThreshold: 0
            // });
            // testLetter = fixLetterPoints(testLetter);
            //
            // p.beginShape();
            // testLetter.forEach(function (pt) {
            //     p.vertex(pt.x, pt.y);
            //     // p.curveVertex(pt.x, pt.y);
            // });
            // p.endShape();
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

    };

    new p5(sketch, document.getElementById('p5sketch'));

});