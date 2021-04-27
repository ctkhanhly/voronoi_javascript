function Point(x, y){
    this.x = x;
    this.y = y;
};

/*

Given left and right site, compute the line equation for the bisector
    ax + by + c = 0
    y = -a/b x - c/b

    Generally make a = -a/b, c = -c/b except for vertical line
        then b = 0, a = 1 and c = -the line!
    a = 0 for horizontal line

*/

function Line(start_point, left_site, right_site){

    if(Math.abs(right_site.y - left_site.y) < 1e-8){
        this.c = -(right_site.x + left_site.x) / 2.0;
        this.b = 0;
        this.a = 1;
        return;
    }

    /*
        Bisector is perpendicular to line between left_site and right_site

    */

    const bisector_slope = -(right_site.x - left_site.x) / ( right_site.y  - left_site.y ); 
    this.a = -bisector_slope;
    this.b = 1.0;
    // const x = (right_site.x + left_site.x) / 2.0;
    // const y = (right_site.y + left_site.y) / 2.0;
    this.c = -start_point.y - this.a * start_point.x;

}

function Edge(start_point, left_site, right_site) {

    // console.log('In edge', start_point, left_site, right_site);

    this.start_point = start_point;
    this.end_point = null;
    this.left_site = left_site;
    this.right_site = right_site;
    this.line = new Line(start_point, left_site, right_site);
    this.neighbor = null;
    this.direction = new Point(right_site.y - left_site.y ,  -(right_site.x-left_site.x) );

};

export {Edge, Line, Point};