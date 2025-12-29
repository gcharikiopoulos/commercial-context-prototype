window.mockData = {
  commercialContextModel: {
    account: "Apex Global Holdings",
    opportunities: [
      {
        id: "opp-1",
        label: "Opp-1",
        stage: "Closed Won",
        closeDate: "2024-10-12"
      },
      {
        id: "opp-2",
        label: "Opp-2",
        stage: "Closed Won",
        closeDate: "2025-02-03"
      },
      {
        id: "opp-3",
        label: "Opp-3",
        stage: "Closed Won",
        closeDate: "2025-06-18"
      }
    ],
    ccVersions: [
      {
        id: "CC-1001",
        version: "v1",
        effectiveStart: "2024-10-12",
        effectiveEnd: "2025-02-02",
        sourceOppId: "opp-1",
        pricingSnapshot: [
          {
            sku: "TR-STD",
            unit: "Words",
            unitPrice: "$0.08"
          },
          {
            sku: "MT-ADV",
            unit: "Words",
            unitPrice: "$0.02"
          },
          {
            sku: "QA-HUM",
            unit: "Hours",
            unitPrice: "$45.00"
          }
        ]
      },
      {
        id: "CC-1002",
        version: "v2",
        effectiveStart: "2025-02-03",
        effectiveEnd: "2025-06-17",
        sourceOppId: "opp-2",
        pricingSnapshot: [
          {
            sku: "TR-STD",
            unit: "Words",
            unitPrice: "$0.09"
          },
          {
            sku: "MT-ADV",
            unit: "Words",
            unitPrice: "$0.02"
          },
          {
            sku: "QA-HUM",
            unit: "Hours",
            unitPrice: "$45.00"
          },
          {
            sku: "PM-DED",
            unit: "Hours",
            unitPrice: "$60.00"
          }
        ]
      },
      {
        id: "CC-1003",
        version: "v3",
        effectiveStart: "2025-06-18",
        effectiveEnd: "-",
        sourceOppId: "opp-3",
        pricingSnapshot: [
          {
            sku: "TR-STD",
            unit: "Words",
            unitPrice: "$0.09"
          },
          {
            sku: "QA-HUM",
            unit: "Hours",
            unitPrice: "$50.00"
          },
          {
            sku: "PM-DED",
            unit: "Hours",
            unitPrice: "$60.00"
          },
          {
            sku: "TR-ULTRA",
            unit: "Words",
            unitPrice: "$0.11"
          }
        ]
      }
    ],
    projects: [
      {
        id: "project-a",
        name: "Project A"
      },
      {
        id: "project-b",
        name: "Project B"
      },
      {
        id: "project-c",
        name: "Project C"
      }
    ]
  },
  lifecycle: [
    {
      id: "opportunity",
      detail: "Define the deal intent, scope, and expectations before any project exists."
    },
    {
      id: "commercial-context",
      detail: "Copy the account, opportunity, and pricing snapshot into a single commercial anchor."
    },
    {
      id: "project",
      detail: "Launch delivery with a deterministic link back to the agreed commercial context."
    },
    {
      id: "usage",
      detail: "Capture usage in a consistent format tied to the commercial context and project."
    },
    {
      id: "invoice",
      detail: "Generate invoices directly from usage and the pricing terms already agreed."
    }
  ],
  usageRows: [
    {
      date: "2025-01-12",
      service: "Translation - Standard",
      units: "12,500 words",
      rate: "$0.12",
      amount: "$1,500.00"
    },
    {
      date: "2025-01-18",
      service: "Review - Legal",
      units: "35 hours",
      rate: "$85.00",
      amount: "$2,975.00"
    }
  ],
  invoiceRows: [
    {
      item: "Usage",
      description: "Translation volume for January",
      quantity: "12,500 words",
      unitPrice: "$0.12",
      total: "$1,500.00",
      source: "Usage"
    },
    {
      item: "Commitment",
      description: "Monthly platform minimum",
      quantity: "1",
      unitPrice: "$5,000.00",
      total: "$5,000.00",
      source: "Commitment"
    },
    {
      item: "Adjustment",
      description: "One-time credit for onboarding",
      quantity: "1",
      unitPrice: "-$500.00",
      total: "-$500.00",
      source: "Adjustment"
    }
  ],
  scenarios: {
    "multiple-opportunities": {
      manualText: "Manual today ❌",
      deterministicText: "Deterministic with context ✅"
    },
    "mid-period-change": {
      manualText: "Manual today ❌",
      deterministicText: "Deterministic with context ✅"
    },
    "multi-entity-billing": {
      manualText: "Manual today ❌",
      deterministicText: "Deterministic with context ✅"
    }
  }
};


