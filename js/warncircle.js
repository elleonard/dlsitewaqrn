// DarkPlasma_DateTime
// Copyright (c) 2017 DarkPlasma
// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

$(function () {
  chrome.storage.sync.get(null, function (items) {
    // ページ内のサークル名リンク一覧を取得
    var circle_tags = $(".maker_name > a");
    circle_tags.each(function (index, tag) {
      // 要注意表示が必要かどうか
      if (Object.keys(items).find(function (key) {
        var circleName = items[key];
        var circleId = key;
        console.log("key: " + key + " name:" + items[key]);
        return $(tag).attr('href').indexOf(circleId + '.html') != -1;
      })) {
        var findCircleId = /(.G[0-9]*)\.html/gi.exec($(tag).attr('href'));
        if (findCircleId != null) {
          var circleId = findCircleId[1];
          $(tag)
            .addClass('warn' + circleId);
          $(tag).after($('<p>')
            .text('要注意サークル')
            .css('color', '#ff0000')
            .css('display', 'inline')
            .css('padding-left', '5px')
            .addClass('warningMessage' + circleId));
          // 要注意解除ボタン
          var button = $('<button>', {
            type: 'button',
            text: '要注意チェックを外す',
            class: 'warnButton' + circleId
          });
          button.on('click', function () {
            chrome.storage.sync.remove(circleId);
            safeCircle(circleId);
          })
            .css('margin-left', '5px');
          $(tag).after(button);
        }
      } else {
        var findCircleId = /(.G[0-9]*)\.html/gi.exec($(tag).attr('href'));
        if (findCircleId != null) {
          var circleId = findCircleId[1];
          $(tag).addClass('safe' + circleId);
          // 要注意ボタン
          var button = $('<button>', {
            type: 'button',
            text: '要注意チェック',
            class: 'safeButton' + circleId
          });
          button.on('click', function () {
            var circleData = {};
            circleData[circleId] = $(tag).text();
            chrome.storage.sync.set(circleData);
            warnCircle(circleId);
          })
            .css('margin-left', '5px');
          $(tag).after(button);
        }
      }
    });
  });

  function safeCircle(circleId, circleName) {
    $('.warn' + circleId)
      .toggleClass('warn' + circleId)
      .toggleClass('safe' + circleId);

    $('.warningMessage' + circleId).remove();

    $('.warnButton' + circleId)
      .text('要注意チェック')
      .toggleClass('safeButton' + circleId)
      .toggleClass('warnButton' + circleId)
      .off("click")
      .click(function () {
        var circleData = {};
        circleData[circleId] = circleName;
        chrome.storage.sync.set(circleData);
        warnCircle(circleId);
      });
  }

  function warnCircle(circleId) {
    $('.safe' + circleId)
      .toggleClass('safe' + circleId)
      .toggleClass('warn' + circleId);

    $('.safeButton' + circleId)
      .text('要注意チェックを外す')
      .toggleClass('safeButton' + circleId)
      .toggleClass('warnButton' + circleId)
      .off("click")
      .click(function () {
        chrome.storage.sync.remove(circleId);
        safeCircle(circleId);
      })
      .after($('<p>')
        .text('要注意サークル')
        .css('color', '#ff0000')
        .css('display', 'inline')
        .css('padding-left', '5px')
        .addClass('warningMessage' + circleId));
  }
});
