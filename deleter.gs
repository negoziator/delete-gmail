// Purge mails after x days
var DELETE_AFTER_DAYS = "186"; // 6 months Assuming there's 31 days in a month 

function Intialize() {
  return;
}

function Install() {

  ScriptApp.newTrigger("deleteGmail")
           .timeBased()
           .at(new Date((new Date()).getTime() + 1000*60*2))
           .create();
  
  ScriptApp.newTrigger("deleteGmail")
           .timeBased().everyDays(1).create();

}

function Uninstall() {
  
  var triggers = ScriptApp.getProjectTriggers();
  for (var i=0; i<triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  
}

function deleteGmail() {
  
  var age = new Date();  
  age.setDate(age.getDate() - DELETE_AFTER_DAYS);    
  
  var purge  = Utilities.formatDate(age, Session.getScriptTimeZone(), "yyyy-MM-dd");
  var search = " before:" + purge;
  
  try {
    
    var threads = GmailApp.search(search, 0, 100);
    
    if (threads.length == 100) {
      ScriptApp.newTrigger("deleteGmail")
               .timeBased()
               .at(new Date((new Date()).getTime() + 1000*60*10))
               .create();
    }
    
    for (var i=0; i<threads.length; i++) {
      var messages = GmailApp.getMessagesForThread(threads[i]);
      for (var j=0; j<messages.length; j++) {
        var email = messages[j];       
        if (email.getDate() < age) {
          email.moveToTrash();
        }
      }
    }
    
  } catch (e) {}
  
}