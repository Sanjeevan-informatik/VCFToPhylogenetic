<script>
    import { onMount, setContext, getContext } from 'svelte';
    //import Plotly from 'plotly.js-dist';   
    import PhylogeneticDetails from '/components/vcftophylogenetic.svelte';
    
    onMount(async () => {
       console.log('DivBrowse App mounted!');

       let script = document.createElement('script');
       script.src = "http://d3js.org/d3.v3.min.js" // TODO: manage this via NPM dependency
       document.head.append(script);
    
    });

    </script>

    <div>
             <PhylogeneticDetails /> 
    </div>

<style lang="less">



</style>