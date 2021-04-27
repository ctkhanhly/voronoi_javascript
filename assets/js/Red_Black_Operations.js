import {Parabola_Tree} from "./Parabola_Tree.js";


Parabola_Tree.prototype.rebalance_insertion = function(parabola){

    console.log("Calling rebalance_insertion");

    if(parabola.parent.color == this.BLACK){
        return;
    }
    var uncle;
    var parent = parabola.parent;
    var gparent = parent.parent;
    var node = parabola;
    while(node.color === this.RED && node.parent.color === this.RED){
        
        parent = node.parent;
        gparent = parent.parent;

        if(parent === gparent.left_child){
            uncle = gparent.right_child;
        }
        else{
            uncle = gparent.left_child;
        }

        if(uncle.color == this.RED){
            uncle.color = this.BLACK;
            parent.color = this.BLACK;
            gparent.color = this.RED;
            node = gparent;
            continue;
        }
        
        if(parent === gparent.left_child && parabola === parent.left_child){
            //Left Left case
            this.right_rotate(gparent);
            this.swap_color(gparent, parent);
            node = parent;
        }
        else if(parent === gparent.left_child && parabola == parent.right_child){
            //Left Right case
            this.left_rotate(parent);
            this.right_rotate(gparent);
            this.swap_color(gparent, parent);
            
        }
        else if(parent == gparent.right_child && parabola === parent.right_child){
            //Right Right case
            this.left_rotate(gparent);
            this.swap_color(gparent, parent);
            node = parent;
        }
        else{
            //Right Left case
            this.right_rotate(parent);
            this.left_rotate(gparent);
            this.swap_color(gparent, parent);
        }

    }
}

//https://www.geeksforgeeks.org/c-program-red-black-tree-insertion/

Parabola_Tree.prototype.right_rotate = function (gparent){

    console.log("Calling right_rotate");

    let ggparent = gparent.parent;
    let parent = gparent.left_child;
    let T3 = parent.right_child;

    //fix parent
    parent.parent = ggparent;
    if(ggparent){
        if(gparent === ggparent.left_child){
            ggparent.left_child = parent;
        }
        else{
            ggparent.right_child = parent;
        }
    }
    else{
        this.root = parent;
    }
    
    //fix gparent
    parent.right_child = gparent;
    gparent.parent = parent;
    gparent.left_child = T3;
    if(T3)
        T3.parent = gparent;

    //swap color
    // let gcolor = gparent.color;
    // let pcolor = parent.color;
    // parent.color = gcolor;
    // gparent.color = pcolor;

    // this.swap_color(gparent, parent);
    
}

Parabola_Tree.prototype.swap_color = function(node1, node2){

    console.log("Calling swap_color");

    //swap color
    let color1 = node1.color;
    let color2 = node2.color;
    node1.color = color2;
    node2.color = color1;
}

Parabola_Tree.prototype.left_rotate = function(gparent){

    console.log("Calling left_rotate");

    let ggparent = gparent.parent;
    let parent = gparent.right_child;
    let T3 = parent.left_child;

    //fix parent
    if(ggparent){
        if(gparent === ggparent.left_child){
            ggparent.left_child = parent;
        }
        else{
            ggparent.right_child = parent;
        }
    }
    else{
        this.root = parent;
    }

    //fix gparent
    parent.left_child = gparent;
    gparent.parent = parent;
    gparent.right_child = T3;
    if(T3)
        T3.parent = gparent;

    // this.swap_color(gparent, parent);
}

Parabola_Tree.prototype.rebalance_deletion = function(parabola){

    console.log("Calling rebalance_deletion");


    var node = parabola;
    if(node === this.root){
        this.root = null;
        return;
    }
    if(node.right_child || node.left_child){
        console.log("Parabola is not leaf!!!");
    }

    if(node.color === this.BLACK){
        this.fix_double_black(node);
    }
    else{
        if(node.get_sibling(node)){
            node.get_sibling(node).color = this.RED;
        }
    }
    if(node === node.parent.left_child){
        node.parent.left_child = null;
    }
    else{
        node.parent.right_child = null;
    }
    node.parent = null;
}

Parabola_Tree.prototype.get_sibling = function(node){
    if(node.parent === null)
        return null;
    if(node === node.parent.left_child)
        return node.parent.right_child;
    return node.parent.left_child;
}

Parabola_Tree.prototype.has_red_child = function(node){
    if(node.left_child && node.left_child.color === this.RED)
        return true;
    if(node.right_child && node.right_child.color === this.RED)
        return true;
}
//https://www.geeksforgeeks.org/red-black-tree-set-3-delete-2/

