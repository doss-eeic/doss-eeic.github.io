//
// plotter.js
// by Makoto Shimazu <makoto.shimaz at gmail.com>
// 2014-06-04
//
// * 使い方 *
// URLPATHにあるjsonを取ってきて、動的にhtmlを生成します。
// つまり、URLPATHの先のjsonを変更することで、アンケートページへのリンクを変えることが出来ます。
// もし1行に表示する列の数を変更したい場合は、createSiteの中の引数を変更してください。(あまり想定していない)
// ANSWERPATHには、グラフをプロットするために必要な情報が入っています。これは、動的にFETCH_INTERVAL[ms]ごとに取得するようにしています。
// kTeamBoardStep, kScoreBoardStepを変更すると、TeamBoard, ScoreBoardそれぞれの１行におけるチーム数が変更できます。

var URLPATH='https://doss.eidos.ic.i.u-tokyo.ac.jp/reviewboard/json/2016-urls.json';
var ANSWERPATH='https://doss.eidos.ic.i.u-tokyo.ac.jp/reviewboard/json/2016-answers.json';
var URLCONTENTS = {};
var FETCH_INTERVAL = 3000;
var kTeamBoardStep = 16;
var kScoreBoardStep  = 2;

// JSONに含まれるシンボルの定数化
var kURLID = 'urlId';
var kEnglishName = 'englishName';

function createTeamBoardHtml(step, urlData) {
    var html = '';
    html = '<table id="teamboard">';

    var teamlist = [];
    for (var key in urlData) {
        teamlist.push(key);
    }

    var i;
    for (i = 0; i < teamlist.length; i+=step) {
        var n = (teamlist.length - i > step) ? step : teamlist.length - i;
        html += '<tr>\n';
        for (var j = 0; j < n; j++ ) {
            var grp = teamlist[i+j];
            html += '<td><a href="#'+urlData[grp][kEnglishName]+'">'+grp+'</a></td>\n';
        }
        html += '</tr>';
    }
    html += '</table>\n';
    return html;
}
function createScoreBoardHtml(step, urlData) {
    var html = '';
    html = '<table id="scoreboard">';

    var teamlist = [];
    for (var key in urlData) {
        teamlist.push(key);
    }

    for (var i = 0; i < teamlist.length; i+=step) {
        var n = (teamlist.length - i > step) ? step : teamlist.length - i;
        // Header line
        html += '<tr>\n';
        for (var j = 0; j < n; j++) {
            var grp = teamlist[i+j];
            var id = urlData[grp][kURLID];
            var linkurl = 'http://enq-maker.com/'+id;
            html += '<th><a id="'+urlData[grp][kEnglishName]+'" class="scorelink" href="'+linkurl+'" target="_blank">'+grp+'</a></th>\n';
        }
        html += '</tr>';
        // Radar chart
        html += '<tr>\n';
        for (var j = 0; j < n; j++) {
            var grp = teamlist[i+j];
            html += '<td class="chart"><canvas id="'+urlData[grp][kEnglishName]+'radar" height="400" width="400"></canvas></td>\n';
        }
        html += '</tr>';
        // Contentes
        html += '<tr>\n';
        for (var j = 0; j < n; j++) {
            var grp = teamlist[i+j];
            html += '<td><div id="'+urlData[grp][kEnglishName]+'contents"></div></td>';
        }
        html += '</tr>';
    }
    html += '</table>\n';
    return html;
}

// smooth scroll
function setSmoothScroll() {
    $(function(){
        // #で始まるアンカーをクリックした場合に処理
        $('a[href^=#]').click(function() {
            // スクロールの速度
            var speed = 400; // ミリ秒
            // アンカーの値取得
            var href= $(this).attr("href");
            // 移動先を取得
            var target = $(href == "#" || href == "" ? 'html' : href);
            // 移動先を数値で取得 (わかりやすいところに飛ぶようにあえて-100している)
            var position = target.offset().top - 100;
            // スムーススクロール
            $('body,html').animate({scrollTop:position}, speed, 'swing');
            return false;
        });
    });
}

// Site Generator
function createSite() {
    $(function () {
        $.getJSON(URLPATH, function(urlData) {
            URLCONTENTS = urlData;
            var html = '';
            // Create TeamBoard
            html = createTeamBoardHtml(kTeamBoardStep, urlData); // arg: 横に並べる数
            $('#teamboard').append(html);
            // Create ScoreBoard
            html = createScoreBoardHtml(kScoreBoardStep, urlData); // arg: 横に並べる数
            $('#scoreboard').append(html);
        });
    })
}

// Template RadarChart
var RadarChartData = function (data) {
    this.labels = ["激シッカリ","激オリジナル","激チャレンジ","激プレゼン","激盛り上げ"];
    this.datasets = [
        {
            fillColor : "rgba(132,132,149,0.5)",
            strokeColor : "rgba(132,132,149,1)",
            pointColor : "rgba(132,132,149,1)",
            pointStrokeColor : "rgba(132,132,149,1)",
            data : data
        },
    ];
};

// RaderChart generator
var createRadarChart = function(label, data) {
    var radarChartData = new RadarChartData(data);
    return new Chart(document.getElementById(label).getContext("2d")).Radar(radarChartData,{
        scaleOverride : true,
        scaleSteps : 5,
        scaleStepWidth : 20,
        scaleStartValue : 0,
        scaleShowLabels : true,
        scaleLabel : "<%=value%>",
        pointLabelFontSize : 12,
        animation : false,
    });
}

var escapeHTML = function (val) {
    return $('<div />').text(val).html();
}

// Plot Graph
function updateGraphs(){
    $(function () {
        $.getJSON(ANSWERPATH)
            .done(function(data) {
                var radars = [];
                for (var grp in URLCONTENTS) {
                    var englishName = URLCONTENTS[grp][kEnglishName];
                    var html = '';
                    // Create Radar
                    var canvas = document.getElementById(''+englishName+'radar');
                    canvas.width = 400; canvas.height = 400;
                    radars += createRadarChart(''+englishName+'radar', data[grp]["scores"]);
                    // Create Footer
                    html += '<p>コメント(直近5つ) [投票者 '+data[grp]["numbers"]+'人]</p><ul>';
                    var comments = data[grp]["comments"];
                    for (var j = 0; j < Math.min(comments.length,5); j++) {
                        html += '<li>'+escapeHTML(comments[j])+'</li>';
                    }
                    html += '</ul>';
                    $('#'+englishName+'contents').html('<p>'+html+'</p>');
                }
                setTimeout(updateGraphs, FETCH_INTERVAL);
            }).fail(function(jqxhr, textStatus, error) {
                var error = textStatus + ", " + error;
                console.log("Request Failed: " + error);
                setTimeout(updateGraphs, FETCH_INTERVAL * 2);
            });
    });
}

// Show Contents
createSite();
// Add Events
$('#teamboard').onReady(setSmoothScroll);
$('#scoreboard').onReady(updateGraphs);
