$(document).ready(function () {

    const sketch = (p) => {

        let fnt;

        let pts;
        let txt = "Фијуче ветар у шибљу, леди пасаже и куће.";
        let letters = [];
        // let epsilon = fntSize * 0.03;

        let slider1, slider2, slider3;

        p.preload = () => {
            fnt = p.loadFont("/static/media/AlegreyaSans-Thin2.otf");
        };

        p.setup = () => {
            p.createCanvas(1050, 200);
            p.frameRate(1);
            p.textAlign(p.LEFT, p.CENTER);

            slider1 = p.createSlider(1, 20, 5);
            slider1.position(10, 220);
            slider1.style('width', '200px');

            slider2 = p.createSlider(5, 100, 30);
            slider2.position(10, 250);
            slider2.style('width', '200px');

            slider3 = p.createSlider(30, 200, 50);
            slider3.position(10, 280);
            slider3.style('width', '200px');

            p.noLoop();

            // p.background(220);

            // pts = fnt.textToPoints('Милош Црњански', 100, 150, fntSize, {
            //     sampleFactor: 0.1,
            //     simplifyThreshold: 0
            // });
            // pts = reduceTypePoints(pts, epsilon);
        };

        p.draw = () => {

            p.background(220);
            p.noFill();
            p.stroke(1);
            p.strokeWeight(1);

            let testLetter = fnt.textToPoints("ć", 20, 100, 100, {
                sampleFactor: 0.2, simplifyThreshold: 0
            });

            testLetter = fixLetterPoints(testLetter);

            p.beginShape();
            testLetter.forEach(function (pt) {
                p.vertex(pt.x, pt.y);
                // console.log(pt);
                // p.curveVertex(pt.x, pt.y);
            });
            p.endShape();

            let txtX = 10;

            fntSize = slider3.value();

            let epsRatio = slider1.value() / 100;
            let epsilon = fntSize * epsRatio;

            let sampleRatio = slider2.value() / 100;

            for (let i = 0; i < txt.length; i++) {
                let char = txt.charAt(i);
                p.textSize(fntSize);
                let w = p.textWidth(char);

                let letterPoints = fnt.textToPoints(char, txtX, 150, fntSize, {
                    sampleFactor: sampleRatio, simplifyThreshold: 0
                });
                letterPoints = reduceTypePoints(letterPoints, epsilon);

                letters.push(letterPoints);
                txtX += w;
            }

            letters.forEach(function (letter) {
                p.beginShape();
                letter.forEach(function (pt) {
                    p.vertex(pt.x, pt.y);
                    // p.curveVertex(pt.x, pt.y);
                });
                p.endShape();
            });

            letters = [];

            // p.beginShape();
            // pts.forEach(function (pt) {
            //     console.log(pt.x + " " + pt.y);
            //     p.vertex(pt.x, pt.y);
            // });
            // p.endShape();

            // p.noStroke();
            // p.fill(0);
            //
            // pts.forEach(function (pt) {
            //     // console.log(pt.x + " " + pt.y);
            //     // p.point(pt.x, pt.y);
            //     console.log(pt.x + " " + pt.y);
            //     p.ellipse(pt.x, pt.y, 2);
            // });
        };

        let fixLetterPoints = (letter, threshold= 1) => {
            const lastAngle = letter[letter.length - 1].alpha;
            let countToDel = 1;
            for (let i = letter.length - 2; i >= 0; i--) {
                if (Math.abs(letter[i].alpha - lastAngle) > threshold) break;
                countToDel++;
            }
            letter.splice(-countToDel, countToDel);
            return letter;
        };

        let reduceTypePoints = (pts, epsilon) => {

            const newPts = [];

            const distance = (pt1, pt2) => {
                let dx = pt1.x - pt2.x;
                let dy = pt1.y - pt2.y;
                return Math.sqrt(dx * dx + dy * dy);
            };

            const noSimilar = (pt) => {
                let value = true;
                newPts.forEach(function (npt) {
                    if (distance(npt, pt) < epsilon) {
                        value = false;
                    }
                });
                return value;
            };

            pts.forEach(function (pt) {
                if (noSimilar(pt)) {
                    newPts.push(pt);
                }
            });

            return newPts;
        }

    };

    new p5(sketch, document.getElementById('p5sketch'));

});