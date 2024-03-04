const popup1 = document.getElementById("popup");
const popup2 = document.getElementById("popup_myinscriptions");

function getpopup(popup_id) {
  if (popup_id == 1) {
    popup1.style.display = "block";
  } else {
    popup2.style.transform = "translateX(0%)";
  }
}

function close_popup(popup_id) {
  if (popup_id == 1) {
    popup1.style.display = "none";
  } else {
    popup2.style.transform = "translateX(100%)";
  }
}


