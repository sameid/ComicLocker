$(document).ready(function () {
    console.log("ready!");
    var list = '';
    $.get('http://192.168.2.35:3000/comics', function (data) {
        for (var i = 0; i < data.length; i++) {
            var currentHash = data[i].hash;
            list += "<li class='span2'><a href='#' data-toggle='popover' class='thumbnail' id='" 
            + currentHash + "'><img src='public/shared-cbs/" 
            + currentHash + "/1.jpg' onerror=\"this.src='public/shared-cbs/"
            + currentHash +"/2.jpg';\"/></a></li>";
        }

        $("#comic-gallery").html(list);
        
        for (var i = 0; i < data.length; i++) {
            currentHash = data[i].hash;
        }

        var ct = $('#'+currentHash);
        var iot = new Opentip(ct, {showOn:null, style:'alert'});
         ct.focus(function() { iot.hide(); });
        ct.change(function() {
    if (ct.val()) {
      // Everything fine
      iot.hide();
    }
    else {
      // Oh oh
      iot.setContent("Please fill out this field.");
      iot.show();
    }
  });

    });
});