__version__ = '0.1.0'

import json
import os
from timeit import default_timer as timer

from flask import Flask, Response, jsonify, request

import allel
import numpy as np
import pandas as pd
from bioblend.galaxy import GalaxyInstance
from bioblend.galaxy.tools.inputs import inputs
from sklearn.metrics import pairwise_distances
import yaml
import time
import psutil

from vcftophylogenetic import log
from vcftophylogenetic.lib.annotation_data import AnnotationData
from vcftophylogenetic.lib.genotype_data import GenotypeData

from vcftophylogenetic.lib.utils import ApiError
from vcftophylogenetic.lib.utils import StrictEncoder
from vcftophylogenetic.lib.utils import generate_distance_matrix_for_genotype, generate_distance_matrix_for_sequence


from vcftophylogenetic.lib.utils import to_newick, sequence_vcf
from scipy.cluster.hierarchy import ClusterWarning, linkage, to_tree
from scipy.spatial import distance_matrix



from Bio import SeqIO,  Phylo, AlignIO
from itertools import chain
from Bio.Phylo.TreeConstruction import DistanceCalculator, DistanceTreeConstructor
import gc
import allel


import pandas as pd
import rpy2.robjects as robjects
from rpy2.robjects import pandas2ri
from rpy2.robjects.vectors import StrVector
import rpy2.robjects.packages as rpackages
import warnings
warnings.filterwarnings('ignore')



