import {Parabola, BreakPoint,Parabola_Tree} from './Parabola_Tree.js';
import {Event, Event_Queue} from './Event_Queue.js';
import { Point, Edge } from './Edge.js';
import { Cell } from './Cell.js';



function Voronoi(width, height, redraw, svg, fast = false){

    function range(start, end, num_pts){
        if(num_pts == 0) return [];
        if(num_pts == 1) return [start];
        const step = (end-start)/(num_pts-1);
        var arr = [];
        for(var i = start; i <= end; i+= step ){
            arr.push(i);
        }
        return arr;
    }

    this.EPS = 1;
    this.edges = [];
    this.sites = [];
    this.tree = new Parabola_Tree();
    this.queue = new Event_Queue();
    this.width= width;
    this.height = height;
    this.ly = height;
    this.segments = [];
    this.beachlines = [];
    this.polygons = [];

    this.boundary = [];
    this.boundary.push({x1:0, y1:0, x2:0, y2:height, color:'black'});
    this.boundary.push({x1:0, y1:0, x2:width, y2:0, color:'black'});
    this.boundary.push({x1:width, y1:0, x2:width, y2:height, color:'black'});
    this.boundary.push({x1:0, y1:height, x2:width, y2:height, color:'black'});

    this.svg = svg;
    this.redraw = redraw;
    this.speed = 1000;
    this.fast = fast;

}



Voronoi.prototype.reset = function(){
    this.clean();
    this.sites = [];
}

Voronoi.prototype.clean = function(){
    this.edges = [];
    this.tree = new Parabola_Tree();
    this.ly = this.height;
    this.segments = [];
    this.beachlines = [];
    this.polygons = [];
    
}

Voronoi.prototype.start = function(){
    this.clean();
    this.get_edges();
}


Voronoi.prototype.add_site = function(point){
    const height = this.height;
    this.sites.push(new Cell(point.x, point.y));
  
}

Voronoi.prototype.process_event = function(){
    var THIS = this;
    var speed = this.speed;
    setTimeout(function(){
        const e = THIS.queue.top();
        THIS.queue.pop();
        THIS.ly = e.point.y;
        THIS.tree.set_ly(THIS.ly);
        console.log('event', THIS.ly);

        if(e.fake){//draw event
            
        }
        else if(e.is_circle){
            if(e.cEvent_valid)
            THIS.remove_parabola(e);
        }
        else{
            THIS.insert_parabola(e.parabola);
        }
        
        if(!THIS.queue.is_empty()){
            THIS.draw();
            THIS.process_event();
        }
        else{
            THIS.tree.set_ly(0);
            THIS.draw(true);
        }
    }, speed);
}

Voronoi.prototype.process_event_fast = function(){
    var THIS = this;
    while(!THIS.queue.is_empty()){
        const e = THIS.queue.top();
        THIS.queue.pop();
        THIS.ly = e.point.y;
        THIS.tree.set_ly(THIS.ly);

        if(e.fake){//draw event
            
        }
        else if(e.is_circle){
            if(e.cEvent_valid)
            THIS.remove_parabola(e);
        }
        else{
            THIS.insert_parabola(e.parabola);
        }
    }
    THIS.tree.set_ly(0);
    THIS.draw(true);
}

Voronoi.prototype.change_speed = function(val){
    this.speed += val;
}

Voronoi.prototype.get_edges = async function(){

    this.queue.build(this.sites, null);
    var THIS = this;
    if(!this.fast){
        this.process_event();
    }  
    else{
        this.process_event_fast();
    }
    
}

Voronoi.prototype.draw = function(is_last=false){

    console.log("Calling Voronoi draw");

    this.clip_edges();
    if(!is_last){
        this.get_beachlines().clip_beaches();
    }
    else {
        console.log('hello reaching the end');
        this.beachlines = [];
        this.get_polygons(this.segments);
    }

    console.log(this.beachlines);
    console.log(this.boundary);
    console.log(this.segments);
    console.log(this.polygons);
    console.log(this.edges);
    var THIS = this;
    THIS.redraw();
  
}

