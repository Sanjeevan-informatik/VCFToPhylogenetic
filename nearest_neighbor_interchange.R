neighbor_interchange <- function(tree) {
  tip.label <- tree$tip.label
  attr(tree, "order") <- NULL
  k <- min(tree$edge[, 1]) - 1
  n <- sum(tree$edge[, 2] > k)
  result <- vector("list", 2 * n)
  l <- 1
  for (i in 1:n) {
    tmp <- nnin(tree, i)
    tmp[[1]]$tip.label <- tmp[[2]]$tip.label <- NULL
    result[c(l, l + 1)] <- tmp
    l <- l + 2
  }
  attr(result, "TipLabel") <- tip.label
  class(result) <- "multiPhylo"
  result
}


nnin <- function(tree, n) {
  attr(tree, "order") <- NULL
  tree1 <- tree
  tree2 <- tree
  edge <- matrix(tree$edge, ncol = 2)
  parent <- edge[, 1]
  child <- tree$edge[, 2]
  k <- min(parent) - 1
  ind <- which(child > k)[n]
  if (is.na(ind)) return(NULL)
  p1 <- parent[ind]
  p2 <- child[ind]
  ind1 <- which(parent == p1)
  ind1 <- ind1[ind1 != ind][1]
  ind2 <- which(parent == p2)
  e1 <- child[ind1]
  e2 <- child[ind2[1]]
  e3 <- child[ind2[2]]
  tree1$edge[ind1, 2] <- e2
  tree1$edge[ind2[1], 2] <- e1
  tree2$edge[ind1, 2] <- e3
  tree2$edge[ind2[2], 2] <- e1
  if (!is.null(tree$edge.length)) {
    tree1$edge.length[c(ind1, ind2[1])] <- tree$edge.length[c(ind2[1], ind1)]
    tree2$edge.length[c(ind1, ind2[2])] <- tree$edge.length[c(ind2[2], ind1)]
  }
  tree1 <- reorder(tree1, "postorder")
  tree2 <- reorder(tree2, "postorder")
  result <- list(tree1, tree2)
  result
}