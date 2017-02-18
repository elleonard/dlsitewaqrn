// DarkPlasma_DateTime
// Copyright (c) 2017 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

$(function(){
  chrome.runtime.sendMessage({load: "load"}, function(response){
    console.log(response.circles);
    // ページ内のサークル名リンク一覧を取得
    var circle_tags = $(".maker_name > a");
    circle_tags.each(function(index, tag){
      // 要注意一覧に含まれるものに絞
      if(response.circles.circles.findIndex(function(circle){
        return circle.name === $(tag).text() || $(tag).attr('href').indexOf(circle.id+'.html') != -1;
      }) != -1){
        // 要注意表示
        $(tag)
          .append('  要注意サークル')
          .css('color', '#ff0000');
      };
    });
  });
});
