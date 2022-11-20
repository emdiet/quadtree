import QuadTree from './quadtree.js';
import { Rectangle } from './quadtree.js';

export default class QuadTreeAdapter{
    private QT = new QuadTree();

    public insert(rect: {x: number, y: number, width: number, height: number, reference?: any}): number {
        return this.QT.insert(new Rectangle(rect.x, rect.y, rect.x + rect.width, rect.y + rect.height, rect.reference));
    }

    public retrieve(rect: {x: number, y: number, width: number, height: number}): {x: number, y: number, width: number, height: number, reference?:any}[] {
        return this.QT.retrieve(new Rectangle(rect.x, rect.y, rect.x + rect.width, rect.y + rect.height)).map(r => ({x: r.x1, y: r.y1, width: r.x2 - r.x1, height: r.y2 - r.y1, reference: r.reference}));
    }
}
