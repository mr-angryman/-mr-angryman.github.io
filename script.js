//variables
var clicks = 0; //increment this by one every click
var auto_clicks = 0; //automatically click once per second
var cost = 1; //the cost of this should increase exponentially
var click_upgrade_cost = 15;
var upgrade_speed = 0; //the level of the speed up upgrade
var click_rate = 1000; //ms between each autoclick
var interval_auto; //storing our interval here so we can update it
var click_increment = 1; //how many clicks per click
var rebirth_count = 0;
var rebirth_points = 0;
var rebirth_point_rec = 10; // updated
var rebirth_multiplier = 1
var noc = true;

var r_up_multi_cost = 1
//functions

function update_total_clicks() { //updates the number of clicks   
  var e = document.getElementById("total_clicks");
  e.innerHTML = clicks;
}

function buy_something(c, button) {
  if (clicks < c) {
    button.className = 'btn btn-danger';
    setTimeout(function() {
      var e = document.getElementsByClassName("btn-danger")[0];
      e.className = 'btn btn-success';
    }, 1000);
    return false;
  }
  clicks -= c;
  return true;
}


var achievements = {
  name: [
    "Keep it Up!",
    "Thats a lot of clicks!",
    "You've came a long way!",
    "Wowza!"
  ],
  description: [
    "You've clicked 100 times!",
    "You've clicked 1,000 times!",
    "You've clicked 2,500 times!",
    "You've clicked 10,000 times!"
  ],
  requirement: [100, 1000, 2500, 10000],
  achieved: [0, 0, 0, 0]
}

function update_workers() {
  var e2 = document.getElementById("time_period");
  e2.innerHTML = parseFloat(click_rate / 1000.0).toFixed(2);
  clearInterval(interval_auto);
  interval_auto = setInterval(function() {
    clicks += auto_clicks;
    update_total_clicks();
  }, click_rate);
}

//click events
document.getElementById("click").addEventListener("click", function(event) {
  clicks = parseFloat(clicks) + parseFloat(click_increment) * rebirth_multiplier;
  update_total_clicks(); //updates the text
  if (noc == true) {
    createNumbersOnClick();
  }
}, false);


document.getElementById("buy_click").onclick = function() {
  if (!buy_something(cost, this)) return;
  auto_clicks++;
  cost = Math.ceil(cost * 1.35); //new cost
  update_total_clicks();
  var e = document.getElementById("clicks_per_second");
  e.innerHTML = auto_clicks;
  var e1 = document.getElementById("buy_click");
  e1.innerHTML = 'Buy for ' + cost;
  var e2 = document.getElementById("autoclicker_level");
  e2.innerHTML = 'lvl  ' + auto_clicks;
};
document.getElementById("upgrade_speed").onclick = function() {
  var upgrade_cost = (Math.pow(3, upgrade_speed)) * 100;
  if (!buy_something(upgrade_cost, this)) return;
  upgrade_speed++;
  click_rate = click_rate * 0.90;
  update_workers();
  var e2 = document.getElementById("upgrade_speed");
  e2.innerHTML = 'Buy for ' + ((Math.pow(3, upgrade_speed)) * 100);
  var e1 = document.getElementById("speed_level");
  e1.innerHTML = 'lvl  ' + upgrade_speed;
};
document.getElementById("increase_clicks").onclick = function() {
  if (!buy_something(click_upgrade_cost, this)) return;
  click_increment++;
  click_upgrade_cost = (click_upgrade_cost * 3);
  update_total_clicks();
  update_workers();
  var e2 = document.getElementById("increase_clicks");
  e2.innerHTML = 'Buy for ' + click_upgrade_cost;
  var e1 = document.getElementById("click_level");
  e1.innerHTML = click_increment + ' avocados per click';

};

//Start Autoclickers
update_workers();

function set_cookie(cookie_name, value) {
  expiry = new Date();
  expiry.setTime(new Date().getTime() + (10 * 60 * 1000));
  var c_value = escape(btoa(JSON.stringify(value))) + "; expires=" + expiry.toUTCString();
  document.cookie = cookie_name + "=" + c_value;
}

function get_cookie(cookie_name) {
  var c_value = document.cookie;
  var c_start = c_value.indexOf(" " + cookie_name + "=");
  if (c_start == -1) {
    c_start = c_value.indexOf(cookie_name + "=");
  }
  if (c_start == -1) return false;
  c_start = c_value.indexOf("=", c_start) + 1;
  var c_end = c_value.indexOf(";", c_start);
  if (c_end == -1) {
    c_end = c_value.length;
  }
  c_value = atob(unescape(c_value.substring(c_start, c_end)));
  return JSON.parse(c_value);
}

function save() {
  var gameSave = {
    clicks: clicks,
    auto_clicks: auto_clicks,
    cost: cost,
    click_upgrade_cost: click_upgrade_cost,
    upgrade_speed: upgrade_speed,
    click_rate: click_rate,
    click_increment: click_increment
  };
  localStorage.setItem("gameSave", JSON.stringify(gameSave));
}

