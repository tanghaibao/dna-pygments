
$(function() {
    $("button, input").button();
    $("button:submit").button({icons: {primary: "ui-icon-refresh"}});
    $('#check').toggle(function(){
        $('#html_src').show();
        }, function() {
        $('#html_src').hide();
    });
    // add demo data
    $.ajax({
        url: "data/sample.fasta",
        success: function(data) { 
            $('#fasta').val(data); 
            $.ajax({
                url: "data/sample.bed",
                success: function(data) { $('#bed').val(data); run(); }
                });
            }
        });

});

function clear() {
    $('#features').html("");
    $('#features').hide();

    $('#display').html("");
    $('#display').hide();
}

function run() {
    var fasta = $('#fasta').val();
    var bed = $('#bed').val();
    clear();

    // the Pygments object
    var p = new Pygments(fasta, bed);

    // jquery-ui
    $('#features').buttonset();
    $('#features').fadeIn();

    // formatting the sequences
    $('#display').html(p.print()).fadeIn();
    $('#html_src').text(p.print());

    // legend
    $('#legend').html(p.print_legend());
}

