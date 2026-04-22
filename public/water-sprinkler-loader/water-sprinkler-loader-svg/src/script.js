import { rawObjectString } from 'https://lukes611.github.io/sprinkler/raw_object_string.js';
import { SVGObj, perspectiveTrans, transformPoint } from 'https://lukes611.github.io/sprinkler/svg_obj.js';
import { LMat4, LV3, LV2 } from 'https://lukes611.github.io/LLA/LLA.js';

const svgElement = document.querySelector('svg');
const text = document.querySelector('.loading-text');
const svgSize = new LV2(
    200,
    110,
);
const TRANSFORM_BASE = new LV2(
    svgSize.x * 0.5,
    svgSize.y * 0.9,
);
const ObjectKeys = {
    BOTTOM: 'base-bottom_Cylinder',
    MAIN: 'base-top_Cylinder.001',
    SPURT: 'water-spurt-1_Cylinder.002',
    NUT: 'nut_Plane',
    TOP: 'top-cyl_Cylinder.004',
    FRONT_HANDLE_TOP: 'front-handle-top_Cube.001',
    BACK_HANDLE: 'back-handle_Cube.002',
    MOVER: 'mover_Cube.003',
    FRONT_HANDLE_BOTTOM: 'front-handle-bottom_Cube.009',
}

const COLORS = {
    TOP: '#00A627',
    MOVER: '#FF79DF',
    // MOVER: '#ffd45c',
    SPURT: '#ffd45c',
    NUT: 'white',
    WATER: '#7096FF',
};
COLORS.MAIN = '#00A627';
COLORS.BOTTOM = '#FF79DF';
COLORS.FRONT_HANDLE_TOP = '#00FF3C'; //'#eee835';
COLORS.FRONT_HANDLE_BOTTOM = COLORS.FRONT_HANDLE_TOP;
COLORS.BACK_HANDLE = COLORS.FRONT_HANDLE_TOP;

function nameToId(name) {
    const entries = Object.entries(ObjectKeys);
    return entries.find(([k, v]) => v === name)[0];
}
const renderOrder = [
    'BOTTOM',
    'NUT',
    'SPURT',
    'FRONT_HANDLE_BOTTOM',
    'MAIN',
    'BACK_HANDLE',
    'MOVER',
    'FRONT_HANDLE_TOP',
    'TOP',
];

function objString2Obj(str) {
    const rv = {
        vs: [],
        objs: [],
    };
    const lines = str.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('o ')) { // start of an object
            const name = line.split(' ')[1];
            const id = nameToId(name);
            rv.objs.push(new SVGObj(name, id, COLORS[id]));
        } else if (rv.objs.length > 0) {
            const ob = rv.objs[rv.objs.length-1];
            if (line.startsWith('v ')) {
                const p = new LV3(...line.split(' ').slice(1).map(Number));
                rv.vs.push(p);
            } else if (line.startsWith('f ')) {
                const splits = line.split(' ').slice(1).map(x => x.split('/')[0]).map(x => Number(x)-1);
                ob.ts.push(splits);
            }
        }
    }
    rv.objs.forEach(o => o.vs = rv.vs);
    rv.objs.sort((a, b) => renderOrder.indexOf(a.id) - renderOrder.indexOf(b.id));
    return rv;
}

const waterProjection = {
    base: new LV3(-100, -100, -100),
    dir: new LV3(-201, 0, 0),
    on: false,
};

const waterPath = createPath([
    new LV2(0, 0),
    new LV2(100, 100),
]);
waterPath.style.stroke = COLORS.WATER;
waterPath.style.strokeWidth = '2.5';

const waterDrops = Array.from({ length: 60 }).map(() => {
    const element = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    element.style.fill = COLORS.WATER;
    element.setAttribute('r', 4);
    element.setAttribute('cx', 30);
    element.setAttribute('cy', 30);
    return element;
});

