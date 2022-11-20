{ // testrunner status header
    // find the body element, and add a div to it as first child
    var body = document.getElementsByTagName('body')[0];
    var div = document.createElement('div');
    body.insertBefore(div, body.firstChild);
    // set id to "testrunner"
    div.setAttribute('id', 'testrunner');
    // add text: testrunner running
    div.appendChild(document.createTextNode('testrunner running'));
    // center the text
    div.style.textAlign = 'center';
    // make the testrunner div full width
    div.style.width = '100%';
    // make background yellow
    div.style.backgroundColor = 'yellow';
}
// test quadtree
{ // testrunner status header prepend div "running quadtree tests"
    var body = document.getElementsByTagName('body')[0];
    var div = document.createElement('div');
    body.insertBefore(div, body.firstChild);
    // set id to "testrunner-quadtree"
    div.setAttribute('id', 'testrunner-quadtree');
    // add text: quadtree tests running
    div.appendChild(document.createTextNode('quadtree tests running'));
    // center the text
    div.style.textAlign = 'center';
    // make the testrunner div full width
    div.style.width = '100%';
    // make background yellow
    div.style.backgroundColor = 'yellow';
}
import QuadTree from './quadtreeadapter.js';
var qt = new QuadTree();
console.log(qt);
qt.insert({ x: 1, y: 1, width: 1, height: 1, reference: 'a' });
qt.insert({ x: 2, y: 2, width: 1, height: 1 });
qt.insert({ x: 3, y: 3, width: 1, height: 1 });
qt.insert({ x: 4, y: 4, width: 1, height: 1 });
qt.insert({ x: 5, y: 5, width: 2, height: 2 });
qt.insert({ x: 6, y: 6, width: 2, height: 2 });
qt.insert({ x: 1.5, y: 2.6, width: 2, height: 2 });
if (JSON.stringify(qt.retrieve({ x: 1, y: 1, width: 2, height: 2 })) ==
    JSON.stringify([{ x: 1, y: 1, width: 1, height: 1, reference: 'a' }, { x: 2, y: 2, width: 1, height: 1 }, { x: 3, y: 3, width: 1, height: 1 }, { x: 1.5, y: 2.6, width: 2, height: 1.9999999999999996 }])) {
    console.log('quadtree test passed');
    // testrunner quadtree status header set to success
    var div = document.getElementById('testrunner-quadtree');
    div.style.backgroundColor = 'lightgreen';
    div.innerHTML = 'quadtree tests success';
}
else {
    console.log('quadtree test failed');
    // testrunner quadtree status header set to failure
    var div = document.getElementById('testrunner-quadtree');
    div.style.backgroundColor = 'red';
    div.innerHTML = 'quadtree tests failed';
}
{ // testrunner complete
    // get testrunner div
    var div = document.getElementById('testrunner');
    // set text to "testrunner complete"
    div.firstChild.nodeValue = 'testrunner complete';
    // make background bright green
    div.style.backgroundColor = 'lightgreen';
}
//# sourceMappingURL=testrunner.js.map