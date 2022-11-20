export class Rectangle {

    public readonly x1: number;
    public readonly y1: number;
    public readonly x2: number;
    public readonly y2: number;

    constructor(x1: number, y1: number, x2: number, y2: number, public readonly reference?: any) {
        this.x1 = Math.min(x1, x2);
        this.y1 = Math.min(y1, y2);
        this.x2 = Math.max(x1, x2);
        this.y2 = Math.max(y1, y2);
    }

    public overlaps(other: Rectangle): boolean {
        return this.x1 <= other.x2 && this.x2 >= other.x1 && this.y1 <= other.y2 && this.y2 >= other.y1;
    }

    public contains(other: Rectangle): boolean {
        return this.x1 <= other.x1 && this.x2 >= other.x2 && this.y1 <= other.y1 && this.y2 >= other.y2;
    }
}

export default class QuadTree {

    private objects: Rectangle[] = [];
    private containedObjects: Rectangle[] = [];
    private children: QuadTree[] = [];
    private objectCount: number = 0;
    private readonly coalescenceCount: number = this.maxObjects / 2;

    constructor(
        private readonly maxObjects: number = 10,
        private readonly maxLevels: number = 4,
        private readonly level: number = 0,
        private readonly bounds: Rectangle = new Rectangle(-Infinity, -Infinity, Infinity, Infinity)
    ){

    }

    private overlaps(rect: Rectangle): boolean {
        return this.bounds.overlaps(rect);
    }

    public retrieve(rect: Rectangle): Rectangle[] {
        return this.getCandidates(rect);
    }

    private getCandidates(rect: Rectangle): Rectangle[] {
        return [...this.objects.filter(o => o.overlaps(rect)), ...this.children.filter(c => c.overlaps(rect)).map(c => c.getCandidates(rect)).flat(), ...this.containedObjects];
    }

    public insert(rect: Rectangle): number {


        const complexity = (() => {
            if (!this.overlaps(rect)) {
                return 0;
            }

            if (rect.contains(this.bounds)) {
                this.containedObjects.push(rect);
                return 1;
            }
        
            if (this.level >= this.maxLevels) {
                this.objects.push(rect);
                return 1;
            }

            if(this.children.length === 0 && this.objects.length < this.maxObjects) {
                this.objects.push(rect);
                return 1;
            }

            if (this.objects.length >= this.maxObjects) {
                if(this.children.length !== 0) throw new Error("Critical Logic Error");

                this.split();

                const oldObjects = this.objects;
                this.objects = [];
                oldObjects.forEach(o => this.insert(o));

                this.objects = [];
            }

            return this.children.map(c => c.insert(rect)).reduce((a, b) => a + b, 0);
        })();    

        this.objectCount += complexity > 0 ? 1 : 0;

        return complexity;
    }
    
    private split() {
        this.medianSplit();
    }

    private medianSplit() {
        let xPoints = [...this.objects.map(o => o.x1).sort((a, b) => a - b), ...this.objects.map(o => o.x2).sort((a, b) => a - b)];
        let yPoints = [...this.objects.map(o => o.y1).sort((a, b) => a - b), ...this.objects.map(o => o.y2).sort((a, b) => a - b)];

        // filter points that are not bounded
        xPoints = xPoints.filter(p => p >= this.bounds.x1 && p <= this.bounds.x2);
        yPoints = yPoints.filter(p => p >= this.bounds.y1 && p <= this.bounds.y2);

        // get median, average if even
        const xMid = xPoints.length % 2 === 0 ? (xPoints[xPoints.length / 2] + xPoints[xPoints.length / 2 - 1]) / 2 : xPoints[Math.floor(xPoints.length / 2)];
        const yMid = yPoints.length % 2 === 0 ? (yPoints[yPoints.length / 2] + yPoints[yPoints.length / 2 - 1]) / 2 : yPoints[Math.floor(yPoints.length / 2)];

        this.children = [
            new QuadTree(this.maxObjects, this.maxLevels, this.level + 1, new Rectangle(this.bounds.x1, this.bounds.y1, xMid, yMid)),
            new QuadTree(this.maxObjects, this.maxLevels, this.level + 1, new Rectangle(xMid, this.bounds.y1, this.bounds.x2, yMid)),
            new QuadTree(this.maxObjects, this.maxLevels, this.level + 1, new Rectangle(this.bounds.x1, yMid, xMid, this.bounds.y2)),
            new QuadTree(this.maxObjects, this.maxLevels, this.level + 1, new Rectangle(xMid, yMid, this.bounds.x2, this.bounds.y2))
        ]

    }


    public remove(rect: Rectangle): number {

        const complexity = (() => {
            if (!this.overlaps(rect)) {
                return 0;
            }

            if (rect.contains(this.bounds)) {
                const oldLength = this.containedObjects.length;
                this.containedObjects = this.containedObjects.filter(o => o !== rect);
                return oldLength - this.containedObjects.length;
            }

            if (this.level >= this.maxLevels) {
                const oldLength = this.objects.length;
                this.objects = this.objects.filter(o => o !== rect);
                return oldLength - this.objects.length;
            }

            return this.children.map(c => c.remove(rect)).reduce((a, b) => a + b, 0);
        })();

        this.objectCount -= complexity > 0 ? 1 : 0;

        if(this.objectCount < this.coalescenceCount) {
            this.coalesce();
        };

        return complexity;
    }

    private coalesce() {
        this.children.forEach(c => {
            if(c.children.length !== 0) throw new Error("Critical Logic Error");
            this.objects.push(...c.objects, ...c.containedObjects);
        });

        this.children = [];
    }
}