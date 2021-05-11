# voronoi_javascript

I use the idea of http://blog.ivank.net/fortunes-algorithm-and-implementation.html#impl_cpp to implement the binary tree data structure to store arcs and beachlines, which runs in `O(n^2)` since the tree does not have balancing operations. But the solution itself is pretty fast to generate even a few hundred points. Any more than that would not allow seeing the voronoi diagrams very clearly for this application.

Main app: https://voronoi-javascript.herokuapp.com/

Report   : https://voronoi-javascript.herokuapp.com/details

Presentation: https://docs.google.com/presentation/d/1AWFgNkQOpvOsm5mgK0B507V5JGaFdxoXJMj7LGdEKxk/edit#slide=id.p

# Known Issues

Sometimes the some cells are not colored. You can experment with changing the EPS property of Cell to remove vertices that are too close. The reason for this is my current implementation of finding the convex hull using Jarvis's scan of the cell given vertices sometimes fail when two vertices are too close since that messes up with the counterclockwise ordering of the vertices. 

Quick fix: place extra point(s) on the part of the cell that is not colored then you have a new diagram with that portion modified but other cells are preserved and all cells will be colored correctly.
