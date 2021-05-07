
import {Voronoi} from './Voronoi.js';

function isFunction(functionToCheck) {
return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}
console.log(isFunction(Voronoi), Voronoi, {}.toString.call(Voronoi));

(function(){
    var svg = d3.select("svg.fast"),
    width = +svg.attr("width"),
    height = +svg.attr("height");
    var site_radius = 2.5;
    // svg.attr("width",'100%')
    // svg.attr("height", '100%')

    const x_offset = 0, y_offset = 0;
    var sites = d3.range(50)
        .map(function(d) { return {x:Math.random() * width + x_offset, y:Math.random() * height + y_offset} ; });


    var voronoi = new Voronoi(width, height, redraw, svg, true);

    var polygon = svg.append("g")
        .attr('id', 'polygon')
        .selectAll("path")
        .data(voronoi.polygons)
        .enter().append("path")
        .call(redraw_polygon);

    var segment = svg.append("g")
        .attr('id', 'segment')
        .attr("class", "links")
        .selectAll("line")
        .data(voronoi.segments)
        .enter().append("line")
        .call(redraw_segment);

    var beachline = svg.append("g")
        .attr('id', 'beachline')
        .selectAll("path")
        .data(voronoi.beachlines)
        .enter().append("path")
        .call(redraw_beachline);

    var site = svg.append("g")
        .attr('id', 'site')
        .selectAll("circle")
        .data(voronoi.sites)
        .enter().append("circle")
        .attr("r", site_radius)
        .call(redraw_site);

    var boundary = svg.append("g")
        .attr('id', 'boundary')
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

    function redraw_site(site) {
        
        site
            .attr("cx", function(point) { 
                return point.x; 
            })
            .attr("cy", function(point) { return point.y; })
            .attr('fill', 'black');
    }


    function redraw_polygon(polygon) {
        console.log('redrawing the polygon', voronoi.polygons.length);
        polygon
            .attr("d", function(cell) { 
              
                return  "M" + cell.points.join("L") + "Z"; 
            })
            .attr("fill", function(cell) { return  cell.color; })
            .attr('stroke', 'tranparent');
    }

    function redraw_beachline(beachline){
        
        beachline.attr('d', function(arc){ 
            
            return `M ${arc.p1.x} ${arc.p1.y} Q ${arc.p2.x} ${arc.p2.y}, ${arc.p3.x} ${arc.p3.y}`;
        })
        .attr('stroke', 'blue')
        .attr('fill', 'transparent')
        .attr('stroke-width', 5);
    }

    function redraw() {
    
        polygon = polygon.data(voronoi.polygons), 
        polygon.exit().remove();
        var polygon_enter = polygon.enter().append('path');
        polygon = polygon.merge(polygon_enter).call(redraw_polygon);
        

        segment = segment.data(voronoi.segments), 
        segment.exit().remove();
        var segment_enter = segment.enter().append('line');
        segment = segment.merge(segment_enter).call(redraw_segment);
    
        beachline = beachline.data(voronoi.beachlines); 
        beachline.exit().remove();
        var beachline_enter = beachline.enter().append("path");
        beachline = beachline.merge(beachline_enter).call(redraw_beachline);
        
        site = site.data(voronoi.sites).attr('r',site_radius);
        site.exit().remove();
        var site_enter = site.enter().append("circle").attr("r", site_radius);
        site = site.merge(site_enter).call(redraw_site);
        
        
    }


    svg.on('click', function(e){
        voronoi.add_site({x: d3.pointer(e)[0], y : d3.pointer(e)[1] });
        redraw();
        console.log(`${d3.pointer(e)} ${d3.pointer(e)[0]} ${d3.pointer(e)[1]}`);
    });


    var add_ran_button = document.getElementById('add-ran-btn-fast');
    var start_button = document.getElementById('start-btn-fast');
    var clear_button = document.getElementById('clear-btn-fast');
    var increase_site_button = document.getElementById('increase-btn-fast');
    var decrease_site_button = document.getElementById('decrease-btn-fast');

    start_button.addEventListener('click', (e)=>{
    
        voronoi.start();
    });

    clear_button.addEventListener('click', (e)=>{
        voronoi.reset();
        redraw();
    });

    function change_site_radius(val){
        site_radius+=val;
        redraw();
    }

    function add_random_sites(){
        var sites = d3.range(10)
        .map(function(d) { return {x:Math.random() * width + x_offset, y:Math.random() * height + y_offset} ; });
        sites.forEach((site)=>voronoi.add_site(site));
        redraw();
    }

    window.addEventListener('keyup', (e)=>{
        console.log(e.key, e.code, e.shiftKey);
        if(e.shiftKey){
            if(e.key == "Up" || e.key == "ArrowUp")
            change_site_radius(0.5);
            else if(e.key == "Down" || e.key == "ArrowDown")
            change_site_radius(-0.5);
            else if(e.code == "Enter"){
                voronoi.start();
            }
            else if(e.code == "KeyD"){
                voronoi.reset();
                redraw();
            }
            else if(e.code == "KeyR"){
                add_random_sites();
            }
        }
        

    }, true);


    increase_site_button.addEventListener('click', (e)=>{
        change_site_radius(0.5);
    });

    decrease_site_button.addEventListener('click', (e)=>{
        change_site_radius(-0.5);
    });


    add_ran_button.addEventListener('click', (e)=>{
        add_random_sites();
    });

})();
