/*
Internal nodes are the break points defined by two parabolic arcs
Leaf nodes are the parabolic arcs defined by a site at (site_x,site_y)
    that defines points (x,y) closer to the site than the sweep line ly:
        (x - site_x)^2 + (y-site_y)^2 = (y-ly)^2
    which solves to:
        x^2 - 2 * site_x * x + site_x^2 - 2y(site_y - ly) + site_y^2 - ly^2 = 0

        2y(site_y - ly) = x^2 - 2 * site_x * x + site_x^2 + site_y^2 - ly^2

        y = x^2/[ 2(site_y - ly) ] - [ 2 * site_x / [ 2(site_y - ly)] ] x
            + site_x^2 + (site_y - ly) (site_y + ly) / [ 2(site_y - ly)]

        y = x^2/[ 2(site_y - ly) ] - [ 2 * site_x / [ 2(site_y - ly)] ] x
            + site_x^2 + (site_y + ly) / 2 

Implement a Balanced Tree using Red Black Tree
Keys are X coordinate of breakpoints
    or   X coordinate of left breakpoint of the arc

Breakpoints are internal nodes
Parabola at the leaves

*/
import {Edge, Line, Point} from './Edge.js';



function Parabola(site, is_left_half = true){

    this.RED = "RED";
    this.BLACK = "BLACK";

    this.is_breakpoint = false;
    this.site = site;
    this.is_left_half = is_left_half;
    this.ly = 0;
    
    this.edge = null;
    this.left_site = null;
    this.right_site = null;// only has site 2 if it's a break point
     
    this.left_child = null;
    this.right_child = null;

    this.color = this.RED;
    this.parent = null;
    this.circle_event = null;

}

function BreakPoint(left_site, right_site = null, edge = null){

    Parabola.call(this, null);
   

    this.is_breakpoint = true;
    this.left_site = left_site;
    this.right_site = right_site;// only has site 2 if it's a break point
    this.edge = edge;// only has an edge is this is a break point

}

BreakPoint.prototype = Object.create(Parabola.prototype);

Parabola.prototype.get_line = function(ly){

    const denom = 2*(this.site.y - ly);
    const a = 1.0/denom;
    const b = - 2*this.site.x / denom;
    const c = this.site.x * this.site.x / denom + ly / 2.0 + this.site.y / 2.0;
    return {a,b,c};
}

Parabola.prototype.set_left = function(left){

    this.left_child = left;
    left.parent = this;
}

Parabola.prototype.set_right = function(right){

    this.right_child = right;
    right.parent = this;
}

Parabola.prototype.get_sibling = function(){
    if(this.parent === null)
        return null;
    if(this === this.parent.left_child)
        return this.parent.right_child;
    return this.parent.left_child;
}

function Parabola_Tree(){

    this.root = null;
    this.EPS = 1e-6;
    this.ly = 0;
}

Parabola_Tree.prototype.set_ly = function(ly){

    this.ly = ly;
}


/*
 Two edges are represented using a line equation with 
    a boundary of start_point and end_point

    a1x + b1y + c1 = 0
    a2x + b2y + c2 = 0

    If b1 = b2 = 1 or b1 = b2 = 0
    x = (c1-c2)/ (a2 - a1)

*/

Parabola_Tree.prototype.get_edge_intersection = function(left_edge, right_edge){


    if(left_edge === right_edge){
        console.log('same edge');
        return null;
    }
    const {a:a1, b:b1, c:c1} = left_edge.line;
    const {a:a2, b:b2, c:c2} = right_edge.line;

    if(a1 === a2){
        return null;
    }

    const x = (c1-c2)/ (a2 - a1);
    var y;
    if(b2 === 0){
        y = -a1*x - c1;
    } 
    else{
        y = -a2*x - c2;
    }

    /*
    Check for degerate case where intersection is not on the vector
    start with start_point
    */

    if((x - left_edge.start_point.x) * left_edge.direction.x < 0)
    {
        return null;
    }

    if((y - left_edge.start_point.y) * left_edge.direction.y < 0)
    {
        return null;
    }

    if((x - right_edge.start_point.x) * right_edge.direction.x < 0)
    {
        return null;
    }

    if((y - right_edge.start_point.y) * right_edge.direction.y < 0)
    {
        return null;
    }

    return new Point(x,y);
}

/*

Breakpoint is defined by the intersection of 2 arcs:
 a1 * x^2 + b1 * x + c1 = y;
 a2 * x^2 + b2 * x + c2 = y;
 (a1-a2) * x^2 + (b1 - b2) * x  + (c1-c2)= 0;

 Apply quadratic formula:
 A = a1-a2
 B = b1-b2
 C = c1-c2
 x = ( -B +/- sqrt(B^2 - 4AC) ) / 2A;

*/

