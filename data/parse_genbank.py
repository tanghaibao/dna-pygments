#!/usr/bin/env python
# -*- coding: UTF-8 -*-

"""
%prog filename.gb

generates filename.fasta with the sequence and filename.bed with feature locs and annotations.
"""

import os.path as op
import sys
from Bio import SeqIO 


def main(filename):
    rec = SeqIO.parse(filename, "gb").next()

    filename_prefix, filename_ext = op.splitext(filename)
    fasta_file = file(filename_prefix + ".fasta", "w")
    bed_file = file(filename_prefix + ".bed", "w")

    print >>fasta_file, ">%s\n%s" % (rec.name, rec.seq)
    for feat in rec.features:
        start, end = feat.location.start.position, feat.location.end.position
        seqtype = feat.type
        print >>bed_file, "\t".join(str(x) for x in (rec.name, start, end, seqtype))


if __name__ == '__main__':
    main(sys.argv[1])
