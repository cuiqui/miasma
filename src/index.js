import { Engine } from './engine.js';
import { Vector2 } from './math/algebra.js';
import './assets/style.css';


class Language {
    /**
     * Smol language.
     * @param {string} axiom 
     * @param {Array.<string>} rules 
     * @param {Object} sentence
     * @param {bool} remember
     */
    constructor(axiom, rules, sentence, remember) {
        this.axiom = axiom;
        this.rules = rules;
        this.remember = remember || false;
        this.history = [];
        this.sentence = sentence || this.axiom;
    }

    next(generations) {
        for (let i = 0; i < generations; i++) {
            let newSentence = '';
            for (let char of this.sentence) {
                if (char in this.rules) {
                    newSentence += this.rules[char];
                } else {
                    newSentence += char;
                }
            }
            if (this.remember) {
                this.history.push(this.sentence);
            }
            this.sentence = newSentence;
        }
        return this.sentence;
    }
}


class Turtle {
    constructor(pos, dir, generations, sentence) {
        this.startingPos = pos;
        this.startingDir = dir;
        this.startSegment = pos;
        this.endSegment = pos;
        this.dir = dir;
        this.language = language;
        this.generations = generations;
        this.sentence = sentence || '';
        this.processingSymbol = 0;
        this.angle = 25;
        this.speed = 2000;
        this.length = 200;
        this.scaleLength = 0.5;
        this.segmentMaxLength = this.length * (this.scaleLength ** this.generations);
        this.posStack = [];
        this.dirStack = [];
    }

    nextSymbol() {
        this.processingSymbol++;
        if (this.processingSymbol >= this.sentence.length) {
            this.processingSymbol = null;
        }
    }

    update(dt) {
        if (this.processingSymbol == null) {
            return;
        }
        let processing = this.sentence.charAt(this.processingSymbol);
        if (processing == 'F') {
            this.startSegment = new Vector2(this.endSegment.x, this.endSegment.y);
            this.endSegment = this.startSegment.add(this.dir.scaleBy(this.speed).scaleBy(dt));
            let segmentLenght = this.endSegment.sub(this.startingPos).length();
            if (segmentLenght >= this.segmentMaxLength) {
                this.endSegment = this.dir.scaleBy(this.segmentMaxLength).add(this.startingPos);
                this.startingPos = new Vector2(this.endSegment.x, this.endSegment.y);
                this.nextSymbol();
            }
        }
        if (processing == '+') {
            this.dir.rotate(-this.angle);
            this.nextSymbol();
        }
        if (processing == '-') {
            this.dir.rotate(this.angle);
            this.nextSymbol();
        }
        if (processing == '[') {
            this.posStack.push(new Vector2(this.endSegment.x, this.endSegment.y));
            this.dirStack.push(new Vector2(this.dir.x, this.dir.y));
            this.nextSymbol();
        }
        if (processing == ']') {
            this.startSegment = this.posStack.pop();
            this.startingPos = new Vector2(this.startSegment.x, this.startSegment.y);
            this.endSegment = new Vector2(this.startSegment.x, this.startSegment.y);
            this.dir = this.dirStack.pop();
            this.nextSymbol();
        }
    }

    draw(ctx) {
        if (this.processingSymbol == null) {
            return;
        }
        ctx.beginPath();
        ctx.moveTo(this.startSegment.x, this.startSegment.y);
        ctx.lineTo(this.endSegment.x, this.endSegment.y);
        ctx.stroke();
    }
}


export class Lsystem {
    constructor(canvasSize, canvasName, language, generations) {
        this.canvasSize = canvasSize;
        this.canvasName = canvasName;
        this.language = language;
        this.generations = generations;
        this.turtle = new Turtle(
            new Vector2(this.canvasSize.width / 2, this.canvasSize.height),
            new Vector2(0, -1),
            this.generations
        );
        // create engine
        this.engine = new Engine(
            this.canvasSize.width,
            this.canvasSize.height,
            this.canvasName,
        );
        this.engine.clearCanvasBetweenFrames = false;
    }
    setup() {
        window.LSYS = this;
        this.turtle.sentence = this.language.next(this.generations);
        this.engine.pushSprite(this.turtle);
    }

    start() {
        this.engine.start();
    }

    stop() {
        this.engine.stop();
    }
}

const canvasSize = {
    width: document.getElementById('canvas').parentNode.offsetWidth,
    height: window.innerHeight
};
let rulesTree = {
    'F': 'FF+[+F-F-F]-[-F+F+F]'
};
let rulesCarpet = {
    'F': 'F[F]-F+F[--F]+F-F'
};
let language = new Language('F', rulesTree);
let lsys = new Lsystem(canvasSize, 'canvas', language, 5);
lsys.setup();
lsys.start();
