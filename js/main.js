var pmt = {
	width: 500,	//画布宽度
	height: 500,	//画布高度
	backcolor: "#fff" , //画布背景
	color_num: 12,	//色相环上的颜色数
	light_num: 8,
	cur_sat: 100,	//当前彩度
	radius: 225,	//色相环的半径
	lineWidth: 30,	//弧的宽度按
	mouseX: 0,
	mouseY: 0
};


var hueLinear = d3.scaleLinear().domain([0,pmt.color_num]).range([0,360]);

var lightLinear = d3.scaleLinear()
	.domain([0, Math.floor(pmt.light_num/2), pmt.light_num-1])
	.range([10,50,90]);



var canvas = document.getElementById("mycanvas");
var ctx = canvas.getContext("2d");

canvas.setAttribute("width", pmt.width);
canvas.setAttribute("height", pmt.height);

redraw(100);
redrawText(0,70,255);

$("#sat-input-range").on("input",function(){
	var sat_value = $(this).val();
	$("#sat-input-text").val(sat_value);
	pmt.cur_sat = sat_value;
	redraw(sat_value);
});

$("#sat-input-text").on("input",function(){
	var sat_value = $(this).val();
	sat_value = sat_value > 100 ? 100 : sat_value;
	sat_value = sat_value < 0 ? 0 : sat_value;
	$(this).val(sat_value);
	$("#sat-input-range").val(sat_value);
	pmt.cur_sat = sat_value;
	redraw(sat_value);
});

$("#hue-input-range").on("input",function(){
	var hue_num = $(this).val();
	$("#hue-input-text").val(hue_num);
	pmt.color_num = hue_num;
	hueLinear.domain([0,pmt.color_num]);
	redraw(pmt.cur_sat);
});

$("#hue-input-text").on("input",function(){
	var hue_num = $(this).val();
	hue_num = hue_num > 20 ? 20 : hue_num;
	hue_num = hue_num < 8 ? 8 : hue_num;
	$(this).val(hue_num);
	$("#hue-input-range").val(hue_num);
	pmt.color_num = hue_num;
	hueLinear.domain([0,pmt.color_num]);
	redraw(pmt.cur_sat);
});


d3.select(canvas).on("click",function(){
	pmt.mouseX = d3.event.offsetX;
	pmt.mouseY = d3.event.offsetY;
	if( pointIsInCircle(pmt.mouseX, pmt.mouseY, pmt.width/2, pmt.height/2, pmt.radius + pmt.lineWidth/2) ){
		var c = ctx.getImageData(pmt.mouseX, pmt.mouseY, 1, 1).data;
		var red = c[0];
		var green = c[1];
		var blue = c[2];
		redrawText(red,green,blue);
	}
});

function pointIsInCircle(x,y,rx,ry,radius){
	return  (x-rx)*(x-rx) + (y-ry)*(y-ry) < radius * radius;
}

function redraw(sat){
	ctx.fillStyle = pmt.backcolor;
	ctx.fillRect(0,0,pmt.width,pmt.height);
	drawLightCircle(pmt.width/2, pmt.height/2, pmt.radius/2,sat);
}

function redrawText(r,g,b){

	var hex_text = "#" + rgb2hex(r,g,b);
	var rgb_text = "rgb("+r+","+g+","+b+")";
	var hsl_text = rgb2hsl(r,g,b);
	var hsb_text = rgb2hsb(r,g,b);
	var cmyk_text = rgb2cmyk(r,g,b);
	var lab_text = rgb2lab(r,g,b);
	var xyz_text = rgb2xyz(r,g,b);

	var cur_color = d3.select("#cur-color")
		.style("background-color",hex_text);

	d3.select("#hex-value").text(hex_text);
	d3.select("#rgb-value").text(rgb_text);
	d3.select("#hsl-value").text(hsl_text);
	d3.select("#hsb-value").text(hsb_text);
	d3.select("#cmy-value").text(cmyk_text);
	d3.select("#lab-value").text(lab_text);
	d3.select("#xyz-value").text(xyz_text);
	/*
	d3.select("#luv-value").text(rgb_text);
	d3.select("#yxy-value").text(rgb_text);
	*/
}


function drawLightCircle(rx,ry,r,sat){
	var radiusLinear = d3.scaleLinear()
		.domain([0,pmt.light_num-1])
		.range([pmt.radius,pmt.lineWidth]);
	for(var lt=0; lt<pmt.light_num; lt++){

		var radius = radiusLinear(lt);
		var light = Math.floor(lightLinear(lt));
		var lineWidth = pmt.lineWidth;
		if( radius < pmt.lineWidth ){
			lineWidth = radiusLinear(lt-1) - pmt.lineWidth/2 + 2;
		}

		drawHueCircle(pmt.width/2, pmt.height/2, radius, sat , light, lineWidth);
	}

	/*ctx.fillStyle = "white";
	ctx.beginPath();
	ctx.arc(rx, ry, radiusLinear(pmt.light_num-1) - pmt.lineWidth/2, 0, 2*Math.PI,false);
	ctx.fill();*/
}


function drawHueCircle(rx,ry,r,sat,light, lineWidth){
	for(var i=0; i<pmt.color_num; i++){

		//var hue = Math.floor(i/pmt.color_num * 360);
		var hue = hueLinear(i);
		var sat = sat;
		var light = light;

		var hsl = "hsl(" + hue + "," + sat + "%," + light + "%)";

		var rx = rx;
		var ry = ry;
		var radius = r;
		var startAngle = i/pmt.color_num * 2*Math.PI + 0.002;
		var endAngle = (i+1)/pmt.color_num * 2*Math.PI - 0.002;
		var angle = Math.abs(endAngle - startAngle);
		startAngle -= angle/2;
		endAngle -= angle/2;

		ctx.strokeStyle = hsl;
		ctx.lineWidth = lineWidth;
		ctx.beginPath();

		ctx.arc(rx, ry, radius, startAngle, endAngle,false);

		ctx.stroke();

	}
}


