import Ember from 'ember';
var dataValues;
var color, colorscale, RadarChart;
var w = 320,
  h = 320;

//Options for the Radar chart, other than default
var mycfg = {
  w: w,
  h: h,
  maxValue: 0.6,
  levels: 4,
  ExtraWidthX: 300
};

export default Ember.Component.extend({
  //tagName: 'svg',
  width: 500,
  height: 500,
  value: 0,
  minValue: 0,
  maxValue: 100,
  label: null,
  svgId: null,
  path: null,
  path2: null,
  dataSetOne: [{
    axis: "Open",
    value: 0
  }, {
    axis: "Conscientious",
    value: 0
  }, {
    axis: "Extraverted",
    value: 0
  }, {
    axis: "Agreeable",
    value: 0
  }, {
    axis: "Neurotic",
    value: 0
  }],
  dataSetTwo: [{
    axis: "Open",
    value: 0
  }, {
    axis: "Conscientious",
    value: 0
  }, {
    axis: "Extraverted",
    value: 0
  }, {
    axis: "Agreeable",
    value: 0
  }, {
    axis: "Neurotic",
    value: 0
  }],
  data: function(){
    return [
      this.get('dataSetOne'),
      this.get('dataSetTwo'),
      [{
        axis: "Open",
        value: 5
      }, {
        axis: "Conscientious",
        value: 5
      }, {
        axis: "Extraverted",
        value: 5
      }, {
        axis: "Agreeable",
        value: 5
      }, {
        axis: "Neurotic",
        value: 5
      }]
    ];
  }.property('dataSetOne'),
  setup: function() {
    var eleId = 's' + Math.random().toString(36).substring(7);
    this.set('eleId', '#' + eleId);
    this.$().attr('id', eleId);
    var _this = this;
    console.log('get');

    var loadD3 = new Ember.RSVP.Promise(function(resolve, reject) {
      try {
        Ember.$.getScript('https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.5/d3.min.js', function() {
          window.d3 = d3;
          resolve(window.d3);
        });
      } catch (e) {
        // on failure
        reject(e.message);
      }
    });

    loadD3.then(function() {
      color = window.d3.scale.ordinal()
        .range(["#d6616b", "#3182bd", "transparent"]);

      colorscale = window.d3.scale.category10();

      RadarChart = {
        draw: function(id, d, options) {
          var cfg = {
            radius: 5,
            w: 600,
            h: 600,
            factor: 1,
            factorLegend: 0.85,
            levels: 3,
            maxValue: 0,
            radians: 2 * Math.PI,
            opacityArea: 0.2,
            ToRight: 5,
            TranslateX: 150,
            TranslateY: 30,
            ExtraWidthX: 100,
            ExtraWidthY: 120,
            color: color
          };

          if ('undefined' !== typeof options) {
            for (var i in options) {
              if ('undefined' !== typeof options[i]) {
                cfg[i] = options[i];
              }
            }
          }
          cfg.maxValue = Math.max(cfg.maxValue, window.d3.max(d, function(i) {
            return window.d3.max(i.map(function(o) {
              return o.value;
            }));
          }));
          var allAxis = (d[0].map(function(i, j) {
            return i.axis;
          }));
          var total = allAxis.length;
          var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);
          var Format = window.d3.format('%');
          window.d3.select(id).select("svg").remove();

          var g = window.d3.select(id)
            .append("svg")
            .attr("width", cfg.w + cfg.ExtraWidthX)
            .attr("height", cfg.h + cfg.ExtraWidthY)
            .append("g")
            .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");

          var tooltip;

          //Circular segments
          for (var j = 0; j < cfg.levels - 1; j++) {
            var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
            g.selectAll(".levels")
              .data(allAxis)
              .enter()
              .append("svg:line")
              .attr("x1", function(d, i) {
                return levelFactor * (1 - cfg.factor * Math.sin(i * cfg.radians / total));
              })
              .attr("y1", function(d, i) {
                return levelFactor * (1 - cfg.factor * Math.cos(i * cfg.radians / total));
              })
              .attr("x2", function(d, i) {
                return levelFactor * (1 - cfg.factor * Math.sin((i + 1) * cfg.radians / total));
              })
              .attr("y2", function(d, i) {
                return levelFactor * (1 - cfg.factor * Math.cos((i + 1) * cfg.radians / total));
              })
              .attr("class", "line")
              .style("stroke", "grey")
              .style("stroke-opacity", "0.75")
              .style("stroke-width", "0.3px")
              .attr("transform", "translate(" + (cfg.w / 2 - levelFactor) + ", " + (cfg.h / 2 - levelFactor) + ")");
          }

          //Text indicating at what % each level is
          for (var j = 0; j < cfg.levels; j++) {
            var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
            g.selectAll(".levels")
              .data([1]) //dummy data
              .enter()
              .append("svg:text")
              .attr("x", function(d) {
                return levelFactor * (1 - cfg.factor * Math.sin(0));
              })
              .attr("y", function(d) {
                return levelFactor * (1 - cfg.factor * Math.cos(0));
              })
              .attr("class", "legend")
              .style("font-family", "sans-serif")
              .style("font-size", "10px")
              .style("opacity", 0)
              .attr("transform", "translate(" + (cfg.w / 2 - levelFactor + cfg.ToRight) + ", " + (cfg.h / 2 - levelFactor) + ")")
              .attr("fill", "#737373")
              .text(new Format((j + 1) * cfg.maxValue / cfg.levels));
          }

          var series = 0;

          var axis = g.selectAll(".axis")
            .data(allAxis)
            .enter()
            .append("g")
            .attr("class", "axis");

          axis.append("line")
            .attr("x1", cfg.w / 2)
            .attr("y1", cfg.h / 2)
            .attr("x2", function(d, i) {
              return cfg.w / 2 * (1 - cfg.factor * Math.sin(i * cfg.radians / total));
            })
            .attr("y2", function(d, i) {
              return cfg.h / 2 * (1 - cfg.factor * Math.cos(i * cfg.radians / total));
            })
            .attr("class", "line")
            .style("stroke", "grey")
            .style("stroke-width", "1px");

          axis.append("text")
            .attr("class", "legend")
            .text(function(d) {
              return d;
            })
            .style("font-family", "sans-serif")
            .style("font-size", "15px")
            .attr("text-anchor", "middle")
            .attr("dy", "1.5em")
            .attr("transform", function(d, i) {
              return "translate(0, -10)";
            })
            .attr("x", function(d, i) {
              return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians / total);
            })
            .attr("y", function(d, i) {
              return cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total)) - 20 * Math.cos(i * cfg.radians / total);
            });


          d.forEach(function(y, x) {
            var dataValues = [];
            g.selectAll(".nodes")
              .data(y, function(j, i) {
                dataValues.push([
                  cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
                  cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
                ]);
              });
            dataValues.push(dataValues[0]);
            g.selectAll(".area")
              .data([dataValues])
              .enter()
              .append("polygon")
              .attr("class", "radar-chart-serie" + series)
              .style("stroke-width", "2px")
              .style("stroke", cfg.color(series))
              .attr("points", function(d) {
                var str = "";
                for (var pti = 0; pti < d.length; pti++) {
                  str = str + d[pti][0] + "," + d[pti][1] + " ";
                }
                return str;
              })
              .style("fill", function(j, i) {
                return cfg.color(series);
              })
              .style("fill-opacity", cfg.opacityArea)
              .on('mouseover', function(d) {
                var z = "polygon." + window.d3.select(this).attr("class");
                g.selectAll("polygon")
                  .transition(200)
                  .style("fill-opacity", 0.1);
                g.selectAll(z)
                  .transition(200)
                  .style("fill-opacity", .7);
              })
              .on('mouseout', function() {
                g.selectAll("polygon")
                  .transition(200)
                  .style("fill-opacity", cfg.opacityArea);
              });
            series++;
          });
          series = 0;
          d.forEach(function(y, x) {
            g.selectAll(".nodes")
              .data(y).enter()
              .append("svg:circle")
              .attr("class", "radar-chart-serie" + series)
              .attr('r', cfg.radius)
              .attr("alt", function(j) {
                return Math.max(j.value, 0);
              })
              .attr("cx", function(j, i) {
                dataValues.push([
                  cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
                  cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
                ]);
                return cfg.w / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total));
              })
              .attr("cy", function(j, i) {
                return cfg.h / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total));
              })
              .attr("data-id", function(j) {
                return j.axis
              })
              .style("fill", cfg.color(series)).style("fill-opacity", .9)
              .on('mouseover', function(d) {
                newX = parseFloat(window.d3.select(this).attr('cx')) - 10;
                newY = parseFloat(window.d3.select(this).attr('cy')) - 5;

                tooltip
                  .attr('x', newX)
                  .attr('y', newY)
                  .text(Format(d.value))
                  .transition(200)
                  .style('opacity', 0);

                z = "polygon." + window.d3.select(this).attr("class");
                g.selectAll("polygon")
                  .transition(200)
                  .style("fill-opacity", 0.1);
                g.selectAll(z)
                  .transition(200)
                  .style("fill-opacity", .7);
              })
              .on('mouseout', function() {
                tooltip
                  .transition(200)
                  .style('opacity', 0);
                g.selectAll("polygon")
                  .transition(200)
                  .style("fill-opacity", cfg.opacityArea);
              })
              .append("svg:title")
              .text(function(j) {
                return Math.max(j.value, 0);
              });

            series++;
          });
          //Tooltip
          tooltip = g.append('text')
            .style('opacity', 0)
            .style('font-family', 'sans-serif')
            .style('font-size', '13px');
        }
      };
      RadarChart.draw(_this.get('eleId'), _this.get('data'), mycfg);
    }, function() {
      // on rejection
    });
  }.on('didInsertElement'),
  setupSvg: function() {
    //Call function to draw the Radar chart
    //Will expect that data is in %'s

    ////////////////////////////////////////////
    /////////// Initiate legend ////////////////
    ////////////////////////////////////////////

    var svg = window.d3.select('#body')
      .selectAll('svg')
      .append('svg')
      .attr("width", w + 300)
      .attr("height", h + 300);

    //Create the title for the legend
    var text = svg.append("text")
      .attr("class", "title")
      .attr("x", w + (w / 2))
      .attr("y", h + 80)
      .attr("text-anchor", "middle")
      .attr("font-size", "18px")
      .attr("font-weight", 500)
      .text("Admiral Ackbar");

    // //Initiate Legend
    // var legend = svg.append("g")
    // 	.attr("class", "legend")
    // 	.attr("height", 100)
    // 	.attr("width", 200)
    // 	.attr('transform', 'translate(90,20)')
    // 	;
    // 	//Create colour squares
    // 	legend.selectAll('rect')
    // 	  .data(LegendOptions)
    // 	  .enter()
    // 	  .append("rect")
    // 	  .attr("x", w - 65)
    // 	  .attr("y", function(d, i){ return i * 20;})
    // 	  .attr("width", 10)
    // 	  .attr("height", 10)
    // 	  .style("fill", function(d, i){ return colorscale(i);})
    // 	  ;
    // 	//Create text next to squares
    // 	legend.selectAll('text')
    // 	  .data(LegendOptions)
    // 	  .enter()
    // 	  .append("text")
    // 	  .attr("x", w - 52)
    // 	  .attr("y", function(d, i){ return i * 20 + 9;})
    // 	  .attr("font-size", "11px")
    // 	  .attr("fill", "#737373")
    // 	  .text(function(d) { return d; })
    // 	  ;
  }
});
