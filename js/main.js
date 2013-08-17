$(function(){
  // init the color squares
  $(".page").find("div").each(function(i, el){
    var me               = $(el);
    var colorArray       = me.text().split(" ");
    var colorArrayLength = colorArray.length;
    var title            = me.attr("data-title");
    var markup           = '<h2>' + title + '</h2><hr><ul class="color-list">';
    var index, hex;

    // build the color list markup
    for(index = 0; index < colorArrayLength; ++index){
      hex = colorArray[index].trim();

      if(hex.length > 0){
        markup += '<li title="Click to copy that color" data-clipboard-target="' + hex + '"><span id="' + hex + '">' + hex + '</span></li>';
      }
    }

    markup += '</ul>';

    me.html(markup);
  });



  // set background and foreground color
  $(".color-list").find("li").each(function(index, el){
    var me       = $(el);
    var bgColor  = me.text();
    var colorSum = rgbSum(hexToRgb(bgColor));

    me.css("backgroundColor", bgColor);

    // if background color is to dark, plz use white as foreground color
    if(colorSum <= 300){
      me.css("color", "#fff");
    }
  });



  // sort colors inside a list
  $(".page").find(".color-list").each(function(index, el){
    var list = $(el);
    var listItems, curItem, beforeItem;

    // do sort
    list.find("li").sort(sortColors).prependTo(list);
  });


  // copy to clipboard
  var items = $(".color-list").find("li");
  var clip = new ZeroClipboard( items, {
    moviePath: "ZeroClipboard.swf"
  });

  // copy feedback
  clip.on( 'complete', function(client, args) {
    var me = $(this);
    me.addClass("copied");
    setTimeout(function(){
      me.removeClass("copied")
    }, 200);
  });

  // helpers
  function sortColors(a, b){
    var hexA    = $("span", a).text();
    var hexB    = $("span", b).text();
    var rgbA    = hexToRgb(hexA);
    var rgbB    = hexToRgb(hexB);
    var rgbSumA = rgbSum(rgbA);
    var rgbSumB = rgbSum(rgbB);

    return (parseInt(rgbSumA) > parseInt(rgbSumB)) ? 1 : -1;
  }
  function rgbSum(rgbObject){return rgbObject.r + rgbObject.g + rgbObject.b;}
  function hexToRgb(hex) {
    var result = /^#?([A-F\d]{2})([A-F\d]{2})([A-F\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  }
});