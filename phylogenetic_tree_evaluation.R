phylogenetic_tree_score <- function(netwick_dir, fasta_seq){



list.of.packages <- c("ape", "phangorn")
new.packages <- list.of.packages[!(list.of.packages %in% installed.packages()[,"Package"])]
if(length(new.packages)) install.packages(new.packages)


library(ape)
library(phangorn)


filenames <- list.files(netwick_dir, pattern="*.newick", full.names=TRUE)
file <- fasta_seq
dat <- read.phyDat(file, format="fasta")

logLik_score <- list()
parsimony_score <- list()

print("phylogenetic_tree_score")

for (file in filenames) {

  tree <- ape::read.tree(file)

  fit <- pml(tree, data=dat)
  logLik_score <- append(logLik_score, logLik(fit))
  parsimony_score <- append(parsimony_score,  parsimony(tree, dat))
  
  }

  
  score = list()
  

  score$logLik_score = logLik_score
  score$parsimony_score = parsimony_score

  print(score)

  return(score)
}


phylogenetic_tree_static <- function(newick_sequence, fasta_seq,  nni = TRUE,  model = "JC", opt_param = "parsimony", itr_nni = 1000){
  
  
  print("sequence based phylogenetic statistics")
  list.of.packages <- c("ape", "phangorn")
  new.packages <- list.of.packages[!(list.of.packages %in% installed.packages()[,"Package"])]
  if(length(new.packages)) install.packages(new.packages)
  
  print(itr_nni)
  library(ape)
  library(phangorn)
  start.time <- Sys.time()
  file <- fasta_seq
  dat <- read.phyDat(file, format="fasta")
  Repeat_nni <-  c(0)
  
  tree_file_1 <- newick_sequence
  
  end.time <- Sys.time()
  
  
  time.taken <- end.time - start.time
  print("sequence based tree(running time)")
  print(time.taken)
  
  if (nni == TRUE) {
    
    if(opt_param == "parsimony") {
      
      for (k in 1:itr_nni) {

        optimize <- FALSE
        
        tree <- ape::read.tree(tree_file_1)
        mytree <- neighbor_interchange(tree)
        best_parsimony_score <- parsimony(tree, dat)
        best_tree <-tree
        parsimony_score <- list()
        for (x in 1:length(mytree) ) {  
          parsimony_score <- append(parsimony_score,  parsimony(mytree[x], dat))
          if (best_parsimony_score > parsimony(mytree[x], dat)){
            best_parsimony_score <- parsimony(mytree[x], dat)
            best_tree <- mytree[x]
            optimize <- TRUE

          }

        }
        write.tree(best_tree, file=tree_file_1)

        if (optimize == FALSE) {
           print("the loop was run")
           print(k)
           Repeat_nni <-  c(k)
           break

        }
        
      }
    } 
    
  }
  
  if (nni == TRUE) {
    
    if(opt_param == "maximum_likelihood") {
      
      tree <- ape::read.tree(tree_file_1)
      
      temp_tree <- "data/tree/temp.newick"
      
      mytree <- neighbor_interchange(tree)
      
      fit <- pml(tree, dat)
      best_logLik_score <- logLik(fit)
      best_tree <-tree
      like_score <- list()
      for (x in 1:length(mytree) ) {
        
        write.tree(mytree[x], file=temp_tree) 
        
        temp_tree_data <- ape::read.tree(temp_tree)
        
        
        fit <- pml(temp_tree_data, dat)
        logLik_score <- logLik(fit)
        
        like_score <- append(like_score,  logLik_score)
        if (best_logLik_score < logLik_score){
          best_logLik_score <- logLik_score
          best_tree <- temp_tree_data
          
        }
      }
      write.tree(best_tree, file=tree_file_1)   
    } 
    
  }
  
  
  tree <- ape::read.tree(tree_file_1)
  
  sequence_score <- modelTest(dat, tree = tree, model = c(model),  G = FALSE, I = FALSE)


  sequence_score$Repeat_nni <- Repeat_nni

  
  print(sequence_score)
  print(class(sequence_score))
  
  return(sequence_score) 
      
}


