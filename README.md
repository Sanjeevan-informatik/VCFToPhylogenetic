# Population Genetics: Genotype data-based  Phylogenetic Tree Inference

<img src="https://user-images.githubusercontent.com/63479459/226971670-2696be48-4410-4795-bcb9-8e2936595ed6.png" >

### This figure above illustrates the architecture of phylogenetic trees analysis software models. (VCF file and reference sequence)

<img src="https://user-images.githubusercontent.com/63479459/226971695-6422a77b-de35-4a3c-9eba-caf6f6d41f58.png" >

### This figure above illustrates the architecture of phylogenetic trees analysis software models. (VCF file only)

###  software requirements 

#### vcf data based phylogenetics

install conda in windows


ubuntu virtual environment(if you construct the phylogenetic tree based on sequence data or fasta data)

### software setup

git clone "VCFToPhylogenetic depository"


data configuration

follow the tutorial to configure the data
https://divbrowse.readthedocs.io/tutorial.html#


cd VCFToPhylogenetic

conda env create -f environment.yml

conda activate divbrowse_dev

cd frontend

npm install

conda activate divbrowse_dev

set FLASK_APP=vcftophylogenetic.server

flask run --port=8090




<img src="https://user-images.githubusercontent.com/63479459/226978993-dea961dc-425e-4037-be3a-2976a1fd4380.PNG" >


<img src="https://user-images.githubusercontent.com/63479459/226979099-a4477be9-a9d9-447d-ab7c-3e7df1fd6c35.PNG" >



<img src="https://user-images.githubusercontent.com/63479459/226979186-8ce89e79-a473-4d66-acc5-c953a927a136.PNG" >

