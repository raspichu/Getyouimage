"use strict";
var alert_error = false;
function videoSearch() {
    let url = $('#video_url').val();
    let p1 = new Promise(function (resolve, failure) {
        if (url && typeof url == 'string') {
            url = url.replace(/https:\/\//, '');
            url = url.replace(/http:\/\//, '');
            let arrurl = url.split('/')
            let firstarr = arrurl[0].split('\.');
            if (!arrurl.length || !arrurl[0] || !arrurl[1]){
                failure('bad_url');
                return;
            }
            let secondarr = arrurl[1].split('?');
            if (firstarr[1] == 'youtube' && secondarr[0] == 'watch') {
                if (!secondarr[1]){
                    failure('bad_url');
                    return;
                }
                let thirdarr = secondarr[1].split('&');
                let videoID = null;
                for (let index of thirdarr) {
                    let comp = index.split('=');
                    if (comp[0] == 'v') {
                        videoID = comp[1];
                        break;
                    }
                }
                if (videoID && typeof videoID == 'string') {
                        let img_obj = getImages(videoID);
                        resolve(img_obj);
                } else {
                    failure('bad_url')
                }
            } else {
                if (firstarr[1] && firstarr[0] == 'youtu' && firstarr[1] == 'be') {
                     let img_obj = getImages(secondarr[0]);
                      resolve(img_obj);
                } else {
                    failure('bad_url');
                }
            }
        } else {
            failure('no_url');
        }
    });
    p1.then(function (val) {
        write_results(val);
    }, function (val) {
        switch (val) {
            case 'no_url': newAlert('danger', 'Need a YouTube URL to get the image'); break;
            case 'bad_url': newAlert('danger', 'Need a valid YouTube URL'); break;
            default: newAlert('danger', 'Error');
        }
    })
}
function getImages(video) {
    let obj = {
        'default 120x90': 'https://img.youtube.com/vi/' + video + '/default.jpg',
        'hqdefault 480x360': 'https://img.youtube.com/vi/' + video + '/hqdefault.jpg',
        'mqdefault 320x180': 'https://img.youtube.com/vi/' + video + '/mqdefault.jpg',
        'sddefault 640x480': 'https://img.youtube.com/vi/' + video + '/sddefault.jpg',
        'maxresdefault 1280x720': 'https://img.youtube.com/vi/' + video + '/maxresdefault.jpg',
        'thumbnail 0 480x360': 'https://img.youtube.com/vi/' + video + '/0.jpg',
        'thumbnail 1 120x90': 'https://img.youtube.com/vi/' + video + '/1.jpg',
        'thumbnail 2 120x90': 'https://img.youtube.com/vi/' + video + '/2.jpg',
        'thumbnail 3 120x90': 'https://img.youtube.com/vi/' + video + '/3.jpg',
    };
    return obj;
}
function newAlert(type, message) {
    $("#alert_area").empty()
    $("#alert_area").append($("<div class='alert-message alert alert-" + type + " fade in' data-alert><p> <center>" + message + "</center> </p></div>"));
    $(".alert-message").delay(2000).fadeOut("slow", function () { $(this).remove(); });
    $('#results').css('display', 'none');
}
function write_results(obj) {
    $('#results_body').empty();
    let html = '<div class="table-responsive"><table class="table table-striped table-condensed"><thead><th>Type</th><th>Image</th><th>Url</th></thead><tbody>'
    for (let image in obj) {
        console.log(image);
        if (image=='thumbnail 0 480x360'){html+='<tr><td><small>thumbnails <small>(0 is hqdefault too)</small></small></td><td><hr></td><td><hr></td></tr>'}
        html += `<tr><td>${image}</td>`
        html += `<td><img width="208" height="117" src="${obj[image]}" alt="${image}"></td>`;
        html += `<td><a href="${obj[image]}" target="_blank">Open image</a></td></tr>`;
    }
    html += '</tbody></table></div>';
    $('#results_body').html(html);
    //$('#results').css('display','');
    $('#results').fadeIn();
  
}
function checkImage(imageSrc, good, bad) {
    var img = new Image();
    img.onload = good; 
    img.onerror = bad;
    img.src = imageSrc;
}