phylogenetic_tree_static_sequence <- function(newick_sequence, fasta_seq,  nni = TRUE,  model ="JC", opt_param = "parsimony", itr_nni = 1000 ){
  
  
  print("sequence based phylogenetic statistics")
  list.of.packages <- c("ape", "phangorn")
  new.packages <- list.of.packages[!(list.of.packages %in% installed.packages()[,"Package"])]
  if(length(new.packages)) install.packages(new.packages)
  
  
  library(ape)
  library(phangorn)
  
  start.time <- Sys.time()
  file <- fasta_seq
  dat <- read.phyDat(file, format="fasta")
  Repeat_nni <-  c(0)
  
  tree_file_1 <- newick_sequence
  
  end.time <- Sys.time()
  
  
  time.taken <- end.time - start.time
  print("sequence based tree(running time)")
  print(time.taken)
  
  if (nni == TRUE) {
    
    if(opt_param == "parsimony") {
      
      for (k in 1:itr_nni) {

        optimize <- FALSE
        
        tree <- ape::read.tree(tree_file_1)
        mytree <- neighbor_interchange(tree)
        best_parsimony_score <- parsimony(tree, dat)
        best_tree <-tree
        parsimony_score <- list()
        for (x in 1:length(mytree) ) {  
          parsimony_score <- append(parsimony_score,  parsimony(mytree[x], dat))
          if (best_parsimony_score > parsimony(mytree[x], dat)){
            best_parsimony_score <- parsimony(mytree[x], dat)
            best_tree <- mytree[x]
            optimize <- TRUE

          }

        }
        write.tree(best_tree, file=tree_file_1)

        if (optimize == FALSE) {
           print("the loop was run")
           print(k)
           Repeat_nni <-  c(k)
           break

        }
        
      }
    } 
    
  }
  
  if (nni == TRUE) {
    
    if(opt_param == "maximum_likelihood") {
      
      tree <- ape::read.tree(tree_file_1)
      
      temp_tree <- "data/tree/temp.newick"
      
      mytree <- neighbor_interchange(tree)
      
      fit <- pml(tree, dat)
      best_logLik_score <- logLik(fit)
      best_tree <-tree
      like_score <- list()
      for (x in 1:length(mytree) ) {
        
        write.tree(mytree[x], file=temp_tree) 
        
        temp_tree_data <- ape::read.tree(temp_tree)
        
        
        fit <- pml(temp_tree_data, dat)
        logLik_score <- logLik(fit)
        
        like_score <- append(like_score,  logLik_score)
        if (best_logLik_score < logLik_score){
          best_logLik_score <- logLik_score
          best_tree <- temp_tree_data
          
        }
      }
      write.tree(best_tree, file=tree_file_1)   
    } 
    
  }
  
  tree <- ape::read.tree(tree_file_1)
  
  sequence_score <- modelTest(dat, tree = tree, model = c(model),  G = FALSE, I = FALSE)
  sequence_score$Repeat_nni <- Repeat_nni
  
  print(sequence_score)
  
  return(sequence_score)
}