Parabola_Tree.prototype.get_coord = function(breakpoint){

    if(!breakpoint.is_breakpoint){
        return breakpoint.site.x;
    }

    var left_arc = this.get_left_arc(breakpoint);
    var right_arc = this.get_right_arc(breakpoint);
   
    if(!left_arc || !right_arc){
        console.log('not a breakpoint get_coord');
        return;
    }

    /* left arc parabolic equation */
    const {a : a1, b: b1, c: c1} = left_arc.get_line(this.ly);
    const {a : a2, b: b2, c: c2} = right_arc.get_line(this.ly);

    const a = a1 - a2;
    const b = b1 - b2;
    const c = c1 - c2;

    const x1 = (-b - Math.sqrt(b*b - 4*a*c) ) / (2*a);
    const x2 = (-b + Math.sqrt(b*b - 4*a*c) ) / (2*a);

    var x;
    /*
    Subject to y order
    */

    if(left_arc.site.y > right_arc.site.y){// Really the left arc after right arc cut original left arc
        x = Math.min(x1, x2);
    }
    else {

        x =  Math.max(x1, x2);
    }
    const y = a1*x*x + b1*x + c1;
    return new Point(x,y);
}


/*
Key is found
Precessor of breakpoint
*/

Parabola_Tree.prototype.get_left_arc = function(breakpoint){
    
    if(breakpoint === null){
        return null;
    } 

    var node = breakpoint.left_child;
    if(node === null){
    }
    while(node && node.is_breakpoint){
        node = node.right_child;
    }
    return node;

}

/*
Key is found
Successor of breakpoint
*/

Parabola_Tree.prototype.get_right_arc = function(breakpoint){

    if(breakpoint === null){
        return null;
    }
        
    
    var node = breakpoint.right_child;
    if(node === null){
       
    }
    while(node && node.is_breakpoint){
        node = node.left_child;
    }

    return node;
}

/*

Case key not found

Predecessor of the parabola
Parabola is the leaf that represents a disappearing arc
Advantage: We don't have a key for the parabola so
    this function works to find internal node (break point)
*/

Parabola_Tree.prototype.get_left_breakpoint = function(parabola){

    // console.log("Calling get_left_breakpoint");

    if(parabola === null){
        // console.log('parabola is null');
        return null;
    }

    var par = parabola.parent;
    var node = parabola;
    while(par && par.left_child == node){
        
        node = node.parent;
        par = par.parent;
    }

    return par;

}

/*

Case key not found

Successor of the parabola
Parabola is the leaf that represents a disappearing arc

*/

Parabola_Tree.prototype.get_right_breakpoint = function(parabola){

    // console.log("Calling get_right_breakpoint");

    if(parabola === null){
        // console.log('parabola is null');
        return null;
    }

    var par = parabola.parent;
    var node = parabola;
    while(par && par.right_child == node){
        node = node.parent;
        par = par.parent;
    }
    return par;

}

/*
Assume node exists, handle in insertion
*/

Parabola_Tree.prototype.lookup_vertical_arc = function(site){

    // console.log("Calling lookup_vertical_arc");

    var node = this.root;
    while(node.is_breakpoint){
        const x = this.get_coord(node).x;
        if(site.x < x){
            node = node.left_child;
        }
        else{
            node = node.right_child;
        }
    }
    return node;
}

/*
Intersection of vertical line from site 
    to the vertical parabolic arc
*/

Parabola_Tree.prototype.get_y_arc_at_x = function(arc, x){

    const {a,b,c} = arc.get_line(this.ly);
    return a * x * x + b*x + c;
}


Parabola_Tree.prototype.get_leaves = function(node, leaves){

    if(node == null)
        return;
    if(!node.is_breakpoint){
        leaves.push(node);
        return;
    }
    this.get_leaves(node.left_child, leaves);
    this.get_leaves(node.right_child, leaves);
}

Parabola_Tree.prototype.print_tree = function(node){

    if(node == null)
        return;
    var queue = [node];
    while(queue.length){
        var line = [];
        var nqu = [];
        queue.forEach((mem)=>{
            if(mem.is_breakpoint){
                line.push(`(${mem.is_breakpoint}, ${mem.left_site.x}, ${mem.left_site.y}, ${mem.right_site.x}, ${mem.right_site.y})`);
            }
            else{
                line.push(`(${mem.is_breakpoint}, ${mem.site.x}, ${mem.site.y})`);
            }
            if(mem.left_child){
                nqu.push(mem.left_child);
            }

            if(mem.right_child){
                nqu.push(mem.right_child);
            }
        });
        queue = nqu;
        console.log(line.join(' '));
    }
    
    
}

Parabola_Tree.prototype.print_node = function (node){
    if(node === null){
        console.log(node);
    }
    else if(node.is_breakpoint){
        console.log( node.left_site.x, node.left_site.y, node.right_site.x, node.right_site.y);
    }
    else{
        console.log( node.site.x, node.site.y);
    }
}
export {BreakPoint, Parabola, Parabola_Tree};