function reset() {
  if (confirm("Are you sure?")) {
    var gameSave = {
      clicks: 0,
      auto_clicks: 0,
      cost: 1,
      click_upgrade_cost: 15,
      upgrade_speed: 0,
      click_rate: 1000,
      click_increment: 1
    };
    localStorage.setItem("gameSave", JSON.stringify(gameSave));
  }
}

function exportSave() {
  var gameSave = {
    clicks: clicks,
    auto_clicks: auto_clicks,
    cost: cost,
    click_upgrade_cost: click_upgrade_cost,
    upgrade_speed: upgrade_speed,
    click_rate: click_rate,
    click_increment: click_increment
  };
  var gameSaveJSON = JSON.stringify(gameSave);
  var gameSaceEncoded = btoa(gameSaveJSON);

  prompt("Exported save", gameSaceEncoded);
}

function importSave() {
  var answer = prompt("Save Import:");
  var gameSaveDecoded = atob(answer);
  var gameSaveParsed = JSON.parse(gameSaveDecoded);

  var gameSave = gameSaveParsed;

  clicks = gameSave.clicks;
  auto_clicks = gameSave.auto_clicks;
  cost = gameSave.cost;
  click_upgrade_cost = gameSave.click_upgrade_cost;
  upgrade_speed = gameSave.upgrade_speed;
  click_rate = gameSave.click_rate;
  click_increment = gameSave.click_increment;
}


function load() {
  var gameSave = JSON.parse(localStorage.getItem("gameSave"));
  clicks = gameSave.clicks;
  auto_clicks = gameSave.auto_clicks;
  cost = gameSave.cost;
  click_upgrade_cost = gameSave.click_upgrade_cost;
  upgrade_speed = gameSave.upgrade_speed;
  click_rate = gameSave.click_rate;
  click_increment = gameSave.click_increment;
}

var input = document.getElementById("saveInput");
var value = document.getElementById("saveValue");

value.textContent = input.value;
input.addEventListener("input", function(event) {
  value.textContent = event.target.value;
});

setInterval(function() {
  save();
}, parseInt(value) * 1000);

function createNumbersOnClick() {
  var clickElement = document.getElementById("click");
  var numberValue = Math.round(click_increment);

  let clickerOffset = clickElement.getBoundingClientRect();
  let position = {
    x: event.pageX - clickerOffset.left + randomNumber(-5, 5),
    y: event.pageY - clickerOffset.top
  };

  let element = document.createElement("div");
  element.textContent = "+" + numberValue;
  element.classList.add("number", "unselectable");
  element.style.left = position.x + "px";
  element.style.top = position.y + "px";

  clickElement.appendChild(element);

  let movementInterval = window.setInterval(function() {
    if (typeof element == "undefined" && element == null) clearInterval(movementInterval)

    position.y--;
    element.style.top = position.y + "px";
  }, 10);

  fadeOut(element, 3000, 0, function() {
    element.remove();
  });
}

function fadeOut(element, duration, finalOpacity, callback) {
  let opacity = 1;

  let elementFadingInterval = window.setInterval(function() {
    opacity -= 50 / duration;

    if (opacity <= finalOpacity) {
      clearInterval(elementFadingInterval);
      callback();
    }

    element.style.opacity = opacity;
  }, 50)
}

function randomNumber(min, max) {
  return Math.round(Math.random() * (min - max) + min);
}

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

function notification(icon, title, text) {

  Toast.fire({
    icon: icon,
    title: title,
    text: text
  });
}

function achievement(id) {
  notification("info", achievements.name[id], achievements.description[id]);
}


setInterval(function() {
  if (clicks == 1000) {
    achievement(1);
  } else if (clicks == 1000) {
    achievement(2);
  } else if (clicks == 2500) {
    achievement(3);
  }
}, 1);

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

setInterval(function() {
  document.getElementById("more_rebirth").innerHTML = numberWithCommas(rebirth_point_rec - clicks);
  document.getElementById("rebirth_points_count").innerHTML = rebirth_points;
  document.getElementById("rebirth_requirement").innerHTML = rebirth_point_rec;
  document.title = clicks
}, 5);

function rebirth() {
  if (clicks >= rebirth_point_rec) {
    clicks = 0;
    click_increment = 0;
    rebirth_points++;
    rebirth_count++;
  }
}

function checkclick() {
  if (document.getElementById("noccheck").checked == true) {
    noc = true;
  } else if (document.getElementById("noccheck").checked = false) {
    noc = false;
  }
}


document.getElementById("r_buy_upgrade_multiplier").addEventListener("click", function() {
  if (rebirth_points >= r_up_multi_cost) {
    rebirth_points -= r_up_multi_cost;
    rebirth_multiplier = rebirth_multiplier * 2
  }
});
