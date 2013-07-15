;(function() {
var COLORS = {
  'wood': 'brown',
  'bait': 'purple',
  'bullets': 'grey',
  'charm': 'green',
  'cloth': 'lightgrey',
  'coal': 'black',
  'cured meat': 'darkred',
  'fur': 'yellow',
  'iron': 'grey',
  'leather': 'brown',
  'meat': 'red',
  'steel': 'cyan'
}

FILTER = [
  's armour',
  'convoy',
  'water tank',
  'i armour',
  'wagon',
  'cask',
  'l armour',
  'rucksack',
  'waterskin',
  'compass'
]

function snapStore() {
  if (amplify) {
    amplify.store('store_' + Number(new Date()), State.stores, {expires: 60 * 60 * 1000});
  }
}

function addGraphTrigger() {
  if ($('#stores').is(':visible') && $('#graphTrigger').length == 0) {
    var trigger = $('<fieldset id="graphTrigger"><legend>tools</legend>graph</div>'),
        graph = $('<div id="storeGraph"><div id="graphContainer"></div><div id="legendContainer"></div></div>');

    $('#stores').before(trigger);
    $('#graphTrigger').colorbox({
      html: graph,
      onComplete: drawGraph
    });
    $(document).on('click', '#stores .row_key, #weapons .row_key', function(ev) {
      $.colorbox({
        html: graph,
        onComplete: function() {drawGraph(ev.target.innerHTML)}
      });
    });
  }
}

function series(type) {
  var _series = {};
  if (type) {
    _series[type] = null;
  }
  $.each(amplify.store(), function(k, v) {
    var now = Math.floor(Number(new Date()) / 1000);
    var limit = now - 60 * 60;
    var time = Math.floor(Number(k.split('_')[1]) / 1000);

    $.each(v, function(itype, count) {
      if (type && itype != type) {
        return;
      }
      if (type || FILTER.indexOf(itype) == -1) {
        if (!_series[itype]) {
          _series[itype] = [];
        }
        if (time > limit) {
          _series[itype].push({x: time, y: count});
        }
      }
    });
  });
  return $.map(_series, function(v, k) {
    return {
      color: COLORS[k] || '#'+Math.floor(Math.random()*16777215).toString(16),
      data: v || [{ x: 0, y: 0 }],
      name: k
    }
  });
}

function drawGraph(type) {
  $('#graphContainer').empty();
  $('#legendContainer').empty();
  var graph = new Rickshaw.Graph({
    renderer: 'line',
    width: 760,
    height:560,
    element: document.querySelector('#graphContainer'),
    series: series(type)
  });
  graph.render();
  var hoverDetail = new Rickshaw.Graph.HoverDetail({ graph: graph });
  var legend = new Rickshaw.Graph.Legend({
    graph: graph,
    element: document.getElementById('legendContainer')
  });
  var shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
    graph: graph,
    legend: legend
  });
}

jQuery(function($) {
  var scripts = [
    '//cdnjs.cloudflare.com/ajax/libs/amplifyjs/1.1.0/amplify.min.js',
    '//cdnjs.cloudflare.com/ajax/libs/jquery.colorbox/1.4.3/jquery.colorbox-min.js',
    '//cdnjs.cloudflare.com/ajax/libs/d3/3.2.2/d3.v3.min.js',
    '//cdnjs.cloudflare.com/ajax/libs/d3/3.2.2/d3.v3.min.js',
    '//cdnjs.cloudflare.com/ajax/libs/rickshaw/1.3.0/rickshaw.min.js'
  ]

  $.each(scripts, function(_, src) {
    var ampsrc = $('<script type="text/javascript" src="'+src+'"></script>')
    $('head').append(ampsrc);
  });
  setInterval(snapStore, 10000);
  setInterval(addGraphTrigger, 1000);
});
})();
