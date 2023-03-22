<script>

    import { getContext, onMount } from 'svelte';
    const context = getContext('app');
    
    import { Datatable, PaginationButtons, PaginationRowCount } from 'svelte-simple-datatables';
    let rows;
    import { parse } from "/utils/newick.js";
    import { Draw_Phylo } from "/utils/phylogenetic_tree.js";
    import axios from 'axios';
    import DataFrame from 'dataframe-js';
    
    let result
    let static_genotype_1
    let static_genotype_2
    let static_genotype_3
    let static_genotype_4
    let static_genotype_5
    let static_genotype_6
    let static_sequence
    let phangorn_upgma
    let no_of_variants
    let static_vcf_data
    let Repeat_nni
    let _dataframe
    let samples =null 
    let likelihood  = []
    let passimory = []
    let running_time =[]
    let start
    let end
    let selectElement
    let consensus
    let data_file
    let NNI
    let subs_model
    let opt_param
    let chromosomes = [] 
    let chromosome =null
    let select_chromosome
    onMount(async () => {
    
            let url_genes = 'http://127.0.0.1:8090'+'/genes';
            axios.get(url_genes).then(response => {
    
                _dataframe = new DataFrame(response.data.genes.data, response.data.genes.columns);
                result = _dataframe.toCollection();
    
            })
            .catch(error => {
                console.log(error);
                this.raiseError('Error: Could not load genes data from the server / backend.')
            });
    
            let url_samples = 'http://127.0.0.1:8090'+'/samples';
            axios.get(url_samples).then(response => {
    
            samples = response.data;
    
            })
            .catch(error => {
            console.log(error);
            this.raiseError('Error: Could not load genes data from the server / backend.')
            });
    
    
            let url_chromosomes = 'http://127.0.0.1:8090'+'/chromosomes';
                axios.get(url_chromosomes).then(response => {
        
    
                chromosomes = response.data
    
                select_chromosome = response.data[0]
    
                console.log(chromosomes)
                console.log(select_chromosome)
    
    
    
                console.log(response.data[0]["end"]);
                console.log(response.data[0]["start"]);
    
                start = response.data[0]["start"]
        
                end = response.data[0]["end"]
        
                })
                .catch(error => {
                console.log(error);
                this.raiseError('Error: Could not load genes data from the server / backend.')
            });
    
    
            let url_configuration = 'http://127.0.0.1:8090'+'/configuration';
            axios.get(url_configuration).then(response => {
    
    
    
    
            })
            .catch(error => {
            console.log(error);
            this.raiseError('Error: Could not load genes data from the server / backend.')
            });
    
      
    });
    
    const datatableSettings = {
        sortable: true,
        pagination: true,
        rowsPerPage: 10,
        columnFilter: false,
        scrollY: false,
        css: false,
        blocks: {
            searchInput: false, 
            paginationButtons: false,
            paginationRowCount: false,
        }
    }
    
    
    function change_chromosome(){
        console.log(select_chromosome)
        start = select_chromosome["start"]
        end = select_chromosome["end"]
    }
    function calc(chrom, startpos , endpos) {
        let _result = null;
        let params = {
            startpos: 0,
            endpos: 200,
        }
    
        params['startpos'] = parseInt(startpos);
        params['endpos'] =   parseInt(endpos);
    
        selectElement = document.querySelector('#consensus');
        consensus = selectElement.value;
    
        selectElement = document.querySelector('#data_file');
        data_file = selectElement.value;
    
        selectElement = document.querySelector('#nni');
        NNI = selectElement.value;
        console.log(NNI)
    
        selectElement = document.querySelector('#subs_model');
        subs_model = selectElement.value;
    
        selectElement = document.querySelector('#opt_param');
        opt_param = selectElement.value;
    
        let highlighted_sample = [];
    

    
        console.log("chrom id", chrom)
        console.log("samples.length", samples.length)
    
            let payload = {
                chrom: chrom,
                startpos: params['startpos'],
                endpos: params['endpos'],
                samples: samples,
                number_of_sample:  samples.length,
                consensus: consensus,
                data_file: data_file,
                nni: NNI,
                subs_model: subs_model,
                opt_param: opt_param,
    
            };
    
            let url = 'http://127.0.0.1:8090'+'/phylo_cluster';
            axios.post(url, payload).then(response => {
                
    
                _result = response.data;
    
                likelihood = _result.likelihood
                passimory = _result.passimory
                static_genotype_1 = _result.static_genotype_1
                static_genotype_2 = _result.static_genotype_2
                static_genotype_3 = _result.static_genotype_3
                static_genotype_4 = _result.static_genotype_4
                static_genotype_5 = _result.static_genotype_5
                static_genotype_6 = _result.static_genotype_6
                static_genotype_6 = _result.static_sequence
                running_time = _result.running_time
                phangorn_upgma = _result.phangorn_upgma
                static_vcf_data = _result.static_vcf_data
                no_of_variants = _result.no_of_variants
                Repeat_nni = _result.Repeat_nni
                
    
    
                console.log(_result.static_genotype_1["Model"][0])
                console.log(_result.static_genotype_1["Model"].length)
    
    
    
        
    
                var newick  = parse(_result.phylogenetic_result)
    
                console.log(newick)
    
                console.log(_result.phylogenetic_result)
    
                var my_width = _result.number_of_sample * 20
    
                var my_height = _result.number_of_sample * 40
    
                const myNode = document.getElementById("phylogenetic_graph");
                myNode.textContent = '';
    
                Draw_Phylo('#phylogenetic_graph', newick, {
                    width: my_width,
                    height: my_height,
                    select_element: highlighted_sample
                });
    
    
    
    
    
            })
            .catch(error => {
                console.log(error);
             
                //self.raiseError('Error: Could not load any data from the server / backend.')
            });
    
    
    }
    
    function highlighted_sample_list(data) {      
            if (highlighted_sample.indexOf(data) > -1 == true ) {
    
                console.log("exit")
            } else {  
                console.log(data);
                highlighted_sample.push(data);
                const my_id  = 're' + ' ' + data
                document.getElementById("highlighted_samples").innerHTML+= '<button   id='+ my_id +'  type="button" class="divbrowse-btn divbrowse-btn-light" style="float: left; margin: 0px 5px 7px 0px; " >'+ data +'</button>'
                console.log(highlighted_sample)
    
    
            } 
        }
    
    </script> 
    
    <div>
     
    <div style="min-height: 600px;">
    
        {#if result !== null}
        <div class="box" style="margin-top:15px; background: rgb(242,242,242); border-radius: 8px; padding: 10px;">
            <!--<h3 style="font-weight:bold;margin-bottom:20px;font-size:1.1rem;padding:0;margin-top:0px;">Search result</h3>-->
    
            <div style="height:400px;">
            <Datatable settings={datatableSettings} data={result} bind:dataRows={rows} id={'datatable-genes'}>
                <thead>
                    <th data-key="id">ID</th>
                    <th data-key="type">Type</th>
                    <th data-key="description">Description</th>
                    <th data-key="seqid">Chromosome</th>
                    <th data-key="start">Start position</th>
                    <th data-key="end">End position</th>
    
                    <th></th>
                </thead>
                <tbody>
                    {#if rows}
                    {#each $rows as row}
                    <tr>
                        <td class="id" style="width:230px;">{row.ID}</td>
                        <td class="desc" style="width:80px;">{row.type}</td>
                        <td class="desc" style="width:330px;">{row.description}</td>
                        <td class="centered">{row.seqid}</td>
                        <td class="centered">{row.start}</td>
                        <td class="centered">{row.end}</td>
                        
    
    
                        <td><a href="#" on:click|preventDefault={ () =>  calc(chromosomes[row.seqid.match(/\d/g).join("")-1]["id"], row.start , row.end) }>show</a></td>
                    </tr>
                    {/each}
                    {/if}
                </tbody>
            </Datatable>
            </div>
    
            <div class="clearfix">
            {#if $rows}
                <PaginationButtons id={'datatable-genes'}/>
                <PaginationRowCount id={'datatable-genes'}/>
            {/if}
            </div>
            
        </div>
        {/if}
    
    </div>
    
    
        
    <div class='context1'>
    
        <select bind:value={select_chromosome} on:change={change_chromosome} >
            {#each chromosomes as chromosome}
                <option value={chromosome} >
                    {chromosome.id}
                </option>
            {/each}
        </select>
    
    
        <label> starting postion</label> <input  name="startpos"  bind:value="{start}" />
        <label> end postion</label> <input  name="endpos"  bind:value="{end}" />
    
        <td><a href="#" on:click|preventDefault={ () =>  calc(select_chromosome["id"], start , end) }>show</a></td>
    
    </div>
    
    
    
        <div>
            <label for="data_file">select the data file:</label>
    
            <select name="data_file" id="data_file">
              <option value="VCF_file_only">VCF file only (SNP)</option>
              <option value="Entire sequence">Entire sequence</option>
            </select>
        </div>
    
    
        <div>
            <label for="consensus ">select the alles:</label>
    
            <select name="consensus " id="consensus">
              <option value="I">IUPAC code for all genotypes</option>
              <option value="R">the first allele</option>
              <option value="A">the second allele</option>
            </select>
        </div>
    
    
        <div>
            <label for="nni ">Nearest Neighbour Interchange:</label>
    
            <select name="nni " id="nni">
            <option value="no">False</option>
            <option value="yes">True</option>
    
            </select>
        </div>
    
    
        <div>
            <label for="nni ">optimization parameters(NNI):</label>
    
            <select name="opt_param " id="opt_param">
            <option value="parsimony">parsimony </option>
            <option value="maximum_likelihood">maximum likelihood</option>
    
            </select>
        </div>
    
    
        <div>
            <label for="nni ">substitution model:</label>
    
            <select name="subs_model " id="subs_model">
            <option value="JC">Jukes and Cantor (1969)</option>
            <option value="K80">Kimura (1980)</option>
    
            </select>
        </div>
    
    
        <div>
            <p>Number oF Variants  : {no_of_variants}</p>
        </div>
    
    
    
        {#if static_genotype_1 != null }
    
    
        <div class="phylogenetic_score box" style="margin-top:15px; background: rgb(242,242,242); border-radius: 8px; padding: 10px;">
            <h3>genotype based phylogenetic statistics(single-linkage clustering)</h3>
            <p>passimory : {passimory[0]}</p>
            <p>running time : {running_time['genotype']} sec. </p>
    
            {#if NNI == "yes" }
                 <p>Repeated NNI : {Repeat_nni['single']} </p> 
            {/if}
    
            
            <table >
                <thead>
                    <th data-key="Model">Model</th>
                    <th data-key="Model">logLik</th>
                    <th data-key="Model">AIC</th>
                    <th data-key="Model">BIC</th>
                </thead>
    
                <tbody>
                 
                    {#each Array(static_genotype_1["Model"].length) as _, index (index)}
                    <tr style="border-color: black;">
                        <td class="id" style="width:230px;">{static_genotype_1["Model"][index]}</td> 
                        <td class="id" style="width:230px;">{static_genotype_1["logLik"][index]}</td> 
                        <td class="id" style="width:230px;">{static_genotype_1["AIC"][index]}</td> 
                        <td class="id" style="width:230px;">{static_genotype_1["BIC"][index]}</td> 
                            
                    </tr>
                    {/each}
    
                </tbody>
    
            </table>
    
    
        </div>
        {/if}
    
    
        {#if static_genotype_2 != null }
    
        <div class="phylogenetic_score box" style="margin-top:15px; background: rgb(242,242,242); border-radius: 8px; padding: 10px;">
            <h3>genotype based phylogenetic statistics(complete-linkage clustering)</h3>
            <p>passimory : {passimory[1]}</p>
    
            {#if NNI == "yes" }
            <p>Repeated NNI : {Repeat_nni['single']} </p> 
            {/if}
    
            <table >
                <thead>
                    <th data-key="Model">Model</th>
                    <th data-key="Model">logLik</th>
                    <th data-key="Model">AIC</th>
                    <th data-key="Model">BIC</th>
                </thead>
    
                <tbody>
                 
                    {#each Array(static_genotype_2["Model"].length) as _, index (index)}
                    <tr style="border-color: black;">
                        <td class="id" style="width:230px;">{static_genotype_2["Model"][index]}</td> 
                        <td class="id" style="width:230px;">{static_genotype_2["logLik"][index]}</td> 
                        <td class="id" style="width:230px;">{static_genotype_2["AIC"][index]}</td> 
                        <td class="id" style="width:230px;">{static_genotype_2["BIC"][index]}</td> 
                            
                    </tr>
                    {/each}
    
                </tbody>
    
            </table>
    
    
        </div>
        {/if}
    
    
        {#if static_genotype_3 != null }
    
    
        <div class="phylogenetic_score box" style="margin-top:15px; background: rgb(242,242,242); border-radius: 8px; padding: 10px;">
            <h3>genotype based phylogenetic statistics(average-linkage clustering)</h3>
            <p>passimory : {passimory[2]}</p>
    
    
            {#if NNI == "yes" }
            <p>Repeated NNI : {Repeat_nni['single']} </p> 
            {/if}
    
            <table >
                <thead>
                    <th data-key="Model">Model</th>
                    <th data-key="Model">logLik</th>
                    <th data-key="Model">AIC</th>
                    <th data-key="Model">BIC</th>
                </thead>
    
                <tbody>
                 
                    {#each Array(static_genotype_3["Model"].length) as _, index (index)}
                    <tr style="border-color: black;">
                        <td class="id" style="width:230px;">{static_genotype_3["Model"][index]}</td> 
                        <td class="id" style="width:230px;">{static_genotype_3["logLik"][index]}</td> 
                        <td class="id" style="width:230px;">{static_genotype_3["AIC"][index]}</td> 
                        <td class="id" style="width:230px;">{static_genotype_3["BIC"][index]}</td> 
                            
                    </tr>
                    {/each}
                </tbody>
            </table>
    
        </div>
        {/if}
    
    
        {#if static_genotype_4 != null }
    
        <div class="phylogenetic_score box" style="margin-top:15px; background: rgb(242,242,242); border-radius: 8px; padding: 10px;">
            <h3>genotype based phylogenetic statistics(centroid-linkage clustering)</h3>
            <p>passimory : {passimory[3]}</p>
    
            {#if NNI == "yes" }
            <p>Repeated NNI : {Repeat_nni['single']} </p> 
            {/if}
    
            <table >
                <thead>
                    <th data-key="Model">Model</th>
                    <th data-key="Model">logLik</th>
                    <th data-key="Model">AIC</th>
                    <th data-key="Model">BIC</th>
                </thead>
    
                <tbody>
                 
                    {#each Array(static_genotype_4["Model"].length) as _, index (index)}
                    <tr style="border-color: black;">
                        <td class="id" style="width:230px;">{static_genotype_4["Model"][index]}</td> 
                        <td class="id" style="width:230px;">{static_genotype_4["logLik"][index]}</td> 
                        <td class="id" style="width:230px;">{static_genotype_4["AIC"][index]}</td> 
                        <td class="id" style="width:230px;">{static_genotype_4["BIC"][index]}</td> 
                            
                    </tr>
                    {/each}
    
                </tbody>
    
            </table>
    
    
        </div>
        {/if}
    
    
        {#if static_genotype_5 != null }
    
        {#if NNI == "yes" }
        <p>Repeated NNI : {Repeat_nni['single']} </p> 
        {/if}
    
    
        <div class="phylogenetic_score box" style="margin-top:15px; background: rgb(242,242,242); border-radius: 8px; padding: 10px;">
            <h3>genotype based phylogenetic statistics(median-linkage clustering)</h3>
            <p>passimory : {passimory[4]}</p>
            
            <table >
                <thead>
                    <th data-key="Model">Model</th>
                    <th data-key="Model">logLik</th>
                    <th data-key="Model">AIC</th>
                    <th data-key="Model">BIC</th>
                </thead>
    
                <tbody>
                 
                    {#each Array(static_genotype_5["Model"].length) as _, index (index)}
                    <tr style="border-color: black;">
                        <td class="id" style="width:230px;">{static_genotype_5["Model"][index]}</td> 
                        <td class="id" style="width:230px;">{static_genotype_5["logLik"][index]}</td> 
                        <td class="id" style="width:230px;">{static_genotype_5["AIC"][index]}</td> 
                        <td class="id" style="width:230px;">{static_genotype_5["BIC"][index]}</td> 
                            
                    </tr>
                    {/each}
    
                </tbody>
    
            </table>
    
    
        </div>
        {/if}
    
    
        {#if static_genotype_6 != null }
    
        {#if NNI == "yes" }
        <p>Repeated NNI : {Repeat_nni['single']} </p> 
        {/if}
    
    
        <div class="phylogenetic_score box" style="margin-top:15px; background: rgb(242,242,242); border-radius: 8px; padding: 10px;">
            <h3>genotype based phylogenetic statistics(ward-linkage clustering)</h3>
            <p>passimory: {passimory[5]}</p>
            <table >
                <thead>
                    <th data-key="Model">Model</th>
                    <th data-key="Model">logLik</th>
                    <th data-key="Model">AIC</th>
                    <th data-key="Model">BIC</th>
                </thead>
    
                <tbody>
                 
                    {#each Array(static_genotype_6["Model"].length) as _, index (index)}
                    <tr style="border-color: black;">
                        <td class="id" style="width:230px;">{static_genotype_6["Model"][index]}</td> 
                        <td class="id" style="width:230px;">{static_genotype_6["logLik"][index]}</td> 
                        <td class="id" style="width:230px;">{static_genotype_6["AIC"][index]}</td> 
                        <td class="id" style="width:230px;">{static_genotype_6["BIC"][index]}</td> 
                            
                    </tr>
                    {/each}
    
                </tbody>
    
            </table>
    
    
        </div>
        {/if}
    
        {#if static_sequence != null }
    
        {#if NNI == "yes" }
        <p>Repeated NNI : {Repeat_nni['single']} </p> 
        {/if}
    
    
        <div class="phylogenetic_score box" style="margin-top:15px; background: rgb(242,242,242); border-radius: 8px; padding: 10px;">
            <h3>sequence based phylogenetic statistics</h3>
            <p>passimory : {passimory[6]}</p>
            <p>running time : {running_time['sequencetype']} sec. </p>
            <table >
                <thead>
                    <th data-key="Model">Model</th>
                    <th data-key="Model">logLik</th>
                    <th data-key="Model">AIC</th>
                    <th data-key="Model">BIC</th>
                </thead>
    
                <tbody>
                 
                    {#each Array(static_sequence["Model"].length) as _, index (index)}
                    <tr style="border-color: black;">
                        <td class="id" style="width:230px;">{static_sequence["Model"][index]}</td> 
                        <td class="id" style="width:230px;">{static_sequence["logLik"][index]}</td> 
                        <td class="id" style="width:230px;">{static_sequence["AIC"][index]}</td> 
                        <td class="id" style="width:230px;">{static_sequence["BIC"][index]}</td> 
                            
                    </tr>
                    {/each}
    
                </tbody>
    
            </table>
    
    
        </div>
        {/if}
    
    
        {#if phangorn_upgma != null }
    
    
        <div class="phylogenetic_score box" style="margin-top:15px; background: rgb(242,242,242); border-radius: 8px; padding: 10px;">
            <h3>sequence based phylogenetic statistics(library(phangorn) )</h3>
            <p>passimory : {passimory[7]}</p>
            <p>running time : {running_time['phangorn']} sec. </p>
    
            {#if NNI == "yes" }
            <p>Repeated NNI : {Repeat_nni['single']} </p> 
            {/if}
           
            <table >
                <thead>
                    <th data-key="Model">Model</th>
                    <th data-key="Model">logLik</th>
                    <th data-key="Model">AIC</th>
                    <th data-key="Model">BIC</th>
                </thead>
    
                <tbody>
                 
                    {#each Array(phangorn_upgma["Model"].length) as _, index (index)}
                    <tr style="border-color: black;">
                        <td class="id" style="width:230px;">{phangorn_upgma["Model"][index]}</td> 
                        <td class="id" style="width:230px;">{phangorn_upgma["logLik"][index]}</td> 
                        <td class="id" style="width:230px;">{phangorn_upgma["AIC"][index]}</td> 
                        <td class="id" style="width:230px;">{phangorn_upgma["BIC"][index]}</td> 
                            
                    </tr>
                    {/each}
    
                </tbody>
    
            </table>
    
    
        </div>
        {/if}
    
    
    
        
    
    
    
        <div id="phylogenetic_graph">
        </div>
    </div>
    
    <style>
    
    
    .phylogenetic_score {
    
    width: 800px;
    border: 15px solid rgb(235, 228, 228);
    padding: 50px;
    margin: 20px;
    
    }
    
    .phylogenetic_score  td {
        
        border-bottom: 1px solid rgb(158, 148, 148);
    }
    
    
    .context1 {
    
        margin-top:-120px;
    }
    
    
    
    
    .centered {
        text-align: center;
    }
    
    
    
    :global(section.dt-pagination) {
        font-size: 0.85rem;
        padding-top: 20px !important;
    }
    
    :global(section.dt-pagination-buttons) {
        float: right;
    }
    
    :global(section.dt-pagination-buttons button) {
        padding: 3px 14px 3px 14px;
        background: white;
        border: 1px solid rgb(90,90,90);
        line-height: 0.8rem !important;
    }
    
    :global(section.dt-pagination-buttons button.active) {
        background: rgb(200,200,200);
    }
    
    :global(.dt-pagination-rowcount) {
        float: left;
        font-size: 0.85rem;
        padding-top: 5px;
    }
    
    
    
    :global(section.datatable table) {
        border-collapse: collapse;
        width: 99%;
        font-size: 0.8rem;
    }
    
    :global(section.datatable table th) {
        font-size: 0.80rem;
        padding: 3px 15px 3px 15px;
    }
    
    :global(section.datatable table td) {
        font-size: 0.80rem;
        border-top: 1px solid rgb(120,120,120);
        border-bottom: 1px solid rgb(120, 120, 120);
        padding: 5px 10px 5px 10px;
    }
    
    :global(section.datatable table tr:hover td) {
        background: white;
    }
    
    :global(section.datatable table td.id) {
        width: 230px;
    }
    
    :global(section.datatable table td.desc) {
        width: 450px;
    }
    
    </style>