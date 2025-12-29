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
  billingUsageRecords: [
    {
      date: "2025-07-02",
      service: "Translation",
      units: "10,000",
      unitType: "Words"
    },
    {
      date: "2025-07-02",
      service: "Machine Translation",
      units: "20,000",
      unitType: "Words"
    }
  ],
  usageCaptureEvents: [
    {
      timestamp: "2025-03-18 09:14:22",
      service: "File translation",
      unitType: "Words",
      quantity: "8,420",
      jobId: "Project-ALP-014",
      customerId: "CUST-2049"
    },
    {
      timestamp: "2025-03-18 09:16:41",
      service: "MT request",
      unitType: "Segments",
      quantity: "1,240",
      jobId: "Job-MT-552",
      customerId: "CUST-2049"
    },
    {
      timestamp: "2025-03-18 10:02:07",
      service: "QA job",
      unitType: "Pages",
      quantity: "18",
      jobId: "QA-7701",
      customerId: "CUST-2049"
    },
    {
      timestamp: "2025-03-18 10:15:33",
      service: "API call",
      unitType: "Requests",
      quantity: "42",
      jobId: "API-9118",
      customerId: "CUST-2049"
    },
    {
      timestamp: "2025-03-18 11:04:02",
      service: "File translation",
      unitType: "Words",
      quantity: "5,300",
      jobId: "Project-ALP-015",
      customerId: "CUST-2049"
    }
  ],
  billingActiveContext: {
    id: "CC-1003",
    version: "v3",
    status: "Active",
    effectivePeriod: "2025-06-18 to Present",
    pricingSnapshot: [
      {
        sku: "TR-STD",
        unitPrice: "$0.08",
        unit: "Word"
      },
      {
        sku: "MT-ADV",
        unitPrice: "$0.02",
        unit: "Word"
      }
    ]
  },
  billingCharges: [
    {
      chargeType: "TR-STD",
      usageReference: "Translation",
      quantity: "10,000 words",
      unitPrice: "$0.08",
      amount: "$800.00",
      pricingSource: "CC v3"
    },
    {
      chargeType: "MT-ADV",
      usageReference: "Machine Translation",
      quantity: "20,000 words",
      unitPrice: "$0.02",
      amount: "$400.00",
      pricingSource: "CC v3"
    }
  ],
  billRun: {
    id: "BR-2025-01",
    period: "Jan 1 - Jan 31, 2025",
    cadence: "Monthly",
    entity: "Lilt, Inc.",
    status: "Preview"
  },
  invoicePreview: {
    number: "INV-2025-01 (Preview)",
    date: "Feb 2, 2025",
    customer: "Apex Global Holdings",
    entity: "Lilt, Inc.",
    lineItems: [
      {
        item: "Translation",
        description: "Translation charge (TR-STD)",
        quantity: "10,000 words",
        unitPrice: "$0.08",
        lineTotal: "$800.00"
      },
      {
        item: "Machine Translation",
        description: "MT charge (MT-ADV)",
        quantity: "20,000 words",
        unitPrice: "$0.02",
        lineTotal: "$400.00"
      }
    ],
    subtotal: "$1,200.00",
    total: "$1,200.00"
  }
};
