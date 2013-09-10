$(function(){
  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }
  function hexToRgb(hexString) {
    var result = /^#?([A-F\d]{2})([A-F\d]{2})([A-F\d]{2})$/i.exec(hexString);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
  }
  function hslArrayToRgbArray(hslCodes, rgbArr){
    var sortedAgbArr = new Array();
    var len    = hslCodes.length;
    //Retrieving rgb colors
    for(var i = 0; i < len; ++i){
      sortedAgbArr[i] = rgbArr[hslCodes[i][1]];
    }

    return sortedAgbArr;
  }
  function rgbToHsl(rgbCodes){
    var r = rgbCodes[0]/255, g = rgbCodes[1]/255, b = rgbCodes[2]/255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return new Array(h * 360, s * 100, l * 100);
  }
  function createRGBArray(hexCodes){
    var len = hexCodes.length;
    var rgbCodes = new Array();
    var rgb;

    for(var i = 0; i < len; ++i){
      if(hexCodes[i].length >= 4){
        rgb = hexToRgb(hexCodes[i]);

        if(rgb != null){
          rgbCodes.push(rgb);
        }
      }
    }

    return rgbCodes;
  }
  function createHSLArray(rgbArray){
    var rgbLen = rgbArray.length;
    var hslArr = new Array();

    for(var i = 0; i < rgbLen; ++i){
        hslArr[i]=[rgbToHsl(rgbArr[i]),i]; 
    }

    return hslArr;
  }
  function sortHSLArray(hslArray){
    var hslSortedArr = new Array();
    var len          = hslArray.length;
    var sortedLen    = hslSortedArr.length;

    outerloop:
    for(var i=0; i<len ; ++i){
        for(var j = 0; j < sortedLen; ++j){
            if(hslSortedArr[j][0][0] > hslArr[i][0][0]){
                hslSortedArr.splice(j,0,hslArr[i]);
                continue outerloop;
            }
        }
        hslSortedArr.push(hslArr[i]);
    }
    
    return hslSortedArr;
  }
  function createMarkup(rgbArr){
    var markup = "<ul>";
    var len    = sortedRgbArr.length;
    var r,g,b, color, hex;

    $("#colorCount").text(len + " colors");

    for(var i = 0; i < len; ++i){
      r = sortedRgbArr[i][0];
      g = sortedRgbArr[i][1];
      b = sortedRgbArr[i][2];

      color = ((r + g + b) <= 340) ? 'style="color:#fff;"' : "";
      hex = rgbToHex(r,g,b);

      markup += '<li title="Click to copy that color" data-clipboard-target="' + hex + '" style="background-color:' + hex + '">' + 
                  '<span id="' + hex + '" ' + color + '>' + 
                    hex + 
                  '</span>' +
                '</li>'
    }
    markup += '</ul>';

    return markup;
  }

  var hexCodes     = $("#colors").text().split(" ");
  var rgbArr       = createRGBArray(hexCodes);
  var hslArr       = createHSLArray(rgbArr);
  var sortedHslArr = sortHSLArray(hslArr);
  var sortedRgbArr = hslArrayToRgbArray(sortedHslArr, rgbArr);

  $("#colors").html(createMarkup(sortedRgbArr));

    // copy to clipboard
  var items = $("#colors").find("li");
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
});