Voronoi.prototype.insert_parabola = function(parabola){

    if(this.tree.root === null){
        this.tree.root = parabola;
        return;
    }

    
    const vertical_arc = this.tree.lookup_vertical_arc(parabola.site);
    if(vertical_arc.circle_event){
        vertical_arc.circle_event.cEvent_valid = false;
        vertical_arc.circle_event = null;
    }

    const y_intersect = this.tree.get_y_arc_at_x(vertical_arc, parabola.site.x);
    vertical_arc.is_breakpoint = true;
    vertical_arc.left_site = parabola.site;
    vertical_arc.right_site = vertical_arc.site;
    const intersection = new Point(parabola.site.x, y_intersect);
    
    vertical_arc.edge = new Edge(intersection, parabola.site, vertical_arc.site);

    

    const p1 = new Parabola(vertical_arc.site, true);
    const p2 = new Parabola(vertical_arc.site, false);
    const left_edge = new Edge(intersection, vertical_arc.site, parabola.site);
    left_edge.neighbor = vertical_arc.edge;
    const left_breakpoint = new BreakPoint(vertical_arc.site, parabola.site, left_edge);


    left_edge.neighbor = vertical_arc.edge;
    /*
        Add the edge's start point to Cell
    */
    this.edges.push(left_edge);
    this.edges.push(vertical_arc.edge);

  
    vertical_arc.set_right(p2);
    vertical_arc.set_left(left_breakpoint);
    left_breakpoint.set_right(parabola);
    left_breakpoint.set_left(p1);
   
    this.check_circle(p1);
    this.check_circle(p2);

}

/*
This is a circle event
*/

Voronoi.prototype.remove_parabola = function(e){

    var parabola = e.parabola;
    const left_breakpoint = this.tree.get_left_breakpoint(parabola);
    const right_breakpoint = this.tree.get_right_breakpoint(parabola);
    const left_arc = this.tree.get_left_arc(left_breakpoint);
    const right_arc = this.tree.get_right_arc(right_breakpoint);

    if(left_arc === right_arc ){
        console.log('SAME ARC???');
    }
    if(left_arc.site.x == right_arc.site.x && left_arc.site.y == right_arc.site.y){
        console.log('Neighbor arcs are from the same parabola??');
    }
    if(left_arc.circle_event){
        left_arc.circle_event.cEvent_valid = false;
        left_arc.circle_event = null;
    }
    if(right_arc.circle_event){
        right_arc.circle_event.cEvent_valid = false;
        right_arc.circle_event = null;
    }

    const circle_center = new Point(e.point.x, this.tree.get_y_arc_at_x(parabola, e.point.x));

    /*
    Add the edge's end point to Cell
    */

    left_breakpoint.edge.end_point = circle_center;
    right_breakpoint.edge.end_point = circle_center;

    var higher_parent = parabola;
    var node = parabola;
    while(node){

        if(node === left_breakpoint)
            higher_parent = node;

        if(node === right_breakpoint)
            higher_parent = node;
        node = node.parent;
    }

    higher_parent.edge = new Edge(circle_center, left_arc.site, right_arc.site);
    console.log(higher_parent.edge);
    this.edges.push(higher_parent.edge);

    var parent = parabola.parent;
    const gparent = parent.parent;
    const sib = parabola.get_sibling();
    if(parent === gparent.left_child){
        gparent.set_left(sib);
    }
    else{
        gparent.set_right(sib);
    }
    parent = null;
    parabola = null;

    this.check_circle(left_arc);
    this.check_circle(right_arc);

}

Voronoi.prototype.get_distance = function(p1, p2){

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx*dx + dy * dy);
}

