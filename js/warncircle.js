// This software is released under the MIT license.
// http://opensource.org/licenses/mit-license.php

/**
 * オススメ枠は動的にロードしているようなので、待つ
 */
window.addEventListener("load", main, false);

function main(e) {
  const jsInitCheckTimer = setInterval(jsLoaded, 1000);
  function jsLoaded() {
    clearInterval(jsInitCheckTimer);
    $(function () {
      chrome.storage.sync.get(null, function (items) {
        // ページ内のサークル名リンク一覧を取得
        const circle_tags = $(".maker_name > a");
        circle_tags.each(function (index, tag) {
          // 要注意表示が必要かどうか
          if (Object.keys(items).find(function (circleId) {
            return $(tag).attr('href').indexOf(`${circleId}.html`) !== -1;
          })) {
            const findCircleId = /(.G[0-9]*)\.html/gi.exec($(tag).attr('href'));
            if (findCircleId !== null) {
              const circleId = findCircleId[1];
              const targetTag = displayTargetTag(tag);
              if (targetTag) {
                $(tag)
                  .addClass(`warn${circleId}`);
                $(targetTag).append($('<p>')
                  .text('要注意サークル')
                  .css('color', '#ff0000')
                  .css('display', 'inline')
                  .css('padding-left', '5px')
                  .addClass(`warningMessage${circleId}`));
                // 要注意解除ボタン
                const button = $('<button>', {
                  type: 'button',
                  text: '要注意チェックを外す',
                  class: `warnButton${circleId}`
                });
                button.on('click', function () {
                  chrome.storage.sync.remove(circleId);
                  safeCircle(circleId);
                })
                  .css('margin-left', '5px');
                $(targetTag).append(button);
              } else {
                console.warn("DLSiteのDOM構造に変化があったものと思われます。dlsitewarn開発者に連絡してください。");
              }
            }
          } else {
            const findCircleId = /(.G[0-9]*)\.html/gi.exec($(tag).attr('href'));
            if (findCircleId != null) {
              const targetTag = displayTargetTag(tag);
              const circleId = findCircleId[1];
              if (targetTag) {
                $(targetTag).addClass(`safe${circleId}`);
                // 要注意ボタン
                const button = $('<button>', {
                  type: 'button',
                  text: '要注意チェック',
                  class: `safeButton${circleId}`
                });
                button.on('click', function () {
                  const circleData = {};
                  circleData[circleId] = $(tag).text();
                  chrome.storage.sync.set(circleData);
                  warnCircle(circleId);
                })
                  .css('margin-left', '5px');
                $(targetTag).append(button);
              } else {
                console.warn("DLSiteのDOM構造に変化があったものと思われます。dlsitewarn開発者に連絡してください。");
              }
            }
          }
        });
      });

      /**
       * 要注意チェックボタンを表示する対象
       */
      function displayTargetTag(tag) {
        /**
         * 総合ランキング
         */
        if ($(tag).parent().parent().parent().parent().parent().parent().parent().hasClass("_top_total_ranking")) {
          return $(tag).parent().siblings(".work_label")[0];
        }

        const rankNumber = $(tag).parent().parent().parent().siblings(".rank_number")[0];
        if (rankNumber) {
          const rank = Number($($(rankNumber).children()[0]).text() || 9999);
          if (rank < 4) {
            /**
             * ランキングTOP3
             */
            return $(tag).parent().siblings(".work_label")[0];
          } else {
            /**
             * 4位以降はポップ画像が邪魔なので避ける
             */
            const li = $('<li>')
              .css('border-bottom', 'solid 1px #eee')
              .css('height', '30px')
              .css('margin-bottom', '16px');
            $(tag).parent().parent().parent().parent().after(li);
            return li;
          }
        }
        /**
         * 新着
         */
        const searchTag = $(tag).parent().siblings(".search_tag")[0];
        if (searchTag) {
          return searchTag;
        }
        /**
         * オススメ
         */
        const workPrice = $(tag).parent().siblings(".work_price_wrap")[0];
        if (workPrice) {
          return workPrice;
        }
        const follow = $(tag).parent().siblings(".btn_follow")[0];
        return follow || undefined;
      }

      function safeCircle(circleId, circleName) {
        $(`.warn${circleId}`)
          .toggleClass(`warn${circleId}`)
          .toggleClass(`safe${circleId}`);

        $(`.warningMessage${circleId}`).remove();

        $(`.warnButton${circleId}`)
          .text('要注意チェック')
          .toggleClass(`safeButton${circleId}`)
          .toggleClass(`warnButton${circleId}`)
          .off("click")
          .click(function () {
            const circleData = {};
            circleData[circleId] = circleName;
            chrome.storage.sync.set(circleData);
            warnCircle(circleId);
          });
      }

      function warnCircle(circleId) {
        $(`.safe${circleId}`)
          .toggleClass(`safe${circleId}`)
          .toggleClass(`warn${circleId}`);

        $(`.safeButton${circleId}`)
          .text('要注意チェックを外す')
          .toggleClass(`safeButton${circleId}`)
          .toggleClass(`warnButton${circleId}`)
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
            .addClass(`warningMessage${circleId}`));
      }
    });
  }
};
