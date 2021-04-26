
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
var sites = [{x: 1, y:1}, {x:2, y:2}, {x: 4, y: 1.5}, {x:2.5, y: 3.5}];

var voronoi = new Voronoi(sites, width, height);

var polygon = svg.append("g")
    // .attr("class", "polygons")
    .selectAll("path")
    .data(voronoi.polygons)
    .enter().append("path")
    .call(redraw_polygon);

// var segments = svg.append("g")
//     .attr("class", "links")
//     .selectAll("line")
//     .data(voronoi.segments)
//     .enter().append("line")
//     .call(redraw_segment);

var beachline = svg.append("g")
    // .attr("class", "beachline")
    .selectAll("path")
    .data(voronoi.beachline)
    .enter().append("path")
    .call(redraw_beachline);

var site = svg.append("g")
    // .attr("class", "sites")
    .selectAll("circle")
    .data(sites)
    .enter().append("circle")
    .call(redraw_site);

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
        .attr("y2", function(seg) { return seg.end.y; });
}

function redraw_boundary(segment) {
    segment
        .attr("x1", function(seg) { return seg.source.x; })
        .attr("y1", function(seg) { return seg.source.y; })
        .attr("x2", function(seg) { return seg.end.x; })
        .attr("y2", function(seg) { return seg.end.y; })
        .attr('stroke', function(seg){ return seg.color; });
}

function redraw_site(site) {
    site
        .attr("cx", function(point) { return point.x; })
        .attr("cy", function(point) { return point.y; });
}


function redraw_polygon(polygon) {
    polygon
        .attr("d", function(cell) { return  "M" + cell.points.join("L") + "Z"; })
        .attr("fill", function(cell) { return  cell.color; })
        .attr('stroke', 'black');
}

function redraw_beachline(beachline){
    beachline.attr('d', function(arc){ 
        return `C ${arc.p1.x} ${arc.p1.y}, ${arc.p3.x} ${arc.p3.y}, ${arc.p2.x} ${arc.p2.y}` })
    .attr('stroke', 'blue')
    .attr('fill', 'transparent');
}
