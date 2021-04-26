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

export {Parabola_Tree};