def create_app(filename_config_yaml = 'vcftophylogenetic.config.yml', config_runtime=None):
    """Factory method to create and return a wsgi-compliant Flask app instance"""

    app = Flask(__name__, static_url_path='', static_folder='static')

    app.json_encoder = StrictEncoder

    if config_runtime is not None:
        log.info('Using runtime config') 
        config = config_runtime
    else:

        try:
            with open(filename_config_yaml) as config_file:
                config = yaml.full_load(config_file)
        except FileNotFoundError:
            log.error('VCFToPhylogenetic config file `vcftophylogenetic.config.yml` not found in current directory!')
            exit(1)


    log.info('Instanciate GenotypeData classes')
    gd = GenotypeData(config)

    log.info('Instanciate AnnotationData classes')
    ad = AnnotationData(config, gd)

 
    def process_request_vars(vars):

        processed = {
            'chrom': vars['chrom'],
        }

        try:

            if 'samples' in vars:
                # conversion to Python list from stringified JSON is necessary for form-data POST requests of vcf_export
                if type(vars['samples']) is str:
                    vars['samples'] = json.loads(vars['samples'])

                samples, unmapable_sample_ids = gd.map_input_sample_ids_to_vcf_sample_ids(vars['samples'])

                if len(unmapable_sample_ids) > 0:
                    raise ApiError('The following sample-IDs could not be resolved: '+', '.join(unmapable_sample_ids))

                processed['samples'] = samples

            processed['count'] = None
            if 'count' in vars:
                processed['count'] = int(vars['count'])

            processed['startpos'] = None
            if 'startpos' in vars:
                processed['startpos'] = int(vars['startpos'])

            processed['endpos'] = None
            if 'endpos' in vars:
                processed['endpos'] = int(vars['endpos'])


        except KeyError:
            raise ApiError('Some input data is missing.')





    @app.route("/configuration", methods = ['GET', 'POST', 'OPTIONS'])
    def __configuration():


        samples, _ = gd.map_vcf_sample_ids_to_input_sample_ids(gd.samples.tolist())

        result = {
            'ploidy': gd.ploidy,
            'count_genotypes': gd.count_samples,
            'count_variants': gd.count_variants,
            'count_elements': gd.count_samples * gd.count_variants,
            'chromosomes': gd.list_of_chromosomes,
            'samples': samples,
            'gff3': ad.metadata_gff3,
            'fasta': ad.metadata_gff3,
            'dataset_descriptions': dict(config['metadata'])
        }

        return jsonify(result)

    @app.route("/variant_calls_slice", methods = ['GET', 'POST', 'OPTIONS'])
    def __variant_calls_slice():



        input =  {'chrom': '1', 'samples': ['BRIDGE_WGS_HOR_2237', 'BRIDGE_WGS_HOR_3187', 'BRIDGE_WGS_HOR_3460', 'BRIDGE_WGS_HOR_10004', 'BRIDGE_WGS_HOR_10041', 'BRIDGE_WGS_HOR_1020', 'BRIDGE_WGS_HOR_1044', 'BRIDGE_WGS_HOR_10478', 'BRIDGE_WGS_HOR_1048', 'BRIDGE_WGS_HOR_1071', 'BRIDGE_WGS_HOR_10725', 'BRIDGE_WGS_HOR_1080', 'BRIDGE_WGS_HOR_11083', 'BRIDGE_WGS_HOR_11101', 'BRIDGE_WGS_HOR_11183', 'BRIDGE_WGS_HOR_11662', 'BRIDGE_WGS_HOR_11875', 'BRIDGE_WGS_HOR_11922', 'BRIDGE_WGS_HOR_12072', 'BRIDGE_WGS_HOR_12168', 'BRIDGE_WGS_HOR_12171', 'BRIDGE_WGS_HOR_12184', 'BRIDGE_WGS_HOR_12311', 'BRIDGE_WGS_HOR_12367', 'BRIDGE_WGS_HOR_1251', 'BRIDGE_WGS_HOR_12541', 'BRIDGE_WGS_HOR_12562', 'BRIDGE_WGS_HOR_12568', 'BRIDGE_WGS_HOR_12830', 'BRIDGE_WGS_HOR_12854', 'BRIDGE_WGS_HOR_12856', 'BRIDGE_WGS_HOR_12996', 'BRIDGE_WGS_HOR_13035', 'BRIDGE_WGS_HOR_1384', 'BRIDGE_WGS_HOR_13924', 'BRIDGE_WGS_HOR_13938', 'BRIDGE_WGS_HOR_14342', 'BRIDGE_WGS_HOR_14411', 'BRIDGE_WGS_HOR_14439', 'BRIDGE_WGS_HOR_14557', 'BRIDGE_WGS_HOR_14689', 'BRIDGE_WGS_HOR_14787', 'BRIDGE_WGS_HOR_14876', 'BRIDGE_WGS_HOR_14914', 'BRIDGE_WGS_HOR_15254', 'BRIDGE_WGS_HOR_1531', 'BRIDGE_WGS_HOR_15401', 'BRIDGE_WGS_HOR_15778', 'BRIDGE_WGS_HOR_15788', 'BRIDGE_WGS_HOR_1581', 'BRIDGE_WGS_HOR_15840', 'BRIDGE_WGS_HOR_15841', 'BRIDGE_WGS_HOR_15857', 'BRIDGE_WGS_HOR_15860', 'BRIDGE_WGS_HOR_15871', 'BRIDGE_WGS_HOR_15895', 'BRIDGE_WGS_HOR_15898', 'BRIDGE_WGS_HOR_15905'], 'count': None, 'startpos': 551, 'endpos': 16149, 'variant_filter_settings': None}

        _result = gd.get_slice_of_variant_calls(
            chrom = input['chrom'],
            startpos = input['startpos'],
            endpos = input['endpos'],
            samples = input['samples'],
            variant_filter_settings = input['variant_filter_settings']
        )

        result = {
            'numbers_of_alternate_alleles':  _result.numbers_of_alternate_alleles.tolist(),
            'index' : _result.samples_selected_mapped,
        }

        return jsonify(result)



    @app.route("/generate_sequence", methods = ['GET', 'POST', 'OPTIONS'])
    def generate_sequence(input):

        samples = ' '.join(map(str, input['samples']))
        argument = str(input['datadir']) +" "+ str(input['reference_fasta']) +" "+ str(input['vcf_file']) +" "+ str(input['chrom']) +" "+  str(input['startpos']+1) + " " +   str(input['endpos']) + " " +  str(input['consensus']) + " " + samples
        os.system('sh script/generate_sequence.sh  ' + argument)



    
    @app.route("/phylogenetic_score", methods = ['GET', 'POST', 'OPTIONS'])
    def phylogenetic_score(netwick_dir, fasta_seq):

       # Defining the R script and loading the instance in Python
        r = robjects.r
        r['source']('phylogenetic_tree_evaluation.R')
        # Loading the function we have defined in R.
        phylogenetic_tree_score = robjects.globalenv['phylogenetic_tree_score']
        #Invoking the R function and getting the result
        df_result_r = phylogenetic_tree_score(netwick_dir, fasta_seq)
        #Converting it back to a pandas dataframe.
        df_result1 = pandas2ri.PandasDataFrame(df_result_r)
        print(type(df_result1))

        data ={
        "passimory" : [],
        "likelihood" : []
        }

        for j in range(0, len(df_result1.iloc[0])):
                
            vector=np.asarray(df_result1[j][0])[0]
            data["likelihood"].append(vector)
            
        for j in range(0, len(df_result1.iloc[1])):
                
            vector=np.asarray(df_result1[j][1])[0]
            data["passimory"].append(vector)
        # cd V2/VCFToPhylogenetic/
        # conda activate divbrowse_dev
        # export FLASK_APP=vcftophylogenetic.server
        # flask run --port=8090
        return data

    def phylogenetic_static_sequence(newick_sequence, fasta_seq, nni, model, opt_param):

        # Defining the R script and loading the instance in Python
        r = robjects.r
        r['source']('phylogenetic_tree_evaluation.R')
        # Loading the function we have defined in R.
        phylogenetic_tree_score = robjects.globalenv['phylogenetic_tree_static_sequence']
        #Invoking the R function and getting the result
        df_result_r = phylogenetic_tree_score(newick_sequence, fasta_seq, nni, model, opt_param)
        #Converting it back to a pandas dataframe.
        df_result1 = pandas2ri.PandasDataFrame(df_result_r)
        print(type(df_result1))

        score ={
        "Model" : [],
        "logLik" : [],
        "AIC" : [], 
        "BIC" : [] ,
        "Repeat_nni" : []   
         }

        score["Model"]=np.asarray(df_result1.iloc[0])
        score["logLik"]=np.asarray(df_result1.iloc[2])
        score["AIC"]=np.asarray(df_result1.iloc[3])
        score["BIC"]=np.asarray(df_result1.iloc[7])
        score["Repeat_nni"]=np.asarray(df_result1.iloc[8])
       

        return score


    def phylogenetic_static(netwick, fasta_seq, nni, model, opt_param):

        # Defining the R script and loading the instance in Python
        r = robjects.r
        r['source']('phylogenetic_tree_evaluation.R')
        # Loading the function we have defined in R.
        phylogenetic_tree_score = robjects.globalenv['phylogenetic_tree_static']
        #Invoking the R function and getting the result
        df_result_r = phylogenetic_tree_score(netwick, fasta_seq, nni, model, opt_param) 
        #Converting it back to a pandas dataframe.
        df_result1 = pandas2ri.PandasDataFrame(df_result_r)
        print(type(df_result1))

        score ={
        "Model" : [],
        "logLik" : [],
        "AIC" : [], 
        "BIC" : [] ,
        "Repeat_nni" : []   
         }

        score["Model"]=np.asarray(df_result1.iloc[0])
        score["logLik"]=np.asarray(df_result1.iloc[2])
        score["AIC"]=np.asarray(df_result1.iloc[3])
        score["BIC"]=np.asarray(df_result1.iloc[7])
        score["Repeat_nni"]=np.asarray(df_result1.iloc[8])

        

        return score


    def phylogenetic_static_vcf_data(netwick, fasta_seq, model, opt_param):

        # Defining the R script and loading the instance in Python
        r = robjects.r
        r['source']('phylogenetic_tree_evaluation.R')
        # Loading the function we have defined in R.
        phylogenetic_tree_score = robjects.globalenv['phylogenetic_static_vcf_data']
        #Invoking the R function and getting the result
        df_result_r = phylogenetic_tree_score(netwick, fasta_seq, model, opt_param) 
        #Converting it back to a pandas dataframe.
        df_result1 = pandas2ri.PandasDataFrame(df_result_r)
        print(type(df_result1))

        score ={
        "Model" : [],
        "logLik" : [],
        "AIC" : [], 
        "BIC" : [] ,
        "Repeat_nni" : []   
         }

        score["Model"]=np.asarray(df_result1.iloc[0])
        score["logLik"]=np.asarray(df_result1.iloc[2])
        score["AIC"]=np.asarray(df_result1.iloc[3])
        score["BIC"]=np.asarray(df_result1.iloc[7])
        score["Repeat_nni"]=np.asarray(df_result1.iloc[8])

        

        return score

    def phylogenetic_tree_static_sequence_phangorn(newick_sequence, fasta_seq, method, nni, model, opt_param):

        # Defining the R script and loading the instance in Python
        r = robjects.r
        r['source']('phylogenetic_tree_evaluation.R')
        # Loading the function we have defined in R.
        phylogenetic_tree_score = robjects.globalenv['phylogenetic_tree_static_sequence_phangorn']
        #Invoking the R function and getting the result
        df_result_r = phylogenetic_tree_score(newick_sequence, fasta_seq, method, nni, model, opt_param) 
        #Converting it back to a pandas dataframe.
        df_result1 = pandas2ri.PandasDataFrame(df_result_r)
        print(type(df_result1))

        score ={
        "Model" : [],
        "logLik" : [],
        "AIC" : [], 
        "BIC" : [] ,
        "Repeat_nni" : []   
         }

        score["Model"]=np.asarray(df_result1.iloc[0])
        score["logLik"]=np.asarray(df_result1.iloc[2])
        score["AIC"]=np.asarray(df_result1.iloc[3])
        score["BIC"]=np.asarray(df_result1.iloc[7])
        score["Repeat_nni"]=np.asarray(df_result1.iloc[8])
        score["running_time"]=np.asarray(df_result1.iloc[9])
        

        return score


    @app.route("/hello_world", methods = ['GET', 'POST', 'OPTIONS'])
    def hello_world():

        print("hello world ")
        
        
    


    @app.route("/phylo_cluster", methods = ['GET', 'POST', 'OPTIONS'])
    def __phylo_cluster():
        
        
        if request.method == 'POST':
            input = request.get_json(silent=True)
            number_of_sample = input["number_of_sample"]
            NNI_value = input["nni"]
            model =input["subs_model"]
            opt_param =input["opt_param"]

        else:
            return 'ERROR'

        
        

        mem_before = process_memory()
        _result = gd.get_slice_of_variant_calls(
            chrom = input['chrom'],
            startpos = input['startpos'],
            endpos = input['endpos'],
            samples = input['samples']
        )


        vcf_file_only = False 
        seq_generate = True
        consensus = "R"

        no_of_variants = len(_result.positions.tolist())
        print(no_of_variants)
            

            

        if input['data_file'] == "VCF_file_only":
              vcf_file_only = True 

        if input['consensus'] != None:
              consensus = input['consensus'] 
        
        reference_fasta = ad.metadata_gff3['reference_seq']
        datadir = config['datadir']
        vcf_to_seq = datadir+"vcf_to_seq.fasta"
        samples= _result.samples_selected_mapped[:number_of_sample]


        labelList = _result.samples_selected_mapped[:number_of_sample]

        if vcf_file_only == True:

            sequence_vcf(_result , samples, vcf_to_seq ,consensus)
            

            fasta_seq = datadir+"vcf_to_seq.fasta" # [ "vcf_to_seq.fasta" , "output.fasta"]

            align = AlignIO.read(fasta_seq, 'fasta') # 'vcf_to_seq.fasta' , 'output.fasta'
            #calculator = DistanceCalculator('identity')
            #sampel_data = calculator.get_distance(align)
            start = time.time()
            sampel_data = generate_distance_matrix_for_sequence(fasta_seq)
            end = time.time()

            sampel_data = sampel_data.replace(0, 0.0000001)
            np.fill_diagonal(sampel_data.values, 0)

            fasta_seq = datadir+"vcf_to_seq.fasta" # [ "vcf_to_seq.fasta" , "output.fasta"]

            #fasta_seq = "/opt/home/arumuham/V2/VCFToPhylogenetic/data/vcf_to_seq.fasta"
            """

            df = pd.DataFrame(_result.numbers_of_alternate_alleles, index= _result.samples_selected_mapped)

            df = df[:number_of_sample]
            df = df.replace(-1, 0)
            start = time.time()
            sampel_data =pd.DataFrame(distance_matrix(df.values, df.values), index=df.index, columns=df.index)
            end = time.time()
            #sampel_data = generate_distance_matrix_for_genotype(_result, number_of_sample)
            sampel_data = sampel_data.replace(0, 0.0001)
            np.fill_diagonal(sampel_data.values, 0)


            fasta_seq = datadir+"vcf_to_seq.fasta" # [ "vcf_to_seq.fasta" , "output.fasta"]
            """



                
        else:

            """
            df = pd.DataFrame(_result.numbers_of_alternate_alleles, index= _result.samples_selected_mapped)
            df = df[:number_of_sample]
            df = df.replace(-1, 0)
            start = time.time()
            sampel_data =pd.DataFrame(distance_matrix(df.values, df.values), index=df.index, columns=df.index)
            end = time.time()
            #sampel_data = generate_distance_matrix_for_genotype(_result, number_of_sample)
            sampel_data = sampel_data.replace(0, 0.0001)
            np.fill_diagonal(sampel_data.values, 0)
            """

            if seq_generate == True:
                print("sequence generator start")
                input['samples']= _result.samples_selected_mapped[:number_of_sample]
                print(len( input['samples']))
                input['reference_fasta']= ad.metadata_gff3['reference_seq']
                input['datadir']= config['datadir']
                input['vcf_file'] = ad.metadata_gff3['vcf_file']
                input['consensus'] = consensus
                generate_sequence(input)
                print("sequence generator end")


            fasta_seq = datadir+"output.fasta" # [ "vcf_to_seq.fasta" , "output.fasta"]
            #align = AlignIO.read(fasta_seq, 'fasta') # 'vcf_to_seq.fasta' , 'output.fasta'
            #calculator = DistanceCalculator('identity')
            #sampel_data = calculator.get_distance(align)
            start = time.time()
            sampel_data = generate_distance_matrix_for_sequence(fasta_seq)
            end = time.time()

            sampel_data = sampel_data.replace(0, 0.001)
            fasta_seq = datadir+"output.fasta" # [ "vcf_to_seq.fasta" , "output.fasta"]

        

        Z1 = linkage(sampel_data, method="single", metric='euclidean') 

        T = to_tree(Z1, rd=False)

        mem_after = process_memory()

        print("genotype based tree(running time)")
        print(end - start)

        print("genotype based tree(memory usage)")
        print(mem_after - mem_before)

        running_time ={
        "genotype" : 0.00,
        "sequencetype" : 0.00,
        "phangorn" : 00
        }


        Repeat_nni ={
         "single" : 0,
         "complete" : 0,
         "average" : 0,
        "centroid" : 0,
        "median" : 0,
        "ward" : 0,
        "sequence" :0,
        "phangorn_upgma" : 0
        }

        running_time["genotype"] = end - start

        method_linkage = [ "single" , "complete" , "average" , "centroid" , "median","ward"] 

        i=0
        for x in method_linkage:

            print(x)
            i=i+1
            Z1 = linkage(sampel_data, method=x, metric='euclidean')

            T = to_tree(Z1, rd=False)

            newick_data = to_newick(T, labelList)
            with open(datadir+'tree/model/newick_000'+str(i)+'.newick', 'w') as f:
                f.write(newick_data)




        print(reference_fasta)
        print(datadir)


        nni = False
        if NNI_value == "yes":
             nni = True
        else:
             nni = False

        newick_0001 = datadir+"tree/model/newick_0001.newick"
        static_genotype_1  = phylogenetic_static(newick_0001, fasta_seq, nni, model, opt_param)

        Repeat_nni ["single" ] = static_genotype_1["Repeat_nni"][0]

    
        static_genotype_1 = {
            "Model" : static_genotype_1["Model"].tolist(),
            "logLik": static_genotype_1["logLik"].tolist(),
            "AIC": static_genotype_1["AIC"].tolist(),
            "BIC": static_genotype_1["BIC"].tolist(),
        }




        newick_0002 = datadir+"tree/model/newick_0002.newick"
        static_genotype_2  = phylogenetic_static(newick_0002, fasta_seq, nni , model, opt_param)

        Repeat_nni ["complete" ] = static_genotype_2["Repeat_nni"][0]

        static_genotype_2 = {
            "Model" : static_genotype_2["Model"].tolist(),
            "logLik": static_genotype_2["logLik"].tolist(),
            "AIC": static_genotype_2["AIC"].tolist(),
            "BIC": static_genotype_2["BIC"].tolist(),


        }


        newick_0003 = datadir+"tree/model/newick_0003.newick"
        static_genotype_3  = phylogenetic_static(newick_0003, fasta_seq, nni, model, opt_param)

        Repeat_nni ["average" ] = static_genotype_3["Repeat_nni"][0]

        static_genotype_3 = {
            "Model" : static_genotype_3["Model"].tolist(),
            "logLik": static_genotype_3["logLik"].tolist(),
            "AIC": static_genotype_3["AIC"].tolist(),
            "BIC": static_genotype_3["BIC"].tolist(),


        }


        
        newick_0004 = datadir+"tree/model/newick_0004.newick"
        static_genotype_4  = phylogenetic_static(newick_0004, fasta_seq, nni, model, opt_param)

        Repeat_nni ["centroid" ] = static_genotype_4["Repeat_nni"][0]

        static_genotype_4 = {
            "Model" : static_genotype_4["Model"].tolist(),
            "logLik": static_genotype_4["logLik"].tolist(),
            "AIC": static_genotype_4["AIC"].tolist(),
            "BIC": static_genotype_4["BIC"].tolist(),


        }
        print(fasta_seq)
        newick_0005 = datadir+"tree/model/newick_0005.newick"
        static_genotype_5  = phylogenetic_static(newick_0005, fasta_seq, nni, model, opt_param)

        Repeat_nni ["median" ] = static_genotype_5["Repeat_nni"][0]


        static_genotype_5 = {
            "Model" : static_genotype_5["Model"].tolist(),
            "logLik": static_genotype_5["logLik"].tolist(),
            "AIC": static_genotype_5["AIC"].tolist(),
            "BIC": static_genotype_5["BIC"].tolist(),


        }

        newick_0006 = datadir+"tree/model/newick_0006.newick"
        static_genotype_6  = phylogenetic_static(newick_0006, fasta_seq, nni, model, opt_param)

        Repeat_nni ["ward" ] = static_genotype_6["Repeat_nni"][0]

        static_genotype_6 = {
            "Model" : static_genotype_6["Model"].tolist(),
            "logLik": static_genotype_6["logLik"].tolist(),
            "AIC": static_genotype_6["AIC"].tolist(),
            "BIC": static_genotype_6["BIC"].tolist(),

        }

        """

        print(fasta_seq)
        align = AlignIO.read(fasta_seq, 'fasta') # 'vcf_to_seq.fasta' , 'output.fasta'

        start = time.time()
        calculator = DistanceCalculator('identity')
        distMatrix = calculator.get_distance(align)
        end = time.time()


        print("sequence based tree(running time- Bio package)")
        print(end - start)


        constructor = DistanceTreeConstructor()
        UGMATree = constructor.upgma(distMatrix)

        Phylo.write(UGMATree, datadir+'tree/model/sequence_based_tree.newick', 'newick')



        running_time["sequencetype"] = end - start 



        start = time.time()
        mem_before = process_memory()
        gc.collect()
        allSeqs = []
        for seq_record in SeqIO.parse(fasta_seq, 'fasta'): #
                allSeqs.append(seq_record.seq)

        seqMat = np.array(allSeqs)

        res = list(set(chain(*seqMat)))
        # printing result
        print ("Unique values in matrix are : " + str(res))
        df = pd.DataFrame(seqMat)
        seqMat = None
        i =0
        for x in res:
            df = df.replace(x, i)
            i=i+1

        sampel_data =pd.DataFrame(distance_matrix(df.values, df.values), index=df.index, columns=df.index)
        sampel_data = sampel_data.replace(0, 0.0001)
        np.fill_diagonal(sampel_data.values, 0)

        labelList = _result.samples_selected_mapped[:number_of_sample]
    
        Z1 = linkage(sampel_data, method="single", metric='euclidean')


        T = to_tree(Z1, rd=False)

        mem_after = process_memory()
        end = time.time()

        print("sequence based tree(running time)")
        print(end - start)

        running_time["sequencetype"] = end - start

        print("sequence based tree(memory usage)")
        print(mem_after - mem_before)

        newick_data = to_newick(T, labelList)
        with open(datadir+'tree/model/sequence_based_tree.newick', 'w') as f:
            f.write(newick_data)




        newick_sequence  = datadir+"tree/model/sequence_based_tree.newick"
        print(fasta_seq)
        static_sequence  = phylogenetic_static_sequence(newick_sequence, fasta_seq, nni, model, opt_param)

        Repeat_nni["sequence" ] = static_sequence["Repeat_nni"][0]

        static_sequence = {
            "Model" : static_sequence["Model"].tolist(),
            "logLik": static_sequence["logLik"].tolist(),
            "AIC": static_sequence["AIC"].tolist(),
            "BIC": static_sequence["BIC"].tolist(),

        }

        
        """


        static_sequence = None
        phangorn_upgma = None

        """

   

        newick_sequence  = datadir+"tree/model/z_sequence_based_tree.newick"

        phangorn_upgma = None



        phangorn_upgma = phylogenetic_tree_static_sequence_phangorn(newick_sequence ,fasta_seq , "upgma", nni, model, opt_param)

        Repeat_nni["phangorn_upgma" ] = phangorn_upgma["Repeat_nni"][0]
        running_time["phangorn"] = phangorn_upgma["running_time"][0]

        phangorn_upgma = {
            "Model" : phangorn_upgma["Model"].tolist(),
            "logLik": phangorn_upgma["logLik"].tolist(),
            "AIC": phangorn_upgma["AIC"].tolist(),
            "BIC": phangorn_upgma["BIC"].tolist(),
        }

        """




        netwick_dir =  datadir+"tree/model/"
        print(fasta_seq)
        score = phylogenetic_score(netwick_dir, fasta_seq)
        print(score)

        mytree = "newick_0001.newick"
        maximumlikelihood = -1000000000


        if maximumlikelihood < static_genotype_1["logLik"][0]:
           maximumlikelihood   = static_genotype_1["logLik"][0]
           mytree = "newick_0001.newick"

        elif maximumlikelihood < static_genotype_2["logLik"][1]:
           maximumlikelihood   = static_genotype_2["logLik"][1]
           mytree = "newick_0002.newick"

        elif maximumlikelihood < static_genotype_3["logLik"][2]:
           maximumlikelihood   = static_genotype_3["logLik"][2]
           mytree = "newick_0003.newick"

        elif maximumlikelihood < static_genotype_4["logLik"][3]:
           maximumlikelihood   = static_genotype_4["logLik"][3]
           mytree = "newick_0004.newick"

        elif maximumlikelihood < static_genotype_5["logLik"][4]:
           maximumlikelihood   = static_genotype_5["logLik"][4]
           mytree = "newick_0005.newick"

        elif maximumlikelihood < static_genotype_6["logLik"][5]:
           maximumlikelihood   = static_genotype_6["logLik"][5]
           mytree = "newick_0006.newick"


        tree_path = datadir+'tree/model/'+mytree
        f = open(tree_path)
        my_tree = str(f.read())



        result = {
            'phylogenetic_result': my_tree,
            'number_of_sample': len(sampel_data),
            'likelihood': score["likelihood"],
            'passimory': score["passimory"],
            'static_genotype_1' : static_genotype_1,
            'static_genotype_2' : static_genotype_2,
            'static_genotype_3' : static_genotype_3,
            'static_genotype_4' : static_genotype_4, 
            'static_genotype_5' : static_genotype_5,
            'static_genotype_6' : static_genotype_6,
            'static_sequence' : static_sequence,
            'running_time' : running_time,
            'phangorn_upgma' : phangorn_upgma,
            'no_of_variants' : no_of_variants,
            'Repeat_nni' : Repeat_nni
        }

        # cd V2/VCFToPhylogenetic/
        # conda activate divbrowse_dev
        # export FLASK_APP=vcftophylogenetic.server
        # flask run --port=8090
        # set FLASK_APP=divbrowse.server

        print(result)
        return jsonify(result)



    @app.route("/chromosomes", methods = ['GET', 'POST', 'OPTIONS'])
    def __chromosomes():
        return jsonify(gd.list_of_chromosomes)


    @app.route("/samples", methods = ['GET', 'POST', 'OPTIONS'])
    def __samples():
        return jsonify(gd.samples.tolist())


    @app.route("/genes", methods = ['GET', 'POST', 'OPTIONS'])
    def __genes():
        r = Response(response=ad.genes_list_json_dumped, status=200, mimetype="application/json")
        r.headers["Content-Type"] = "application/json; charset=utf-8"
        return r
        


    @app.route("/", methods = ['GET', 'POST', 'OPTIONS'])
    def __home():
        return 'VCFToPhylogenetic server is running'

    # inner psutil function

    def process_memory():
        process = psutil.Process(os.getpid())
        mem_info = process.memory_info()
        return mem_info.rss


    @app.errorhandler(ApiError)
    def handle_api_error(error):
        response = jsonify(error.to_dict())
        response.status_code = error.status_code
        return response



    @app.after_request
    def after_request(response):
        header = response.headers
        header['Access-Control-Allow-Origin'] = '*'
        header['Access-Control-Allow-Headers'] = 'Accept, Accept-CH, Accept-Charset, Accept-Datetime, Accept-Encoding, Accept-Ext, Accept-Features, Accept-Language, Accept-Params, Accept-Ranges, Access-Control-Allow-Credentials, Access-Control-Allow-Headers, Access-Control-Allow-Methods, Access-Control-Allow-Origin, Access-Control-Expose-Headers, Access-Control-Max-Age, Access-Control-Request-Headers, Access-Control-Request-Method, Age, Allow, Alternates, Authentication-Info, Authorization, C-Ext, C-Man, C-Opt, C-PEP, C-PEP-Info, CONNECT, Cache-Control, Compliance, Connection, Content-Base, Content-Disposition, Content-Encoding, Content-ID, Content-Language, Content-Length, Content-Location, Content-MD5, Content-Range, Content-Script-Type, Content-Security-Policy, Content-Style-Type, Content-Transfer-Encoding, Content-Type, Content-Version, Cookie, Cost, DAV, DELETE, DNT, DPR, Date, Default-Style, Delta-Base, Depth, Derived-From, Destination, Differential-ID, Digest, ETag, Expect, Expires, Ext, From, GET, GetProfile, HEAD, HTTP-date, Host, IM, If, If-Match, If-Modified-Since, If-None-Match, If-Range, If-Unmodified-Since, Keep-Alive, Label, Last-Event-ID, Last-Modified, Link, Location, Lock-Token, MIME-Version, Man, Max-Forwards, Media-Range, Message-ID, Meter, Negotiate, Non-Compliance, OPTION, OPTIONS, OWS, Opt, Optional, Ordering-Type, Origin, Overwrite, P3P, PEP, PICS-Label, POST, PUT, Pep-Info, Permanent, Position, Pragma, ProfileObject, Protocol, Protocol-Query, Protocol-Request, Proxy-Authenticate, Proxy-Authentication-Info, Proxy-Authorization, Proxy-Features, Proxy-Instruction, Public, RWS, Range, Referer, Refresh, Resolution-Hint, Resolver-Location, Retry-After, Safe, Sec-Websocket-Extensions, Sec-Websocket-Key, Sec-Websocket-Origin, Sec-Websocket-Protocol, Sec-Websocket-Version, Security-Scheme, Server, Set-Cookie, Set-Cookie2, SetProfile, SoapAction, Status, Status-URI, Strict-Transport-Security, SubOK, Subst, Surrogate-Capability, Surrogate-Control, TCN, TE, TRACE, Timeout, Title, Trailer, Transfer-Encoding, UA-Color, UA-Media, UA-Pixels, UA-Resolution, UA-Windowpixels, URI, Upgrade, User-Agent, Variant-Vary, Vary, Version, Via, Viewport-Width, WWW-Authenticate, Want-Digest, Warning, Width, X-Content-Duration, X-Content-Security-Policy, X-Content-Type-Options, X-CustomHeader, X-DNSPrefetch-Control, X-Forwarded-For, X-Forwarded-Port, X-Forwarded-Proto, X-Frame-Options, X-Modified, X-OTHER, X-PING, X-PINGOTHER, X-Powered-By, X-Requested-With'
        return response




    
    return app


class NumpyEncoder(json.JSONEncoder):
    """ Special json encoder for numpy types """
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)