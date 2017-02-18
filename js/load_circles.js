chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
  if (message.load) {
    var json;
    chrome.runtime.getPackageDirectoryEntry(function(root){
      root.getFile('data/caution_circle.json',{}, function(file){
        file.file(function(file){
          reader = new FileReader;
          reader.onload = function(e){
            json = JSON.parse(e.target.result);
            sendResponse({circles: json});
          };
          reader.readAsText(file, 'utf-8');
        });
      });
    });
    return true;
  }
});

