var socket = io();
var vm = new Vue({
  el: '#app',
  data: {
    message: '',
    referrers: {},
    activeUsers: 0
  },
  created: function() {
    socket.on('update-intresting', function(data) {
      render2([parseInt(data)]);
    });

    socket.on('update-understand', function(data) {
      console.log(parseInt(data));
      render([parseInt(data)]);

    }.bind(this));
  }
});

var identityScale  = d3.scaleLinear().domain([0, 100]).range([0, 1]);
var colorScale = d3.scaleLinear().domain([0, 100]).range([0, 255]);

var phi = 2 * Math.PI;

var arc = d3.arc().innerRadius(150).outerRadius(180).startAngle(0);
          
var svg_unds = d3.select("#unds_monitor").attr('width', 400).attr('height', 400);
    svg_intrst = d3.select("#intrst_monitor").attr('width', 400).attr('height', 400);

initiate_main_svg(svg_unds, "fgs");
initiate_main_svg(svg_intrst, "fgs2");

add_ui_boxShadow(svg_unds);
add_ui_boxShadow(svg_intrst);

// Rendering the left oval ( understanding rate ), with current data transmitted by clients
async function render(data) {

  var texts = svg_unds.selectAll("text").data(data);

  texts.enter().text(data+"%").attr("fill", "red");
  texts.text(data+"%").attr("fill", d3.rgb(colorScale(data), 0,0, 0.05+identityScale(data)));
  
  d3.select("path[id=fgs]").transition().duration(500).attrTween("d", arcTween(identityScale(data) * phi));
  d3.select("path[id=fgs]").style("fill", d3.rgb(255-colorScale(data), colorScale(data)-20, 0, 0.05+identityScale(data)));
}

// Rendering the right oval ( intresting rate ), with current data transmitted by clients
async function render2(data) {
  var texts = svg_intrst.selectAll("text").data(data);
  
    texts.enter().text(data+"%").attr("fill", "red");
    texts.text(data+"%").attr("fill", d3.rgb(colorScale(data), 0,0, 0.05+identityScale(data)));
    
    d3.select("path[id=fgs2]").transition().duration(500).attrTween("d", arcTween(identityScale(data) * phi));
    d3.select("path[id=fgs2]").style("fill", d3.rgb(255-colorScale(data), colorScale(data)-20, 0, 0.05+identityScale(data)));
}

// Calculating the new oval's angle 
function arcTween(newAngle) {
  return function(d) {
    var interpolate = d3.interpolate(d.endAngle, newAngle);
    return function(t) {
      d.endAngle = interpolate(t);
      return arc(d);
    }
  }
}


function initiate_main_svg(svg, path_id) {

  var width = +svg_unds.attr("width"),
      height = +svg_unds.attr("height")
      g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  svg.append("text")
  .attr("x", svg.attr("width")/2-20)
  .attr("y", svg.attr("height")/2+20)
  .attr("font-size", "40px").attr("fill", "red");

  g.append("path")
   .datum({endAngle: phi})
   .style("fill", "#ddd")
   .attr("d", arc);

  g.append("path")
   .datum({endAngle: 0 * phi})
   .style("fill", "orange")
   .attr("d", arc)
   .attr("id", path_id);

   d3.select("path[id="+path_id+"]").style("filter", "url(#drop-shadow)");
}


function add_ui_boxShadow(svg) {

  // Shadow - Box Styling
  var defs = svg.append("defs");
  var filter = defs.append("filter")
                  .attr("id", "drop-shadow")
                  .attr("height", "130%");

  filter.append("feGaussianBlur").attr("in", "SourceAlpha").attr("stdDeviation", 5).attr("result", "blur");
  filter.append("feOffset").attr("in", "blur").attr("dx", 5).attr("dy", 5).attr("result", "offsetBlur");
  var feMerge = filter.append("feMerge");

  feMerge.append("feMergeNode").attr("in", "offsetBlur");
  feMerge.append("feMergeNode").attr("in", "SourceGraphic");

  
}