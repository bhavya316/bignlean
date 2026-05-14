(function () {
  var regionCodes = [
    "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AS", "AT", "AU", "AW", "AX", "AZ",
    "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS",
    "BT", "BV", "BW", "BY", "BZ", "CA", "CC", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN",
    "CO", "CR", "CU", "CV", "CW", "CX", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE",
    "EG", "EH", "ER", "ES", "ET", "FI", "FJ", "FK", "FM", "FO", "FR", "GA", "GB", "GD", "GE", "GF",
    "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HM",
    "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IR", "IS", "IT", "JE", "JM",
    "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KY", "KZ", "LA", "LB", "LC",
    "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH", "MK",
    "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA",
    "NC", "NE", "NF", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG",
    "PH", "PK", "PL", "PM", "PN", "PR", "PS", "PT", "PW", "PY", "QA", "RE", "RO", "RS", "RU", "RW",
    "SA", "SB", "SC", "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS",
    "ST", "SV", "SX", "SY", "SZ", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO",
    "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "UM", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VI",
    "VN", "VU", "WF", "WS", "YE", "YT", "ZA", "ZM", "ZW"
  ];
  var countryCodes = {};
  var countryDisplayNames = typeof Intl !== "undefined" && Intl.DisplayNames
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;
  var countries = regionCodes.map(function (code) {
    var name = countryDisplayNames ? countryDisplayNames.of(code) || code : code;
    countryCodes[name] = code;
    countryCodes[name.toLowerCase()] = code;
    return name;
  }).sort(function (a, b) {
    return a.localeCompare(b);
  });
  [
    ["Bharat", "IN"],
    ["USA", "US"],
    ["US", "US"],
    ["United States of America", "US"],
    ["UK", "GB"],
    ["UAE", "AE"],
    ["Korea", "KR"],
    ["South Korea", "KR"],
    ["Russia", "RU"],
    ["Vietnam", "VN"]
  ].forEach(function (alias) {
    countryCodes[alias[0]] = alias[1];
    countryCodes[alias[0].toLowerCase()] = alias[1];
  });
  var brandOriginValue = "";
  var brandOriginsByName = {};
  var offerBannerImageValue = "";
  var offerDraftProductIds = [];
  var offerDraftProducts = [];
  var comboDraftPayload = null;
  var comboEditPricesLoaded = false;
  var webpackRequire = null;
  var lastObservedPath = location.pathname;

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
      ".bnl-product-draft-modal{position:fixed;inset:0;background:rgba(17,24,39,.45);z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:20px;}",
      ".bnl-product-draft-modal__card{width:min(420px,100%);background:#fff;border-radius:10px;padding:22px;box-shadow:0 20px 45px rgba(15,23,42,.25);}",
      ".bnl-product-draft-modal__card h4{font-size:18px;margin:0 0 8px;color:#111827;}",
      ".bnl-product-draft-modal__card p{font-size:14px;line-height:1.5;color:#4b5563;margin:0 0 18px;}",
      ".bnl-product-draft-modal__actions{display:flex;gap:10px;justify-content:flex-end;}",
      ".bnl-product-draft-modal__actions button{border:0;border-radius:8px;padding:10px 14px;font-size:14px;font-weight:700;cursor:pointer;}",
      ".bnl-product-draft-modal__keep{background:#f3f4f6;color:#111827;}",
      ".bnl-product-draft-modal__discard{background:#e70f0f;color:#fff;}",
      ".bnl-combo-picker{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:18px;margin:0 0 18px;box-shadow:0 10px 24px rgba(15,23,42,.06);}",
      ".bnl-combo-picker__header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;}",
      ".bnl-combo-picker h4{margin:0 0 6px;font-size:18px;color:#111827;}",
      ".bnl-combo-picker p{margin:0;color:#6b7280;font-size:14px;line-height:1.45;}",
      ".bnl-combo-picker button{border:0;border-radius:8px;padding:10px 14px;font-size:14px;font-weight:700;cursor:pointer;white-space:nowrap;}",
      ".bnl-combo-picker__open,.bnl-combo-modal__primary{background:#e70f0f;color:#fff;}",
      ".bnl-combo-price-row{display:grid;grid-template-columns:repeat(2,minmax(160px,1fr));gap:12px;margin-top:16px;}",
      ".bnl-combo-price-field{display:flex;flex-direction:column;gap:7px;}",
      ".bnl-combo-price-field label{font-size:13px;font-weight:700;color:#111827;}",
      ".bnl-combo-price-field input{height:42px;border:1px solid #d1d5db;border-radius:8px;padding:0 12px;font-size:14px;outline:none;}",
      ".bnl-combo-price-field input:focus{border-color:#e70f0f;box-shadow:0 0 0 3px rgba(231,15,15,.08);}",
      ".bnl-combo-preview{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;background:#fff7f7;border:1px solid #fecaca;border-radius:8px;margin-top:14px;padding:12px;}",
      ".bnl-combo-preview[hidden]{display:none;}",
      ".bnl-combo-preview strong{display:block;color:#111827;font-size:15px;margin-bottom:4px;}",
      ".bnl-combo-preview span{color:#4b5563;font-size:13px;}",
      ".bnl-combo-modal{position:fixed;inset:0;background:rgba(17,24,39,.52);z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:20px;}",
      ".bnl-combo-modal__card{width:min(860px,100%);max-height:min(760px,92vh);background:#fff;border-radius:12px;display:flex;flex-direction:column;box-shadow:0 24px 56px rgba(15,23,42,.3);overflow:hidden;}",
      ".bnl-combo-modal__head,.bnl-combo-modal__foot{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 18px;border-bottom:1px solid #e5e7eb;}",
      ".bnl-combo-modal__foot{border-top:1px solid #e5e7eb;border-bottom:0;}",
      ".bnl-combo-modal__head h4{margin:0;font-size:18px;color:#111827;}",
      ".bnl-combo-modal__body{padding:16px 18px;overflow:auto;}",
      ".bnl-combo-modal__search{width:100%;height:42px;border:1px solid #d1d5db;border-radius:8px;padding:0 12px;margin-bottom:12px;}",
      ".bnl-combo-modal__selected{display:flex;flex-wrap:wrap;gap:8px;min-height:28px;margin:0 0 12px;}",
      ".bnl-combo-chip{display:inline-flex;align-items:center;gap:6px;background:#f3f4f6;border-radius:999px;padding:6px 10px;font-size:13px;color:#111827;}",
      ".bnl-combo-chip button{border:0;background:transparent;color:#6b7280;padding:0;cursor:pointer;font-weight:800;}",
      ".bnl-combo-products{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px;}",
      ".bnl-combo-product{display:grid;grid-template-columns:54px minmax(0,1fr);gap:10px;border:1px solid #e5e7eb;border-radius:8px;padding:10px;align-items:center;}",
      ".bnl-combo-product img{width:54px;height:54px;border-radius:7px;object-fit:cover;background:#f3f4f6;}",
      ".bnl-combo-product strong{display:block;color:#111827;font-size:14px;line-height:1.25;margin-bottom:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}",
      ".bnl-combo-product span{display:block;color:#6b7280;font-size:12px;margin-bottom:8px;}",
      ".bnl-combo-product button{background:#111827;color:#fff;border:0;border-radius:7px;padding:8px 10px;font-size:13px;font-weight:700;cursor:pointer;}",
      ".bnl-combo-product button.is-selected{background:#16a34a;}",
      ".bnl-combo-modal__status{font-size:13px;color:#6b7280;}",
      ".bnl-combo-modal__error{font-size:13px;color:#b91c1c;}",
      ".bnl-combo-modal__secondary,.bnl-combo-modal__close{background:#f3f4f6;color:#111827;border:0;border-radius:8px;padding:10px 14px;font-weight:700;cursor:pointer;}",
      ".bnl-offer-image-tools{display:grid!important;grid-template-columns:repeat(2,minmax(180px,1fr));gap:14px;align-items:stretch;}",
      ".bnl-offer-image-tools>input[type='file']{display:none!important;}",
      ".bnl-offer-logo-upload,.bnl-offer-banner-upload{min-height:150px!important;height:auto!important;display:flex!important;align-items:center!important;justify-content:center!important;text-align:center!important;}",
      ".bnl-offer-banner-upload{border:2px dashed #d1d5db!important;border-radius:10px!important;background:#f9fafb!important;cursor:pointer!important;overflow:hidden!important;padding:10px!important;}",
      ".bnl-offer-banner-upload:hover{border-color:#e70f0f!important;background:#fff7f7!important;}",
      ".bnl-offer-banner-upload__preview{display:flex;min-height:128px;width:100%;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:#111827;font-size:14px;font-weight:700;}",
      ".bnl-offer-banner-upload__preview img{max-height:128px!important;width:100%!important;object-fit:contain!important;border-radius:8px;background:#fff;}",
      ".bnl-offer-banner-upload__preview small{display:block;color:#6b7280;font-size:12px;font-weight:500;line-height:1.35;}",
      ".bnl-offer-image-hint{display:block;width:100%;margin-top:8px;color:#6b7280;font-size:12px;font-weight:500;line-height:1.35;}",
      ".bnl-offer-builder{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:16px;margin:0 0 18px;box-shadow:0 10px 24px rgba(15,23,42,.06);}",
      ".bnl-offer-builder h4{margin:0 0 4px;font-size:18px;color:#111827;}",
      ".bnl-offer-builder p{margin:0;color:#6b7280;font-size:13px;line-height:1.45;}",
      ".bnl-offer-builder__filters{display:grid;grid-template-columns:1.2fr 1fr 1fr auto;gap:10px;margin-top:14px;align-items:end;}",
      ".bnl-offer-builder__field{display:flex;flex-direction:column;gap:6px;min-width:0;}",
      ".bnl-offer-builder__field label{font-size:13px;font-weight:700;color:#111827;}",
      ".bnl-offer-builder input,.bnl-offer-builder select{height:40px;border:1px solid #d1d5db;border-radius:8px;background:#fff;padding:0 10px;font-size:14px;outline:none;}",
      ".bnl-offer-builder button{height:40px;border:0;border-radius:8px;padding:0 14px;font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap;}",
      ".bnl-offer-builder__primary{background:#e70f0f;color:#fff;}",
      ".bnl-offer-builder__secondary{background:#f3f4f6;color:#111827;}",
      ".bnl-offer-builder__selected{display:flex;flex-wrap:wrap;gap:8px;min-height:28px;margin-top:14px;}",
      ".bnl-offer-builder__chip{display:inline-flex;align-items:center;gap:6px;border-radius:999px;background:#fff7f7;border:1px solid #fecaca;color:#991b1b;padding:6px 10px;font-size:12px;font-weight:700;}",
      ".bnl-offer-builder__chip button{height:auto;background:transparent;color:#991b1b;padding:0;font-size:14px;line-height:1;}",
      ".bnl-offer-builder__products{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px;margin-top:14px;max-height:430px;overflow:auto;padding-right:4px;}",
      ".bnl-offer-builder__product{display:grid;grid-template-columns:58px minmax(0,1fr);gap:10px;align-items:center;border:1px solid #e5e7eb;border-radius:8px;padding:10px;background:#fff;}",
      ".bnl-offer-builder__product img{width:58px!important;height:58px!important;max-height:58px!important;object-fit:contain;border-radius:7px;background:#f3f4f6;}",
      ".bnl-offer-builder__product strong{display:block;color:#111827;font-size:13px;line-height:1.3;margin-bottom:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}",
      ".bnl-offer-builder__product span{display:block;color:#6b7280;font-size:12px;margin-bottom:8px;}",
      ".bnl-offer-builder__product button{height:34px;background:#111827;color:#fff;padding:0 10px;}",
      ".bnl-offer-builder__product button.is-selected{background:#16a34a;}",
      ".bnl-offer-builder__status{margin-top:10px;font-size:13px;color:#6b7280;}",
      ".bnl-offer-builder__status.is-error{color:#b91c1c;}",
      "@media(max-width:680px){.bnl-combo-picker__header,.bnl-combo-price-row,.bnl-combo-preview,.bnl-combo-modal__head,.bnl-combo-modal__foot{grid-template-columns:1fr;display:grid;}.bnl-combo-modal{padding:10px;}.bnl-combo-products{grid-template-columns:1fr;}}",
      "@media(max-width:900px){.bnl-offer-builder__filters{grid-template-columns:1fr 1fr;}.bnl-offer-builder__filters button{width:100%;}}",
      "@media(max-width:680px){.bnl-offer-image-tools,.bnl-offer-builder__filters{grid-template-columns:1fr;}.bnl-offer-logo-upload,.bnl-offer-banner-upload{min-height:140px!important;}.bnl-offer-builder__products{grid-template-columns:1fr;}}",
      ".add_product_varients__content__items{grid-template-columns:repeat(4,minmax(150px,1fr))!important;align-items:end!important;overflow:visible!important;}",
      ".add_product_varients__content__items__item_desc{min-width:0;align-self:end;}",
      ".add_product_varients__content__items__item_desc:nth-of-type(-n+4) label{min-height:42px;display:flex;flex-direction:column;justify-content:flex-end;}",
      ".add_product_varients__content__items__item_desc.bnl-primary-flavor-row{grid-column:auto!important;display:flex!important;flex-direction:column!important;flex-wrap:nowrap!important;gap:0!important;margin-top:0!important;padding-top:0!important;border-top:0!important;align-self:end!important;min-width:0;}",
      ".add_product_varients__content__items__item_desc.bnl-primary-flavor-row label{display:flex!important;justify-content:space-between!important;align-items:center!important;width:100%!important;min-height:42px;margin-bottom:8px!important;}",
      ".add_product_varients__content__items__item_desc.bnl-primary-flavor-row label svg{display:none!important;}",
      ".add_product_varients__content__items__item_desc.bnl-primary-flavor-row>input[name='flavor']{width:100%!important;height:38px;margin:0!important;min-width:0;flex:initial!important;}",
      ".add_product_varients__content__items__item_desc.bnl-flavor-row{grid-column:1/-1!important;display:grid!important;grid-template-columns:repeat(5,minmax(120px,1fr));gap:10px!important;align-items:end;min-width:0;}",
      ".add_product_varients__content__items__item_desc.bnl-flavor-row label{grid-column:1/-1;margin-bottom:0!important;min-height:auto!important;}",
      ".add_product_varients__content__items__item_desc.bnl-flavor-row>input[name='flavor']{height:38px;margin:0!important;min-width:0;flex:initial!important;}",
      ".bnl-flavor-panel{display:grid;grid-column:2/-1;grid-template-columns:repeat(4,minmax(120px,1fr));gap:10px;margin:0;min-width:0;}",
      ".bnl-flavor-panel input{width:100%;height:38px;border:1px solid #d1d5db;border-radius:7px;padding:0 10px;min-width:0;}",
      ".add_product_varients__content__items>button{align-self:end;}",
      "@media(max-width:1100px){.add_product_varients__content__items{grid-template-columns:repeat(2,minmax(150px,1fr))!important;}.add_product_varients__content__items__item_desc.bnl-flavor-row{grid-template-columns:repeat(2,minmax(120px,1fr));}.bnl-flavor-panel{grid-column:1/-1;grid-template-columns:repeat(2,minmax(120px,1fr));}}",
      "@media(max-width:620px){.add_product_varients__content__items{grid-template-columns:1fr!important;}.add_product_varients__content__items__item_desc.bnl-flavor-row{grid-template-columns:1fr;}.bnl-flavor-panel{grid-template-columns:1fr;}}"
    ].join("");
    document.head.appendChild(style);
  }

  function getCountryCode(country) {
    var value = String(country || "").trim();
    return countryCodes[value] || countryCodes[value.toLowerCase()] || "";
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

  function getWebpackRequire() {
    if (webpackRequire) return webpackRequire;
    try {
      (window.webpackChunkbignlean = window.webpackChunkbignlean || []).push([[Date.now()], {}, function (require) {
        webpackRequire = require;
      }]);
    } catch (error) {}
    return webpackRequire;
  }

  function createDefaultProductVariant() {
    return [{
      id: 1,
      mrp: "",
      units: "",
      sellingPrice: "",
      premiumPrice: "",
      date: "",
      stock: "",
      flavor: [""]
    }];
  }

  function clearFlavorDrafts() {
    try {
      Object.keys(window.localStorage).forEach(function (key) {
        if (key.indexOf("bnlFlavorPricing:") === 0) {
          window.localStorage.removeItem(key);
        }
      });
    } catch (error) {}
  }

  function resetProductDraftState() {
    clearFlavorDrafts();
    try {
      var require = getWebpackRequire();
      if (!require) return;
      var storeModule = require(90);
      var productActions = require(4439);
      var store = storeModule && storeModule.Z;
      if (!store || !store.dispatch || !productActions) return;
      store.dispatch(productActions.KO({}));
      store.dispatch(productActions.Wt(createDefaultProductVariant()));
    } catch (error) {}
  }

  function isProductDraftPath(pathname) {
    return /\/products\/(?:add_products|add_product_varients)\/?$/.test(pathname || location.pathname);
  }

  function isVariantDraftPath(pathname) {
    return /\/products\/add_product_varients\/?$/.test(pathname || location.pathname);
  }

  function closeProductDraftPrompt() {
    var modal = document.querySelector("[data-bnl-product-draft-modal]");
    if (modal) modal.remove();
  }

  function showProductDraftPrompt(onDiscard) {
    if (document.querySelector("[data-bnl-product-draft-modal]")) return;
    var modal = document.createElement("div");
    modal.className = "bnl-product-draft-modal";
    modal.setAttribute("data-bnl-product-draft-modal", "true");
    modal.innerHTML = [
      '<div class="bnl-product-draft-modal__card" role="dialog" aria-modal="true">',
      "<h4>Unsaved product changes</h4>",
      "<p>Keep editing to preserve the current form, or discard changes and go back.</p>",
      '<div class="bnl-product-draft-modal__actions">',
      '<button type="button" class="bnl-product-draft-modal__keep">Keep Editing</button>',
      '<button type="button" class="bnl-product-draft-modal__discard">Discard Changes</button>',
      "</div>",
      "</div>"
    ].join("");
    modal.querySelector(".bnl-product-draft-modal__keep").addEventListener("click", closeProductDraftPrompt);
    modal.querySelector(".bnl-product-draft-modal__discard").addEventListener("click", function () {
      closeProductDraftPrompt();
      onDiscard();
    });
    document.body.appendChild(modal);
  }

  function installProductDraftGuard() {
    if (window.__bnlProductDraftGuard) return;
    window.__bnlProductDraftGuard = true;

    document.addEventListener("click", function (event) {
      var target = event.target && event.target.closest ? event.target : event.target && event.target.parentElement;
      if (!target || !target.closest) return;

      var backTarget = target.closest(".add_products .back__button,.add_product_varients .back__button,.add_product_varients__content__footer__back");
      if (backTarget && isProductDraftPath()) {
        event.preventDefault();
        event.stopPropagation();
        if (event.stopImmediatePropagation) event.stopImmediatePropagation();
        showProductDraftPrompt(function () {
          if (isVariantDraftPath()) {
            clearFlavorDrafts();
          } else {
            resetProductDraftState();
          }
          window.history.back();
        });
        return;
      }

      var productEditTarget = target.closest(".product_action span");
      if (productEditTarget && (productEditTarget.textContent || "").trim().toLowerCase() === "edit") {
        resetProductDraftState();
        return;
      }

      var linkTarget = target.closest("a[href]");
      var href = linkTarget && linkTarget.getAttribute("href");
      if (href && href.indexOf("/products/add_products") !== -1) {
        resetProductDraftState();
      }
    }, true);

    window.addEventListener("beforeunload", function (event) {
      if (!isProductDraftPath()) return;
      event.preventDefault();
      event.returnValue = "";
    });
  }

  function cleanupProductDraftOnRouteChange() {
    var currentPath = location.pathname;
    if (currentPath === lastObservedPath) return;
    var wasProductDraft = isProductDraftPath(lastObservedPath);
    var isProductDraft = isProductDraftPath(currentPath);
    if (wasProductDraft && !isProductDraft) {
      resetProductDraftState();
    }
    if (isComboFormPath(lastObservedPath) && !isComboFormPath(currentPath)) {
      comboDraftPayload = null;
      comboEditPricesLoaded = false;
    }
    if (isOfferAddPath(lastObservedPath) && !isOfferAddPath(currentPath)) {
      offerBannerImageValue = "";
      offerDraftProductIds = [];
      offerDraftProducts = [];
    }
    lastObservedPath = currentPath;
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
        var label = row.querySelector('label[for="flavor"]');
        var panel = row.querySelector("[data-bnl-flavor-panel]");
        row.classList.remove("bnl-primary-flavor-row", "bnl-flavor-row");
        if (flavorIndex === 0) {
          row.classList.add("bnl-primary-flavor-row");
          if (label && label.firstChild) label.firstChild.nodeValue = "Primary Flavor";
          if (panel) panel.remove();
          return;
        }
        row.classList.add("bnl-flavor-row");
        if (label && label.firstChild) label.firstChild.nodeValue = "Flavor " + (flavorIndex + 1);
        if (panel) return;
        var draft = readFlavorDraft(variantIndex, flavorIndex);
        panel = document.createElement("div");
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

  function isComboFormPath(pathname) {
    return /\/combo\/add_combo\/?$/.test(pathname || location.pathname);
  }

  function isComboFormPage() {
    return isComboFormPath() && !!document.getElementById("add_products__content__form__brand_cat__combo_category");
  }

  function getAdminAuthHeaders(json) {
    var headers = json ? { "Content-Type": "application/json" } : {};
    var token = "";
    var stores = [];
    try {
      stores.push(window.localStorage);
      stores.push(window.sessionStorage);
    } catch (error) {}
    stores.some(function (store) {
      if (!store) return false;
      return ["token", "authToken", "adminToken", "accessToken", "firebaseToken", "idToken", "user"].some(function (key) {
        var raw = store.getItem(key);
        if (!raw) return false;
        if (/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(raw) || /^Bearer\s+/i.test(raw)) {
          token = raw;
          return true;
        }
        try {
          var parsed = JSON.parse(raw);
          token = parsed.token || parsed.authToken || parsed.accessToken || parsed.idToken || parsed.firebaseToken || "";
          return !!token;
        } catch (error) {
          return false;
        }
      });
    });
    if (token) {
      headers.Authorization = /^Bearer\s+/i.test(token) ? token : "Bearer " + token;
    }
    return headers;
  }

  function isOfferAddPath(pathname) {
    return /\/add_new_offer\/?$/.test(pathname || location.pathname);
  }

  function isOfferFormPage() {
    return !!document.querySelector(".add_new_deal input#offer_name") &&
      !!document.querySelector(".add_new_deal .categories__content__new_brand__upload_logo");
  }

  function uploadOfferImageFile(file) {
    var formData = new FormData();
    formData.append("file", file);
    return fetch("http://localhost:3002/upload", {
      method: "POST",
      headers: getAdminAuthHeaders(false),
      body: formData
    }).then(function (response) {
      return response.json().then(function (data) {
        if (!response.ok || data.status === false) {
          throw new Error(data.message || "Unable to upload image.");
        }
        var url = data.fileUrl || data.filePath || data.url;
        if (!url) throw new Error("Upload response did not include an image URL.");
        return url;
      });
    });
  }

  function updateOfferBannerPreview(wrapper, statusText, isError) {
    var preview = wrapper && wrapper.querySelector("[data-bnl-offer-banner-preview]");
    if (!preview) return;
    if (offerBannerImageValue) {
      preview.innerHTML = [
        '<img src="' + escapeHtml(offerBannerImageValue) + '" alt="Offer banner preview" />',
        "<span>Change offer banner</span>",
        statusText ? '<small style="color:' + (isError ? "#b91c1c" : "#16a34a") + '">' + escapeHtml(statusText) + "</small>" : "<small>Banner image: 1500 x 400 px. Used on the offer detail page.</small>"
      ].join("");
      return;
    }
    preview.innerHTML = [
      "<span>Upload offer banner</span>",
      "<small>Banner image: 1500 x 400 px. Used on the offer detail page.</small>",
      statusText ? '<small style="color:' + (isError ? "#b91c1c" : "#6b7280") + '">' + escapeHtml(statusText) + "</small>" : ""
    ].join("");
  }

  function installOfferBannerUpload() {
    if (!isOfferFormPage()) return;
    var imageTools = document.querySelector(".add_new_deal .categories__content__new_brand");
    if (!imageTools || imageTools.querySelector("[data-bnl-offer-banner-upload]")) return;

    imageTools.classList.add("bnl-offer-image-tools");
    var logoUpload = imageTools.querySelector(".categories__content__new_brand__upload_logo");
    if (logoUpload) {
      logoUpload.classList.add("bnl-offer-logo-upload");
      var logoLabel = logoUpload.querySelector("span");
      if (logoLabel && /offer image/i.test(logoLabel.textContent || "")) {
        logoLabel.textContent = "Upload offer logo";
      }
      if (!logoUpload.querySelector("[data-bnl-offer-logo-hint]")) {
        var logoHint = document.createElement("small");
        logoHint.className = "bnl-offer-image-hint";
        logoHint.setAttribute("data-bnl-offer-logo-hint", "true");
        logoHint.textContent = "Logo image: 600 x 400 px. Used on offer cards, navbar, and other listing areas.";
        logoUpload.appendChild(logoHint);
      }
    }

    var bannerUpload = document.createElement("div");
    bannerUpload.className = "bnl-offer-banner-upload";
    bannerUpload.setAttribute("data-bnl-offer-banner-upload", "true");
    bannerUpload.innerHTML = [
      '<input type="file" accept="image/*" data-bnl-offer-banner-input hidden />',
      '<div class="bnl-offer-banner-upload__preview" data-bnl-offer-banner-preview></div>'
    ].join("");

    imageTools.appendChild(bannerUpload);
    updateOfferBannerPreview(bannerUpload);

    var input = bannerUpload.querySelector("[data-bnl-offer-banner-input]");
    bannerUpload.addEventListener("click", function (event) {
      if (event.target === input) return;
      if (input) input.click();
    });
    input.addEventListener("change", function (event) {
      var file = event.target && event.target.files && event.target.files[0];
      if (!file) return;
      updateOfferBannerPreview(bannerUpload, "Uploading banner...", false);
      uploadOfferImageFile(file)
        .then(function (url) {
          offerBannerImageValue = url;
          updateOfferBannerPreview(bannerUpload, "Banner uploaded.", false);
        })
        .catch(function (error) {
          updateOfferBannerPreview(bannerUpload, error.message || "Unable to upload banner.", true);
        });
    });
  }

  function getOfferProductId(product) {
    return Number(product && (product.id || product.productId));
  }

  function normalizeOfferProductIdsForAdmin(products) {
    if (!products) return [];
    var items = products;
    if (typeof products === "string") {
      try {
        items = JSON.parse(products);
      } catch (error) {
        items = products.split(",");
      }
    }
    if (!Array.isArray(items)) return [];
    return items.map(function (item) {
      if (item && typeof item === "object") return Number(item.id || item.productId);
      return Number(item);
    }).filter(Boolean);
  }

  function setOfferBuilderStatus(builder, message, isError) {
    var status = builder && builder.querySelector("[data-bnl-offer-status]");
    if (!status) return;
    status.textContent = message || "";
    status.className = "bnl-offer-builder__status" + (isError ? " is-error" : "");
  }

  function renderOfferSelectedProducts(builder) {
    var selectedNode = builder && builder.querySelector("[data-bnl-offer-selected]");
    if (!selectedNode) return;
    if (!offerDraftProducts.length) {
      selectedNode.innerHTML = '<span class="bnl-offer-builder__status">No products selected for this offer.</span>';
      return;
    }
    selectedNode.innerHTML = "";
    offerDraftProducts.forEach(function (product) {
      var id = getOfferProductId(product);
      var chip = document.createElement("span");
      chip.className = "bnl-offer-builder__chip";
      chip.innerHTML = '<span>' + escapeHtml(product.name || ("Product #" + id)) + '</span><button type="button" aria-label="Remove product">x</button>';
      chip.querySelector("button").addEventListener("click", function () {
        offerDraftProductIds = offerDraftProductIds.filter(function (item) { return item !== id; });
        offerDraftProducts = offerDraftProducts.filter(function (item) { return getOfferProductId(item) !== id; });
        renderOfferSelectedProducts(builder);
        renderOfferProductRows(builder, builder.__bnlOfferProducts || []);
      });
      selectedNode.appendChild(chip);
    });
  }

  function renderOfferProductRows(builder, products) {
    var productsNode = builder && builder.querySelector("[data-bnl-offer-products]");
    if (!productsNode) return;
    builder.__bnlOfferProducts = products || [];
    productsNode.innerHTML = "";

    if (!products || !products.length) {
      productsNode.innerHTML = '<div class="bnl-offer-builder__status">No products found.</div>';
      return;
    }

    products.forEach(function (product) {
      var id = getOfferProductId(product);
      if (!id) return;
      var isSelected = offerDraftProductIds.indexOf(id) !== -1;
      var row = document.createElement("div");
      row.className = "bnl-offer-builder__product";

      var image = document.createElement("img");
      image.src = getProductImage(product) || "/assets/product.png";
      image.alt = product.name || "Product";

      var info = document.createElement("div");
      var name = document.createElement("strong");
      name.textContent = product.name || "Product";
      name.title = product.name || "Product";
      var meta = document.createElement("span");
      meta.textContent = getProductPriceSummary(product);
      var button = document.createElement("button");
      button.type = "button";
      button.textContent = isSelected ? "Selected" : "Add to offer";
      if (isSelected) button.className = "is-selected";
      button.addEventListener("click", function () {
        if (offerDraftProductIds.indexOf(id) === -1) {
          offerDraftProductIds.push(id);
          offerDraftProducts.push(product);
        }
        renderOfferSelectedProducts(builder);
        renderOfferProductRows(builder, builder.__bnlOfferProducts || []);
        setOfferBuilderStatus(builder, "Selected " + offerDraftProductIds.length + " product" + (offerDraftProductIds.length === 1 ? "" : "s") + ".", false);
      });

      info.appendChild(name);
      info.appendChild(meta);
      info.appendChild(button);
      row.appendChild(image);
      row.appendChild(info);
      productsNode.appendChild(row);
    });
  }

  function fetchOfferProducts(builder) {
    var searchInput = builder.querySelector("[data-bnl-offer-search]");
    var categorySelect = builder.querySelector("[data-bnl-offer-category]");
    var subcategorySelect = builder.querySelector("[data-bnl-offer-subcategory]");
    var params = new URLSearchParams();
    params.set("page", "1");
    params.set("limit", "100");
    if (searchInput && searchInput.value.trim()) params.set("search", searchInput.value.trim());
    if (categorySelect && categorySelect.value) params.set("catId", categorySelect.value);
    if (subcategorySelect && subcategorySelect.value) params.set("subCatId", subcategorySelect.value);

    setOfferBuilderStatus(builder, "Loading products...", false);
    fetch("http://localhost:3002/admin/all-products?" + params.toString(), {
      headers: getAdminAuthHeaders(false)
    })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        var products = normalizeProductsResponse(data);
        renderOfferProductRows(builder, products);
        setOfferBuilderStatus(builder, products.length + " product" + (products.length === 1 ? "" : "s") + " loaded.", false);
      })
      .catch(function () {
        renderOfferProductRows(builder, []);
        setOfferBuilderStatus(builder, "Unable to load products.", true);
      });
  }

  function fetchOfferCategories(builder) {
    var categorySelect = builder.querySelector("[data-bnl-offer-category]");
    if (!categorySelect) return;
    categorySelect.innerHTML = '<option value="">All categories</option>';
    fetch("http://localhost:3002/categories", {
      headers: getAdminAuthHeaders(false)
    })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        var categories = Array.isArray(data.categories) ? data.categories : Array.isArray(data.data) ? data.data : [];
        categories.forEach(function (category) {
          var option = document.createElement("option");
          option.value = category.id;
          option.textContent = category.name || ("Category #" + category.id);
          categorySelect.appendChild(option);
        });
      })
      .catch(function () {
        setOfferBuilderStatus(builder, "Unable to load categories.", true);
      });
  }

  function fetchOfferSubcategories(builder, categoryId) {
    var subcategorySelect = builder.querySelector("[data-bnl-offer-subcategory]");
    if (!subcategorySelect) return;
    subcategorySelect.innerHTML = '<option value="">All subcategories</option>';
    subcategorySelect.disabled = !categoryId;
    if (!categoryId) return;

    fetch("http://localhost:3002/subcategories/" + encodeURIComponent(categoryId), {
      headers: getAdminAuthHeaders(false)
    })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        var subcategories = Array.isArray(data.subcategories) ? data.subcategories : Array.isArray(data.data) ? data.data : [];
        subcategories.forEach(function (subcategory) {
          var option = document.createElement("option");
          option.value = subcategory.id;
          option.textContent = subcategory.name || ("Subcategory #" + subcategory.id);
          subcategorySelect.appendChild(option);
        });
        subcategorySelect.disabled = false;
      })
      .catch(function () {
        setOfferBuilderStatus(builder, "Unable to load subcategories.", true);
      });
  }

  function installOfferProductPicker() {
    if (!isOfferFormPage()) return;
    var container = document.querySelector(".add_new_deal__content__all_product");
    if (!container || container.querySelector("[data-bnl-offer-builder]")) return;

    var nativeFilters = container.querySelector(".add_new_deal__content__all_product__search_container");
    if (nativeFilters) nativeFilters.style.display = "none";

    var builder = document.createElement("div");
    builder.className = "bnl-offer-builder";
    builder.setAttribute("data-bnl-offer-builder", "true");
    builder.innerHTML = [
      "<h4>Offer product picker</h4>",
      "<p>Select products here if the default category or subcategory controls do not load. These selections are used when creating the offer.</p>",
      '<div class="bnl-offer-builder__filters">',
      '<div class="bnl-offer-builder__field"><label>Search product</label><input data-bnl-offer-search type="search" placeholder="Search by product name" /></div>',
      '<div class="bnl-offer-builder__field"><label>Category</label><select data-bnl-offer-category><option value="">All categories</option></select></div>',
      '<div class="bnl-offer-builder__field"><label>Subcategory</label><select data-bnl-offer-subcategory disabled><option value="">All subcategories</option></select></div>',
      '<button type="button" class="bnl-offer-builder__primary" data-bnl-offer-load>Load Products</button>',
      "</div>",
      '<div class="bnl-offer-builder__selected" data-bnl-offer-selected></div>',
      '<div class="bnl-offer-builder__status" data-bnl-offer-status></div>',
      '<div class="bnl-offer-builder__products" data-bnl-offer-products></div>'
    ].join("");

    var heading = container.querySelector(".add_new_deal__content__all_product__heading");
    if (heading && heading.nextSibling) {
      container.insertBefore(builder, heading.nextSibling);
    } else {
      container.insertBefore(builder, container.firstChild);
    }

    var searchTimer = null;
    var searchInput = builder.querySelector("[data-bnl-offer-search]");
    var categorySelect = builder.querySelector("[data-bnl-offer-category]");
    var subcategorySelect = builder.querySelector("[data-bnl-offer-subcategory]");
    var loadButton = builder.querySelector("[data-bnl-offer-load]");

    searchInput.addEventListener("input", function () {
      if (searchTimer) window.clearTimeout(searchTimer);
      searchTimer = window.setTimeout(function () { fetchOfferProducts(builder); }, 300);
    });
    categorySelect.addEventListener("change", function () {
      fetchOfferSubcategories(builder, categorySelect.value);
      fetchOfferProducts(builder);
    });
    subcategorySelect.addEventListener("change", function () {
      fetchOfferProducts(builder);
    });
    loadButton.addEventListener("click", function () {
      fetchOfferProducts(builder);
    });

    renderOfferSelectedProducts(builder);
    fetchOfferCategories(builder);
    fetchOfferProducts(builder);
  }

  function getComboSelectValue(labelId) {
    var label = document.getElementById(labelId);
    var root = label && label.closest ? label.closest(".MuiFormControl-root") : null;
    var input = root && root.querySelector("input");
    return input && input.value ? input.value : "";
  }

  function setNativeInputValue(element, value) {
    if (!element) return;
    var normalized = value == null ? "" : String(value);
    var descriptor = element.tagName === "TEXTAREA"
      ? Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")
      : Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value");
    if (descriptor && descriptor.set) {
      descriptor.set.call(element, normalized);
    } else {
      element.value = normalized;
    }
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function setComboSelectValue(labelId, value) {
    if (value == null || value === "") return;
    var label = document.getElementById(labelId);
    var root = label && label.closest ? label.closest(".MuiFormControl-root") : null;
    var input = root && root.querySelector("input");
    if (input) setNativeInputValue(input, value);
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function normalizeProductsResponse(response) {
    if (Array.isArray(response)) return response;
    if (!response || typeof response !== "object") return [];
    if (Array.isArray(response.products)) return response.products;
    if (response.data && Array.isArray(response.data.products)) return response.data.products;
    if (Array.isArray(response.data)) return response.data;
    if (response.result && Array.isArray(response.result.products)) return response.result.products;
    return [];
  }

  function firstProductVariant(product) {
    return Array.isArray(product && product.varients) && product.varients.length > 0
      ? product.varients[0]
      : {};
  }

  function getProductImage(product) {
    var image = product && (product.image || product.thumbnail);
    if (!image && Array.isArray(product && product.images)) {
      image = product.images[0];
    }
    if (image && typeof image === "object") {
      image = image.url || image.src || image.path || "";
    }
    return image || "";
  }

  function getProductPriceSummary(product) {
    var variant = firstProductVariant(product);
    var mrp = variant.mrp || product.mrp || "";
    var price = variant.sellingPrice || variant.price || product.sellingPrice || product.price || "";
    if (!mrp && !price) return "No variant price";
    return "MRP Rs. " + (mrp || "-") + " | Price Rs. " + (price || "-");
  }

  function readComboPriceInputs(section) {
    var root = section || document.querySelector("[data-bnl-combo-picker]");
    if (!root) return {};
    var mrpInput = root.querySelector("[data-bnl-combo-mrp]");
    var priceInput = root.querySelector("[data-bnl-combo-price]");
    return {
      mrp: mrpInput ? mrpInput.value.trim() : "",
      sellingPrice: priceInput ? priceInput.value.trim() : ""
    };
  }

  function writeComboPriceInputs(section, data) {
    if (!section || !data) return;
    var mrpInput = section.querySelector("[data-bnl-combo-mrp]");
    var priceInput = section.querySelector("[data-bnl-combo-price]");
    if (mrpInput && data.mrp != null) setNativeInputValue(mrpInput, data.mrp);
    if (priceInput && (data.sellingPrice != null || data.price != null)) {
      setNativeInputValue(priceInput, data.sellingPrice != null ? data.sellingPrice : data.price);
    }
  }

  function updateComboPreviewCard(section, data) {
    var preview = section && section.querySelector("[data-bnl-combo-preview]");
    if (!preview) return;
    if (!data) {
      preview.hidden = true;
      preview.innerHTML = "";
      return;
    }
    var mrp = data.mrp || 0;
    var sellingPrice = data.sellingPrice || data.price || 0;
    var selectedIds = data.selectedProductIds || data.products || data.productIds || [];
    preview.hidden = false;
    preview.innerHTML = [
      "<div>",
      "<strong>" + escapeHtml(data.name || "Combo preview") + "</strong>",
      "<span>MRP Rs. " + escapeHtml(mrp) + " | Price Rs. " + escapeHtml(sellingPrice) + "</span>",
      "</div>",
      "<span>" + escapeHtml(selectedIds.length || 0) + " products selected</span>"
    ].join("");
  }

  function syncComboVariantDraft(variants) {
    try {
      var require = getWebpackRequire();
      if (!require || !Array.isArray(variants)) return;
      var storeModule = require(90);
      var productActions = require(4439);
      var store = storeModule && storeModule.Z;
      if (store && store.dispatch && productActions && productActions.Wt) {
        store.dispatch(productActions.Wt(variants));
      }
    } catch (error) {}
  }

  function applyComboPreviewToForm(data, section) {
    if (!data) return;
    var comboCatId = data.comboCatId || data.comboCategoryId || getComboSelectValue("add_products__content__form__brand_cat__combo_category");
    comboDraftPayload = Object.assign({}, data, {
      comboCatId: comboCatId || data.comboCatId,
      comboCategoryId: comboCatId || data.comboCategoryId,
      varients: []
    });

    setNativeInputValue(document.querySelector('.add_products__content__form input#name[name="name"]'), data.name || "");
    writeComboPriceInputs(section, comboDraftPayload);
    var firstDetail = Array.isArray(data.details) && data.details[0] ? data.details[0] : null;
    if (firstDetail) {
      setNativeInputValue(document.querySelector('.add_products__content__form__details input[name="heading"]'), firstDetail.heading || "");
      setNativeInputValue(document.querySelector('.add_products__content__form__details textarea[name="body"]'), firstDetail.body || "");
    }
    setComboSelectValue("add_products__content__form__brand_cat__brand", data.brandId);
    setComboSelectValue("add_products__content__form__brand_cat__category", data.catId);
    setComboSelectValue("add_products__content__form__brand_cat__sub_category", data.subCatId);
    setComboSelectValue("add_products__content__form__brand_cat__combo_category", comboCatId);
    updateComboPreviewCard(section, comboDraftPayload);
  }

  function isBlankRecord(record) {
    if (!record || typeof record !== "object") return !record;
    return Object.keys(record).every(function (key) {
      var value = record[key];
      if (Array.isArray(value)) return value.length === 0 || value.every(function (item) { return item === "" || item == null; });
      return value === "" || value == null || value === false;
    });
  }

  function shouldUseDraftArray(value) {
    return !Array.isArray(value) || value.length === 0 || value.every(isBlankRecord);
  }

  function hasSellableVariant(variants) {
    return Array.isArray(variants) && variants.some(function (variant) {
      return Number(variant.mrp || 0) > 0 ||
        Number(variant.sellingPrice || variant.price || 0) > 0 ||
        Number(variant.stock || 0) > 0 ||
        (Array.isArray(variant.productIds) && variant.productIds.length > 0);
    });
  }

  function mergeComboDraftIntoPayload(payload) {
    var merged = Object.assign({}, payload || {});
    if (!merged.comboCatId && merged.comboCategoryId) merged.comboCatId = merged.comboCategoryId;
    if (!merged.comboCategoryId && merged.comboCatId) merged.comboCategoryId = merged.comboCatId;
    var priceInputs = readComboPriceInputs();
    if (!comboDraftPayload) {
      if (priceInputs.mrp) merged.mrp = priceInputs.mrp;
      if (priceInputs.sellingPrice) {
        merged.sellingPrice = priceInputs.sellingPrice;
        merged.price = priceInputs.sellingPrice;
      }
      merged.varients = [];
      delete merged.products;
      return merged;
    }

    ["catId", "subCatId", "subCatId2", "brandId", "comboCatId", "comboCategoryId"].forEach(function (key) {
      if ((merged[key] === "" || merged[key] == null) && comboDraftPayload[key] != null && comboDraftPayload[key] !== "") {
        merged[key] = comboDraftPayload[key];
      }
    });
    if (!merged.comboCatId && merged.comboCategoryId) merged.comboCatId = merged.comboCategoryId;
    if (!merged.comboCategoryId && merged.comboCatId) merged.comboCategoryId = merged.comboCatId;
    if (!merged.name && comboDraftPayload.name) merged.name = comboDraftPayload.name;
    if (priceInputs.mrp) merged.mrp = priceInputs.mrp;
    if (priceInputs.sellingPrice) {
      merged.sellingPrice = priceInputs.sellingPrice;
      merged.price = priceInputs.sellingPrice;
    }
    if (!merged.mrp && comboDraftPayload.mrp != null) merged.mrp = comboDraftPayload.mrp;
    if (!merged.sellingPrice && (comboDraftPayload.sellingPrice != null || comboDraftPayload.price != null)) {
      merged.sellingPrice = comboDraftPayload.sellingPrice != null ? comboDraftPayload.sellingPrice : comboDraftPayload.price;
      merged.price = merged.sellingPrice;
    }
    if (shouldUseDraftArray(merged.images) && Array.isArray(comboDraftPayload.images)) merged.images = comboDraftPayload.images;
    merged.varients = [];
    ["overView", "details", "tables", "information", "certificates", "supplements"].forEach(function (key) {
      if (shouldUseDraftArray(merged[key]) && Array.isArray(comboDraftPayload[key])) {
        merged[key] = comboDraftPayload[key];
      }
    });
    if (isBlankRecord(merged.brand) && comboDraftPayload.brand) merged.brand = comboDraftPayload.brand;
    var selectedIds = comboDraftPayload.selectedProductIds || comboDraftPayload.products || comboDraftPayload.productIds || [];
    if (Array.isArray(selectedIds) && selectedIds.length > 0) {
      merged.products = selectedIds.map(function (id) { return Number(id); }).filter(Boolean);
      merged.selectedProductIds = merged.products;
    } else {
      delete merged.products;
      delete merged.selectedProductIds;
    }
    return merged;
  }

  function installComboProductPicker() {
    if (window.__bnlInstallingComboPicker) return;
    window.__bnlInstallingComboPicker = true;
    if (!isComboFormPage()) { window.__bnlInstallingComboPicker = false; return; }
    var content = document.querySelector(".add_products__content");
    var form = document.querySelector(".add_products__content__form");
    if (!content || !form || content.querySelector("[data-bnl-combo-picker]")) { window.__bnlInstallingComboPicker = false; return; }

    var section = document.createElement("div");
    section.className = "bnl-combo-picker";
    section.setAttribute("data-bnl-combo-picker", "true");
    section.innerHTML = [
      '<div class="bnl-combo-picker__header">',
      "<div><h4>Build Combo from Products</h4><p>Select 2 or 3 products from the catalog, preview the computed combo, then customize the form before saving.</p></div>",
      '<button type="button" class="bnl-combo-picker__open">Select Products</button>',
      "</div>",
      '<div class="bnl-combo-price-row">',
      '<div class="bnl-combo-price-field"><label for="bnl-combo-mrp">Combo MRP</label><input id="bnl-combo-mrp" data-bnl-combo-mrp type="number" min="0" step="0.01" placeholder="Enter combo MRP" /></div>',
      '<div class="bnl-combo-price-field"><label for="bnl-combo-price">Combo Price</label><input id="bnl-combo-price" data-bnl-combo-price type="number" min="0" step="0.01" placeholder="Enter combo price" /></div>',
      "</div>",
      '<div class="bnl-combo-preview" data-bnl-combo-preview hidden></div>'
    ].join("");
    content.insertBefore(section, form);
    section.querySelector(".bnl-combo-picker__open").addEventListener("click", function () {
      openComboProductPicker(section);
    });
    section.querySelectorAll("[data-bnl-combo-mrp],[data-bnl-combo-price]").forEach(function (input) {
      input.addEventListener("input", function () {
        if (!comboDraftPayload) return;
        var prices = readComboPriceInputs(section);
        comboDraftPayload.mrp = prices.mrp || comboDraftPayload.mrp;
        comboDraftPayload.sellingPrice = prices.sellingPrice || comboDraftPayload.sellingPrice;
        comboDraftPayload.price = comboDraftPayload.sellingPrice;
        updateComboPreviewCard(section, comboDraftPayload);
      });
    });
    updateComboPreviewCard(section, comboDraftPayload);
    loadComboEditPrices(section);
    window.__bnlInstallingComboPicker = false;
  }

  function hideComboVariantControls() {
    try {
      if (!isComboFormPage()) return;

      var heading = document.querySelector(".add_products__content__form__flash_sale h4");
      if (heading) {
        heading.textContent = heading.textContent.replace(/\s*[&,]\s*Varients/i, "").trim();
      }

      var variantLink = document.querySelector('a[href*="add_product_varients"]');
      if (variantLink) {
        variantLink.style.display = "none";
        variantLink.setAttribute("aria-hidden", "true");
      }
    } catch (error) {}
  }

  function openComboProductPicker(section) {
    var apiBase = "http://localhost:3002";
    var selected = [];
    var products = [];
    var loading = false;
    var searchTimer = null;

    var modal = document.createElement("div");
    modal.className = "bnl-combo-modal";
    modal.setAttribute("data-bnl-combo-modal", "true");
    modal.innerHTML = [
      '<div class="bnl-combo-modal__card" role="dialog" aria-modal="true">',
      '<div class="bnl-combo-modal__head"><h4>Select Combo Products</h4><button type="button" class="bnl-combo-modal__close">Close</button></div>',
      '<div class="bnl-combo-modal__body">',
      '<input class="bnl-combo-modal__search" type="search" placeholder="Search products" autocomplete="off" />',
      '<div class="bnl-combo-modal__selected"></div>',
      '<div class="bnl-combo-products"></div>',
      "</div>",
      '<div class="bnl-combo-modal__foot"><span class="bnl-combo-modal__status">Select 2 or 3 products.</span><div><button type="button" class="bnl-combo-modal__secondary">Cancel</button> <button type="button" class="bnl-combo-modal__primary">Build Preview</button></div></div>',
      "</div>"
    ].join("");
    document.body.appendChild(modal);

    var searchInput = modal.querySelector(".bnl-combo-modal__search");
    var selectedNode = modal.querySelector(".bnl-combo-modal__selected");
    var productsNode = modal.querySelector(".bnl-combo-products");
    var statusNode = modal.querySelector(".bnl-combo-modal__status");

    function closeModal() {
      if (searchTimer) window.clearTimeout(searchTimer);
      modal.remove();
    }

    function setStatus(message, isError) {
      statusNode.className = isError ? "bnl-combo-modal__error" : "bnl-combo-modal__status";
      statusNode.textContent = message || "";
    }

    function productId(product) {
      return String(product && (product.id || product.productId || product._id || ""));
    }

    function isSelected(product) {
      var id = productId(product);
      return selected.some(function (item) { return productId(item) === id; });
    }

    function renderSelected() {
      selectedNode.innerHTML = "";
      if (!selected.length) {
        selectedNode.textContent = "No products selected.";
        return;
      }
      selected.forEach(function (product) {
        var chip = document.createElement("span");
        chip.className = "bnl-combo-chip";
        chip.textContent = product.name || "Product";
        var remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "x";
        remove.addEventListener("click", function () {
          selected = selected.filter(function (item) { return productId(item) !== productId(product); });
          renderSelected();
          renderProducts();
        });
        chip.appendChild(remove);
        selectedNode.appendChild(chip);
      });
    }

    function renderProducts() {
      productsNode.innerHTML = "";
      if (loading) {
        productsNode.textContent = "Loading products...";
        return;
      }
      if (!products.length) {
        productsNode.textContent = "No products found.";
        return;
      }
      products.forEach(function (product) {
        var row = document.createElement("div");
        row.className = "bnl-combo-product";
        var image = document.createElement("img");
        var imageUrl = getProductImage(product);
        if (imageUrl) image.src = imageUrl;
        image.alt = product.name || "Product";
        var info = document.createElement("div");
        var name = document.createElement("strong");
        name.textContent = product.name || "Product";
        var meta = document.createElement("span");
        meta.textContent = getProductPriceSummary(product);
        var button = document.createElement("button");
        button.type = "button";
        button.textContent = isSelected(product) ? "Selected" : "Select";
        if (isSelected(product)) button.className = "is-selected";
        button.addEventListener("click", function () {
          if (isSelected(product)) {
            selected = selected.filter(function (item) { return productId(item) !== productId(product); });
          } else if (selected.length >= 3) {
            setStatus("Combo can include only 3 products.", true);
            return;
          } else {
            selected.push(product);
          }
          setStatus("Selected " + selected.length + " product" + (selected.length === 1 ? "" : "s") + ".", false);
          renderSelected();
          renderProducts();
        });
        info.appendChild(name);
        info.appendChild(meta);
        info.appendChild(button);
        row.appendChild(image);
        row.appendChild(info);
        productsNode.appendChild(row);
      });
    }

    function fetchProducts(query) {
      loading = true;
      renderProducts();
      fetch(apiBase + "/admin/all-products?limit=24&search=" + encodeURIComponent(query || ""), {
        headers: getAdminAuthHeaders(false)
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          products = normalizeProductsResponse(data);
          loading = false;
          renderProducts();
        })
        .catch(function () {
          products = [];
          loading = false;
          setStatus("Unable to load products.", true);
          renderProducts();
        });
    }

    function buildPreview() {
      if (selected.length < 2 || selected.length > 3) {
        setStatus("Select 2 or 3 products to build a combo.", true);
        return;
      }
      var comboCatId = getComboSelectValue("add_products__content__form__brand_cat__combo_category");
      var body = {
        products: selected.map(function (product) { return Number(productId(product)); }).filter(Boolean)
      };
      var prices = readComboPriceInputs(section);
      if (prices.mrp) body.mrp = prices.mrp;
      if (prices.sellingPrice) {
        body.sellingPrice = prices.sellingPrice;
        body.price = prices.sellingPrice;
      }
      if (comboCatId) {
        body.comboCatId = comboCatId;
        body.comboCategoryId = comboCatId;
      }
      setStatus("Building preview...", false);
      fetch(apiBase + "/admin/combo-products/preview", {
        method: "POST",
        headers: getAdminAuthHeaders(true),
        body: JSON.stringify(body)
      })
        .then(function (res) {
          return res.json().then(function (data) {
            if (!res.ok || data.status === false) {
              var message = data.message || (data.errors && data.errors[0] && data.errors[0].msg) || "Unable to build preview.";
              throw new Error(message);
            }
            return data;
          });
        })
        .then(function (data) {
          applyComboPreviewToForm(data.data, section);
          closeModal();
        })
        .catch(function (error) {
          setStatus(error.message || "Unable to build preview.", true);
        });
    }

    modal.querySelector(".bnl-combo-modal__close").addEventListener("click", closeModal);
    modal.querySelector(".bnl-combo-modal__secondary").addEventListener("click", closeModal);
    modal.querySelector(".bnl-combo-modal__primary").addEventListener("click", buildPreview);
    modal.addEventListener("click", function (event) {
      if (event.target === modal) closeModal();
    });
    searchInput.addEventListener("input", function () {
      if (searchTimer) window.clearTimeout(searchTimer);
      searchTimer = window.setTimeout(function () {
        fetchProducts(searchInput.value);
      }, 250);
    });

    renderSelected();
    fetchProducts("");
    searchInput.focus();
  }

  function isJsonMutation(method, url, key) {
    return /^(POST|PUT|PATCH)$/i.test(method || "") && String(url || "").indexOf(key) !== -1;
  }

  function rewriteAdminOrderUrl(url) {
    if (typeof url !== "string" || url.indexOf("order/cancel/") === -1) return url;
    return url.replace(/(^|\/)order\/cancel\//, "$1admin/order/reject/");
  }

  function getCurrentOrder() {
    var routeState = window.history && window.history.state;
    return (
      routeState &&
      routeState.usr &&
      routeState.usr.data
    ) || null;
  }

  function getCurrentOrderId() {
    var order = getCurrentOrder();
    var orderId = order && order.id;
    if (orderId) return orderId;

    return "";
  }

  function isCancelledOrderStatus(value) {
    var text = String(value || "").trim().toLowerCase();
    return (
      text === "cn" ||
      text === "cancel" ||
      text === "canceled" ||
      text === "cancelled" ||
      text.indexOf("cancel") !== -1
    );
  }

  function isCurrentOrderCancelled() {
    var order = getCurrentOrder();
    return Boolean(
      order &&
        (
          isCancelledOrderStatus(order.status) ||
          isCancelledOrderStatus(order.orderStatus) ||
          isCancelledOrderStatus(order.shippingStatus)
        )
    );
  }

  function updateCurrentOrderState(patch) {
    var routeState = window.history && window.history.state;
    if (!routeState || !routeState.usr || !routeState.usr.data) return null;

    var nextOrder = Object.assign({}, routeState.usr.data, patch || {});
    var nextState = Object.assign({}, routeState, {
      usr: Object.assign({}, routeState.usr, { data: nextOrder })
    });

    window.history.replaceState(nextState, "", window.location.href);
    return nextOrder;
  }

  function applyOrderActionResponse(data, isAccept) {
    var responseOrder = data && data.order ? data.order : {};
    var patch = Object.assign({}, responseOrder);

    if (!patch.status) {
      patch.status = isAccept ? "Accepted" : "Cancelled";
    }

    if (!isAccept && !patch.trackingID) {
      patch.trackingID = null;
    }

    return updateCurrentOrderState(patch);
  }

  function getCurrentOrderActionStatus() {
    var order = getCurrentOrder();
    return String(order && order.status ? order.status : "").trim();
  }

  function installOrderActionGuard() {
    if (window.__bnlOrderActionGuard) return;
    window.__bnlOrderActionGuard = true;

    document.addEventListener("click", function (event) {
      var button = event.target && event.target.closest && event.target.closest("button");
      if (!button || !document.querySelector(".orders_detail")) return;
      var action = (button.textContent || "").trim();
      if (action !== "Accept" && action !== "Reject") return;

      var orderId = getCurrentOrderId();
      if (!orderId) return;

      if (isCurrentOrderCancelled()) {
        event.preventDefault();
        event.stopImmediatePropagation();
        button.disabled = true;
        button.textContent = "Cancelled";
        alert("This order is already cancelled.");
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();

      var isAccept = action === "Accept";
      var originalText = button.textContent;
      button.disabled = true;
      button.textContent = isAccept ? "Accepting..." : "Rejecting...";

      fetch(
        "http://localhost:3002/" + (isAccept ? "order/accept/" : "admin/order/reject/") + encodeURIComponent(orderId),
        { method: isAccept ? "PUT" : "DELETE" }
      )
        .then(function (response) {
          return response.json().then(function (data) {
            if (!response.ok || !data.status) {
              throw new Error(data.message || (isAccept ? "Failed to accept order" : "Failed to reject order"));
            }
            return data;
          });
        })
        .then(function (data) {
          applyOrderActionResponse(data, isAccept);
          alert(
            data.message ||
              (isAccept
                ? "Order accepted and shipment created successfully."
                : "Order rejected. No shipment was created.")
          );
          location.reload();
        })
        .catch(function (error) {
          button.disabled = false;
          button.textContent = originalText;
          alert(error.message || (isAccept ? "Failed to accept order" : "Failed to reject order"));
        });
    }, true);
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatCurrency(value) {
    var amount = Number(value || 0);
    if (!Number.isFinite(amount)) amount = 0;
    return "Rs. " + amount.toFixed(2);
  }

  function getOrderLineItems(order) {
    var products = Array.isArray(order && order.product) ? order.product : [];
    return products.map(function (product, index) {
      var qty = Number(product.qty || (order.qty && order.qty[index]) || 0);
      var unitPrice = Number(
        product.unitPrice ||
          product.sellingPrice ||
          product.price ||
          product.mrp ||
          0
      );
      var lineTotal = Number(product.lineTotal || product.amount || unitPrice * qty);
      return {
        name: product.name || "Product",
        variant: [
          product.selectedUnits || product.weight,
          product.selectedFlavor || product.selectedFlavour || product.flavor,
        ].filter(Boolean).join(" - "),
        qty: qty,
        unitPrice: unitPrice,
        lineTotal: lineTotal,
      };
    });
  }

  function buildOrderDetailsHtml(order) {
    var address = order.address || {};
    var user = order.user || {};
    var items = getOrderLineItems(order);
    var shipping = Number(order.shippingCharge || order.shiping || 0);
    var subtotal = Number(order.subtotalAmount || order.totalAmount || order.amount || 0);
    var couponDiscount = Number(order.couponDiscount || 0);
    var walletDiscount = Number(order.walletDiscount || order.bglCash || 0);
    var finalAmount = Number(order.finalAmount || order.payableAmount || 0);
    if (!finalAmount) {
      finalAmount = Math.max(0, subtotal - couponDiscount - walletDiscount + shipping);
    }

    var addressText = [
      address.name,
      address.phone,
      address.flat,
      address.landmark,
      address.city,
      address.state,
      address.pincode,
    ].filter(Boolean).join(", ");

    var rows = items.map(function (item) {
      return [
        "<tr>",
        "<td>", escapeHtml(item.name), item.variant ? "<br><small>" + escapeHtml(item.variant) + "</small>" : "", "</td>",
        "<td>", escapeHtml(item.qty), "</td>",
        "<td>", escapeHtml(formatCurrency(item.unitPrice)), "</td>",
        "<td>", escapeHtml(formatCurrency(item.lineTotal)), "</td>",
        "</tr>",
      ].join("");
    }).join("");

    return [
      "<!doctype html><html><head><meta charset=\"utf-8\"><title>Order ",
      escapeHtml(order.orderID || order.id || ""),
      "</title><style>",
      "body{font-family:Arial,sans-serif;color:#111;margin:32px;}h1{font-size:24px;margin:0 0 16px;}h2{font-size:16px;margin:24px 0 8px;}table{width:100%;border-collapse:collapse;margin-top:12px;}th,td{border:1px solid #ddd;padding:10px;text-align:left;font-size:13px;}th{background:#f5f5f5}.grid{display:grid;grid-template-columns:1fr 1fr;gap:10px 24px;font-size:14px}.totals{margin-left:auto;max-width:320px}.totals div{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee}.muted{color:#666}.total{font-weight:700;font-size:16px}",
      "</style></head><body>",
      "<h1>Order Details</h1>",
      "<div class=\"grid\">",
      "<div><strong>Order ID:</strong> ", escapeHtml(order.orderID || order.id || "N/A"), "</div>",
      "<div><strong>Status:</strong> ", escapeHtml(order.status || "N/A"), "</div>",
      "<div><strong>Tracking ID:</strong> ", escapeHtml(order.trackingID || "N/A"), "</div>",
      "<div><strong>Payment:</strong> ", escapeHtml(order.paymentMethod || "N/A"), "</div>",
      "<div><strong>Customer:</strong> ", escapeHtml(user.name || address.name || "N/A"), "</div>",
      "<div><strong>Email:</strong> ", escapeHtml(user.email || "N/A"), "</div>",
      "<div style=\"grid-column:1/-1\"><strong>Address:</strong> ", escapeHtml(addressText || "N/A"), "</div>",
      "</div>",
      "<h2>Products</h2>",
      "<table><thead><tr><th>Product</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead><tbody>",
      rows || "<tr><td colspan=\"4\">No products found</td></tr>",
      "</tbody></table>",
      "<h2>Summary</h2>",
      "<div class=\"totals\">",
      "<div><span>Subtotal</span><span>", escapeHtml(formatCurrency(subtotal)), "</span></div>",
      "<div><span>Coupon</span><span>-", escapeHtml(formatCurrency(couponDiscount)), "</span></div>",
      "<div><span>Wallet</span><span>-", escapeHtml(formatCurrency(walletDiscount)), "</span></div>",
      "<div><span>Shipping</span><span>", escapeHtml(formatCurrency(shipping)), "</span></div>",
      "<div class=\"total\"><span>Final Amount</span><span>", escapeHtml(formatCurrency(finalAmount)), "</span></div>",
      "</div>",
      "<p class=\"muted\">Generated on ", escapeHtml(new Date().toLocaleString()), "</p>",
      "</body></html>",
    ].join("");
  }

  function sanitizePdfText(value) {
    return String(value == null ? "" : value)
      .replace(/[^\x20-\x7E]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function escapePdfText(value) {
    return sanitizePdfText(value)
      .replace(/\\/g, "\\\\")
      .replace(/\(/g, "\\(")
      .replace(/\)/g, "\\)");
  }

  function wrapPdfText(value, maxLength) {
    var words = sanitizePdfText(value).split(" ").filter(Boolean);
    var lines = [];
    var current = "";

    words.forEach(function (word) {
      if (word.length > maxLength) {
        if (current) {
          lines.push(current);
          current = "";
        }
        for (var index = 0; index < word.length; index += maxLength) {
          lines.push(word.slice(index, index + maxLength));
        }
        return;
      }

      var next = current ? current + " " + word : word;
      if (next.length > maxLength) {
        lines.push(current);
        current = word;
      } else {
        current = next;
      }
    });

    if (current) lines.push(current);
    return lines.length ? lines : [""];
  }

  function createPdfDocument(pageStreams) {
    var objects = [];
    function addObject(body) {
      objects.push(body);
      return objects.length;
    }

    var catalogId = addObject("<< /Type /Catalog /Pages 2 0 R >>");
    var pagesId = addObject("");
    var regularFontId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
    var boldFontId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
    var pageIds = [];

    pageStreams.forEach(function (stream) {
      var contentId = addObject(
        "<< /Length " + stream.length + " >>\nstream\n" + stream + "endstream"
      );
      var pageId = addObject(
        "<< /Type /Page /Parent " + pagesId + " 0 R /MediaBox [0 0 612 792] " +
          "/Resources << /Font << /F1 " + regularFontId + " 0 R /F2 " + boldFontId + " 0 R >> >> " +
          "/Contents " + contentId + " 0 R >>"
      );
      pageIds.push(pageId);
    });

    objects[pagesId - 1] =
      "<< /Type /Pages /Kids [" +
      pageIds.map(function (id) { return id + " 0 R"; }).join(" ") +
      "] /Count " + pageIds.length + " >>";

    var pdf = "%PDF-1.4\n";
    var offsets = [0];
    objects.forEach(function (body, index) {
      offsets.push(pdf.length);
      pdf += (index + 1) + " 0 obj\n" + body + "\nendobj\n";
    });

    var xrefOffset = pdf.length;
    pdf += "xref\n0 " + (objects.length + 1) + "\n";
    pdf += "0000000000 65535 f \n";
    for (var i = 1; i < offsets.length; i += 1) {
      pdf += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
    }
    pdf +=
      "trailer\n<< /Size " + (objects.length + 1) + " /Root " + catalogId + " 0 R >>\n" +
      "startxref\n" + xrefOffset + "\n%%EOF";

    return pdf;
  }

  function buildOrderDetailsPdf(order) {
    var address = order.address || {};
    var user = order.user || {};
    var items = getOrderLineItems(order);
    var shipping = Number(order.shippingCharge || order.shiping || 0);
    var subtotal = Number(order.subtotalAmount || order.totalAmount || order.amount || 0);
    var couponDiscount = Number(order.couponDiscount || 0);
    var walletDiscount = Number(order.walletDiscount || order.bglCash || 0);
    var finalAmount = Number(order.finalAmount || order.payableAmount || 0);
    if (!finalAmount) {
      finalAmount = Math.max(0, subtotal - couponDiscount - walletDiscount + shipping);
    }

    var addressText = [
      address.name,
      address.phone,
      address.flat,
      address.landmark,
      address.city,
      address.state,
      address.pincode,
    ].filter(Boolean).join(", ");

    var pages = [];
    var content = "";
    var y = 752;

    function pushPage() {
      if (content) pages.push(content);
      content = "";
      y = 752;
    }

    function ensureSpace(lines, lineHeight) {
      var required = (lines || 1) * (lineHeight || 14);
      if (y - required < 48) pushPage();
    }

    function addText(text, options) {
      options = options || {};
      var size = options.size || 10;
      var lineHeight = options.lineHeight || 14;
      var x = options.x || 50;
      var font = options.bold ? "/F2" : "/F1";
      var lines = wrapPdfText(text, options.maxLength || 92);
      ensureSpace(lines.length, lineHeight);
      lines.forEach(function (line) {
        content += "BT " + font + " " + size + " Tf 1 0 0 1 " + x + " " + y + " Tm (" + escapePdfText(line) + ") Tj ET\n";
        y -= lineHeight;
      });
    }

    function addGap(size) {
      y -= size || 8;
      if (y < 48) pushPage();
    }

    function addRule() {
      ensureSpace(1, 8);
      content += "0.82 0.82 0.82 RG 50 " + y + " m 562 " + y + " l S\n";
      y -= 12;
    }

    addText("Order Details", { bold: true, size: 22, lineHeight: 26 });
    addText("Generated on " + new Date().toLocaleString(), { size: 9, lineHeight: 12 });
    addRule();
    addText("Order ID: " + (order.orderID || order.id || "N/A"), { bold: true });
    addText("Status: " + (order.status || "N/A"));
    addText("Tracking ID: " + (order.trackingID || "N/A"));
    addText("Payment: " + (order.paymentMethod || "N/A"));
    addText("Customer: " + (user.name || address.name || "N/A"));
    addText("Email: " + (user.email || "N/A"));
    addText("Address: " + (addressText || "N/A"), { maxLength: 86 });
    addGap(10);
    addText("Products", { bold: true, size: 15, lineHeight: 18 });
    addRule();

    if (items.length) {
      items.forEach(function (item, index) {
        addText((index + 1) + ". " + item.name, { bold: true, maxLength: 82 });
        if (item.variant) addText("Variant: " + item.variant, { x: 64, maxLength: 78 });
        addText(
          "Qty: " + item.qty +
            " | Unit Price: " + formatCurrency(item.unitPrice) +
            " | Line Total: " + formatCurrency(item.lineTotal),
          { x: 64, maxLength: 78 }
        );
        addGap(4);
      });
    } else {
      addText("No products found");
    }

    addGap(8);
    addText("Summary", { bold: true, size: 15, lineHeight: 18 });
    addRule();
    addText("Subtotal: " + formatCurrency(subtotal));
    addText("Coupon: -" + formatCurrency(couponDiscount));
    addText("Wallet: -" + formatCurrency(walletDiscount));
    addText("Shipping: " + formatCurrency(shipping));
    addText("Final Amount: " + formatCurrency(finalAmount), { bold: true, size: 12, lineHeight: 16 });

    pushPage();
    return createPdfDocument(pages.length ? pages : [""]);
  }

  function downloadOrderDetails(order) {
    if (!order) {
      alert("Order details are not available yet.");
      return;
    }

    var pdf = buildOrderDetailsPdf(order);
    var blob = new Blob([pdf], { type: "application/pdf" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "order-" + String(order.orderID || order.id || "details") + ".pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  function installOrderDetailsDownload() {
    if (window.__bnlOrderDetailsDownload) return;
    window.__bnlOrderDetailsDownload = true;

    document.addEventListener("click", function (event) {
      var button = event.target && event.target.closest && event.target.closest("button");
      if (!button || !document.querySelector(".orders_detail")) return;

      var action = (button.textContent || "").trim().toLowerCase();
      if (action.indexOf("download") === -1 || action.indexOf("detail") === -1) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      downloadOrderDetails(getCurrentOrder());
    }, true);
  }

  function closestOrderActionScope(button) {
    var node = button;
    var depth = 0;
    while (node && depth < 8) {
      if (
        node.tagName === "TR" ||
        (node.className && String(node.className).toLowerCase().indexOf("order") !== -1)
      ) {
        return node;
      }
      node = node.parentElement;
      depth += 1;
    }
    return button.parentElement;
  }

  function normalizeCancelledOrderActions() {
    var detail = document.querySelector(".orders_detail");
    if (detail && isCurrentOrderCancelled()) {
      Array.prototype.slice.call(detail.querySelectorAll("button")).forEach(function (button) {
        var action = (button.textContent || "").trim();
        if (action !== "Accept" && action !== "Reject") return;
        button.disabled = true;
        button.textContent = "Cancelled";
        button.style.pointerEvents = "none";
      });
    }

    var detailStatus = getCurrentOrderActionStatus();
    if (detail && detailStatus && detailStatus !== "Processing") {
      Array.prototype.slice.call(detail.querySelectorAll("button")).forEach(function (button) {
        var action = (button.textContent || "").trim();
        if (action !== "Accept" && action !== "Reject") return;
        button.disabled = true;
        button.textContent = detailStatus === "Accepted" ? "Accepted" : detailStatus;
        button.style.pointerEvents = "none";
      });
    }

    Array.prototype.slice.call(document.querySelectorAll("button")).forEach(function (button) {
      var action = (button.textContent || "").trim();
      if (action !== "Accept" && action !== "Reject") return;

      var scope = closestOrderActionScope(button);
      var scopeText = scope ? scope.textContent || "" : "";
      if (!isCancelledOrderStatus(scopeText)) return;

      button.disabled = true;
      button.textContent = "Cancelled";
      button.style.pointerEvents = "none";
    });
  }

  function enhanceOrderDetailContact() {
    var order = getCurrentOrder();
    if (!order || !document.querySelector(".orders_detail")) return;

    var phone =
      (order.address && order.address.phone) ||
      (order.user && order.user.phone) ||
      "";
    if (!phone) return;

    var cards = document.querySelectorAll(".orders_detail__content__cards__customer");
    if (!cards || !cards.length) return;

    Array.prototype.slice.call(cards, 0, 2).forEach(function (card) {
      if (!card || card.querySelector("[data-bnl-order-phone]")) return;
      var phoneLine = document.createElement("p");
      phoneLine.setAttribute("data-bnl-order-phone", "true");
      phoneLine.textContent = "Phone: " + phone;
      card.appendChild(phoneLine);
    });
  }

  function patchRequests() {
    if (window.__bnlAdminRequestPatch) return;
    window.__bnlAdminRequestPatch = true;
    var originalFetch = window.fetch;
    var open = XMLHttpRequest.prototype.open;
    var send = XMLHttpRequest.prototype.send;

    if (typeof originalFetch === "function") {
      window.fetch = function (input, init) {
        if (typeof input === "string") {
          return originalFetch.call(this, rewriteAdminOrderUrl(input), init);
        }
        return originalFetch.apply(this, arguments);
      };
    }

    XMLHttpRequest.prototype.open = function (method, url) {
      var rewrittenUrl = rewriteAdminOrderUrl(url);
      this.__bnlMethod = method;
      this.__bnlUrl = rewrittenUrl;
      var args = Array.prototype.slice.call(arguments);
      args[1] = rewrittenUrl;
      return open.apply(this, args);
    };

    XMLHttpRequest.prototype.send = function (body) {
      this.addEventListener("load", function () {
        try {
          if (this.__bnlShouldClearFlavorDrafts && this.status >= 200 && this.status < 300) {
            clearFlavorDrafts();
          }
          if (this.__bnlShouldClearOfferBanner && this.status >= 200 && this.status < 300) {
            offerBannerImageValue = "";
            offerDraftProductIds = [];
            offerDraftProducts = [];
          }
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
          if (isJsonMutation(this.__bnlMethod, this.__bnlUrl, "/combo-products") && String(this.__bnlUrl || "").indexOf("/combo-products/preview") === -1) {
            body = JSON.stringify(mergeComboDraftIntoPayload(payload));
          }
          if (isJsonMutation(this.__bnlMethod, this.__bnlUrl, "/offers")) {
            if (payload.image && !payload.logo) payload.logo = payload.image;
            var payloadProductIds = normalizeOfferProductIdsForAdmin(payload.products);
            var selectedOfferProductIds = payloadProductIds.concat(offerDraftProductIds).filter(function (id, index, list) {
              return id && list.indexOf(id) === index;
            });
            if (selectedOfferProductIds.length > 0) payload.products = selectedOfferProductIds;
            if (offerBannerImageValue) {
              payload.banner = offerBannerImageValue;
              payload.bannerImage = offerBannerImageValue;
            } else if (!payload.banner && payload.image) {
              payload.banner = payload.image;
            }
            body = JSON.stringify(payload);
            this.__bnlShouldClearOfferBanner = true;
          }
          if (isJsonMutation(this.__bnlMethod, this.__bnlUrl, "/products") && Array.isArray(payload.varients)) {
            body = JSON.stringify(normalizeProductVariants(payload));
            this.__bnlShouldClearFlavorDrafts = true;
          }
        } catch (error) {}
      }
      return send.call(this, body);
    };
  }

  function loadComboEditPrices(section) {
    if (comboEditPricesLoaded) return;
    comboEditPricesLoaded = true;
    try {
      if (!isComboFormPage()) return;
      var nameInput = document.querySelector('.add_products__content__form input#name[name="name"]');
      if (!nameInput || !nameInput.value) return;

      var require = getWebpackRequire();
      if (!require) return;
      var storeModule = require(90);
      var store = storeModule && storeModule.Z;
      if (!store) return;
      var state = store.getState();
      var product = state && state.ProductVarients && state.ProductVarients.product;
      if (!product) return;

      var comboMrp = product.mrp || product.sellingPrice || 0;
      var comboPrice = product.sellingPrice || product.price || product.mrp || 0;
      if (Number(comboMrp) <= 0 && Number(comboPrice) <= 0) return;

      comboDraftPayload = {
        mrp: comboMrp,
        sellingPrice: comboPrice,
        price: comboPrice,
        name: product.name,
        images: product.images,
        details: product.details,
        brandId: product.brandId,
        catId: product.catId,
        subCatId: product.subCatId,
        comboCatId: product.comboCatId,
        comboCategoryId: product.comboCatId,
        products: product.products || product.selectedProductIds || [],
        selectedProductIds: product.selectedProductIds || product.products || [],
        varients: []
      };
      writeComboPriceInputs(section, comboDraftPayload);
      updateComboPreviewCard(section, comboDraftPayload);
    } catch (error) {}
  }

  function fixComboConfig() {
    try {
      var require = getWebpackRequire();
      if (!require) return;
      var configModule = require(3810);
      if (!configModule) return;
      var config = configModule.H;
      if (!config || !config.user) return;
      if (config.front && config.front.user && typeof config.front.user.combo === 'string') return;
      if (!config.front) config.front = {};
      if (!config.front.user) config.front.user = {};
      Object.keys(config.user).forEach(function(key) {
        if (typeof config.front.user[key] !== 'string' && typeof config.user[key] === 'string') {
          config.front.user[key] = config.user[key];
        }
      });
    } catch (error) {}
    try {
      if (config && config.front && config.front.user) {
        if (typeof config.front.user.combo !== "string") config.front.user.combo = "combo";
        if (typeof config.front.user.add_combo !== "string") config.front.user.add_combo = "add_combo";
      }
    } catch (e) {}
  }

  function fixComboNavButton() {
    try {
      if (/\/add_combo/.test(location.pathname)) return;
      var buttons = document.querySelectorAll("button, a");
      Array.prototype.slice.call(buttons).forEach(function (el) {
        if (el.__bnlComboFixed) return;
        var text = (el.textContent || "").trim().toLowerCase();
        if (text.indexOf("combo category") !== -1) return;
        if (text.indexOf("add combo") !== -1) {
          el.__bnlComboFixed = true;
          el.addEventListener("click", function (e) {
            e.stopPropagation();
            // AFTER (soft client-side navigation preserving React state)
            e.preventDefault();
            window.history.pushState({}, "", "/combo/add_combo");
            window.dispatchEvent(new PopStateEvent("popstate", { state: {} }));
          }, true);
        }
      });
    } catch (error) {}
  }

  function tick() {
    if (window.__bnlTickRunning) return;
    window.__bnlTickRunning = true;
    try {
      injectStyle();
      installBrandCountryField();
      installBlogToolbar();
      installFlavorPanels();
      installProductDraftGuard();
      cleanupProductDraftOnRouteChange();
      installComboProductPicker();
      installOfferBannerUpload();
      installOfferProductPicker();
      hideComboVariantControls();
      fixComboConfig();
      fixComboNavButton();
      enhanceOrderDetailContact();
      installOrderDetailsDownload();
      normalizeCancelledOrderActions();
    } catch (error) {}
    window.__bnlTickRunning = false;
    // The FAQ page is a React-controlled tree. Replacing its form/card nodes
    // from this runtime patch can make React crash on the first data rerender.
    // Keep the native FAQ screen active and avoid mutating that subtree.
  }

  // FAQ Enhancements - Heading dropdown and Edit functionality
  function installFAQEnhancements() {
    var faqForm = document.querySelector(".faq__content__form");
    if (!faqForm || faqForm.querySelector("[data-bnl-faq-enhanced]")) return;

    faqForm.setAttribute("data-bnl-faq-enhanced", "true");

    // Create styles for FAQ enhancements
    var faqStyle = document.createElement("style");
    faqStyle.textContent = [
      ".bnl-faq-heading-row{display:flex;gap:10px;align-items:flex-start;}",
      ".bnl-faq-heading-row>div{flex:1;}",
      ".bnl-faq-heading-select{height:42px;border:1px solid #d1d5db;border-radius:8px;padding:0 12px;width:100%;}",
      ".bnl-faq-actions{display:flex;gap:8px;}",
      ".bnl-faq-edit-btn,.bnl-faq-delete-btn{background:none;border:none;cursor:pointer;padding:4px;}",
      ".bnl-faq-edit-btn:hover,.bnl-faq-delete-btn:hover{opacity:0.7}",
      ".bnl-faq-edit-btn svg,.bnl-faq-delete-btn svg{width:18px;height:18px;}",
      ".bnl-faq-item-card{position:relative;}",
      ".bnl-faq-item-actions{position:absolute;top:10px;right:10px;display:flex;gap:8px;}",
      ".bnl-cancel-btn{background:#6b7280 !important;}"
    ].join("");
    document.head.appendChild(faqStyle);

    // Get API base URL
    var apiBase = "http://localhost:3002";
    var headings = [];
    var editingFaqId = null;

    // Fetch existing headings
    fetch(apiBase + "/admin/faqs/headings")
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data.headings) headings = data.headings;
      })
      .catch(function() {});

    // Create heading row with dropdown and input
    var headingRow = faqForm.querySelector(".faq__content__form__heading");
    if (!headingRow) return;

    var newHeadingRow = document.createElement("div");
    newHeadingRow.className = "bnl-faq-heading-row";
    newHeadingRow.innerHTML = [
      '<div><label>Select Heading</label>',
      '<select class="bnl-faq-heading-select" id="bnl-heading-select">',
      '<option value="">-- Select Existing --</option>',
      '</select></div>',
      '<div><label>Or Enter New Heading</label>',
      '<input type="text" id="bnl-new-heading" placeholder="Enter new heading" style="height:42px;border:1px solid #d1d5db;border-radius:8px;padding:0 12px;width:100%;"></input></div>'
    ].join("");

    var selectEl = newHeadingRow.querySelector("#bnl-heading-select");
    headings.forEach(function(h) {
      var opt = document.createElement("option");
      opt.value = h;
      opt.textContent = h;
      selectEl.appendChild(opt);
    });

    // Declare variables in outer scope for access in edit handlers
    var headingSelect = selectEl;
    var newHeadingInput = newHeadingRow.querySelector("#bnl-new-heading");

    selectEl.addEventListener("change", function() {
      var newInput = newHeadingRow.querySelector("#bnl-new-heading");
      if (this.value) {
        newInput.value = "";
      }
    });

    newHeadingRow.querySelector("#bnl-new-heading").addEventListener("input", function() {
      if (this.value) {
        selectEl.value = "";
      }
    });

    headingRow.parentNode.replaceChild(newHeadingRow, headingRow);

    // Update submit button
    var submitBtn = faqForm.querySelector("button");
    if (submitBtn) {
      submitBtn.textContent = "Add FAQ";
      submitBtn.id = "bnl-faq-submit-btn";
    }

    // Handle form submission
    faqForm.addEventListener("submit", function(e) {
      e.preventDefault();

      var heading = headingSelect.value || newHeadingInput.value;
      var question = faqForm.querySelector('input[name="question"]').value;
      var answer = faqForm.querySelector('input[name="answer"]').value;

      if (!heading || !question || !answer) {
        alert("Please fill all fields");
        return;
      }

      var url = apiBase + "/admin/faqs";
      var method = "POST";

      if (editingFaqId) {
        url = apiBase + "/admin/faqs/" + editingFaqId;
        method = "PUT";
      }

      fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heading: heading, question: question, answer: answer })
      })
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data.status) {
          // Reset form
          headingSelect.value = "";
          newHeadingInput.value = "";
          faqForm.querySelector('input[name="question"]').value = "";
          faqForm.querySelector('input[name="answer"]').value = "";
          submitBtn.textContent = "Add FAQ";
          editingFaqId = null;
          // Reload page to show updated data
          location.reload();
        } else {
          alert(data.message || "Error saving FAQ");
        }
      })
      .catch(function(err) {
        alert("Error saving FAQ");
      });
    });

    // Add edit/delete buttons to existing FAQ items
    setTimeout(function() {
      // First fetch all FAQs with their IDs
      fetch(apiBase + "/admin/faqs")
        .then(function(res) { return res.json(); })
        .then(function(data) {
          if (!data.faqs) return;
          
          // Map questions to their IDs
          var faqIdMap = {};
          Object.keys(data.faqs).forEach(function(heading) {
            data.faqs[heading].forEach(function(faq) {
              faqIdMap[faq.question] = faq.id;
            });
          });

          // Add buttons to each card
          var faqCards = document.querySelectorAll(".faq__content__faq_list__content__faq__content__card");
          faqCards.forEach(function(card) {
            if (card.querySelector(".bnl-faq-item-actions")) return;

            var questionEl = card.querySelector(".faq__content__faq_list__content__faq__content__card__content__question");
            var answerEl = card.querySelector(".faq__content__faq_list__content__faq__content__card__content__answer");
            if (!questionEl) return;

            var questionText = questionEl.textContent.trim();
            var answerText = answerEl ? answerEl.textContent.trim() : "";

            // Find the parent heading section to get the heading name
            var headingEl = card.closest(".faq__content__faq_list__content__faq");
            var headingText = "";
            if (headingEl) {
              var headingTitle = headingEl.querySelector("h4, .heading");
              if (headingTitle) headingText = headingTitle.textContent.trim();
            }

            // Get FAQ ID from the map using question text
            var faqId = faqIdMap[questionText] || Date.now();

        var actionsDiv = document.createElement("div");
        actionsDiv.className = "bnl-faq-item-actions";

        // Edit button (pencil icon)
        var editBtn = document.createElement("button");
        editBtn.className = "bnl-faq-edit-btn";
        editBtn.title = "Edit";
        editBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';
        editBtn.addEventListener("click", function() {
          headingSelect.value = headings.includes(headingText) ? headingText : "";
          newHeadingInput.value = headings.includes(headingText) ? "" : headingText;
          faqForm.querySelector('input[name="question"]').value = questionText;
          faqForm.querySelector('input[name="answer"]').value = answerText;
          submitBtn.textContent = "Update FAQ";
          editingFaqId = faqId;
          window.scrollTo({ top: 0, behavior: "smooth" });
        });

        // Delete button (trash icon)
        var deleteBtn = document.createElement("button");
        deleteBtn.className = "bnl-faq-delete-btn";
        deleteBtn.title = "Delete";
        deleteBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>';
        deleteBtn.addEventListener("click", function() {
          if (confirm("Are you sure you want to delete this FAQ?")) {
            fetch(apiBase + "/admin/faqs/" + faqId, { method: "DELETE" })
              .then(function(res) { return res.json(); })
              .then(function(data) {
                if (data.status) {
                  location.reload();
                } else {
                  alert(data.message || "Error deleting FAQ");
                }
              })
              .catch(function() {
                alert("Error deleting FAQ");
              });
          }
        });

        actionsDiv.appendChild(editBtn);
          actionsDiv.appendChild(deleteBtn);
          card.appendChild(actionsDiv);
        });
      });
    }, 1000);
  }

  patchRequests();
  installOrderActionGuard();
  var tickTimer = null;
  tick();
  new MutationObserver(function () {
    if (tickTimer) return;
    tickTimer = setTimeout(function () {
      tickTimer = null;
      tick();
    }, 150);
  }).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
