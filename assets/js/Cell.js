function Cell(x = 0.0, y = 0.0){
    const pastels = [[224, 187, 228], [255, 223, 211], [149, 125, 173], [254, 200, 216], [210, 145, 188],
                    [164, 195, 210], [191, 212, 219], [174, 203, 214], [210, 233, 218], [175, 218, 193]];
    this.points = [];
    const color = Math.floor(Math.random() * pastels.length);
    const a = Math.random();
    this.color = `rgba(${pastels[color][0]}, ${pastels[color][1]}, ${pastels[color][2]}, ${1})`;
    this.x = x;
    this.y = y;
    this.EPS = 1e-2;
}

Cell.prototype.get_distance = function(pt1, pt2){
    return Math.sqrt((pt1.x - pt2.x) * (pt1.x - pt2.x) + (pt1.y - pt2.y) * (pt1.y - pt2.y));
}


Cell.prototype.ccw = function(pt1, pt2, pt3){
    const dx1 = pt2.x - pt1.x;
    const dy1 = pt2.y - pt1.y;
    const dx2 = pt3.x - pt1.x;
    const dy2 = pt3.y - pt1.y;
    return dx1 * dy2 - dy1 * dx2  > 0;
}

Cell.prototype.collinear = function(pt1, pt2, pt3){
    const dx1 = pt2.x - pt1.x;
    const dy1 = pt2.y - pt1.y;
    const dx2 = pt3.x - pt1.x;
    const dy2 = pt3.y - pt1.y;
    return Math.abs(dx1 * dy2 - dy1 * dx2) < 1e-6;
}

Cell.prototype.convex_hull = function(){
    this.sort_points(true);
    var new_pts = [];
    for(var i = 0; i < this.points.length; ++i){
        while(new_pts.length >= 2 && !this.ccw(new_pts[new_pts.length-2], new_pts[ new_pts.length-1], this.points[i]))
            new_pts.pop();
        new_pts.push(this.points[i]);
    }
    this.points[i] = new_pts;
}

Cell.prototype.remove_dup = function(){
    var new_pts = [];
    this.sort_points();

    for(var i = 0; i < this.points.length; ++i){
        if(!this.points[i])
            continue;
        if(new_pts.length == 0 || this.get_distance(this.points[i], new_pts[new_pts.length - 1]) > this.EPS){
            new_pts.push(this.points[i]);
        }
    }
    

    this.points = new_pts;
    this.convex_hull();
    return this;
}

Cell.prototype.sort_points = function(convex_sort = false){
    
    var p = null;
    for(var i = 0; i < this.points.length; ++i){
        if(!this.points[i])
            continue;
        if(p == null || this.points[i].y < p.y || this.points[i].y === p.y && this.points[i].x > p.x){
            p = this.points[i];
        }
    }  
    const this_cell = this;
    this.points.sort(function(a, b){
        if(convex_sort && this_cell.collinear(p, a, b)){
            return this_cell.get_distance(p, a) < this_cell.get_distance(p,b);
        }
        return Math.atan2(a.y-p.y, a.x-p.x) - Math.atan2(b.y-p.y, b.x-p.x);
    });
    return this;
}

export {Cell};