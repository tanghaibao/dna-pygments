Javascript bio-sequence highlighter
-------------------------------------

Introduction
=============
This is a lightweight javascript solution to highlight parts of the bio-sequence (DNA or protein, often in FASTA format), based on intervals (in BED format). See a working demo `here <http://biocon.berkeley.edu/~bao/dna-pygments/>`_.

.. image:: http://lh4.ggpht.com/_srvRoIok9Xs/TDzJtuTV8gI/AAAAAAAAA-A/EOe73EAugRg/s800/t.png
    :alt: demo

Usage
======
The ``data/`` folder contains a working example from converting Genbank file (``.gb``) to the required ``.fasta`` and ``.bed`` files. The demo page above loads the two required files and does the highlight accordingly - based on the styles pre-defined in a ``.css`` file.

Known issues
=============
- many feature types are nested, but often start at the same location. For example, the ``exon`` is a child of ``gene``. Currently the hierarchy of features are not modeled, resulting in errors depending on which tag gets inserted first.

