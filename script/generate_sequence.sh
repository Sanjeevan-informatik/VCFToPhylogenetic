: '
myArray=(
"BRIDGE_WGS_HOR_2237"
"BRIDGE_WGS_HOR_3187"
"BRIDGE_WGS_HOR_3460"
"BRIDGE_WGS_HOR_10004"
"BRIDGE_WGS_HOR_10041"
"BRIDGE_WGS_HOR_1020"
"BRIDGE_WGS_HOR_1044"
"BRIDGE_WGS_HOR_10478"
"BRIDGE_WGS_HOR_1048"
"BRIDGE_WGS_HOR_1071"
"BRIDGE_WGS_HOR_10725"
"BRIDGE_WGS_HOR_1080"
"BRIDGE_WGS_HOR_11083"
"BRIDGE_WGS_HOR_11101"
"BRIDGE_WGS_HOR_11183"
"BRIDGE_WGS_HOR_11662"
"BRIDGE_WGS_HOR_11875"
"BRIDGE_WGS_HOR_11922"
"BRIDGE_WGS_HOR_12072"
"BRIDGE_WGS_HOR_12168"
"BRIDGE_WGS_HOR_12171"
"BRIDGE_WGS_HOR_12184"
"BRIDGE_WGS_HOR_12311"
"BRIDGE_WGS_HOR_12367"
"BRIDGE_WGS_HOR_1251"
 )


myArray=(
"BRIDGE_WGS_HOR_2237"
"BRIDGE_WGS_HOR_3187"
"BRIDGE_WGS_HOR_3460"
"BRIDGE_WGS_HOR_10004"
 )
'

Dir="$1"; 
fasta_file="$2"; 
vcf_file="$3"; 
chromosome="$4"; 
start="$5"; 
end="$6"; 
type="$7"; 
sample_list=${@: 8};  


subdir="temp/"

input_fasta_file=$Dir$fasta_file
input_vcf_file=$Dir$vcf_file
out_path=$Dir$subdir


bcftools index  $input_vcf_file 

for i in  $sample_list; do
  echo $i
    variablename=$i
    vcffile="${variablename}.vcf"
    vcffile_gz="${variablename}.vcf.gz"
    vcffile_gz_csi="${variablename}.vcf.gz.csi"
    consensus="${variablename}.fa"
    #bcftools view -s $variablename $input_vcf_file > $vcffile

    bcftools view -r $chromosome:$start-$end -s $variablename  $input_vcf_file > $vcffile

    echo $chromosome

    bgzip -c  $vcffile  > $vcffile_gz
    bcftools index  $vcffile_gz

    echo $chromosome
    
    samtools faidx $input_fasta_file $chromosome:$start-$end | bcftools consensus --haplotype $type $vcffile_gz > $out_path$consensus


    # Check the file is exists or not
    if [ -f $vcffile ]; then
    rm $vcffile
    echo "$vcffile is removed"
    fi

    # Check the file is exists or not
    if [ -f $vcffile_gz ]; then
    rm $vcffile_gz
    echo "$vcffile_gz is removed"
    fi

    # Check the file is exists or not
    if [ -f $vcffile_gz_csi ]; then
    rm $vcffile_gz_csi
    echo "$vcffile_gz_csi is removed"
    fi

done
 



function fasta_to_phylip {
python - <<END
import glob
import sys
from Bio import SeqIO
import os
fasta_dir ="/opt/home/arumuham/V2/VCFToPhylogenetic/data/my_data/"
infile = fasta_dir+"temp/*.fa"
all_fasta_file = fasta_dir+"output.fasta"
phyfile = fasta_dir+"phyfile.fasta"

read_files = glob.glob(infile)

with open(all_fasta_file, "w") as outfile:
    for f in read_files:
        file_name = os.path.basename(f)
        myfile = os.path.splitext(file_name)[0]
        print(myfile)
        with open(f, "r") as infile:
            outfile.write(">" + myfile +"\n")

            next(infile)
            outfile.write(infile.read())

sequence_list = [] # To keep order of sequence
sequence_dict = {}
for record in SeqIO.parse(open(all_fasta_file, "r"), "fasta"):
    sequence_list.append(record.id)
    sequence_dict[record.id] = str(record.seq)

# Test length of the alignment:
alignment_length = 0
for gene in sequence_dict:
    if (alignment_length != 0) and (len(sequence_dict[gene]) != alignment_length):
        print ("Error in alignment length, exit on error !!!")
        sys.exit()
    else:
        alignment_length = len(sequence_dict[gene])

number_of_seq = len(sequence_dict)

longest_id = sorted(sequence_dict.keys())[-1]

# Write alignment in Phylip format
phyfile = open(phyfile, "w")
phyfile.write(str(number_of_seq)+" "+str(alignment_length)+"\n")

for gene in sequence_list:
    phyfile.write(gene.ljust(len(longest_id), ' ') + "   " + sequence_dict[gene] + "\n")
phyfile.close()

END
}

# Call it
fasta_to_phylip

