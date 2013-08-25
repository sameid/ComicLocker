$(document).ready(function () {
    console.log("ready!");
    $.get('http://192.168.2.35:3000/comics', function (data) {
        //console.log(data);
        
        $("#search-comics-gallery").hide();
		var list = "";
        var currentHash = "";
        var displayHash = "";
        for (var i = 0; i < data.length; i++) {
            currentHash = data[i].hash;
            displayHash = currentHash;
            if (currentHash.length > 20) displayHash = currentHash.substring(0, 20) + "...";
            list += "<li class='comicList' id='" + currentHash + "'><h4>" + displayHash + "</h4></li>";
        }
        $("#userComics").html(list);

        $(".comicList").click(function (e) {

            var $this = $(this);
            var hash = $this.attr("id");
            console.log(hash);
            $.get('http://192.168.2.35:3000/comics/' + hash, function (data) {
                var pageCount = data.page_count;
                var cItems = "";
                for (var i = 1; i <= pageCount; i++) {
                    cItems += "<li><img src='http://192.168.2.35:3000/public/shared-cbs/" + hash + "/" + (i) + ".jpg' /></li>";
                }
                $("#comic-view").html(cItems);
				$('#comic-view').roundabout();
                
            });
        });
    });

    var toggle = true;
    $('.switch-click').on('click', function () {
        $("#userComics-gallery").attr('class', 'thumbnails');
        $.get('http://192.168.2.35:3000/comics', function (data) {
            //console.log(data);
			
			$("#comic-preview").animate({width: 'toggle'});
            var list = "";
            var currentHash = "";
            var displayHash = "";
            if (toggle) {
                for (var i = 0; i < data.length; i++) {
                    currentHash = data[i].hash;
                    list += "<li class='comicList' id='" + currentHash + "'><a href='#' class='thumbnail'><img src='http://192.168.2.35:3000/public/shared-cbs/" + currentHash + "/1.jpg' onerror=\"this.src='http://192.168.2.35:3000/public/shared-cbs/19dd105e0a87b8f5f9a9a43192d77522/1.jpg';\"/></a></li>";
                }
                $("#userComics-gallery").html(list);
                $("#search-comics").fadeOut(100);
                $("#search-comics-gallery").fadeIn(200);
				toggle = false;
            } else {

                for (var i = 0; i < data.length; i++) {
                    currentHash = data[i].hash;
                    displayHash = currentHash;
                    if (currentHash.length > 20) displayHash = currentHash.substring(0, 20) + "...";
                    list += "<li class='comicList' id='" + currentHash + "'><h4>" + displayHash + "</h4></li>";
                }
                $("#userComics").html(list);
                $("#search-comics-gallery").fadeOut(100);
                $("#search-comics").fadeIn(200);
				toggle = true;
            }

			$(".comicList").click(function (e) {

            var $this = $(this);
            var hash = $this.attr("id");
            console.log(hash);
            $.get('http://192.168.2.35:3000/comics/' + hash, function (data) {
                var pageCount = data.page_count;
                var cItems = "";
                for (var i = 1; i <= pageCount; i++) {
                    cItems += "<div class='item' ><img src='http://192.168.2.35:3000/comics/" + hash + "/" + (i) + "'></div>";
                }
                $("#comicPreview").html(cItems);
                $("#myCarousel").carousel('next');
            });
        });
			
        });
    });
});