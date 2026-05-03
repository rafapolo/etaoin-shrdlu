$(document).ready(function(){
    if($.browser.msie && parseInt($.browser.version<9)){
        alert("Internet Explorer still don't support OpenType fonts. Please, update your browser.");
    }

    if ($("#abc").length>0){
        // view
        $("#editor-text").focus();
        var abcs = "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9 ! ? @ & … « » \" \" [ . : , ] - ( – — ) # * / € £ $ % ™".split(" ");
        $.each(abcs, function(i, s){
            $("#abc").append('<span id="char-'+s+'">'+s+'</span> ');
        });

        var params = new URLSearchParams(window.location.search);
        var shrdlu = params.get('shrdlu');
        if (shrdlu && shrdlu.length>10){
            var etaoin = decodeFromHex(shrdlu);
            var urlParams = new URLSearchParams(etaoin);
            var color = urlParams.get('color');
            var size = urlParams.get('size');
            var text = urlParams.get('text');
            // we got etaoinshrdlu!
            $("#abc").fadeOut(800);
            $("#text").animate({
                marginLeft: 80
            }, 1000, function(){
                $("#abc").remove();
            });
            $("#text").css("color", "#"+color).css("font-size", parseInt(size)).html(text);
            $("#editor-text").val(text);
            $("#colorSelector").css("background-color", "#"+color);
        } else {
            $("span[id^='char-']").mouseenter(function(){
                var symbol = $(this).html();
                $("#editor-text").val(symbol);
                $("#text").html(symbol);
                $(this).css("cursor", "e-resize");
                $(this).click(function(){
                    $("#editor-text").focus();
                });
            });
        }
    }

    // clicks
    $("#editor-text").keyup(function(){
        $("#text").text($("#editor-text").val());
        if ($("#editor-text").val().length>2){
            $("#abc").fadeOut(800);
            $("#text").animate({
                marginLeft: 80
            }, 1000, function(){
                $("#abc").remove();
            });
        }
    });
    $("#editor-plus").click(function(){
        var newsize = parseInt($("#text").css("font-size").replace("px", "")) +10;
        $("#text").css("font-size", newsize );
    });
    $("#editor-minus").click(function(){
        var newsize = parseInt($("#text").css("font-size").replace("px", "")) -10;
        $("#text").css("font-size", newsize);
    });
    $("#editor-save").click(function(){
        var text = $("#editor-text").val();
        var textToSave = trim(text);
        if (textToSave=="") {
            return false
        }
        $(this).val("Saving...");
        text = trim(textToSave.replace('"', ""));
        var color = rgb2hex($("#text").css("color"));
        var size = $("#text").css("font-size").replace("px", "");
        var domain = window.location.origin + window.location.pathname.replace(/[^/]*$/, '');
        var etaoin = "?shrdlu=";
        var shrdlu = encodeToHex("?text="+text+"&color="+color+"&size="+size);
        var fullUrl = domain + "index.html" + etaoin + shrdlu;

        // Copy to clipboard
        if (navigator.clipboard) {
            navigator.clipboard.writeText(fullUrl).then(function() {
                $("#editor-short").fadeIn(1000);
                $("#editor-link").html("<a class='shortLink' href='#' onclick='return false;'>URL copied to clipboard!</a>");
                $("#editor-save").val("Save");
            }).catch(function() {
                $("#editor-short").fadeIn(1000);
                $("#editor-link").html("<a class='shortLink' href='"+fullUrl+"'>"+fullUrl+"</a>");
                $("#editor-save").val("Save");
            });
        } else {
            $("#editor-short").fadeIn(1000);
            $("#editor-link").html("<a class='shortLink' href='"+fullUrl+"'>"+fullUrl+"</a>");
            $("#editor-save").val("Save");
        }
    });
    $(".background").click(function(){
        var newAlign = "justify";
        var actualAlign = $(".background").css("text-align");
        if (actualAlign == "justify"){
            newAlign = "left";
        } else if (actualAlign == "left"){
            newAlign = "center";
        }
        $(".background").css("text-align", newAlign);
    });

});

function get(from, name){
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec(from);
    if( results == null )
        return "";
    else
        return results[1];
}

function rgb2hex(rgb){
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return ""+
    ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[3],10).toString(16)).slice(-2);
}

function trim(str){
    return str==null ? "" : str.replace(/^\s+|\s+$/g,"").replace(/\s+/, " ");
}
function encodeToHex(str){
    var r="";
    var e=str.length;
    var c=0;
    var h;
    while(c<e){
        h=str.charCodeAt(c++).toString(16);
        while(h.length<3) h="0"+h;
        r+=h;
    }
    return r;
}
function decodeFromHex(str){
    var r="";
    var e=str.length;
    var s;
    while(e>=0){
        s=e-3;
        r=String.fromCharCode("0x"+str.substring(s,e))+r;
        e=s;
    }
    return r;
}

function fundirTipos(tipos){
    $(document).ready(function(){
        $.each(tipos, function(i, tipo){
            var id = tipo.toLowerCase();
            $("#tipos").append("<a id='"+id+"' href='font-"+id+"'>"+id.toUpperCase()+"</a>");
            if (tipos.length > i+1){ // not at last
                $("#tipos").append(" / ");
            }
        });

    });
}