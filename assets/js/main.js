
import {Voronoi} from './Voronoi.js';

function isFunction(functionToCheck) {
return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}
console.log(isFunction(Voronoi), Voronoi, {}.toString.call(Voronoi));

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

const x_offset = 0, y_offset = 0;
// var sites = d3.range(100)
//     .map(function(d) { return {x:Math.random() * width + x_offset, y:Math.random() * height + y_offset} ; });
var sites = [{x: 100, y:100}, {x:200, y:200}, {x: 400, y: 150}, {x:250, y: 350}];

var voronoi = new Voronoi(sites, width, height);

var polygon = svg.append("g")
    // .attr("class", "polygons")
    .selectAll("path")
    .data(voronoi.polygons)
    .enter().append("path")
    // .call(redraw_polygon);

var segments = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(voronoi.segments)
    .enter().append("line")
    .call(redraw_segment);

var beachline = svg.append("g")
    // .attr("class", "beachline")
    .selectAll("path")
    .data(voronoi.beachlines)
    .enter().append("path")
    // .call(redraw_beachline);

var site = svg.append("g")
    // .attr("class", "sites")
    .selectAll("circle")
    .data(sites)
    .enter().append("circle")
    .attr("r", 5)
    .call(redraw_site);

var start = svg.append('g')
        .selectAll("circle")
        // .data(voronoi.beachlines)
        .data(voronoi.edges)
        .enter().append("circle")
        .attr("r", 5)
        .call(redraw_start);

var end = svg.append('g')
.selectAll("circle")
// .data(voronoi.beachlines)
.data(voronoi.segments)
.enter().append("circle")
.attr("r", 5)
// .call(redraw_end);

var boundary = svg.append("g")
    // .attr("class", "sites")
    .selectAll("line")
    .data(voronoi.boundary)
    .enter().append("line")
    .call(redraw_boundary);

function redraw_segment(segment) {
    segment
        .attr("x1", function(seg) { return seg.source.x; })
        .attr("y1", function(seg) { return seg.source.y; })
        .attr("x2", function(seg) { return seg.end.x; })
        .attr("y2", function(seg) { return seg.end.y; })
        .attr('stroke', 'black');
}

function redraw_boundary(segment) {
    segment
        .attr("x1", function(seg) { return seg.x1; })
        .attr("y1", function(seg) { return seg.y1; })
        .attr("x2", function(seg) { return seg.x2; })
        .attr("y2", function(seg) { return seg.y2; })
        .attr('stroke', function(seg){ return seg.color; });
}

function redraw_start(start){
    // start.attr('cx', (seg)=>seg.source.x)
    //     .attr('cy', (seg)=>seg.source.y)
    //     .attr('fill', 'red');

    // start.attr('cx', (seg)=>seg.p1.x)
    //     .attr('cy', (seg)=>seg.p1.y)
    //     .attr('fill', 'red');

    start.attr('cx', (seg)=>seg.start_point.x)
        .attr('cy', (seg)=>seg.start_point.y)
        .attr('fill', 'red');
}

function redraw_end(end){
    end.attr('cx', (seg)=>seg.end.x)
        .attr('cy', (seg)=>seg.end.y)
        .attr('fill', 'orange');

    // end.attr('cx', (seg)=>seg.p3.x)
    // .attr('cy', (seg)=>seg.p3.y)
    // .attr('fill', 'orange');
}

function redraw_site(site) {
    site
        .attr("cx", function(point) { 
            // console.log(point);
            return point.x; 
        })
        .attr("cy", function(point) { return height-point.y; })
        .attr('fill', 'black');
}


function redraw_polygon(polygon) {
    polygon
        .attr("d", function(cell) { 
            // console.log(cell);
            // console.log("M" + cell.points.join("L") + "Z");
            return  "M" + cell.points.join("L") + "Z"; 
        })
        .attr("fill", function(cell) { return  cell.color; })
        .attr('stroke', 'black');
}

function redraw_beachline(beachline){
    
    beachline.attr('d', function(arc){ 
        // console.log(`M ${arc.p1.x} ${arc.p1.y} C ${arc.p1.x} ${arc.p1.y}, ${arc.p3.x} ${arc.p3.y}, ${arc.p2.x} ${arc.p2.y}`);
        return `M ${arc.p1.x} ${arc.p1.y} C ${arc.p1.x} ${arc.p1.y}, ${arc.p3.x} ${arc.p3.y}, ${arc.p2.x} ${arc.p2.y}`;
    })
    .attr('stroke', 'blue')
    .attr('fill', 'transparent');
}