phylogenetic_tree_static_sequence_phangorn <- function(newick_sequence, fasta_seq, method,  nni = TRUE, model ="JC", opt_param = "parsimony",  itr_nni = 1000){
  
  
  print("sequence based phylogenetic statistics(library(phangorn) )")
  list.of.packages <- c("ape", "phangorn")
  new.packages <- list.of.packages[!(list.of.packages %in% installed.packages()[,"Package"])]
  if(length(new.packages)) install.packages(new.packages)
  
  
  library(ape)
  library(phangorn)
  

  file <- fasta_seq
  dat <- read.phyDat(file, format="fasta")
  Repeat_nni <-  c(0)

  start.time <- Sys.time()
  dm  <- dist.ml(dat)
  end.time <- Sys.time()
  
  if (method == "upgma"){
    tree  <- upgma(dm)
  } else if (method == "NJ"){
    tree  <- NJ(dm)
  } 
  
  time.taken <- end.time - start.time
  print("end.time <- Sys.time() based tree(running time)")
  print(time.taken)
  
  tree_file_1 <- newick_sequence
  write.tree(tree, file=tree_file_1)
  
  
  if (nni == TRUE) {
    
    if(opt_param == "parsimony") {
      
      for (k in 1:itr_nni) {

        optimize <- FALSE
        
        tree <- ape::read.tree(tree_file_1)
        mytree <- neighbor_interchange(tree)
        best_parsimony_score <- parsimony(tree, dat)
        best_tree <-tree
        parsimony_score <- list()
        for (x in 1:length(mytree) ) {  
          parsimony_score <- append(parsimony_score,  parsimony(mytree[x], dat))
          if (best_parsimony_score > parsimony(mytree[x], dat)){
            best_parsimony_score <- parsimony(mytree[x], dat)
            best_tree <- mytree[x]
            optimize <- TRUE

          }

        }
        write.tree(best_tree, file=tree_file_1)

        if (optimize == FALSE) {
           print("the loop was run")
           print(k)
           Repeat_nni <-  c(k)
           break

        }
        
      }
    } 
    
  }
  
  if (nni == TRUE) {
    
    if(opt_param == "maximum_likelihood") {
      
      tree <- ape::read.tree(tree_file_1)
      
      temp_tree <- "data/tree/temp.newick"
      
      mytree <- neighbor_interchange(tree)
      
      fit <- pml(tree, dat)
      best_logLik_score <- logLik(fit)
      best_tree <-tree
      like_score <- list()
      for (x in 1:length(mytree) ) {
        
        write.tree(mytree[x], file=temp_tree) 
        
        temp_tree_data <- ape::read.tree(temp_tree)
        
        
        fit <- pml(temp_tree_data, dat)
        logLik_score <- logLik(fit)
        
        like_score <- append(like_score,  logLik_score)
        if (best_logLik_score < logLik_score){
          best_logLik_score <- logLik_score
          best_tree <- temp_tree_data
          
        }
      }
      write.tree(best_tree, file=tree_file_1)   
    } 
    
  }
  
  tree <- ape::read.tree(tree_file_1)
  sequence_score <- modelTest(dat, tree = tree, model = c(model),  G = FALSE, I = FALSE)
  sequence_score$Repeat_nni <- Repeat_nni
  sequence_score$running_time  <- time.taken

  print(sequence_score)
  
  
  return(sequence_score)
}




phylogenetic_static_vcf_data <- function(method, model ="JC"){


  print("calculate the maximum likelihood score from vcf data")
  list.of.packages <- c("ape", "phangorn")
  new.packages <- list.of.packages[!(list.of.packages %in% installed.packages()[,"Package"])]
  if(length(new.packages)) install.packages(new.packages)


  library(ape)
  library(phangorn)


  file <- "/opt/home/arumuham/V2/VCFToPhylogenetic/data/vcf_to_seq.fasta"

  start.time <- Sys.time()
  dat <- read.phyDat(file, format="fasta")

  dm  <- dist.ml(dat)

  end.time <- Sys.time()

  if (method == "upgma"){
    tree  <- upgma(dm)
  } else if (method == "NJ"){
    tree  <- NJ(dm)
  } 


  time.taken <- end.time - start.time
  print("vcf data based tree(running time)")
  print(time.taken)


  source("/opt/home/arumuham/V2/VCFToPhylogenetic/nearest_neighbor_interchange.R")
  fit <- nearest_neighbor_interchange(tree, dat)
  print("Number of_moves :")
  print(fit$number_of_moves)

  tree_file <- "/opt/home/arumuham/V2/VCFToPhylogenetic/data/tree/model/sequence_based_tree.newick"
  write.tree(fit$tree, file=tree_file)


  sequence_score <- modelTest(dat, tree = fit$tree, model = c(model))

  print(sequence_score)
  print("the parsimony score is :")
  print(parsimony(tree, dat))


  return(sequence_score)
}


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