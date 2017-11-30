$(function() {
    $('.need-confirm-btn').click(function() {
      if (confirm('Are you sure to delete?')) {
        return true;
      }
      return false;
    });
  });
  
function check() {
    if(frm.r1[0].checked==true) frm.text.style.visibility = "hidden";
    else if(frm.r1[1].checked==true) frm.text.style.visibility="visible";
}