
//https://stackoverflow.com/questions/13204562/proper-format-for-drawing-polygon-data-in-d3

var count = 0; 
function Cell(x = 0.0, y = 0.0){
    // const pastels = [[224, 187, 228], [255, 223, 211], [149, 125, 173], [254, 200, 216], [210, 145, 188],
    //                 [164, 195, 210], [191, 212, 219], [174, 203, 214], [210, 233, 218], [175, 218, 193]];
    const pastels = [[184, 225, 237], [246, 226, 223], [176, 199, 237], [184, 225, 237]];
    this.points = [];
    // const r = Math.floor(Math.random()*256);
    // const g = Math.floor(Math.random()*256);
    // const b = Math.floor(Math.random()*256);
    const color = Math.floor(Math.random() * pastels.length);
    const a = Math.random();
    this.color = `rgba(${pastels[count][0]}, ${pastels[count][1]}, ${pastels[count][2]}, ${1})`;
    this.x = x;
    this.y = y;
    this.EPS = 1e-2;
    ++count;
}

Cell.prototype.get_distance = function(pt1, pt2){
    return Math.sqrt((pt1.x - pt2.x) * (pt1.x - pt2.x) + (pt1.y - pt2.y) * (pt1.y - pt2.y));
}

Cell.prototype.remove_dup = function(){
    var new_pts = [];
    this.points.sort(function(a,b){
        return a.x == b.x ? a.y < b.y : a.x < b.x;
    });

    for(var i = 0; i < this.points.length; ++i){
        if(new_pts.length == 0 || this.get_distance(this.points[i], new_pts[new_pts.length - 1]) > this.EPS){
            new_pts.push(this.points[i]);
        }
    }
    this.points = new_pts;
    return this;
}

Cell.prototype.sort_points = function(){

    var p = null;
    for(var i = 0; i < this.points.length; ++i){
        if(p == null || this.points[i].x > p.x || this.points[i].x === p.x && this.points[i].y < p.y){
            p = this.points[i];
        }
    }  
    
    this.points.sort(function(a, b){
        return Math.atan2(a.y-p.y, a.x-p.x) < Math.atan2(b.y-p.y, b.x-p.x);
    });
    return this;
}

export {Cell};