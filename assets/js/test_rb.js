import { Cell } from './Cell.js';
import { Parabola } from './Parabola_Tree.js';
import {Parabola_Tree} from './Red_Black_Operations.js';


function Utility(){
    

    var max_depth = 0;

    function get_tree_depth(root, depth){
        if(root == null)
            return;
        max_depth = Math.max(max_depth, depth);
        get_tree_depth(root.left_child, depth+1);
        get_tree_depth(root.right_child, depth+1);
    }


    function print_spaces(depth){
        const num_spaces = (Math.pow(2, max_depth - depth) - 2)/2;
        var line = [];
        for(var i = 0; i < num_spaces; ++i){
            line.push(' ');
        }
        return line;
    }
    /*
    Reverse 2 horizontal spaces for each node
        except root
    */
    this.print_tree = function print_tree(root){
        var depth = 0;
        var queue = [];
        queue.push(root);
        while(queue.length > 0 && depth < max_depth){
            // queue.reverse();
            var new_queue = [];
            var line = print_spaces(depth);
            
            // if(depth)
            //     line.push(' ');
            // for(var i = 0; i < queue.length; ++i){
            //     if(queue[i] === null){
            //         line.push(' ');
            //     }
            //     else{
            //         if(i % 2 == 0){
            //             line.push('/');
            //         }
            //         else{
            //             line.push('\\');
            //         }
            //     }
            //     line.push(' ');
            // }
            
            line = print_spaces(depth);
            for(var i = 0; i < queue.length; ++i){
                if(queue[i] === null){
                    // line.push(' ');
                    // line.push(' ');
                    new_queue.push(null);
                    new_queue.push(null);
                }
                else{
                    line.push(queue[i].site.x);
                    // line.push(' ');
                    new_queue.push(queue[i].left_child);
                    new_queue.push(queue[i].right_child);
                }
            }
            console.log(line);
            ++depth;
            queue = new_queue;
        }
    }
    function get_leaves(root, leaves){
        if(root === null)
            return;
        console.log(root);
        if(root.left_child === null && root.right_child === null){
            leaves.push(node);
        }
        get_leaves(root.left_child, leaves);
        get_leaves(root.right_child, leaves);
    }
    
    // var tree = new Parabola_Tree();
    // for(var i = 1; i <= 10; ++i){
        
    //     tree.insert(new Parabola(new Cell(i,0)));
    // }
    // max_depth = 0;
    
    // get_tree_depth();
    // console.log(max_depth);
    // print_tree(tree.root);

    // console.log("======================AMEN=================");


    // var leaves = [];
    // get_leaves(tree.root, leaves);
    // leaves.forEach((leaf)=>console.log(leaf.site.x));
    // tree.remove(leaves[0]);

    // max_depth = 0;
    // get_tree_depth();
    // console.log(max_depth);
    // print_tree(tree.root);

    // console.log("======================AMEN=================");

};
export {Utility};
