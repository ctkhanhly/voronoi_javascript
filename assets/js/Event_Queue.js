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
Max Binary Heap
*/

function Event_Queue() {

    this.events = [];
   
};


Event_Queue.prototype.build = function(sites, fake_events = null){
 
    var parabolas = sites.map(function(site){
        return new Parabola(site);
    });
   
    parabolas.forEach((parabola)=>{
        if(parabola.is_breakpoint){
            console.log('found breakpoint', parabola.site, parabola.left_site, parabola.right_site);
        }
    });

    this.events = parabolas.map(function(parabola) {
        return new Event(parabola.site, false, false, parabola);
    });

    if(fake_events){
        this.events = this.events.concat(fake_events);
    }
    this.events.forEach((e)=>{
        if(!e)
        console.log('event is undefine');
    })
   
    //Heapify 
    for(var i = Math.floor(this.events.length/2); i >= 0; --i){
        this.fix_down(i);
    }

}

Event_Queue.prototype.push = function (event){//should be circle event

    this.events.push(event);
    this.fix_up(this.events.length-1);
};

Event_Queue.prototype.swap = function(index1, index2){

    const event2 = this.events[index2];
    this.events[index2] = this.events[index1];
    this.events[index1] = event2;
}

Event_Queue.prototype.fix_up = function (index){

    const size = this.events.length;
    while(index > 0){
        const parent = Math.floor((index-1)/2);
        const left_child = parent*2 + 1;
        const right_child = parent*2 + 2;
        var swap_index = left_child;
        
        if( right_child < size && this.compare(this.events[right_child],  this.events[swap_index]) ){
            swap_index = right_child;
        }

        if( swap_index < size && this.compare(this.events[swap_index],  this.events[parent]) ){
            this.swap(swap_index, parent);
        }

        index = parent;
    }
}

Event_Queue.prototype.compare = function(event1, event2){

    return Math.abs(event1.point.y - event2.point.y) < 1e-8 ? event1.point.x < event2.point.x 
        : event1.point.y > event2.point.y;
}

Event_Queue.prototype.fix_down = function (index){

    const size = this.events.length;
    while(index < size){

        const left_child = index * 2 + 1;
        const right_child = index * 2 + 2;

        var fix_subtree = left_child;
        if( right_child < size && this.compare(this.events[right_child],  this.events[fix_subtree]) ){
            
            fix_subtree = right_child;
        }
        if( fix_subtree < size && this.compare(this.events[fix_subtree],  this.events[index]) ){
            
            this.swap(fix_subtree, index);
        }
            
        index = fix_subtree;

    }
}

Event_Queue.prototype.is_empty = function(){

    return this.events.length == 0;
}

Event_Queue.prototype.size = function(){
    return this.events.length;
}

Event_Queue.prototype.top = function(){

    return this.events[0];
}

Event_Queue.prototype.pop = function (){

    this.swap(this.events.length-1, 0);
    this.events.pop();//Remove last element
    this.fix_down(0);
}

export { Event, Event_Queue};