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
    title.textContent = "Pricing Snapshot";
    header.appendChild(title);

    var lock = document.createElement("span");
    lock.className = "lock-indicator";
    lock.textContent = "LOCKED";
    header.appendChild(lock);
    section.appendChild(header);

    var helper = document.createElement("p");
    helper.className = "snapshot-helper";
    helper.textContent = "Prices snapshotted at CC creation time";
    section.appendChild(helper);

    var table = document.createElement("table");
    table.className = "snapshot-table";
    table.setAttribute("aria-label", "Pricing snapshot");

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

  // Render the Commercial Context creation model and bindings.
  function wireCommercialContextModel(model) {
    var accountName = document.getElementById("account-name");
    var opportunityCards = document.getElementById("opportunity-cards");
    var ccVersions = document.getElementById("cc-versions");
    var lineageText = document.getElementById("lineage-text");
    var activeOppId = null;

    if (!accountName || !opportunityCards || !ccVersions) {
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

    function renderOpportunities() {
      clear(opportunityCards);
      model.opportunities.forEach(function (opp) {
        var card = document.createElement("div");
        card.className = "card opp-card";
        card.setAttribute("role", "button");
        card.setAttribute("data-opp-id", opp.id);
        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "button");
        card.setAttribute("aria-pressed", opp.id === activeOppId ? "true" : "false");
        card.classList.toggle("is-active", opp.id === activeOppId);
        card.classList.toggle("is-muted", activeOppId && opp.id !== activeOppId);

        card.innerHTML =
          '<div class="card-header">' +
          "<h5>" +
          opp.label +
          "</h5>" +
          '<span class="status">' +
          opp.stage +
          "</span>" +
          "</div>" +
          '<p class="card-meta">Close date: ' +
          opp.closeDate +
          "</p>";

        function applyOpportunity() {
          activeOppId = opp.id;
          renderAll();
        }

        card.addEventListener("click", applyOpportunity);
        card.addEventListener("keydown", function (event) {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            applyOpportunity();
          }
        });

        opportunityCards.appendChild(card);
      });
    }

    function renderCCVersions() {
      clear(ccVersions);
      var activeOppIndex = model.opportunities.findIndex(function (opp) {
        return opp.id === activeOppId;
      });
      var hasActive = activeOppIndex >= 0;

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
          (isActive ? "Active" : "Expired") +
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
          "Derived from " + activeOpp.label + ". Used for lineage, not billing execution.";
      }
    }

    function renderAll() {
      if (accountName) {
        accountName.textContent = model.account;
      }
      renderOpportunities();
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

  // Render mock usage rows.
  function populateUsage(rows) {
    var tbody = document.getElementById("usage-rows");
    if (!tbody) {
      return;
    }

    rows.forEach(function (row) {
      tbody.appendChild(
        buildRow([row.date, row.service, row.units, row.rate, row.amount])
      );
    });
  }

  // Render mock invoice rows.
  function populateInvoices(rows) {
    var tbody = document.getElementById("invoice-rows");
    if (!tbody) {
      return;
    }

    rows.forEach(function (row) {
      tbody.appendChild(
        buildRow([row.item, row.description, row.quantity, row.unitPrice, row.total, row.source])
      );
    });
  }

  // Toggle scenario text between manual and deterministic states.
  function wireScenarioToggles(scenarios) {
    var toggles = Array.prototype.slice.call(
      document.querySelectorAll("[data-scenario-toggle]")
    );

    toggles.forEach(function (toggle) {
      var scenarioKey = toggle.getAttribute("data-scenario-toggle");
      var scenarioCard = document.querySelector(
        "[data-scenario='" + scenarioKey + "']"
      );
      var scenarioState = scenarioCard
        ? scenarioCard.querySelector(".scenario-state")
        : null;

      function updateScenarioState(isDeterministic) {
        if (!scenarioCard || !scenarioState) {
          return;
        }

        scenarioCard.classList.toggle("is-deterministic", isDeterministic);
        scenarioState.textContent = isDeterministic
          ? scenarios[scenarioKey].deterministicText
          : scenarios[scenarioKey].manualText;
      }

      updateScenarioState(false);

      toggle.addEventListener("change", function () {
        updateScenarioState(toggle.checked);
      });
    });
  }

  // Simple left/right navigation between sections.
  function wirePresentationNav() {
    var main = document.querySelector("main");
    var sections = Array.prototype.slice.call(document.querySelectorAll("main > section"));
    var prevButton = document.getElementById("nav-prev");
    var nextButton = document.getElementById("nav-next");
    var index = 0;

    if (!main || sections.length === 0 || !prevButton || !nextButton) {
      return;
    }

    function updateButtons() {
      prevButton.disabled = index === 0;
      nextButton.disabled = index === sections.length - 1;
    }

    function goToSection(newIndex) {
      index = Math.max(0, Math.min(sections.length - 1, newIndex));
      main.scrollLeft = sections[index].offsetLeft;
      updateButtons();
    }

    prevButton.addEventListener("click", function () {
      goToSection(index - 1);
    });

    nextButton.addEventListener("click", function () {
      goToSection(index + 1);
    });

    window.addEventListener("resize", function () {
      goToSection(index);
    });

    updateButtons();
  }

  document.addEventListener("DOMContentLoaded", function () {
    var data = window.mockData;
    if (!data) {
      return;
    }

    wireCommercialContextModel(data.commercialContextModel);
    wireLifecycleFlow(data.lifecycle);
    populateUsage(data.usageRows);
    populateInvoices(data.invoiceRows);
    wireScenarioToggles(data.scenarios);
    wirePresentationNav();
  });
})();