function randomSpraySet(p1, p2) {
    let n = p2.sub(p1);
    const m = n.mag();
    n = n.scale(1 / m);
    const noiseX = 2;
    function randomPoint() {
        const t = Math.random();
        const a = t * m;
        const noise = noiseX + t * 20;

        return p1.add(n.scale(a)).add(new LV2(
            Math.random() * noise - noise/2,
            Math.random() * noise - noise/2,
        ));
    }
    waterDrops.forEach(e => {
        const p = randomPoint();
        const r = Math.random() * 0.5 + 0.3;
        e.setAttribute('r', r);
        e.setAttribute('cx', p.x);
        e.setAttribute('cy', p.y);
    });
}

function drawWaterVec() {
    const m = LMat4.buildMatrix([
        LMat4.trans(TRANSFORM_BASE.x, TRANSFORM_BASE.y, 0),
        perspectiveTrans(1/500),
        LMat4.trans(0, 0, -500),
    ]);
    
    let p1 = waterProjection.base;
    const dir = waterProjection.dir;
    const sc = waterProjection.on ? 1700 : 1700;
    let p2 = p1.add(dir.scale(sc));
    p1 = transformPoint(m, p1);
    p2 = transformPoint(m, p2);
    randomSpraySet(p1, p2);
    waterPath.setAttribute('d', `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`);
    if (!waterProjection.on) {
        waterPath.style.opacity = '0';
        text.style.opacity = '.5';
    } else {
        waterPath.style.opacity = '1';
        text.style.opacity = '1';
    }
}

const objData = objString2Obj(rawObjectString);
console.log(`found ${objData.objs.length} objects`);

waterDrops.forEach(d => svgElement.appendChild(d))
function animateWater() {
    drawWaterVec();
    requestAnimationFrame(animateWater);
}

animateWater();


svgElement.appendChild(waterPath);
for(let obj of objData.objs) {
    obj.transform = LMat4.trans(100, 100, 0).mult(LMat4.scaleXYZ(8, -8, 8));
    obj.initPaths();
    renderObj(obj);
}

function getObjectById(id) {
    return objData.objs.find(x => x.name === id);
}

function renderObj(obj) {
    
    for(let p of obj.paths) {
        svgElement.append(p.element);
    }

    let ii = 0;
    const maxY = 240;
    const minY = 185;
    let y = maxY;
    let dir = -1;
    let tt = 0;
    function computeOtherAngle() {
        return dir < 1 ?  Math.sin(tt*4) * 10 - 8 : Math.sin(tt*18) * 4 - 8;
    }
    function otherAngle() {
        if (obj.id === 'MOVER') {
            return computeOtherAngle();
        }
        return 0;
    }
    async function draw() {
        const transform = LMat4.buildMatrix([
            LMat4.trans(TRANSFORM_BASE.x, TRANSFORM_BASE.y, 0),
            perspectiveTrans(1/500),
            LMat4.trans(0, 0, -500),
            LMat4.rotateX(40),
            LMat4.rotateY(y + otherAngle()),
            LMat4.scaleXYZ(8, 8, -8),
        ]);
        if (obj.id === 'NUT') {
            const mcomb = LMat4.buildMatrix([
                LMat4.rotateX(40),
                LMat4.rotateY(y + otherAngle()),
                LMat4.scaleXYZ(8, 8, -8),
            ]);
            const t1 = obj.paths[0].points.map(x => transformPoint(mcomb, x));
            
            const base = t1[0];
            let n = undefined;
            {
                let v1 = t1[1].sub(t1[0]).unit();
                let v2 = t1[2].sub(t1[0]).unit();
                n = v1.cross(v2);
            }
            waterProjection.base = base;
            waterProjection.dir = n;
            const oa = computeOtherAngle();
            if (oa > -6) waterProjection.on = true;
            else waterProjection.on = false;
        }
        obj.updateTransform(transform);
        ii += 0.1;
        tt += 0.1;
        if (y < minY) {
            dir = 1;
        } else if (y > maxY) {
            dir = -1;
        }
        y += dir * (dir < 0 ? 0.4 : 1);
        requestAnimationFrame(draw);
    }
    draw();
}

function createPath(points) {
    const e = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    let st = `M ${points[0].x} ${points[0].y}`;
    points.slice(1).forEach(p => {
        st += ` L ${p.x} ${p.y}`;
    });
    st += ' Z ';
    e.setAttribute('d', st);
    return e;
}