Voronoi.prototype.check_circle = function (parabola){

    const left_breakpoint = this.tree.get_left_breakpoint(parabola);
    const right_breakpoint = this.tree.get_right_breakpoint(parabola);
 
    const left_arc = this.tree.get_left_arc(left_breakpoint);
    const right_arc = this.tree.get_right_arc(right_breakpoint);

    if(!left_arc || !right_arc || left_arc === right_arc
        || left_arc.site.x === right_arc.site.x && left_arc.site.y === right_arc.site.y){
        return;
    }

    
    
    var center = this.tree.get_edge_intersection(left_breakpoint.edge, right_breakpoint.edge);
    if(center == null)
        return;
    
    left_breakpoint.edge.end_point =  right_breakpoint.edge.end_point = center;

    var radius = this.get_distance(parabola.site, center);
    
    /* change order */
    center.y -= radius;
    var circle_event = new Event(center, true, false, parabola);

    parabola.circle_event = circle_event;
    this.queue.push(circle_event);
}

/*
Use Belzier Curve to draw parabolic arcs constrained
by two break points

https://math.stackexchange.com/questions/1257576/convert-quadratic-bezier-curve-to-parabola

*/

Voronoi.prototype.get_beachlines = function (){

    console.log('voronoi get_beachlines');

    var leaves = [];
    var arcs = [];
    
    this.tree.get_leaves(this.tree.root, leaves);
    console.log(leaves.length);
    console.log(this.ly);
    leaves.forEach((leaf)=>console.log(leaf.site.x, leaf.site.y));
    const width = this.width;
    leaves.forEach((leaf)=>console.log(leaf.get_line(this.ly).a, leaf.get_line(this.ly).b, leaf.get_line(this.ly).c));
    
    for(var i = 0; i < leaves.length; ++i){
        const left_breakpoint = this.tree.get_left_breakpoint(leaves[i]);
        const right_breakpoint = this.tree.get_right_breakpoint(leaves[i]);
        var p1 = new Point(0.0,0.0), p3 = new Point(0.0,0.0), p2 = new Point(0.0,0.0);
        if(left_breakpoint == null){
            p1.x = 0;
            p1.y = this.tree.get_y_arc_at_x(leaves[i], 0);
        }
        else{
            p1 = this.tree.get_coord(left_breakpoint);
        }

        if(right_breakpoint == null){
            p3.x = width;
            p3.y = this.tree.get_y_arc_at_x(leaves[i], width);
        }
        else{
            p3 = this.tree.get_coord(right_breakpoint);
        }
        const {a,b,c} = leaves[i].get_line(this.ly);
        p2.x = (p1.x + p3.x ) / 2.0;
        p2.y = (p3.x - p1.x) / 2.0 * (2*a * p1.x + b) + p1.y;
        arcs.push({p1, p2, p3, a, b, c});
        console.log(p1, p2, p3, a,b,c,left_breakpoint, right_breakpoint);
    }
    this.beachlines = arcs;
    console.log(arcs);
    return this;
}

Voronoi.prototype.get_boundaries = function(){

    const ly = this.ly;
    const height = this.height;
    if(ly < this.boundary[3].y1){
    
        if(this.boundary.length < 5){
            this.boundary.push({y1: ly, x1: 0, x2: this.width, y2: ly, color:'green'});
        }
        else{
            this.boundary[4].y1 = this.boundary[4].y2 = ly;
        }
    }
    else if(this.boundary.length === 5){
        this.boundary.pop();
    }
    return this.boundary;
}

Voronoi.prototype.get_line_from_end_points = function(pt1, pt2){

    if(pt1.y == pt2.y){
        return {a: 0.0, b:1.0, c : -pt2.y};
    }
    else if(pt1.x == pt2.x){
        return {a:1.0, b:0.0, c: -pt2.x};
    }
    const a = -(pt2.y - p1.y) / (pt2.x - pt1.x);
    const b = 1.0;
    const c = -pt1.y - a * pt1.x;
    return {a,b,c};
}

