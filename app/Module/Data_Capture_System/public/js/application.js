// HR(bpm) SPO2(%) TEMP(C) SBP(mmHG) DBP(mmHG) MAP(mmHG) RR(bpm)
function application({ root, profile, features }) {
  let self = this;

  this.feature = new Object();
  this.profile = profile;
  this.container = null;
  this.chart = null;
  this.canvas = null;
  this.label_focus = null;

  let featuresChilds = [];
  let profileChilds  = [];
  let orderCss = ["info-primary"];
  let orderLast = "info-secondary";
  let basicContainer = {
    el: "div",
    className: "element row info-margin p-3 col-auto",
    childs: [
      { el: "div", className: "info-head row",         childs: profileChilds      },
      { el: "div", className: "info-chart",            childs: [{ el: "canvas" }] },
      { el: "div", className: "row chart_label_group", childs: featuresChilds     },
    ]
  };

  if (typeof features === "object") {
    for (let p of features) {
      this.feature[p.label] = p;
      this.feature[p.label]['update'] = (v) => {
        updateLastValue(self, p.label, v);
      };
      this.feature[p.label]['setColor'] = ( color ) => {
        setFeatureColor(self, p.label, color);
      }
      let labelText = `${p.label} ${p.unit}`;
      let featureContainer = {
        el: "div", className: "chart_label col-auto", onclick: () => changeFeatureEvent(self, this.feature[p.label]),
        dataset: { label: p.label, unit: p.unit },
        childs: [
          { el: "p", className: "last_value", dataset: { id: p.label }, innerText: "- -" },
          { el: "span", className: "last_label", dataset: { unit: p.unit }, innerText: labelText },
        ],
      };

      featuresChilds.push(featureContainer);
    }
  }

  if (typeof profile === "object") {
    let profileContainer;
    for (let p of profile) {
      let infoCss = `col-auto ${p.order > 0 ? "pt-2" : ""} ${orderCss[p.order] || orderLast} `;
      let infoText = `${p.prefix || ""} ${p.content} ${p.postfix || ""}`;
      if (p.order == 0) {
        profileContainer = { el: "a",   id: `profile-${p.name}`, href: `/dcs/${doctor == 'true' ? "doctor" : "patient"}/${p.content}`, className: infoCss, innerText: infoText, style: { "text-decoration": "none", "color": "black" } };
      } else {
        profileContainer = { el: "div", id: `profile-${p.name}`, href: "#", className: infoCss, innerText: infoText };
      }
      
      p.setColor      = ( color ) => { setProfileColor(self, p.name, color); };
      p.setBackground = ( color ) => { setProfileBackgroundColor( self, p.name, color ); }; 
      profileChilds.push(profileContainer);
    }
  }

  function initialization(container) {
    self.container = container;
    self.canvas = container.querySelector(".info-chart > canvas");
    changeFeatureEvent(self, features[0]);
    root.appendChild(container);
  }

  function changeFeatureEvent(self, p) {
    // Magic, don't touch
    self.label_focus &&
      self.label_focus.classList.remove("last_label_active");

    // Warning: security issues, using user data.
    self.label_focus = self.container.querySelector(`.chart_label[data-label='${p.label}']`);
    self.label_focus.classList.add("last_label_active");

    changeChart(self, p);
  }

  // function changeProfile

  function changeChart(self, p) {
    if (self.chart) {
      self.chart.destroy();
    }

    if (p.config) {
      self.chart = new Chart(self.canvas, p.config);
    }
  }

  function updateChart(self) {
    if (self.chart) {
      self.chart.update();
    }
  }

  function updateLastValue(self, name, value) {
    // Warning: security issues, using user data.
    let label = self.container.querySelector(`.last_value[data-id='${name}']`);
    label.innerText = value;
  }

  function setFeatureColor( self, name, color ) {
    let label = self.container.querySelector(`.last_value[data-id='${name}']`);
    label.style.color = color;
  }

  function setProfileColor(self, name, color) {
    self.container.querySelector(`.info-head > #profile-${name}`).style.color = color;
    // self.container.querySelector(".info-head ").style.backgroundColor = color;
    // self.container.classList.remove(...orderCss);
    // self.container.classList.add(color);
  }
  
  function setProfileBackgroundColor(self, color) {
    self.container.querySelector(`.info-head > #profile-${name}`).style.backgroundColor = color;
  }


  this.update = function () {
    updateChart(self);
  }

  createElement(basicContainer).then(initialization);
}