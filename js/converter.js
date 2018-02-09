function rgb2hex(R,G,B) {return toHex(R)+toHex(G)+toHex(B)}
function toHex(n) {
 n = parseInt(n,10);
 if (isNaN(n)) return "00";
 n = Math.max(0,Math.min(n,255));
 return "0123456789ABCDEF".charAt((n-n%16)/16)
      + "0123456789ABCDEF".charAt(n%16);
}

function rgb2hsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
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

    //return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
    return "hsl("+Math.round(h * 360)+","+Math.round(s * 100)+","+Math.round(l* 100)+")";
}

function rgb2hsb (red,green,blue) {
 var computedH = 0;
 var computedS = 0;
 var computedV = 0;

 //remove spaces from input RGB values, convert to int
 var r = red; 
 var g = green; 
 var b = blue; 

 r=r/255; g=g/255; b=b/255;
 var minRGB = Math.min(r,Math.min(g,b));
 var maxRGB = Math.max(r,Math.max(g,b));

 // Black-gray-white
 if (minRGB==maxRGB) {
  computedV = minRGB;
  //return [0,0,computedV];
  return "hsb("+0+","+0+","+Math.round(computedV*100)+")";
 }

 // Colors other than black-gray-white:
 var d = (r==minRGB) ? g-b : ((b==minRGB) ? r-g : b-r);
 var h = (r==minRGB) ? 3 : ((b==minRGB) ? 1 : 5);
 computedH = 60*(h - d/(maxRGB - minRGB));
 computedS = (maxRGB - minRGB)/maxRGB;
 computedV = maxRGB;
 //return [computedH,computedS,computedV];
 return "hsb("+Math.round(computedH)+","+Math.round(computedS*100)+","+Math.round(computedV*100)+")";
}



function rgb2cmyk(red, green, blue){
		var result = {};
 
		r = red / 255;
		g = green / 255;
		b = blue / 255;
 
		result.k = Math.min( 1 - r, 1 - g, 1 - b );
		result.c = ( 1 - r - result.k ) / ( 1 - result.k );
		result.m = ( 1 - g - result.k ) / ( 1 - result.k );
		result.y = ( 1 - b - result.k ) / ( 1 - result.k );
 
		result.c = Math.round( result.c * 100 );
		result.m = Math.round( result.m * 100 );
		result.y = Math.round( result.y * 100 );
		result.k = Math.round( result.k * 100 );
 
		return "cmyk("+Math.round(result.c)+","+Math.round(result.m)+","+Math.round(result.y)+","+Math.round(result.k)+")";
}


function rgb2xyz(r,g,b){
	var var_R = ( r / 255 );        //R from 0 to 255
	var var_G = ( g / 255 );        //G from 0 to 255
	var var_B = ( b / 255 );        //B from 0 to 255

	if ( var_R > 0.04045 ) 
		var_R = Math.pow( ( var_R + 0.055 ) / 1.055 , 2.4);
	else                   
		var_R = var_R / 12.92;
	if ( var_G > 0.04045 ) 
		var_G = Math.pow( ( var_G + 0.055 ) / 1.055 , 2.4);
	else                   
		var_G = var_G / 12.92;
	if ( var_B > 0.04045 ) 
		var_B = Math.pow( (var_B + 0.055 ) / 1.055 , 2.4);
	else                   
		var_B = var_B / 12.92;

	var_R = var_R * 100;
	var_G = var_G * 100;
	var_B = var_B * 100;

	//Observer. = 2¡Æ, Illuminant = D65
	var X = var_R * 0.4124 + var_G * 0.3576 + var_B * 0.1805;
	var Y = var_R * 0.2126 + var_G * 0.7152 + var_B * 0.0722;
	var Z = var_R * 0.0193 + var_G * 0.1192 + var_B * 0.9505;

	return "xyz("+Math.round(X)+","+Math.round(Y)+","+Math.round(Z)+")";
}



function rgb2lab(red, green, blue){
  var r = red / 255,
      g = green / 255,
      b = blue / 255,
      x, y, z;

  r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
  z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

  x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
  y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
  z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;

  var lab = {
  	l: (116 * y) - 16,
  	a: 500 * (x - y),
  	b: 200 * (y - z)
  }

  //return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)];
  return "lab("+Math.round(lab.l)+","+Math.round(lab.a)+","+Math.round(lab.b)+")";
}