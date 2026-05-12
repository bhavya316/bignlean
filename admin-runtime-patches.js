(function () {
  var countries = [
    "India", "United States", "United Kingdom", "Canada", "Australia", "New Zealand",
    "Germany", "France", "Italy", "Spain", "Netherlands", "Belgium", "Switzerland",
    "Sweden", "Norway", "Denmark", "Ireland", "Poland", "Austria", "Portugal",
    "United Arab Emirates", "Saudi Arabia", "Qatar", "Kuwait", "Singapore",
    "Malaysia", "Thailand", "Indonesia", "Vietnam", "Philippines", "China",
    "Japan", "South Korea", "Taiwan", "Hong Kong", "Brazil", "Mexico",
    "South Africa", "Turkey"
  ];
  var countryCodes = {
    India: "IN",
    "United States": "US",
    "United Kingdom": "GB",
    Canada: "CA",
    Australia: "AU",
    Germany: "DE",
    France: "FR",
    Italy: "IT",
    Spain: "ES",
    Singapore: "SG",
    China: "CN",
    Japan: "JP",
    "South Korea": "KR"
  };
  var brandOriginValue = "";
  var brandOriginsByName = {};

  function injectStyle() {
    if (document.getElementById("bnl-admin-runtime-style")) return;
    var style = document.createElement("style");
    style.id = "bnl-admin-runtime-style";
    style.textContent = [
      ".bnl-origin-field{display:flex;flex-direction:column;gap:8px;margin:16px 0;}",
      ".bnl-origin-field label,.bnl-editor-toolbar__label{font-size:14px;font-weight:600;color:#111827;}",
      ".bnl-origin-field input{height:42px;border:1px solid #d1d5db;border-radius:8px;padding:0 12px;outline:none;}",
      ".bnl-editor-toolbar{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0 10px;}",
      ".bnl-editor-toolbar button{border:1px solid #d1d5db;background:#fff;border-radius:6px;padding:6px 10px;font-size:13px;font-weight:600;cursor:pointer;}",
      ".bnl-editor-toolbar button:hover{border-color:#e70f0f;color:#e70f0f;}",
      ".add_product_varients__content__items{grid-template-columns:repeat(4,minmax(150px,1fr))!important;align-items:start!important;overflow:visible!important;}",
      ".add_product_varients__content__items__item_desc.bnl-flavor-row{grid-column:1/-1;display:grid;grid-template-columns:repeat(5,minmax(120px,1fr));gap:10px;align-items:end;min-width:0;}",
      ".add_product_varients__content__items__item_desc.bnl-flavor-row label{grid-column:1/-1;margin-bottom:0!important;}",
      ".add_product_varients__content__items__item_desc.bnl-flavor-row>input[name='flavor']{height:38px;margin:0;min-width:0;}",
      ".bnl-flavor-panel{display:grid;grid-column:2/-1;grid-template-columns:repeat(4,minmax(120px,1fr));gap:10px;margin:0;min-width:0;}",
      ".bnl-flavor-panel input{width:100%;height:38px;border:1px solid #d1d5db;border-radius:7px;padding:0 10px;min-width:0;}",
      ".add_product_varients__content__items>button{align-self:end;}",
      "@media(max-width:1100px){.add_product_varients__content__items{grid-template-columns:repeat(2,minmax(150px,1fr))!important;}.add_product_varients__content__items__item_desc.bnl-flavor-row{grid-template-columns:repeat(2,minmax(120px,1fr));}.bnl-flavor-panel{grid-column:1/-1;grid-template-columns:repeat(2,minmax(120px,1fr));}}",
      "@media(max-width:620px){.add_product_varients__content__items{grid-template-columns:1fr!important;}.add_product_varients__content__items__item_desc.bnl-flavor-row{grid-template-columns:1fr;}.bnl-flavor-panel{grid-template-columns:1fr;}}"
    ].join("");
    document.head.appendChild(style);
  }

  function getCountryCode(country) {
    return countryCodes[country] || "";
  }

  function installBrandCountryField() {
    var form = document.querySelector(".brands__content__new_brand__info");
    if (!form || form.querySelector("[data-bnl-origin-field]")) return;

    var datalist = document.getElementById("bnl-origin-country-list");
    if (!datalist) {
      datalist = document.createElement("datalist");
      datalist.id = "bnl-origin-country-list";
      countries.forEach(function (country) {
        var option = document.createElement("option");
        option.value = country;
        datalist.appendChild(option);
      });
      document.body.appendChild(datalist);
    }

    var wrapper = document.createElement("div");
    wrapper.className = "bnl-origin-field";
    wrapper.setAttribute("data-bnl-origin-field", "true");
    wrapper.innerHTML = '<label for="bnl-origin-country">Origin country</label><input id="bnl-origin-country" list="bnl-origin-country-list" placeholder="Search and select origin country" autocomplete="off" />';
    var input = wrapper.querySelector("input");
    var brandNameInput = form.querySelector("input#brand_name");
    var knownOrigin = brandNameInput && brandOriginsByName[(brandNameInput.value || "").trim()];
    brandOriginValue = knownOrigin || "";
    input.value = brandOriginValue;
    input.addEventListener("input", function () {
      brandOriginValue = input.value.trim();
    });
    if (brandNameInput) {
      brandNameInput.addEventListener("input", function () {
        var origin = brandOriginsByName[(brandNameInput.value || "").trim()];
        if (!brandOriginValue && origin) {
          brandOriginValue = origin;
          input.value = origin;
        }
      });
    }
    form.insertBefore(wrapper, form.firstChild);
  }

  function wrapSelection(textarea, before, after) {
    var start = textarea.selectionStart || 0;
    var end = textarea.selectionEnd || 0;
    var selected = textarea.value.slice(start, end) || "text";
    var value = textarea.value.slice(0, start) + before + selected + after + textarea.value.slice(end);
    textarea.value = value;
    textarea.focus();
    textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function prefixSelection(textarea, prefix) {
    var start = textarea.selectionStart || 0;
    var end = textarea.selectionEnd || 0;
    var selected = textarea.value.slice(start, end) || "List item";
    var lines = selected.split("\n").map(function (line) {
      return prefix + line.replace(/^[-*]\s+|^\d+\.\s+/, "");
    }).join("\n");
    textarea.value = textarea.value.slice(0, start) + lines + textarea.value.slice(end);
    textarea.focus();
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function installBlogToolbar() {
    var container = document.querySelector(".add_blogs__content__body_text");
    var textarea = container && container.querySelector("textarea#bodyText");
    if (!container || !textarea || container.querySelector("[data-bnl-blog-toolbar]")) return;

    var toolbar = document.createElement("div");
    toolbar.className = "bnl-editor-toolbar";
    toolbar.setAttribute("data-bnl-blog-toolbar", "true");
    [
      ["H2", function () { prefixSelection(textarea, "## "); }],
      ["H3", function () { prefixSelection(textarea, "### "); }],
      ["B", function () { wrapSelection(textarea, "**", "**"); }],
      ["I", function () { wrapSelection(textarea, "*", "*"); }],
      ["Bullet", function () { prefixSelection(textarea, "- "); }],
      ["Number", function () { prefixSelection(textarea, "1. "); }],
      ["Code", function () { wrapSelection(textarea, "`", "`"); }]
    ].forEach(function (item) {
      var button = document.createElement("button");
      button.type = "button";
      button.textContent = item[0];
      button.addEventListener("click", item[1]);
      toolbar.appendChild(button);
    });
    container.insertBefore(toolbar, textarea);
  }

  function flavorKey(variantIndex, flavorIndex) {
    return "bnlFlavorPricing:" + location.pathname + ":" + variantIndex + ":" + flavorIndex;
  }

  function readFlavorDraft(variantIndex, flavorIndex) {
    try {
      return JSON.parse(window.localStorage.getItem(flavorKey(variantIndex, flavorIndex)) || "{}");
    } catch (error) {
      return {};
    }
  }

  function writeFlavorDraft(variantIndex, flavorIndex, key, value) {
    var draft = readFlavorDraft(variantIndex, flavorIndex);
    draft[key] = value;
    window.localStorage.setItem(flavorKey(variantIndex, flavorIndex), JSON.stringify(draft));
  }

  function installFlavorPanels() {
    document.querySelectorAll(".add_product_varients__content__items").forEach(function (variantNode, variantIndex) {
      var rows = Array.prototype.slice.call(variantNode.querySelectorAll(".add_product_varients__content__items__item_desc"));
      rows.filter(function (row) {
        return row.querySelector('input[name="flavor"]');
      }).forEach(function (row, flavorIndex) {
        row.classList.add("bnl-flavor-row");
        if (row.querySelector("[data-bnl-flavor-panel]")) return;
        var draft = readFlavorDraft(variantIndex, flavorIndex);
        var panel = document.createElement("div");
        panel.className = "bnl-flavor-panel";
        panel.setAttribute("data-bnl-flavor-panel", "true");
        [
          ["stock", "Flavor stock"],
          ["mrp", "Flavor MRP"],
          ["sellingPrice", "Flavor price"],
          ["premiumPrice", "Premium price"]
        ].forEach(function (field) {
          var input = document.createElement("input");
          input.type = "number";
          input.placeholder = field[1];
          input.value = draft[field[0]] || "";
          input.addEventListener("input", function () {
            writeFlavorDraft(variantIndex, flavorIndex, field[0], input.value);
          });
          panel.appendChild(input);
        });
        row.appendChild(panel);
      });
    });
  }

  function getFlavorLabel(flavor) {
    if (flavor == null) return "";
    if (typeof flavor === "string" || typeof flavor === "number") return String(flavor);
    return String(flavor.name || flavor.flavor || flavor.label || "");
  }

  function normalizeProductVariants(payload) {
    if (!payload || !Array.isArray(payload.varients)) return payload;
    payload.varients = payload.varients.map(function (variant, variantIndex) {
      var flavorLabels = Array.isArray(variant.flavor)
        ? variant.flavor.map(getFlavorLabel).filter(Boolean)
        : [];
      var existingFlavors = Array.isArray(variant.flavors) ? variant.flavors : [];
      var flavors = flavorLabels.map(function (label, flavorIndex) {
        var existing = existingFlavors.find(function (item) {
          return getFlavorLabel(item) === label;
        }) || {};
        var draft = readFlavorDraft(variantIndex, flavorIndex);
        return {
          name: label,
          stock: draft.stock || existing.stock || variant.stock || 0,
          mrp: draft.mrp || existing.mrp || variant.mrp || 0,
          sellingPrice: draft.sellingPrice || existing.sellingPrice || existing.price || variant.sellingPrice || 0,
          premiumPrice: draft.premiumPrice || existing.premiumPrice || variant.premiumPrice || variant.mrp || 0
        };
      });
      return Object.assign({}, variant, { flavor: flavorLabels, flavors: flavors });
    });
    return payload;
  }

  function isJsonMutation(method, url, key) {
    return /^(POST|PUT|PATCH)$/i.test(method || "") && String(url || "").indexOf(key) !== -1;
  }

  function patchRequests() {
    if (window.__bnlAdminRequestPatch) return;
    window.__bnlAdminRequestPatch = true;
    var open = XMLHttpRequest.prototype.open;
    var send = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url) {
      this.__bnlMethod = method;
      this.__bnlUrl = url;
      return open.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function (body) {
      this.addEventListener("load", function () {
        try {
          if (String(this.__bnlUrl || "").indexOf("/brands") === -1) return;
          var data = JSON.parse(this.responseText || "{}");
          var list = Array.isArray(data.brands) ? data.brands : data.brand ? [data.brand] : [];
          list.forEach(function (brand) {
            if (brand && brand.name && brand.originCountry) {
              brandOriginsByName[brand.name] = brand.originCountry;
            }
          });
        } catch (error) {}
      });
      if (typeof body === "string") {
        try {
          var payload = JSON.parse(body);
          if (isJsonMutation(this.__bnlMethod, this.__bnlUrl, "/brands")) {
            var origin = brandOriginValue || "";
            if (origin) {
              payload.originCountry = origin;
              payload.countryOfOrigin = origin;
              payload.originCountryCode = getCountryCode(origin);
            }
            body = JSON.stringify(payload);
          }
          if (isJsonMutation(this.__bnlMethod, this.__bnlUrl, "/products") && Array.isArray(payload.varients)) {
            body = JSON.stringify(normalizeProductVariants(payload));
          }
        } catch (error) {}
      }
      return send.call(this, body);
    };
  }

  function tick() {
    injectStyle();
    installBrandCountryField();
    installBlogToolbar();
    installFlavorPanels();
  }

  patchRequests();
  tick();
  new MutationObserver(tick).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