Parabola_Tree.prototype.fix_double_black = function(node){

    console.log("Calling fix_double_black");

    while(node != root){
        var parent = node.parent, sibling = this.get_sibling(node);
        if(sibling === null){
            node = parent;
        }
        else{
            if(sibling.color === this.RED){
                parent.color = this.RED;
                sibling.color = this.BLACK;

                if(sibling == parent.left_child){
                    this.right_rotate(parent);
                }
                else{
                    this.left_rotate(parent);
                }
            }
            else{
                if(this.has_red_child(sibling)){
                    if(sibling.left_child && sibling.left_child.color === this.RED){
                        if(sibling === parent.left_child){
                            sibling.left_child.color = sibling.color;
                            sibling.color = parent.color;
                            this.right_rotate(parent);
                        }
                        else{
                            sibling.left_child.color = parent.color;
                            this.right_rotate(sibling);
                            this.left_rotate(parent);
                        }
                    }
                    else{
                        if(sibling === parent.left_child){
                            sibling.right_child.color = parent.color;
                            this.left_rotate(sibling);
                            this.right_rotate(parent);
                        }
                        else{
                            sibling.right_child.color = sibling.color;
                            sibling.color = parent.color;
                            this.left_rotate(parent);
                        }
                    }
                    parent.color = this.BLACK;
                    return;
                }
                else{
                    sibling.color = this.RED;
                    if (parent.color === this.BLACK)
					    node = parent;
				    else{
                        parent.color = this.BLACK;
                        return;
                    }
                }
            }
        }
    }
}

/*
When inserting a new parabola, two same break point coordinate, check 
    for site order to determine order of the two break points

*/

Parabola_Tree.prototype.insert = function(parabola, intersection){

    console.log("Calling insert");
    
    if(this.root == null){
        
        this.root = parabola;
        this.root.color = this.BLACK;
        // console.log('insert', this.root, parabola);
        return;
    }

    /*
        Change vertical arc into a breakpoint

    */
    
    var node = this.root;
    var par = node;
    while(node && node.is_breakpoint){
        par = node;
        if(this.is_left_child(node, parabola, intersection)){
            node = node.left_child;
        }
        else{
            node = node.right_child;
        }
        
    }

    if(this.is_left_child(par, parabola, intersection)){
        par.left_child = parabola;
        
    }
    else{
        par.right_child = parabola;
    }

    parabola.parent = par;
    // this.rebalance_insertion(parabola);
}


Parabola_Tree.prototype.remove = function(parabola){

    console.log("Calling remove");

    // const parent = parabola.parent;
    // var sib;

    // if(parabola.left_child === null && parabola.right_child === null){
    //     if(parent.left_child === parabola){
    //         parent.left_child = null;
    //         sib = parent.right_child;
    //     }
    //     else{
    //         parent.right_child = null;
    //         sib = parent.left_child;
    //     }
    // }
    // else {
    //     console.log("Parabola is not the leave!!!!!!");
    // }

    // else if(parabola.left_child === null){
    //     if(parent.left_child === parabola){
    //         parent.left_child = parabola.right_child;
    //     }
    //     else{
    //         parent.right_child = parabola.right_child;
    //     }
    //     parabola.right_child.parent = parent;
    // }
    // else if(parabola.right_child === null){
        
    //     if(parent.left_child === parabola){
    //         parent.left_child = parabola.left_child;
            
    //     }
    //     else{
    //         parent.right_child = parabola.left_child;
    //     }
    //     parabola.left_child.parent = parent;
    // }
    // else{
    //     const successor = this.get_right_breakpoint(parabola);

    // }


    // this.rebalance_deletion(parabola);
}

Parabola_Tree.prototype.is_left_child = function(parent, child, intersection){
    // const x = parent.is_breakpoint? this.get_coord(parent) : parent.site.x;
    // if(coord == null){
    //     console.log('parent is not breakpoint');
    //     return null;
    // }
    // const {x,y} = coord;
    // const child_x = child.is_breakpoint ? this.get_X(child) : child.site.x;
    // if(Math.abs(x - child_x) <= this.EPS){
    //     if(child.is_breakpoint){
    //         return true;
    //     }
    //     else if(child.site == parent.left_site)
    //         return true;
    //     else return false;
    // }
    // else if(child_x < coord.x)
    //     return true;
    // else return false;

    console.log("calling is_left_child");

    console.log('parent');
    this.print_node(parent);
    console.log('child');
    this.print_node(child);
    
    // console.log(parent.is_breakpoint, parent.site, parent.left_site, parent.right_site);
    // console.log(child.is_breakpoint, child.site, child.left_site, child.right_site);

    if(child.is_breakpoint){ //only 1 case in insert_parabola
                            //do we ever insert breakpoint
        
        // if(Math.abs(x - child_x) <= this.EPS && child.right_site === parent.left_site)
        //     return true;
        if(child.right_site === parent.left_site && child.left_site === parent.right_site){
            return true;
        }
        else{
            const x = this.get_coord(parent).x;
            return child.edge.start_point.x < x;
        }
    }

    
    console.log(child.site === parent.right_site, child.site === parent.left_site);

    if(intersection === parent.edge.start_point){
        if(parent.site && child.site === parent.site)
            return child.is_left_half;
        
    }

    if(child.site === parent.right_site){
        return false;
    }

    if(child.site === parent.left_site){
        return true;
    }
    
    const x = parent.is_breakpoint? this.get_coord(parent).x : parent.site.x;
    // const child_x = child.is_breakpoint? this.get_coord(child).x : child.site.x;

    if(child.site.x < x){
        return true;
    }
    return false;
    
}


export {Parabola_Tree};