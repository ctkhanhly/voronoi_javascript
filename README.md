# voronoi_javascript

Deployed code is on branch gh-pages

I used the idea of http://blog.ivank.net/fortunes-algorithm-and-implementation.html#impl_cpp to implement the binary tree data structure to store arcs and beachlines, which runs in `O(n^2)` since the tree does not have balancing operations. But the solution itself is pretty fast to generate even a few hundred points. Any more than that would not allow seeing the voronoi diagrams very clearly for this application.

https://voronoi-javascript.herokuapp.com/
