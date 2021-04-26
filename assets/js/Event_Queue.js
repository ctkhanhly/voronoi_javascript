import {Edge, Point} from './Edge.js';
import {Parabola} from './Parabola_Tree.js';

function Event(point, is_circle, fake = false, parabola = null) {

    this.is_circle = is_circle;
    this.parabola = parabola;//contains a site here
    this.cEvent_valid = is_circle;
    this.point = point;
    this.fake = fake;
};

/*
Min Binary Heap
*/
function Event_Queue(sites, fake_events = null) {

    // console.log("Calling Event_Queue");

    this.events = [];
    var parabolas = sites.map(function(site){
        // console.log(site);
        return new Parabola(site);
    });
    console.log('checking if any parabola is breakpoint');
    parabolas.forEach((parabola)=>{
        if(parabola.is_breakpoint){
            console.log('found', parabola.site, parabola.left_site, parabola.right_site);
        }
    });
    // console.log(fake_events);
    this.build(parabolas, fake_events);
};


Event_Queue.prototype.build = function(parabolas, fake_events = null){

    // console.log("Calling build");

    this.events = parabolas.map(function(parabola) {
        return new Event(parabola.site, false, false, parabola);
    });
    if(fake_events){
        this.events = this.events.concat(fake_events);
    }
    // for(var i = this.events.length-1; i >= 0; --i){
    //     // console.log(i, this.events[i]);
    //     if(!this.events[i]){
    //         console.log(i, this.events[i]);
    //     }
    // }
    // console.log(this.events.length);
    //Heapify 
    for(var i = this.events.length/2; i >= 0; --i){
        // console.log(i, this.events[i]);
        this.fix_down(i);
    }

    // this.events.forEach((e)=>{
    //     console.log(e.parabola.site.x, e.parabola.site.y, e.parabola.is_breakpoint);
    // })
}

Event_Queue.prototype.push = function (event){//should be circle event

    // console.log("Calling Event_Queue push");

    this.events.push(event);
    this.fix_up(this.events.length-1);
};

Event_Queue.prototype.swap = function(index1, index2){

    // console.log("Calling Event_Queue swap");


    const event2 = this.events[index2];
    this.events[index2] = this.events[index1];
    this.events[index1] = event2;
}

Event_Queue.prototype.fix_up = function (index){

    // console.log("Calling Event_Queue fix_up");


    while(index){
        const parent = (index-1)/2;
        const left_child = parent*2 + 1;
        const right_child = parent*2 + 2;
        var swap_index = left_child;
        
        if( this.compare(this.events[right_child],  this.events[swap_index]) ){
            // this.swap(this.events[right_child], this.events[parent]);
            swap_index = right_child;
        }

        if( this.compare(this.events[swap_index],  this.events[parent]) ){
            this.swap(swap_index, parent);
        }

        index = parent;
    }
}

Event_Queue.prototype.compare = function(event1, event2){

    // console.log("Calling Event_Queue compare");

    // console.log(event1, event2);
    return event1.point.y === event2.point.y ? event1.point.x < event2.point.x 
        : event1.point.y < event2.point.y;
}

Event_Queue.prototype.fix_down = function (index){

    // console.log("Calling Event_Queue fix_down");


    const size = this.events.length;
    while(index < size){

        const left_child = index * 2 + 1;
        const right_child = index * 2 + 2;

        var fix_subtree = left_child;
        // if( this.compare(this.events[left_child],  this.events[fix_subtree]) ){
        //     // this.swap(this.events[left_child], this.events[parent]);
        //     fix_subtree = left_child;
        // }
        if( right_child < size && this.compare(this.events[right_child],  this.events[fix_subtree]) ){
            fix_subtree = right_child;
        }
        // console.log(fix_subtree, index);
        if( fix_subtree < size && this.compare(this.events[fix_subtree],  this.events[index]) ){
            this.swap(fix_subtree, index);
        }
            
        index = fix_subtree;

    }
}

Event_Queue.prototype.is_empty = function(){

    // console.log("Calling Event_Queue is_empty");

    return this.events.length == 0;
}

Event_Queue.prototype.top = function(){

    // console.log("Calling Event_Queue top");

    return this.events[0];
}

Event_Queue.prototype.pop = function (){

    // console.log("Calling Event_Queue pop");

    this.swap(this.events.length-1, 0);
    this.events.pop();//Remove last element
    this.fix_down(0);
}

export { Event, Event_Queue};