Voronoi.prototype.get_beach_line_intersection = function(beach_pt, line){

    const {a:d, b:f, c:e} = line;
    const {a,b,c, p1, p3} = beach_pt;
    const height = this.height;
    const width = this.width;
    if(f === 0){
        //vertical line
        const x = -e/d;
        const y = a*x*x + b*x + c;
        return {x,y};
    }

    const A = a;
    const B = b+d/f;
    const C = c + e/f;
    if(B*B - 4*A*C < 0)
        return null;
    var x1 = (-B - Math.sqrt(B*B - 4*A*C)) / (2*A);
    var y1 = A*x1*x1 + B*x1 + C;
    var x2 = (-B + Math.sqrt(B*B - 4*A*C)) / (2*A);
    var y2 = A*x2*x2 + B*x2 + C;
    if(x1 < p1.x || x1 > p3.x || x1 < 0 || x1 > width || y1 < 0 || y1 > height){
        x1 = null;
    }
    if(x2 < p1.x || x2 > p3.x || x2 < 0 || x2 > width || y2 < 0 || y2 > height){
        x2 = null;
    }
    if(x1 && x2){
        if(x1 < x2){
            var temp = x2;
            x2 = x1;
            x1 = temp;
        }
        return {x1, x2, y1,y2};
    }
    if(x1)
        return {x:x1, y:y1};
    if(x2)
        return{x:x2, y:y2};

}

Voronoi.prototype.clip_beaches = function(){

    console.log("Calling Voronoi clip_beaches");


    var new_pts = [];
    for(var i = 0; i < this.beachlines.length; ++i){
        const beach_pt = this.beachlines[i];
        const {p1,p2,p3,a,b,c} = beach_pt;
        const intersection = this.get_beach_line_intersection(beach_pt, 
            this.get_line_from_end_points({x:0, y:this.height}, {x:this.width, y:this.height}));
        
        if(!intersection || !intersection.x1){
            new_pts.push({p1,p2,p3});
            console.log(p1,p2, p3);
        }
        else{
            var pp1 = p1;
            var pp3 = new Point(intersection.x1, intersection.y1);
            var x2 = (pp1.x + pp3.x ) / 2.0;
            var y2 = (pp3.x - pp1.x) / 2.0 * (2*a * pp1.x + b) + pp1.y;
            var pp2 = new Point(x2,y2);
            new_pts.push({p1:pp1, p2:pp2, p3:pp3});

            pp1 = new Point(intersection.x2, intersection.y2);
            pp3 = p3;
            x2 = (pp1.x + pp3.x ) / 2.0;
            y2 = (pp3.x - pp1.x) / 2.0 * (2*a * pp1.x + b) + pp1.y;
            pp2 = new Point(x2,y2);
            new_pts.push({p1:pp1, p2:pp2, p3:pp3});
            console.log(p1,p2, pp1, pp2, p3);
        }
       
    }
    return this.beachlines = new_pts;
   
}

Voronoi.prototype.is_point_in_rect = function(point){
    return !(point == null || point.x < 0 || point.y < 0 
    || point.x > this.width || point.y > this.height);
}

Voronoi.prototype.clip_point = function(edge){

    

    const { start_point, end_point, left_site, right_site, line, direction} = edge;

    var new_start, new_end;
    const height = this.height;
    const width = this.width;

    if(!this.is_point_in_rect(start_point) && !this.is_point_in_rect(end_point) ){
        return null;
    }

    new_start = start_point;
    if(start_point.x >= 0 && start_point.x <= width && start_point.y >= 0 && start_point.y <= height){
        new_start = start_point;
    }
    else{
        if(direction.y < 0 && direction.x > 0){
            var y = height;
            var x = (-line.b*y -line.c) /line.a;
            if(x < 0 || x > this.width){
                x = 0;
                y = (-line.a*x - line.c)/line.b;
            }
            new_start = new Point(x,y);
        }
        else if(direction.y < 0 && direction.x < 0){
            var y = height;
            var x = (-line.b*y -line.c) /line.a;
            if(x < 0 || x > this.width){
                x = width;
                y = (-line.a*x - line.c)/line.b;
            }
            new_start = new Point(x,y);
        }
        else if(direction.y > 0 && direction.x > 0 ){
            var y = 0;
            var x = (-line.b*y -line.c) /line.a;
            if(x < 0 || x > this.width){
                x = 0;
                y = (-line.a*x - line.c)/line.b;
            }
            new_start = new Point(x,y);
        }
        else{//y > 0, x < 0
            var y = 0;
            var x = (-line.b*y -line.c) /line.a;
            if(x < 0 || x > this.width){
                x = width;
                y = (-line.a*x - line.c)/line.b;
            }
            new_start = new Point(x,y);
        }
    }

    if(end_point && end_point.x >= 0 && end_point.x <= width && end_point.y >= 0 && end_point.y <= height){
        new_end = end_point;
    }
    else{
        if(direction.y < 0 && direction.x > 0){
            var y = 0;
            var x = (-line.b*y -line.c) /line.a;
            if(x < 0 || x > this.width){
                x = width;
                y = (-line.a*x - line.c)/line.b;
            }
            new_end = new Point(x,y);
        }
        else if(direction.y < 0 && direction.x < 0){
            var y = 0;
            var x = (-line.b*y -line.c) /line.a;
            if(x < 0 || x > this.width){
                x = 0;
                y = (-line.a*x - line.c)/line.b;
            }
            new_end = new Point(x,y);
        }
        else if(direction.y > 0 && direction.x > 0 ){
            var y = height;
            var x = (-line.b*y -line.c) /line.a;
            if(x < 0 || x > this.width){
                x = width;
                y = (-line.a*x - line.c)/line.b;
            }
            new_end = new Point(x,y);
        }
        else{//y > 0, x < 0
            var y = height;
            var x = (-line.b*y -line.c) /line.a;
            if(x < 0 || x > this.width){
                x = 0;
                y = (-line.a*x - line.c)/line.b;
            }
            new_end = new Point(x,y);
        }
    }

    if(this.get_distance(new_start, new_end) < this.EPS)
        return null;
    
    return {source:new_start, end:new_end, left_site, right_site};
}


