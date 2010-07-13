var DEFAULTS = {
    CHAR_PER_LINE: 60
};

function Pygments (fasta, bed) {
    this.str = fasta; // the final output
    this.data = {}; // dictionary of name:fasta
    this.feats = []; // array of bed objects
    this.types = []; // unique feature types

    this.parse_fasta(fasta);
    this.parse_bed(bed);

    for (var name in this.data) {
        var seq = this.data[name];
        this.data[name] = this.linebreak(seq);
    }

    for (var i in this.feats) {
        var o = this.feats[i];
        var name = o.name;
        var start = o.start;
        var end = o.end;
        var seqtype = o.seqtype;
        var seq = this.data[name];

        this.data[name] = this.decorate(seq, start, end, seqtype);
    }
}

Pygments.prototype = {

    add_seq: function(name, seq) {
        if (name!="") this.data[name] = seq.replace(/[^A-Za-z]+/g, '');
    },

    parse_fasta: function(fasta) {

        var rows = fasta.split("\n");
        var name = "", seq = "", i;
        for (i in rows) {
            var row = $.trim(rows[i]);
            if (row[0]=='>') {
                this.add_seq(name, seq);
                name = row.substring(1);
                seq = "";
            }
            else {
                seq += row;
            }
        }
        this.add_seq(name, seq);
    },
    
    parse_bed: function(bed) {

        var str = bed;
        var rows = str.split("\n");
        for (var i in rows) {
            var row = $.trim(rows[i]);
            if (row=="") continue;

            var atoms = row.split("\t");
            var o = {
                name: atoms[0],
                start: parseInt(atoms[1]),
                end: parseInt(atoms[2]),
                seqtype: atoms[3],
            };
            this.feats.push(o);
        }
        
        var types = $.map(this.feats, function(f) {return f.seqtype;});
        this.types = unique(types);
        this.types.sort();
    },

    /* break the sequence so that there are no more than CHAR_PER_LINE chars each row
     */
    linebreak: function(str) {

        var newstr = [], i;
        var row = "";
        for (i=0; i<str.length; i++) {
            row += str[i];

            if (row.length==DEFAULTS.CHAR_PER_LINE) {
                newstr.push(row);
                row = "";
            }
        }
        if (row!="") newstr.push(row);
        return newstr.join("<br />");
    },

    /* highlight specific features
     */
    decorate: function(str, start, end, seqtype) {

        var i, real_index=0;
        var start_tag = "<span class='{spanClass}'>".template({spanClass: seqtype});
        var end_tag = "</span>"

        // find the position of start and end, skipping the existing tags
        var inTag = false;
        var start_i = 0;
        var end_i = str.length;

        for (i=0; i<str.length; i++) {
            var c = str[i];
            if (c=='<') inTag = true;
            else if (c=='>') { inTag = false; continue; }

            if (inTag) continue;
            if (real_index==start) start_i = i;
            else if (real_index==end) end_i = i;
            real_index ++;
        }

        var before_seq = str.substring(0, start_i);
        var feat_seq = str.substring(start_i, end_i);
        var after_seq = str.substring(end_i);

        return [before_seq, start_tag, feat_seq, end_tag, after_seq].join('');
    },

    print: function() {
        var print_array = [];
        for (var name in this.data) {
            var seq = this.data[name];
            print_array.push(">{name}<br / >{seq}".template(
                        {name: name, seq: seq}
                        ));
        }
        return print_array.join("<br />")
    },

    print_legend: function() {

        var legend = "";

        for (var i in this.types) {
            var seqtype = this.types[i];
            var start_tag = "<span class='{spanClass}'>".template({spanClass: seqtype});
            var end_tag = "</span> | "
            legend += [start_tag, seqtype, end_tag].join('');
        }
        return legend;
    },

};

/* Removes redundant elements from the array 
 */
function unique(a) {
    var o = {}, i, r = [];
    for (i=0; i<a.length; i++) o[a[i]] = a[i];
    for (i in o) r.push(o[i]);
    return r;
};

/* string templating function 
 */
String.prototype.template = function (o) { 
    return this.replace(/{([^{}]*)}/g, 
        function (a, b) { 
            var r = o[b]; 
            return typeof r === 'string' || typeof r === 'number' ?  r : a; 
        } 
    ); 
}; 

/* remove html tags 
 */
String.prototype.removetags = function() {
    return this.replace(/(<([^>]+)>)/ig, "");
};

/* wrap string and highlight (jquery version) 
 */
$.fn.highlight = function(what, spanClass) {
    return this.each(function(){
        var container = this,
        content = container.innerHTML,
        pattern = new RegExp('(>[^<.]*)(' + what + ')([^<.]*)','g'),
        replaceWith = '$1<span ' + ( spanClass ? 'class="' + spanClass + '"' : '' ) + '">$2</span>$3',
        highlighted = content.replace(pattern,replaceWith);
        container.innerHTML = highlighted;
    });
};


