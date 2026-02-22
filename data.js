window.mockData = {
  commercialContextModel: {
    account: "Example Client Co.",
    opportunities: [
      {
        id: "agr-1",
        label: "AGR-1",
        stage: "Open",
        closeDate: "2024-10-12",
        origin: "Sales-led Quote"
      },
      {
        id: "agr-2",
        label: "AGR-2",
        stage: "Open",
        closeDate: "2025-02-03",
        origin: "Self-service Quote"
      },
      {
        id: "agr-3",
        label: "AGR-3",
        stage: "Open",
        closeDate: "2025-06-18",
        origin: "Sales-led Quote"
      }
    ],
    ccVersions: [
      {
        id: "CP-1001",
        version: "v1",
        effectiveStart: "2024-10-12",
        effectiveEnd: "2025-02-02",
        sourceOppId: "agr-1",
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
        id: "CP-1002",
        version: "v2",
        effectiveStart: "2025-02-03",
        effectiveEnd: "2025-06-17",
        sourceOppId: "agr-2",
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
        id: "CP-1003",
        version: "v3",
        effectiveStart: "2025-06-18",
        effectiveEnd: "-",
        sourceOppId: "agr-3",
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
      detail:
        "Agreement is upstream commercial agreement context for the Commercial Profile (CP). CPs can derive from one or multiple Agreements that are consolidated into a signle commercial snapshot."
    },
    {
      id: "commercial-context",
      detail:
        "Commercial Profile (CP) is the frozen, authoritative commercial snapshot derived from Agreements."
    },
    {
      id: "project-creation",
      detail:
        "Project is the execution container; an active Commercial Profile (CP) serves as the gate."
    },
    {
      id: "usage",
      detail: "Usage Records are captured as immutable execution facts tied to the Project."
    },
    {
      id: "invoice",
      detail:
        "Charge calculation derives Charges from Usage Records and the active Commercial Profile (CP); invoice assembly builds invoices from Charges."
    }
  ],
  billingUsageRecords: [
    {
      timestamp: "2025-03-18 09:14:22",
      service: "File translation",
      sku: "TR-STD",
      unitType: "Words",
      quantity: "8,420",
      jobId: "Project-ALP-014",
      customerId: "CUST-2049"
    },
    {
      timestamp: "2025-03-18 09:16:41",
      service: "MT request",
      sku: "MT-ADV",
      unitType: "Segments",
      quantity: "1,240",
      jobId: "Project-MT-552",
      customerId: "CUST-2049"
    },
    /*{
      timestamp: "2025-03-18 10:02:07",
      service: "QA review",
      sku: "QA-HUM",
      unitType: "Pages",
      quantity: "18",
      jobId: "Project-QA-7701",
      customerId: "CUST-2049"
    },
    {
      timestamp: "2025-03-18 10:15:33",
      service: "API call",
      sku: "API-REQ",
      unitType: "Requests",
      quantity: "42",
      jobId: "Project-API-9118",
      customerId: "CUST-2049"
    },
    {
      timestamp: "2025-03-18 11:04:02",
      service: "File translation",
      sku: "TR-STD",
      unitType: "Words",
      quantity: "5,300",
      jobId: "Project-ALP-015",
      customerId: "CUST-2049"
    }*/
  ],
  usageCaptureEvents: [
    {
      timestamp: "2025-03-18 09:14:22",
      service: "File translation",
      sku: "TR-STD",
      unitType: "Words",
      quantity: "8,420",
      jobId: "Project-ALP-014",
      customerId: "CUST-2049"
    },
    {
      timestamp: "2025-03-18 09:16:41",
      service: "MT request",
      sku: "MT-ADV",
      unitType: "Segments",
      quantity: "1,240",
      jobId: "Project-MT-552",
      customerId: "CUST-2049"
    },
    {
      timestamp: "2025-03-18 10:02:07",
      service: "QA review",
      sku: "QA-HUM",
      unitType: "Pages",
      quantity: "18",
      jobId: "Project-QA-7701",
      customerId: "CUST-2049"
    },
    {
      timestamp: "2025-03-18 10:15:33",
      service: "API call",
      sku: "API-REQ",
      unitType: "Requests",
      quantity: "42",
      jobId: "Project-API-9118",
      customerId: "CUST-2049"
    },
    {
      timestamp: "2025-03-18 11:04:02",
      service: "File translation",
      sku: "TR-STD",
      unitType: "Words",
      quantity: "5,300",
      jobId: "Project-ALP-015",
      customerId: "CUST-2049"
    }
  ],
  billingActiveContext: {
    id: "CP-1003",
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
      quantity: "8,420 words",
      unitPrice: "$0.08",
      amount: "$673.60",
      pricingSource: "CP-v3"
    },
    {
      chargeType: "MT-ADV",
      usageReference: "Machine Translation",
      quantity: "1,240 segments",
      unitPrice: "$0.02",
      amount: "$24.80",
      pricingSource: "CP-v3"
    }
  ],
  billRun: {
    id: "BR-2025-01",
    period: "Jan 1 - Jan 31, 2025",
    cadence: "Monthly",
    entity: "Example Vendor LLC",
    status: "Preview"
  },
  invoicePreview: {
    number: "INV-2025-01",
    date: "Feb 2, 2025",
    customer: "Example Client Co.",
    entity: "Example Vendor LLC",
    lineItems: [
      {
        item: "Translation",
        description: "Translation charge (TR-STD)",
        quantity: "8,420 words",
        unitPrice: "$0.08",
        lineTotal: "$673.60"
      },
      {
        item: "Machine Translation",
        description: "MT charge (MT-ADV)",
        quantity: "1,240 segments",
        unitPrice: "$0.02",
        lineTotal: "$24.80"
      }
    ],
    subtotal: "$698.40",
    total: "$698.40"
  }
};

