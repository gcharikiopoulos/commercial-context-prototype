(function () {
  // Small DOM helper to keep updates readable.
  function setText(id, value) {
    var node = document.getElementById(id);
    if (node) {
      node.textContent = value;
    }
  }

  // Table row builder for static mock data.
  function buildRow(cells) {
    var row = document.createElement("tr");
    cells.forEach(function (cellText) {
      var cell = document.createElement("td");
      cell.textContent = cellText;
      row.appendChild(cell);
    });
    return row;
  }

  function buildSnapshotRow(item, status, index) {
    var row = document.createElement("tr");
    row.className = status ? "snapshot-row is-" + status : "snapshot-row";

    var indexCell = document.createElement("td");
    indexCell.className = "snapshot-index";
    indexCell.textContent = index;
    row.appendChild(indexCell);

    var skuCell = document.createElement("td");
    skuCell.textContent = item.sku;
    if (status) {
      var badge = document.createElement("span");
      badge.className = "snapshot-badge";
      badge.textContent =
        status === "changed" ? "Changed" : status === "added" ? "Added" : "Removed";
      skuCell.appendChild(badge);
    }
    row.appendChild(skuCell);

    var unitCell = document.createElement("td");
    unitCell.textContent = item.unit;
    row.appendChild(unitCell);

    var priceCell = document.createElement("td");
    priceCell.textContent = item.unitPrice;
    row.appendChild(priceCell);

    return row;
  }

  function buildPricingSnapshotSection(current, previous) {
    var section = document.createElement("section");
    section.className = "pricing-snapshot";

    var header = document.createElement("div");
    header.className = "pricing-snapshot-header";

    var title = document.createElement("h6");
    title.textContent = "Pricing Terms";
    header.appendChild(title);

    var lock = document.createElement("span");
    lock.className = "lock-indicator";
    lock.textContent = "Finalized";
    header.appendChild(lock);
    section.appendChild(header);

    var helper = document.createElement("p");
    helper.className = "snapshot-helper";
    helper.textContent =
      "Commercial Profile (CP) pricing captured at creation time.";
    section.appendChild(helper);

    var table = document.createElement("table");
    table.className = "snapshot-table";
    table.setAttribute("aria-label", "Pricing Terms");

    var thead = document.createElement("thead");
    var headRow = document.createElement("tr");
    ["#", "SKU", "Unit", "Unit Price"].forEach(function (label) {
      var th = document.createElement("th");
      th.scope = "col";
      th.textContent = label;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    var tbody = document.createElement("tbody");

    var currentItems = current.pricingSnapshot || [];
    var previousItems = previous ? previous.pricingSnapshot || [] : [];
    var previousBySku = {};

    previousItems.forEach(function (item) {
      previousBySku[item.sku] = item;
    });

    var orderedSkus = [];
    var currentBySku = {};

    currentItems.forEach(function (item) {
      currentBySku[item.sku] = item;
    });

    previousItems.forEach(function (item) {
      orderedSkus.push(item.sku);
    });

    currentItems.forEach(function (item) {
      if (!previousBySku[item.sku]) {
        orderedSkus.push(item.sku);
      }
    });

    orderedSkus.forEach(function (sku, idx) {
      var currentItem = currentBySku[sku];
      var previousItem = previousBySku[sku];
      var status = null;
      var displayItem = currentItem || previousItem;

      if (!currentItem && previousItem) {
        status = "removed";
      } else if (currentItem && !previousItem) {
        status = "added";
      } else if (
        previousItem &&
        currentItem &&
        (previousItem.unitPrice !== currentItem.unitPrice ||
          previousItem.unit !== currentItem.unit)
      ) {
        status = "changed";
      }

      if (displayItem) {
        tbody.appendChild(buildSnapshotRow(displayItem, status, idx + 1));
      }
    });

    table.appendChild(tbody);
    section.appendChild(table);

    return section;
  }

  function toIsoDate(date) {
    return date.toISOString().slice(0, 10);
  }

  function dayBefore(isoDate) {
    var parts = isoDate.split("-");
    var year = Number(parts[0]);
    var month = Number(parts[1]) - 1;
    var day = Number(parts[2]);
    var date = new Date(Date.UTC(year, month, day - 1));
    return toIsoDate(date);
  }

  // Render the Commercial Profile creation model and bindings.
  function wireCommercialContextModel(model) {
    var opportunityCards = document.getElementById("opportunity-cards");
    var ccVersions = document.getElementById("cc-versions");
    var lineageText = document.getElementById("lineage-text");
    var activeOppId = null;
    var visibleOppCount = 1;
    var activeOppIndex = -1;

    if (!opportunityCards || !ccVersions) {
      return;
    }

    function clear(node) {
      while (node.firstChild) {
        node.removeChild(node.firstChild);
      }
    }

    function findOppById(oppId) {
      return model.opportunities.filter(function (opp) {
        return opp.id === oppId;
      })[0];
    }

    function findVersionByOpp(oppId) {
      return model.ccVersions.filter(function (cc) {
        return cc.sourceOppId === oppId;
      })[0];
    }

    function activateAgreement(index) {
      var opp = model.opportunities[index];
      if (!opp) {
        return;
      }

      activeOppId = opp.id;
      activeOppIndex = index;
      visibleOppCount = Math.max(1, index + 2);

      model.opportunities.forEach(function (item, idx) {
        if (idx <= index) {
          item.stage = "Closed Won";
        } else {
          item.stage = "Open";
        }
      });

      renderAll();
    }

    function renderAgreements() {
      clear(opportunityCards);
      model.opportunities.forEach(function (opp, index) {
        var isHidden = index >= visibleOppCount;
        var card = document.createElement("div");
        card.className = "card opp-card";
        card.setAttribute("role", "button");
        card.setAttribute("data-opp-id", opp.id);
        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "button");
        card.setAttribute("aria-pressed", opp.id === activeOppId ? "true" : "false");
        card.classList.toggle("is-active", opp.id === activeOppId);
        card.classList.toggle("is-muted", activeOppId && opp.id !== activeOppId);
        card.classList.toggle("is-hidden", isHidden);
        card.setAttribute("aria-hidden", isHidden ? "true" : "false");

        card.innerHTML =
          '<div class="card-header">' +
          "<h5>" +
          opp.label +
          "</h5>" +
          '<div class="card-badges">' +
          '<span class="status">' +
          opp.stage +
          "</span>" +
          "</div>" +
          "</div>" +
          '<p class="card-meta">Close date: ' +
          opp.closeDate +
          "</p>";

        if (!isHidden) {
          card.addEventListener("click", function () {
            activateAgreement(index);
          });
          card.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              activateAgreement(index);
            }
          });
        }

        opportunityCards.appendChild(card);
      });
    }

    function renderCCVersions() {
      clear(ccVersions);
      var activeOppIndex = model.opportunities.findIndex(function (opp) {
        return opp.id === activeOppId;
      });
      var hasActive = activeOppIndex >= 0;

      if (!hasActive) {
        var placeholder = document.createElement("div");
        placeholder.className = "card cc-card is-placeholder";
        placeholder.setAttribute("role", "listitem");
        placeholder.setAttribute("aria-live", "polite");
        placeholder.innerHTML =
          '<div class="card-header">' +
          "<h5>Commercial Profile pending</h5>" +
          '<span class="status">Inactive</span>' +
          "</div>" +
          "<p class=\"card-meta\">CP-1001 becomes active after AGR-1 closes.</p>";
        ccVersions.appendChild(placeholder);
      }

      model.ccVersions.forEach(function (cc, index) {
        var isActive = hasActive && index === activeOppIndex;
        var isExpired = hasActive && index < activeOppIndex;
        var isHidden = !hasActive || index > activeOppIndex;
        var previousVersion = index > 0 ? model.ccVersions[index - 1] : null;
        var nextVersion = model.ccVersions[index + 1];
        var effectiveEnd = cc.effectiveEnd;

        if (isActive) {
          effectiveEnd = "-";
        } else if (isExpired && nextVersion && nextVersion.effectiveStart) {
          effectiveEnd = dayBefore(nextVersion.effectiveStart);
        }
        var card = document.createElement("div");
        card.className = "card cc-card";
        card.setAttribute("role", "listitem");
        card.classList.toggle("is-active", isActive);
        card.classList.toggle("is-expired", isExpired);
        card.classList.toggle("is-hidden", isHidden);

        card.innerHTML =
          '<div class="card-header">' +
          "<h5>" +
          cc.id +
          "</h5>" +
          '<span class="status">' +
          (isActive ? "Active" : "Inactive") +
          "</span>" +
          "</div>" +
          "<dl>" +
          "<div><dt>Version</dt><dd>" +
          cc.version +
          "</dd></div>" +
          "<div><dt>Effective</dt><dd>" +
          cc.effectiveStart +
          " to " +
          effectiveEnd +
          "</dd></div>" +
          "<div><dt>Derived From</dt><dd>" +
          findOppById(cc.sourceOppId).label +
          "</dd></div>" +
          "</dl>";

        card.appendChild(buildPricingSnapshotSection(cc, previousVersion));
        ccVersions.appendChild(card);
      });
    }

    function renderLineage() {
      var activeOpp = findOppById(activeOppId);
      if (lineageText && activeOpp) {
        lineageText.textContent =
          "Derived from " + activeOpp.label + ". Used for lineage, not charge calculation.";
      }
    }

    function renderAll() {
      renderAgreements();
      renderCCVersions();
      renderLineage();
    }

    renderAll();
  }

  // Activate lifecycle steps and update the detail panel.
  function wireLifecycleFlow(lifecycleData) {
    var steps = Array.prototype.slice.call(
      document.querySelectorAll(
        "section[aria-labelledby=\"lifecycle-flow\"] .lifecycle-step"
      )
    );
    var detail = document.getElementById("lifecycle-detail");

    function activateStep(stepId) {
      steps.forEach(function (step) {
        step.classList.toggle("active", step.getAttribute("data-step") === stepId);
      });

      var match = lifecycleData.filter(function (item) {
        return item.id === stepId;
      })[0];

      if (detail && match) {
        detail.textContent = match.detail;
      }
    }

    steps.forEach(function (step) {
      step.addEventListener("click", function () {
        activateStep(step.getAttribute("data-step"));
      });
    });

    if (lifecycleData.length > 0) {
      activateStep(lifecycleData[0].id);
    }
  }

  function populateBillingUsage(rows) {
    var tbody = document.getElementById("billing-usage-rows");
    if (!tbody || !rows) {
      return;
    }

    rows.forEach(function (row) {
      tbody.appendChild(
        buildRow([
          row.timestamp,
          row.service,
          row.sku,
          row.unitType,
          row.quantity,
          row.jobId,
          row.customerId
        ])
      );
    });
  }

  function populateUsageCaptureEvents(events) {
    var tbody = document.getElementById("usage-capture-rows");
    if (!tbody) {
      return;
    }

    events.forEach(function (event) {
      tbody.appendChild(
        buildRow([
          event.timestamp,
          event.service,
          event.sku,
          event.unitType,
          event.quantity,
          event.jobId,
          event.customerId
        ])
      );
    });
  }

  function populateBillingContext(context) {
    var pricingBody = document.getElementById("billing-pricing-rows");
    if (!context) {
      return;
    }

    setText("billing-cc-id", context.id);
    setText("billing-cc-version", context.version);
    setText("billing-cc-status", context.status);
    setText("billing-cc-period", context.effectivePeriod);

    if (pricingBody && context.pricingSnapshot) {
      context.pricingSnapshot.forEach(function (item) {
        pricingBody.appendChild(
          buildRow([item.sku, item.unitPrice, item.unit])
        );
      });
    }
  }

  function populateBillingCharges(rows) {
    var tbody = document.getElementById("billing-charge-rows");
    if (!tbody || !rows) {
      return;
    }

    rows.forEach(function (row) {
      tbody.appendChild(
        buildRow([
          row.chargeType,
          row.usageReference,
          row.quantity,
          row.unitPrice,
          row.amount,
          row.pricingSource
        ])
      );
    });
  }

  function setBillRunStatus(status) {
    var normalized = status === "Final" ? "Final" : "Preview";
    var toggle = document.getElementById("bill-run-toggle");
    var invoicePanel = document.getElementById("invoice-preview-panel");
    var invoiceBadge = document.getElementById("invoice-status-badge");

    setText("bill-run-status", normalized);

    if (toggle) {
      toggle.textContent = normalized;
      toggle.setAttribute("aria-pressed", normalized === "Final");
      toggle.classList.toggle("is-finalized", normalized === "Final");
    }

    if (invoiceBadge) {
      invoiceBadge.textContent = normalized === "Final" ? "Final" : "Preview";
    }

    if (invoicePanel) {
      invoicePanel.classList.toggle("is-finalized", normalized === "Final");
    }
  }

  function wireBillRunToggle(initialStatus) {
    var toggle = document.getElementById("bill-run-toggle");
    if (!toggle) {
      return;
    }

    var status = initialStatus || "Preview";
    setBillRunStatus(status);

    toggle.addEventListener("click", function () {
      status = status === "Preview" ? "Final" : "Preview";
      setBillRunStatus(status);
    });
  }

  function populateBillRun(billRun) {
    if (!billRun) {
      return;
    }

    setText("bill-run-id", billRun.id);
    setText("bill-run-period", billRun.period);
    setText("bill-run-cadence", billRun.cadence);
    setText("bill-run-entity", billRun.entity);
  }

  function populateBillRunCharges(rows, period) {
    var tbody = document.getElementById("bill-run-charge-rows");
    if (!tbody || !rows) {
      return;
    }

    rows.forEach(function (row, index) {
      var chargeId = "CHG-" + String(index + 1).padStart(4, "0");
      var source = row.pricingSource || "ChargeCalc";
      tbody.appendChild(
        buildRow([
          chargeId,
          row.chargeType,
          row.quantity,
          row.amount,
          period || "-",
          source
        ])
      );
    });
  }

  function populateInvoicePreview(invoice) {
    var tbody = document.getElementById("invoice-line-rows");
    if (!invoice || !tbody) {
      return;
    }

    setText("invoice-number", invoice.number);
    setText("invoice-date", invoice.date);
    setText("invoice-customer", invoice.customer);
    setText("invoice-entity", invoice.entity);
    setText("invoice-subtotal", invoice.subtotal);
    setText("invoice-total", invoice.total);

    if (invoice.lineItems) {
      invoice.lineItems.forEach(function (item) {
        tbody.appendChild(
          buildRow([
            item.item,
            item.description,
            item.quantity,
            item.unitPrice,
            item.lineTotal
          ])
        );
      });
    }
  }

  // Toggle scenario text between manual and deterministic states.
  

  // Dynamic tab navigation derived from section headings.
  function wirePresentationNav() {
    var main = document.querySelector("main");
    var sections = Array.prototype.slice.call(document.querySelectorAll("main > section"));
    var tabContainer = document.getElementById("nav-tabs");
    var buttons = [];

    if (!main || sections.length === 0 || !tabContainer) {
      return;
    }

    function clear(node) {
      while (node.firstChild) {
        node.removeChild(node.firstChild);
      }
    }

    function setActive(index) {
      buttons.forEach(function (button, idx) {
        button.classList.toggle("is-active", idx === index);
        button.setAttribute("aria-selected", idx === index ? "true" : "false");
      });
    }

    function goToSection(index) {
      var clamped = Math.max(0, Math.min(sections.length - 1, index));
      main.scrollLeft = sections[clamped].offsetLeft;
      setActive(clamped);
    }

    function buildTabs() {
      clear(tabContainer);
      buttons = sections.map(function (section, idx) {
        var heading = section.querySelector("h2");
        var label = heading ? heading.textContent.trim() : "Section " + (idx + 1);
        var button = document.createElement("button");
        var labelSpan = document.createElement("span");
        var annotationSpan = null;
        button.type = "button";
        button.className = "nav-tab-button";
        labelSpan.className = "nav-tab-label";
        labelSpan.textContent = label;
        button.appendChild(labelSpan);
        if (heading && heading.id) {
          var annotation = document.querySelector(
            '.lifecycle-step[data-step="' + heading.id + '"] .step-annotation'
          );
          if (annotation && annotation.textContent.trim()) {
            annotationSpan = document.createElement("span");
            annotationSpan.className = "nav-tab-subtext";
            annotationSpan.textContent = annotation.textContent.trim();
            button.appendChild(annotationSpan);
          }
        }
        button.setAttribute("role", "tab");
        button.setAttribute("aria-selected", "false");
        button.addEventListener("click", function () {
          goToSection(idx);
        });
        tabContainer.appendChild(button);
        return button;
      });
    }

    function syncToScroll() {
      var scrollLeft = main.scrollLeft;
      var closestIndex = 0;
      var closestDistance = Infinity;

      sections.forEach(function (section, idx) {
        var distance = Math.abs(section.offsetLeft - scrollLeft);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = idx;
        }
      });

      setActive(closestIndex);
    }

    buildTabs();
    setActive(0);

    main.addEventListener("scroll", function () {
      window.requestAnimationFrame(syncToScroll);
    });

    window.addEventListener("resize", function () {
      syncToScroll();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var data = window.mockData;
    if (!data) {
      return;
    }

    wireCommercialContextModel(data.commercialContextModel);
    wireLifecycleFlow(data.lifecycle);
    populateUsageCaptureEvents(data.usageCaptureEvents || []);
    populateBillingUsage(data.billingUsageRecords || []);
    populateBillingContext(data.billingActiveContext || null);
    populateBillingCharges(data.billingCharges || []);
    populateBillRun(data.billRun || null);
    populateBillRunCharges(
      data.billingCharges || [],
      data.billRun ? data.billRun.period : null
    );
    populateInvoicePreview(data.invoicePreview || null);
    wireBillRunToggle(data.billRun ? data.billRun.status : "Preview");
    wirePresentationNav();
  });
})();