Voronoi.prototype.clip_edges = function (){

    var segments = [];
    var e_idx_to_seg_idx = {};
    for(var i = 0; i < this.edges.length; ++i){

        const segment = this.clip_point(this.edges[i]);
        if(segment){
            e_idx_to_seg_idx[i] = segments.length;
            segments.push(segment);
        }
    }
    for(var i = 0; i < this.edges.length; ++i){

        const edge = this.edges[i];
        if(edge.neighbor && i in e_idx_to_seg_idx && i+1 in e_idx_to_seg_idx){
            segments[ e_idx_to_seg_idx[i] ].source = segments[ e_idx_to_seg_idx[i+1] ].end;
            segments[ e_idx_to_seg_idx[i+1] ] = null;
        }
    }
    this.segments = segments.filter((segment)=>segment);
    return this;
}

Voronoi.prototype.get_polygons = function(segments){

    this.sites.map((site)=>site.points=[]);
    segments.forEach(function (segment){
        segment.left_site.points.push(segment.source);
        segment.left_site.points.push(segment.end);
        segment.right_site.points.push(segment.source);
        segment.right_site.points.push(segment.end);
    } );
    
    var corners = [ new Point(0,0), new Point(this.width, 0), 
        new Point(0, this.height), new Point(this.width, this.height)];

    var top_left, top_right, bottom_left, bottom_right;

    for(var i = 0; i < this.sites.length; ++i){
        const site = this.sites[i];
        if(!top_left || this.get_distance(corners[0], site) < this.get_distance(corners[0], top_left) ){
            top_left = site;
        }
        if(!top_right || this.get_distance(corners[1], site) < this.get_distance(corners[1], top_right) ){
            top_right = site;
        }
        if(!bottom_left || this.get_distance(corners[2], site) < this.get_distance(corners[2], bottom_left) ){
            bottom_left = site;
        }
        if(!bottom_right || this.get_distance(corners[3], site) < this.get_distance(corners[3], bottom_right) ){
            bottom_right = site;
        }
    }

    top_left.points.push(new Point(0,0));
    top_right.points.push(new Point(this.width, 0));
    bottom_left.points.push(new Point(0, this.height));
    bottom_right.points.push(new Point(this.width, this.height));

    console.log('sites are', this.sites);
    
    this.polygons = this.sites.map((site) => site.remove_dup());
    const height = this.height;
    this.polygons = this.polygons.map((site)=>{
        return {points : site.points.map((pt)=>`${pt.x} ${pt.y}`),
        color : site.color}
    });
    return this.polygons;
}

export {Voronoi};