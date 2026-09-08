import type { RollupNode } from '../types'

// Sourced from Will's HTML prototype (IDEA-2246-prototype 6.html, YEXT_DATA).
// 607 nodes, max depth 5 (root + 4), real Balance Sheet + Income Statement hierarchy.
//
// Source field shape was { n, l, id, c }. Normalized to RollupNode here:
//   n  -> name
//   l  -> level
//   id -> id  (root nodes had empty ids in the source; replaced with "root-<slug>")
//   c  -> children (omitted when empty)
// Source had no mapped-account counts; mappedCount is left undefined.

export const sampleRollup: RollupNode[] = [
  {
    "id": "root-balance-sheet",
    "name": "Balance Sheet",
    "level": 1,
    "children": [
      {
        "id": "87350ede-6ebd-42d1-8066-56c117f6707e.87f65187-2fb2-417f-8b30-f4bb1df17581",
        "name": "Right of use asset, long term",
        "level": 2
      },
      {
        "id": "87350ede-6ebd-42d1-8066-56c117f6707e.9868a748-d550-4107-9f43-06e21bf19a0d",
        "name": "Cash and Equivalents",
        "level": 2
      },
      {
        "id": "87350ede-6ebd-42d1-8066-56c117f6707e.fd4bb034-b755-4a65-98b5-009a6ad50f60",
        "name": "Restricted Cash, Short Term",
        "level": 2
      },
      {
        "id": "87350ede-6ebd-42d1-8066-56c117f6707e.988afae1-a305-4589-8bf0-cecc08ed8fb1",
        "name": "Long term debt",
        "level": 2
      },
      {
        "id": "87350ede-6ebd-42d1-8066-56c117f6707e.53ead825-6e0b-4059-a5be-734259c70463",
        "name": "Right of Use Asset Short Term",
        "level": 2
      },
      {
        "id": "87350ede-6ebd-42d1-8066-56c117f6707e.be0e0056-bdd6-4c22-965c-108b908a9485",
        "name": "Investments, noncurrent",
        "level": 2
      },
      {
        "id": "87350ede-6ebd-42d1-8066-56c117f6707e.f614af07-e91c-465d-89ac-f953cc395427",
        "name": "Restricted cash, long term",
        "level": 2
      },
      {
        "id": "87350ede-6ebd-42d1-8066-56c117f6707e.b45a201c-461b-4d4d-932c-1f417b450323",
        "name": "Goodwill",
        "level": 2
      },
      {
        "id": "87350ede-6ebd-42d1-8066-56c117f6707e.40c06084-6e2a-4528-b324-2e2fbecdb8f4",
        "name": "Deferred Commissions (long term) - 606",
        "level": 2
      },
      {
        "id": "87350ede-6ebd-42d1-8066-56c117f6707e.10d7aee4-550e-4817-a9b3-de326142828e",
        "name": "Other long term assets",
        "level": 2
      },
      {
        "id": "87350ede-6ebd-42d1-8066-56c117f6707e.10ba2ca6-9afb-4d0f-8d01-ecdc03acb6d5",
        "name": "Deferred tax asset, net of valuation allowance",
        "level": 2
      },
      {
        "id": "87350ede-6ebd-42d1-8066-56c117f6707e.9fab31c4-7b70-42dd-9834-96c45a772cc6",
        "name": "Balance Sheet Inactive",
        "level": 2
      },
      {
        "id": "87350ede-6ebd-42d1-8066-56c117f6707e.66e3f100-ea2f-4516-8bb1-04c1ba7d41c8",
        "name": "Deferred revenue, short term",
        "level": 2
      },
      {
        "id": "87350ede-6ebd-42d1-8066-56c117f6707e.cf08f6a9-a003-4547-8f08-a52a273d755b",
        "name": "Short term debt",
        "level": 2
      },
      {
        "id": "87350ede-6ebd-42d1-8066-56c117f6707e.e2a21eb8-e4c3-4151-80a5-3f283e8bc08e",
        "name": "Lease Liability Short Term",
        "level": 2
      },
      {
        "id": "87350ede-6ebd-42d1-8066-56c117f6707e.313671bc-fd01-4960-a7e3-7f77da5d3b32",
        "name": "Deferred rent, short term",
        "level": 2
      },
      {
        "id": "87350ede-6ebd-42d1-8066-56c117f6707e.271753de-fea4-4c60-b1ab-0da412727cb8",
        "name": "Deferred rent, non-current",
        "level": 2
      },
      {
        "id": "87350ede-6ebd-42d1-8066-56c117f6707e.704948af-188b-4305-bc27-31e7e6c04bdd",
        "name": "Lease liability, long term",
        "level": 2
      },
      {
        "id": "87350ede-6ebd-42d1-8066-56c117f6707e.f4d89b52-ec60-44a3-b65f-cdff18f6c9f8",
        "name": "Deferred tax liability",
        "level": 2
      },
      {
        "id": "87350ede-6ebd-42d1-8066-56c117f6707e.177cc6a5-cdcf-485a-91aa-48d6388fec15",
        "name": "Convertible Preferred Stock",
        "level": 2
      },
      {
        "id": "87350ede-6ebd-42d1-8066-56c117f6707e.0cdcc80d-6d8a-4f97-80bf-bf62cd910f67",
        "name": "Other long term liabilities",
        "level": 2,
        "children": [
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.0cdcc80d-6d8a-4f97-80bf-bf62cd910f67.27f49a26-a292-4378-b4ec-1fe068da92e5",
            "name": "Accrued Pension - Long Term",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.0cdcc80d-6d8a-4f97-80bf-bf62cd910f67.43f78df8-e994-49bc-91ca-409acc590f3a",
            "name": "Deferred Revenue - Long Term",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.0cdcc80d-6d8a-4f97-80bf-bf62cd910f67.fdd2c63e-2056-43c3-845a-03907b37d734",
            "name": "Accrued Earnout - Long Term",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.0cdcc80d-6d8a-4f97-80bf-bf62cd910f67.6280d6c4-8682-444b-b101-d23b4e8a1327",
            "name": "Accrued Taxes - Long Term",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.0cdcc80d-6d8a-4f97-80bf-bf62cd910f67.c7ea3ba2-6c3f-41a1-a34f-ba5ccd80f253",
            "name": "Accrued Liabilities - Long Term",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.0cdcc80d-6d8a-4f97-80bf-bf62cd910f67.ec72d466-1af0-4c49-b84d-aceb7435918b",
            "name": "Accrued Commissions Long Term",
            "level": 3
          }
        ]
      },
      {
        "id": "root-accounts-receivable-net",
        "name": "Accounts Receivable, Net",
        "level": 2,
        "children": [
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.4d8c1ab9-8cbe-43a2-9681-081e2be4461f.2f5c8506-9d08-4e8a-8618-341f06cd6883",
            "name": "Undeposited Funds",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.4d8c1ab9-8cbe-43a2-9681-081e2be4461f.0e9d00e7-dcdb-4be7-ad06-0ec069084c0b",
            "name": "Accounts Receivable",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.4d8c1ab9-8cbe-43a2-9681-081e2be4461f.5e864205-86c7-4875-9252-c607772edd1d",
            "name": "1125 - Accounts Receivable - Intercompany",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.4d8c1ab9-8cbe-43a2-9681-081e2be4461f.8478eb65-4595-46d7-b22a-adf18dacf780",
            "name": "Allowance for Bad Debts",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.4d8c1ab9-8cbe-43a2-9681-081e2be4461f.cf083bf6-f5c9-4c5b-9864-ffd16a2d26a4",
            "name": "1105 - Other Receivables",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.4d8c1ab9-8cbe-43a2-9681-081e2be4461f.696dced5-6917-4c28-8081-b00fbdc2a521",
            "name": "Unbilled Revenue",
            "level": 3
          }
        ]
      },
      {
        "id": "root-prepaid-expenses-and-other-current-assets",
        "name": "Prepaid expenses and other current assets",
        "level": 2,
        "children": [
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.0c5f53a7-e23f-433f-abe1-6ec61c15abd3.eee9f5d3-1df1-4015-be8e-4f558588aa2a",
            "name": "1425 - Partner Commitments",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.0c5f53a7-e23f-433f-abe1-6ec61c15abd3.cb70fc44-29e6-4bbc-89b8-361dc5b4c1ea",
            "name": "GST Receivable - India",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.0c5f53a7-e23f-433f-abe1-6ec61c15abd3.859ad5a9-3bdd-4ed5-a387-4375e15b7696",
            "name": "1399 - I/C Clearing Account",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.0c5f53a7-e23f-433f-abe1-6ec61c15abd3.9b497be0-3aa6-4d39-9d55-c69c3bfe2568",
            "name": "1315 - Cloud Computing",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.0c5f53a7-e23f-433f-abe1-6ec61c15abd3.01397490-2af4-4b29-8c85-c0caa83e06ca",
            "name": "1140 - Intercompany Receivable (Payable) - Hearsay",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.0c5f53a7-e23f-433f-abe1-6ec61c15abd3.fe57c1e2-d70b-47ed-b6e0-569e994b8187",
            "name": "1170 - Contract Asset - Current",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.0c5f53a7-e23f-433f-abe1-6ec61c15abd3.a5581678-59c0-40df-9207-4801def889bc",
            "name": "1171 - Contract Asset - Current - Acquisition",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.0c5f53a7-e23f-433f-abe1-6ec61c15abd3.cdae2c87-5f1f-4297-94b5-a2a2fa9b76a0",
            "name": "1130 - INACTIVE Intercompany Accounts Receivable",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.0c5f53a7-e23f-433f-abe1-6ec61c15abd3.9daf9c0a-568e-4e65-a294-6f9ff12afa8e",
            "name": "1132 - Intercompany Interest Receivable",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.0c5f53a7-e23f-433f-abe1-6ec61c15abd3.34748465-c648-4278-831e-871df688a5ed",
            "name": "1135 - Intercompany Note  Receivable",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.0c5f53a7-e23f-433f-abe1-6ec61c15abd3.3011b7f3-db36-4d96-80ab-a6a5dc4cb0d6",
            "name": "1430 - Intercompany Other Current Assets",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.0c5f53a7-e23f-433f-abe1-6ec61c15abd3.35a0bba9-c7d4-4d7d-a3fa-2103dfe7b5f0",
            "name": "Japan Consumption Tax Receivable",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.0c5f53a7-e23f-433f-abe1-6ec61c15abd3.b79a4780-3fb9-4362-8a0d-df9ae0aecb42",
            "name": "1331 - Other Current Assets",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.0c5f53a7-e23f-433f-abe1-6ec61c15abd3.469b75db-a583-47e4-b4b7-9cbe229a1fa2",
            "name": "1332 - Other Current Assets - Acquisition",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.0c5f53a7-e23f-433f-abe1-6ec61c15abd3.45267b24-0d23-481f-84df-af8b5e2e5909",
            "name": "1304 - Prepaid Expenses - Partner Service Delivery Recurring",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.0c5f53a7-e23f-433f-abe1-6ec61c15abd3.dc79348c-359d-48a5-86ff-58b6e4e3d046",
            "name": "Prepaid Expenses-Fixed",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.0c5f53a7-e23f-433f-abe1-6ec61c15abd3.c828804e-6af9-49ae-998d-ab6ab901ac90",
            "name": "1301 - Prepaid Expenses-Variable",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.0c5f53a7-e23f-433f-abe1-6ec61c15abd3.9818f6d7-b603-4557-8b10-20236ea8cb85",
            "name": "1305 - Prepaid Tax",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.0c5f53a7-e23f-433f-abe1-6ec61c15abd3.90761317-826b-405c-ba0c-5f30001d9c8a",
            "name": "Recoverable Draw",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.0c5f53a7-e23f-433f-abe1-6ec61c15abd3.3ece4314-488f-4970-95e5-26beec8ca55c",
            "name": "1327 - Rent Receivable",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.0c5f53a7-e23f-433f-abe1-6ec61c15abd3.9b10524f-d8ab-4bf4-86a1-e9bed3ca2baf",
            "name": "1345 - Security Deposits - Short Term",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.0c5f53a7-e23f-433f-abe1-6ec61c15abd3.9e852016-e5d4-41c7-96d8-cc4a9ff049aa",
            "name": "1350 - Software in Progress - Cloud Computing",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.0c5f53a7-e23f-433f-abe1-6ec61c15abd3.a2dc10f5-61ff-4c75-9824-852c6572a880",
            "name": "1328 - Sublease Rent (ST)",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.0c5f53a7-e23f-433f-abe1-6ec61c15abd3.ea8785fa-567f-4875-9aa6-e66f82d4ab86",
            "name": "1336 - VAT/GST Receivable",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.0c5f53a7-e23f-433f-abe1-6ec61c15abd3.a715a4f5-e48b-48e5-ad5e-36ded06ec543",
            "name": "99015 - VAT on Purchases",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.0c5f53a7-e23f-433f-abe1-6ec61c15abd3.41772c6c-9cee-4932-b01a-0ab8ba9abcaa",
            "name": "1303 - Prepaid Expenses- Partner Service Delivery 1x",
            "level": 3
          }
        ]
      },
      {
        "id": "root-deferred-commissions",
        "name": "Deferred commissions",
        "level": 2,
        "children": [
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.fc2ecef2-3129-4b61-a1a8-64463919f9f1.cb43d437-0e05-47dc-9ac0-74fc24ce96b2",
            "name": "1415 - Deferred Affiliates - 606",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.fc2ecef2-3129-4b61-a1a8-64463919f9f1.7b72d237-08a5-41c2-abd1-6a8dfeb932a0",
            "name": "Deferred Commissions - Short Term",
            "level": 3
          }
        ]
      },
      {
        "id": "root-accounts-payable-accrued-expenses-and-other-current-liabilities",
        "name": "Accounts Payable, accrued expenses and other current liabilities",
        "level": 2,
        "children": [
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.9c3dd20c-f25c-453f-b50b-2f3dd8a1cc29.710ebd2b-a93e-4f8a-95ef-d285ecdcdc38",
            "name": "Third Party Accrued Commissions",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.9c3dd20c-f25c-453f-b50b-2f3dd8a1cc29.cfe09454-cc34-43da-aa54-be451b6465f0",
            "name": "Accounts Payable",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.9c3dd20c-f25c-453f-b50b-2f3dd8a1cc29.4964e563-0ae4-4064-947c-9e7021c47419",
            "name": "T&E Payable",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.9c3dd20c-f25c-453f-b50b-2f3dd8a1cc29.8e055547-84d7-4941-820d-4b8e5bdf7ae8",
            "name": "Accrued Bonus",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.9c3dd20c-f25c-453f-b50b-2f3dd8a1cc29.6da94e37-0152-4937-8081-b8ad47af7408",
            "name": "Accrued Commissions",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.9c3dd20c-f25c-453f-b50b-2f3dd8a1cc29.a719d898-af8b-4533-9668-eac866969ca5",
            "name": "Accrued Taxes",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.9c3dd20c-f25c-453f-b50b-2f3dd8a1cc29.e1f08e87-f132-4c67-b1ab-ff6f2b9c5703",
            "name": "2460 - Customer Deposits - 606",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.9c3dd20c-f25c-453f-b50b-2f3dd8a1cc29.3956705a-7494-4a68-815e-4b5876416cfe",
            "name": "Accrued Expense",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.9c3dd20c-f25c-453f-b50b-2f3dd8a1cc29.77320db1-a991-473b-9d82-e668f50c5556",
            "name": "Accrued Payroll",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.9c3dd20c-f25c-453f-b50b-2f3dd8a1cc29.e1d46018-233b-4096-99b9-c4d400a7b6a0",
            "name": "Accrued Earnout",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.9c3dd20c-f25c-453f-b50b-2f3dd8a1cc29.ba786f20-e3ee-4e35-8e79-28f25ecff181",
            "name": "2421 - ESPP Liability",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.9c3dd20c-f25c-453f-b50b-2f3dd8a1cc29.2f0b0eef-c105-4d2f-a8c9-b09c21e997e9",
            "name": "Accrued Equity",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.9c3dd20c-f25c-453f-b50b-2f3dd8a1cc29.a44c6b5b-bffb-4632-a84c-922aa3308678",
            "name": "Intercompany Payable",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.9c3dd20c-f25c-453f-b50b-2f3dd8a1cc29.cf100970-0b76-46ba-a33c-94deb3436fef",
            "name": "Other Current Liabilities",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.9c3dd20c-f25c-453f-b50b-2f3dd8a1cc29.04a00d0c-1965-40e5-98cf-05e9cafac4dd",
            "name": "Japan Consumption Tax Payable",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.9c3dd20c-f25c-453f-b50b-2f3dd8a1cc29.c8fc21d1-5e87-4148-b5a4-c9e0a3770a3d",
            "name": "2250 - Sales Allowance Reserve",
            "level": 3
          }
        ]
      },
      {
        "id": "root-property-and-equipment-net",
        "name": "Property and equipment, net",
        "level": 2,
        "children": [
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.87003fec-1d21-491c-aded-e2ed2a1f4f5f.95510e13-0484-4276-be5e-3df90432b205",
            "name": "Asset Retirement Obligation",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.87003fec-1d21-491c-aded-e2ed2a1f4f5f.de077d12-1a92-4a4e-96c5-4510cf215d8e",
            "name": "Computer Software",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.87003fec-1d21-491c-aded-e2ed2a1f4f5f.0ccb247a-9860-42ec-8f6c-40666ce95523",
            "name": "Furniture and Fixtures",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.87003fec-1d21-491c-aded-e2ed2a1f4f5f.97daee10-e2bd-4eb2-a919-36cf4fe1a80c",
            "name": "Leasehold Improvements",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.87003fec-1d21-491c-aded-e2ed2a1f4f5f.f7e48ccb-e0be-49b5-a4de-8be4a8497664",
            "name": "Office Equipment",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.87003fec-1d21-491c-aded-e2ed2a1f4f5f.d866a0ac-423f-479e-b50b-83c707d4436e",
            "name": "1645 - Construction in Progress",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.87003fec-1d21-491c-aded-e2ed2a1f4f5f.ce313b64-7934-4c69-ace9-cee7b1fbec8d",
            "name": "1646 - Software in Progress",
            "level": 3
          }
        ]
      },
      {
        "id": "root-intangible-assets-net",
        "name": "Intangible Assets, Net",
        "level": 2,
        "children": [
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.5d58081e-d584-4560-8efb-992e5e776b1d.686d058c-10b9-4c85-b7d0-9343ed28fc7a",
            "name": "Domains",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.5d58081e-d584-4560-8efb-992e5e776b1d.083cab95-cfbb-4b08-86b4-5996ff55d030",
            "name": "Website",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.5d58081e-d584-4560-8efb-992e5e776b1d.a52052c8-056a-42fb-a46a-44a906c720f8",
            "name": "Intangibles - Customer Relationships",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.5d58081e-d584-4560-8efb-992e5e776b1d.35779d55-499c-4f7b-9996-564426d7f4fe",
            "name": "Intangibles - Software Technology",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.5d58081e-d584-4560-8efb-992e5e776b1d.17095048-59e9-4a40-9673-5d5490ae257c",
            "name": "Intangibles - Trademarks",
            "level": 3
          }
        ]
      },
      {
        "id": "root-stockholders-equity",
        "name": "Stockholders' equity",
        "level": 2,
        "children": [
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.91052610-581a-4b62-9f2d-6d7da469af8f.42756d05-4fe1-4815-a709-0150daee8a77",
            "name": "Common stock, $0.001 par value",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.91052610-581a-4b62-9f2d-6d7da469af8f.3177ebff-6841-4c0a-beef-ae1e5f43922b",
            "name": "Additional paid-in capital",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.91052610-581a-4b62-9f2d-6d7da469af8f.c41eb70c-fea1-4b3d-b7c5-57c5d67823f7",
            "name": "3100 - Retained Earnings",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.91052610-581a-4b62-9f2d-6d7da469af8f.5c02737f-f7bc-45ad-8720-2d12e7b42e8e",
            "name": "3105 - Retained Earnings Adjustment – 606",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.91052610-581a-4b62-9f2d-6d7da469af8f.92272beb-da8b-46ad-9fdc-daac30b8cdc2",
            "name": "3150 - Other comprehensive income",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.91052610-581a-4b62-9f2d-6d7da469af8f.c7b6bd35-4f15-40c0-bcdf-36aff3105b02",
            "name": "3300 - Cumulative Translation Adjustment",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.91052610-581a-4b62-9f2d-6d7da469af8f.75e3e6d0-a1be-4611-bc52-a28c91fd10ac",
            "name": "3400 - Cumulative Translation Adjustment-Elimination",
            "level": 3
          },
          {
            "id": "87350ede-6ebd-42d1-8066-56c117f6707e.91052610-581a-4b62-9f2d-6d7da469af8f.47906ee2-b790-4604-bde8-59a4e4ee9b68",
            "name": "Treasury stock, at cost",
            "level": 3
          }
        ]
      }
    ]
  },
  {
    "id": "root-income-statement",
    "name": "Income Statement",
    "level": 1,
    "children": [
      {
        "id": "root-gross-profit",
        "name": "Gross Profit",
        "level": 2,
        "children": [
          {
            "id": "root-revenue",
            "name": "Revenue",
            "level": 3,
            "children": [
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.ca66a5ce-5917-4a11-908e-f164c7cc9368.430c2e4b-74ad-400c-a94c-3f5c10905280",
                "name": "5010 - Intercompany Remittance Fee Income",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.ca66a5ce-5917-4a11-908e-f164c7cc9368.3a4f6d65-26a9-421f-bdc7-63417effce2d",
                "name": "Subscription Revenue",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.ca66a5ce-5917-4a11-908e-f164c7cc9368.a0d41348-685c-4e45-a01d-1352ee0778cd",
                "name": "Support and Maintenance Revenue",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.ca66a5ce-5917-4a11-908e-f164c7cc9368.176fe50c-7b65-4d36-a7bd-0b95a36ce709",
                "name": "Service Revenue",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.ca66a5ce-5917-4a11-908e-f164c7cc9368.9dca8930-3021-4aec-8b24-785e964636a7",
                "name": "Professional Services Revenue",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.ca66a5ce-5917-4a11-908e-f164c7cc9368.113a1457-76e9-4a50-8fc8-3a32f2ef7e1e",
                "name": "Sales Reserve",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.ca66a5ce-5917-4a11-908e-f164c7cc9368.2d3f9c0e-3591-4681-ab2f-6dbde99e1cd9",
                "name": "5000 - Intercompany Royalty Income",
                "level": 4
              }
            ]
          },
          {
            "id": "root-cost-of-revenues",
            "name": "Cost of Revenues",
            "level": 3,
            "children": [
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.f737dcec-544f-4a71-853d-754426013405",
                "name": "COR 5020 - Intercompany Royalty Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.a9481e16-e49d-4476-a4a0-eeaddafbf57e",
                "name": "COR 5030 - Intercompany Remittance Fee Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.65857e4c-9e49-41c4-9c8a-1deeeaf48793",
                "name": "COR 5050 - Intercompany Expat Recharge",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.1c3f23a7-6db5-405a-b9d6-de5a70e960af",
                "name": "5100 - Publisher Fees",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.293101fa-5607-4dc9-a99b-db0f0356eec2",
                "name": "5200 - Data Centers",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.54c37c2f-50ce-4646-b8b3-a9af08044bbf",
                "name": "5400 - Other COGS",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.4479dc3b-5e58-4f4c-9ca4-2cf517f6e909",
                "name": "5500 - Royalties and Integration Fees",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.62ca3288-8363-49bc-ae8b-df3670331dc1",
                "name": "COGS 6005 - Contra Comp Expense - SIP - Cap SW/IT",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.1d2fd427-2e8d-4745-a414-3e5d6ad21ee8",
                "name": "COGS 6006 - Contra Comp Expense - SIP - CCA",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.8788fe44-becb-4f19-a34d-6de8ad32de15",
                "name": "COGS 6011 - Vacation Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.09ffabd7-13c5-4d4a-81d2-46a201a06f40",
                "name": "COR 6030 - Benefits",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.153660dc-1250-4b42-b6fd-f6ebe6ff0fc2",
                "name": "COR 6031 - 401K Matching Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.4db74e89-b506-4f1e-b29b-f36bf88dda97",
                "name": "COR 6430 - Office Technology",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.3e2273f6-9b30-4e27-b2ab-758963ab90a4",
                "name": "COR 6062 - Contra Comp Expense - SIP SBC - Cap SW/IT",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.31f81a8c-16fb-4001-8765-4c8b65a88a14",
                "name": "COR 6063 - Contra Comp Expense - SIP SBC - CCA",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.da8c778b-b861-4089-8f86-4ac01ebb5e07",
                "name": "COR 6070 - Temp and contractor costs",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.c4be8619-0099-4ab5-b8d9-34ec82ec1605",
                "name": "COR 6071 - Contra Temp and contractor costs - SIP",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.5ab0b236-969e-4518-aa95-ab8e36beb428",
                "name": "COR 6072 - Delivery Partner Services Costs",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.5733eba3-e316-48ae-8dd9-02dc048d3da7",
                "name": "COR 6145 - Public relations",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.8226dbe9-52f5-4c75-870a-64c5b5436e3c",
                "name": "COR 6150 - Other Marketing",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.d6d8246c-5b5f-48d9-b156-29973a381dcf",
                "name": "COR 6125 - Affiliates",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.86544437-e652-4204-957a-206d5f4d86cd",
                "name": "COR 6130 - Conferences/Events",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.8a57a8c0-6e88-4270-8611-6fe8a88a1fab",
                "name": "COR 6135 - Branded marketing materials",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.92d77b26-6dc0-417f-9d5d-27f0f5801db2",
                "name": "COR 6140 - Other sales materials",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.6624a1f8-6d93-4768-8353-cd0ccccf4b9f",
                "name": "COR 6090 - Relocation Cost",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.8d41068a-778c-4ad5-8b0c-86a304563404",
                "name": "COR 6300 - Recruiting and referral fees",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.9ab0c350-7f41-4888-89ee-6f138ff96a91",
                "name": "COR 6310 - Training",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.67414b28-99f6-429f-b0c2-bbc7a41b850a",
                "name": "COR 6400 - Software",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.c5473413-6471-433a-ada9-a09138f84d8a",
                "name": "COR 6401 - Data Centers (Non COS)",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.dd7d9c7f-f9de-4762-841b-299c7b0f2134",
                "name": "COR 6405 - Amortization - Cloud Computing Implementation",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.fe1485a3-c755-4194-96e1-eb22b6b85bda",
                "name": "COR 6410 - Corporate Internet",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.d8450650-88d4-4539-b403-b1d797880f26",
                "name": "COR 6420 - Telecom",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.08a78ac4-3cbd-45b0-8b59-4c8059cf2af2",
                "name": "COR 6825 - Penalty Fees",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.d2656c27-2c40-478e-95c5-68aa0f5b4a06",
                "name": "COR 6830 - Insurance",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.2b1c78d4-28bf-4c6f-baa0-d1e1aff3114c",
                "name": "COR 6452 - Real Estate Taxes",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.9ddf1f8e-2ad4-4e97-9fdf-fed713d28c8d",
                "name": "COR 6455 - Repair & Maintenance",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.acc73687-5c99-42fd-92ac-713ccab96e5a",
                "name": "COR 6460 - Utilities",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.c9602588-edb6-40fe-a842-688da82008c3",
                "name": "COR 6740 - Recruiting Travel",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.b59679cb-99bd-4a32-b839-0ed73ebdf5a0",
                "name": "COR 6750 - Employee travel",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.3cef3942-5708-4fda-845a-b575814d9fd1",
                "name": "COR 6530 - Non-Income Tax Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.87776999-3a18-422f-86d1-f301984b3814",
                "name": "COR 6540 - Auditing Fees",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.32d2d476-ee60-4874-9f9e-353236b592cc",
                "name": "COR 6650 - Publisher Integrations",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.e237aca3-66c5-49d8-9f4f-4027ed92f9db",
                "name": "COR 6700 - Employee Food Services",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.72bb32e0-d0e8-4ad1-8aa8-2f7c206f698f",
                "name": "COR 6710 - Employee social events",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.baa2d1e1-7ae6-4394-8267-0fc10e907be7",
                "name": "COR 6720 - Employee Offsites",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.fb2c7537-a739-4c43-b4ee-6502a6c1711c",
                "name": "COR 6730 - Business meals",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.9643ca1f-6736-4749-abb2-2f438c43ac5e",
                "name": "COR 6735 - Entertainment",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.50d1b8ef-2ebe-43aa-94e1-6092b39e7e70",
                "name": "COR 6505 - Contra Professional Fees - SIP",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.d0cdbac9-f1b3-4d16-910d-ab4bef43befb",
                "name": "COR 6510 - Legal Fees",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.83feec5d-acef-43fa-a99f-0107f877c59b",
                "name": "COR 6760 - Gifts",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.0e9b92cd-5a20-4442-860e-187a3a7016aa",
                "name": "COR 6800 - Office Expenses",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.cfffcda8-fabb-47e6-8837-53ee320b1815",
                "name": "COR 6810 - Bank Charges",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.0a112b05-2244-4a02-92fa-dc6c9b3f7063",
                "name": "COR 6815 - Sales and Use Tax - Goods & Services",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.a54b23e9-291d-45f8-a7d5-03b6cdcede5a",
                "name": "COR 6816 - VAT / GST Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.0424e373-0e1f-43e1-8d9d-89c659048fb6",
                "name": "COR 6819 - Sales and Use Tax Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.377e7407-740d-4ba3-b319-c2df5cb1234a",
                "name": "COR 6820 - Filing Fees",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.ae2fa502-292e-4a64-a510-65099a3ca4cd",
                "name": "COR 6900 - Bad Debt Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.23402174-1830-40c3-892d-0418c62b6dc5",
                "name": "COR 8100 - Income Tax Expense - Federal",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.807f7964-746c-4d34-9cb5-5c88c81a30ad",
                "name": "COR 6835 - Shipping & Handling",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.b7ef78f5-e015-4d8f-a9ca-ebccd1717023",
                "name": "COR 6840 - Payroll Processing Fees",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.ca265d45-5210-48d5-94f1-ff276de5d0b5",
                "name": "COR 6850 - Charitable Donations",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.6a9282da-e1a6-40c9-b97a-c9222d069af8",
                "name": "COR 6855 - Meals Reserve",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.994c715f-0f58-4973-a773-64d25118fd08",
                "name": "COR 6860 - Other Expenses",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.0e848870-2b9f-41ba-9556-76e2ae4fb092",
                "name": "COR 6870 - Credit Card Processing Fees",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.05e40ffb-306a-4c1b-8fe6-b4d0a458cc5b",
                "name": "COR 6880 - Collection Fees",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.57d583f8-70c3-4547-833e-866f5da5fce7",
                "name": "COR 6891 - Earnout - Unvested Portion",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.96015965-fc03-4aa3-af9e-d5bee983c8ab",
                "name": "COR 6440 - Domains expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.04cecec4-4ad6-4845-8056-90fb0f9864b4",
                "name": "COR 8300 - Depreciation Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.aaf18777-5571-4ce1-a39a-412f1db5ad90",
                "name": "COR 8305 - Impairment",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.365a9eec-3c55-42ef-a3f3-02e14edeab70",
                "name": "COR 8350 - Amortization Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.c74b43b0-4f42-472e-87b4-5fe636097a94",
                "name": "COR 8350-01 - Amortization of Acquired Intangibles",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.ba0be0b7-d140-44d4-b4e0-e5f75fb91654",
                "name": "COR 6080 - Severance",
                "level": 4
              },
              {
                "id": "root-deferred-commission-amortization",
                "name": "Deferred Commission Amortization",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.9bb694e3-1da9-4a65-8fed-e5501f5efbf6.5f14e52d-c717-4774-96c2-4fe9c4857476",
                    "name": "COR 6022 - Deferred Payroll Taxes Amortization - 606",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.9bb694e3-1da9-4a65-8fed-e5501f5efbf6.05cd4b07-40a7-46fd-91ac-50807b281df1",
                    "name": "COR 6042 - Deferred Commission Amortization",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.9bb694e3-1da9-4a65-8fed-e5501f5efbf6.7244b312-c90d-48db-8a14-72dd3a579f1b",
                    "name": "COR 6044 - Deferred Commission Amortization - 606",
                    "level": 5
                  }
                ]
              },
              {
                "id": "root-cogs-payroll-taxes",
                "name": "COGS Payroll Taxes",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.7c26ec51-1302-4bd7-bc98-424128f6d64b.b8b4b923-eccc-43bc-befc-62f79717474d",
                    "name": "COR 6027 - Transaction Payroll Taxes",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.7c26ec51-1302-4bd7-bc98-424128f6d64b.35df129a-dbb9-4036-97ff-b5fbb6f4576c",
                    "name": "COR 6028 - Payroll Taxes Settlement",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.7c26ec51-1302-4bd7-bc98-424128f6d64b.e6132920-a8b3-4494-b897-af0a555d249a",
                    "name": "COR 6020 - Payroll Taxes",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.7c26ec51-1302-4bd7-bc98-424128f6d64b.1fadaf6c-d394-4ebc-a5bb-3bf20baef085",
                    "name": "COR 6025 - Payroll Tax Accrual",
                    "level": 5
                  }
                ]
              },
              {
                "id": "root-cogs-salares-wages",
                "name": "COGS Salares & Wages",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.5ae4788b-f4d7-4406-ae9f-d9159fe3a174.51e5bf7b-97cc-4391-984d-a69297bfac12",
                    "name": "COR 6012 - Salaries & Wages Accrual",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.5ae4788b-f4d7-4406-ae9f-d9159fe3a174.1b056e16-0813-401b-bc22-34aaf04eb5d4",
                    "name": "COR 6013 - Salaries & Wages - Overtime",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.5ae4788b-f4d7-4406-ae9f-d9159fe3a174.c3728cea-46ac-4a3f-865f-6bc28baa0426",
                    "name": "COR 6010 - Salaries & Wages",
                    "level": 5
                  }
                ]
              },
              {
                "id": "root-cogs-commissions-expense",
                "name": "COGS Commissions Expense",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.b63a7665-69d4-42d3-893a-86d4399edda0.5a8faf3c-5209-4a47-a7ef-3ac96aef51e0",
                    "name": "COR 6021 - Contra Payroll Tax Expense - 606",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.b63a7665-69d4-42d3-893a-86d4399edda0.a4bb5e77-fbd3-4a8f-9da6-0f1a889fb933",
                    "name": "COR 6040 - Commissions",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.b63a7665-69d4-42d3-893a-86d4399edda0.555cfff7-fe73-468f-bfa5-1059d4f45179",
                    "name": "COR 6043 - Contra Commission Expense - 606",
                    "level": 5
                  }
                ]
              },
              {
                "id": "root-cogs-bonuses",
                "name": "COGS Bonuses",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.176bb507-9d0c-406e-bb7c-26d4e435d5c3.c4cae549-0428-4212-9a6a-71c40787d833",
                    "name": "COR 6050-07 - Bonus: Transaction - Retention",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.176bb507-9d0c-406e-bb7c-26d4e435d5c3.a9ffb42c-d221-4ceb-b28c-a9220207107a",
                    "name": "COR 6050-01 - Bonus: Executive",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.176bb507-9d0c-406e-bb7c-26d4e435d5c3.6ae18b46-8f84-4059-a58a-0585aee315fa",
                    "name": "COR 6050-02 - Bonus: Non-Executive",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.176bb507-9d0c-406e-bb7c-26d4e435d5c3.e8eec239-ae7c-4c2f-80f3-4b75613c9d3e",
                    "name": "COR 6050-03 - Bonus: One-time",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.176bb507-9d0c-406e-bb7c-26d4e435d5c3.920b1e2f-4d7c-4782-99fa-c28712631c62",
                    "name": "COR 6050-04 - Bonus: Referral",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.176bb507-9d0c-406e-bb7c-26d4e435d5c3.86dd63c7-3c4d-4285-ba5b-b03eaf940428",
                    "name": "COR 6050-05 - Bonus: Other",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.176bb507-9d0c-406e-bb7c-26d4e435d5c3.29b04f26-72ca-489b-b916-68e68daf5c2a",
                    "name": "COR 6050-06 - Bonus: Transaction",
                    "level": 5
                  }
                ]
              },
              {
                "id": "root-cogs-stock-comp",
                "name": "COGS Stock Comp",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.872f2bc4-9c34-4aca-8622-b46869e9c4be.5bf0a2b1-b869-4ca7-a0c8-8973f1bb0809",
                    "name": "COR 6060 - Stock compensation",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.872f2bc4-9c34-4aca-8622-b46869e9c4be.d71cf665-24d9-4494-9ac7-b95be15e508f",
                    "name": "COR 6064 - Stock Compensation ESPP",
                    "level": 5
                  }
                ]
              },
              {
                "id": "root-cogs-paid-media",
                "name": "COGS Paid Media",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.2ff7d6b6-6075-4763-acb9-8afaf963d7dc.2976e01c-ad37-403f-b081-c5c58cb233f9",
                    "name": "COR 6110 - Paid Search",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.2ff7d6b6-6075-4763-acb9-8afaf963d7dc.f9cadfe0-eca9-48d1-a9a7-304c09886217",
                    "name": "COR 6115 - Syndication",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.2ff7d6b6-6075-4763-acb9-8afaf963d7dc.d19dfcc1-961a-4835-943b-dd457ed2f870",
                    "name": "COR 6120 - Email",
                    "level": 5
                  }
                ]
              },
              {
                "id": "root-cogs-facilities",
                "name": "COGS Facilities",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.fa5371c3-8192-401c-af9a-54dee140b7e1.1d33378b-95b5-4d54-b240-d271c747baa4",
                    "name": "COR 6445 - Facilities - Cleaning",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.fa5371c3-8192-401c-af9a-54dee140b7e1.b0a4705f-c986-4e71-bfbe-420333b978f7",
                    "name": "COR 6446 - Facilities - CAM",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.fa5371c3-8192-401c-af9a-54dee140b7e1.dd969755-d7b7-4926-bfb0-417b3fd866b4",
                    "name": "COR 6451 - Facilities",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.fa5371c3-8192-401c-af9a-54dee140b7e1.3907b8ed-fb2b-42f8-a5bc-f2b6b4e4f197",
                    "name": "COR 6447 - Facilities - Food Services",
                    "level": 5
                  }
                ]
              },
              {
                "id": "root-cogs-rent-or-lease",
                "name": "COGS Rent or Lease",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.256ee846-5e1b-4486-a6a8-fd0a93139cd1.605c0ed6-fad8-49e1-b298-fbc41e1d12f8",
                    "name": "COR 6443 - Rent or Lease (Short Term)",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.256ee846-5e1b-4486-a6a8-fd0a93139cd1.50f83363-f58f-48b7-b5a6-8b32c3f34d5d",
                    "name": "COR 6444 - Rent or Lease - Variable CPI/Other",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.256ee846-5e1b-4486-a6a8-fd0a93139cd1.2970d220-0c62-42d4-a87c-c328db096852",
                    "name": "COR 6441 - Rent or Lease (842) Amortization",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.256ee846-5e1b-4486-a6a8-fd0a93139cd1.8c2bbc27-bbde-481c-8212-1ee77ddc4fc7",
                    "name": "COR 6442 - Rent or Lease (842) Other",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.256ee846-5e1b-4486-a6a8-fd0a93139cd1.acb233f0-703d-47c3-b692-39e033f07cc3",
                    "name": "COR 6450 - Rent or Lease (842)",
                    "level": 5
                  }
                ]
              },
              {
                "id": "root-cogs-professional-fees",
                "name": "COGS Professional Fees",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.543340d7-09ff-4b15-8652-d7f1d7e73c58.b07227b3-1393-444c-acec-1be37ecc4ffc",
                    "name": "COR 6500 - Professional Fees",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.692ed235-0243-492f-921a-b74d44787c51.543340d7-09ff-4b15-8652-d7f1d7e73c58.331ab590-37b3-407a-8394-27b6b46c2adb",
                    "name": "COR 6506 - Professional Fees - Transaction",
                    "level": 5
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "root-operating-expenses",
        "name": "Operating Expenses",
        "level": 2,
        "children": [
          {
            "id": "root-sales-and-marketing",
            "name": "Sales and Marketing",
            "level": 3,
            "children": [
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.0ef97e4c-b7c8-4f78-bd66-f8969eaa3068",
                "name": "S&M 5030 - Intercompany Remittance Fee Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.c5e30bf1-4947-4d63-bf62-898727c18ae8",
                "name": "S&M 5020 - Intercompany Royalty Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.31252881-6f07-445a-a1f6-3b5a053ab1da",
                "name": "S&M 6005 - Contra Comp Expense - SIP - Cap SW/IT",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.9c6707f5-eaab-4d84-95ed-7ac82a80128c",
                "name": "S&M 6006 - Contra Comp Expense - SIP - CCA",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.58ba615f-e4ca-4cf4-a1a3-810128b62cb8",
                "name": "S&M 6011 - Vacation Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.5544a5fb-e9fb-4aff-a26f-f000e2dd1b9f",
                "name": "S&M 5050 - Intercompany Expat Recharge",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.4259904b-fc14-4a99-84fc-66b537985101",
                "name": "S&M 6048 - 3rd Party Commissions",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.4625c72d-caf1-4e04-aacb-7688dd720021",
                "name": "S&M 6030 - Benefits",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.2d07b185-b8ae-4588-9d0f-ec933bf0d4f7",
                "name": "S&M 6031 - 401K Matching Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.508b8b30-e077-41fd-98b4-831fed5a0169",
                "name": "S&M 6140 - Other sales materials",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.58ef89e8-22c2-413c-a1af-9c0a38c32e72",
                "name": "S&M 6145 - Public relations",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.d8c2abbc-411e-4454-8b87-3a3554fe5d22",
                "name": "S&M 6112 - Paid Social",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.d11acae1-bb08-4e3e-bea6-8be165d3b901",
                "name": "S&M 6113 - Sponsored Content",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.aed11dc9-f87e-4d46-a783-54063e931a73",
                "name": "S&M 6070 - Temp and contractor costs",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.e09dbfc3-2cb8-4336-863a-a438b050404d",
                "name": "S&M 6071 - Contra Temp and contractor costs - SIP",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.7a60aa25-7646-4153-a690-74747193ff8e",
                "name": "S&M 6080 - Severance",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.60b1d165-56a7-4e4a-9ed6-8ca033c26b7c",
                "name": "S&M 6090 - Relocation Cost",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.4ed43274-f5c2-46d3-9019-0c7ce230ca06",
                "name": "S&M 6110 - Paid Search",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.76ee74cd-b235-44ac-bf5c-2aa194046ea8",
                "name": "S&M 6062 - Contra Comp Expense - SIP SBC - Cap SW/IT",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.12503ef7-77ab-4d31-88dd-3821239a28e7",
                "name": "S&M 6063 - Contra Comp Expense - SIP SBC - CCA",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.77f1bec2-68ef-4dae-b63c-f51038030d33",
                "name": "S&M 6114 - Advertising",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.b737c555-ce18-45d5-8659-b60782e79f76",
                "name": "S&M 6115 - Syndication",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.d1c82584-1250-4eff-8ebc-1f993c1f0985",
                "name": "S&M 6120 - Email",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.04f530cc-0b75-4623-9b06-53e3d178ef34",
                "name": "S&M 6125 - Affiliates",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.d6192af3-63c0-47eb-acde-e691bd0a9c0e",
                "name": "6127 - Deferred Affiliates Amortization - 606",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.f7de1ca8-136b-409a-b825-69d94a4eb2ca",
                "name": "S&M 6130 - Conferences/Events",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.69b0b471-91ca-46b9-92ce-970ba9417361",
                "name": "S&M 6135 - Branded marketing materials",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.0512220a-f41a-4697-920d-a1564608aeda",
                "name": "S&M 6430 - Office Technology",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.ac2da7a3-c066-4fc9-b0c7-d7502ceefe93",
                "name": "S&M 6150 - Other Marketing",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.a6878233-287e-4b33-addc-ab7bc60ced5a",
                "name": "S&M 6300 - Recruiting and referral fees",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.0b9695d2-3964-4475-bd19-fc2071ae5a05",
                "name": "S&M 6310 - Training",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.d2533269-1f72-4b04-a097-1004347ec957",
                "name": "S&M 6400 - Software",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.f8284d2c-cb0a-425a-8b04-4ce8856db1ca",
                "name": "S&M 6401 - Data Centers (Non COS)",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.82e5c7cb-fba6-4d9a-9d4a-dca84674d694",
                "name": "S&M 6405 - Amortization - Cloud Computing Implementation",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.fc05dd16-6d57-4f8e-9884-20b573e837b9",
                "name": "S&M 6410 - Corporate Internet",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.0e45ba48-f80a-433e-ae52-5624a4330f4c",
                "name": "S&M 6420 - Telecom",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.39f4198e-31c4-4863-93e8-ebe61fd30cfc",
                "name": "S&M 6730 - Business meals",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.740a755a-5a62-4f8b-aeaa-a6f4c390ea77",
                "name": "S&M 6440 - Domains expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.d5bbf6d6-89c6-4aa3-81f7-c100c388f74a",
                "name": "S&M 6505 - Contra Professional Fees - SIP",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.dd734f6e-4099-44e2-8734-a58e237492e5",
                "name": "S&M 6452 - Real Estate Taxes",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.30856260-2f81-4830-8424-925b2b949de2",
                "name": "S&M 6455 - Repair & Maintenance",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.533ac976-4389-424e-95d6-8cc2bf6c173a",
                "name": "S&M 6460 - Utilities",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.0586912b-79f4-405a-8d20-c8abe310b95b",
                "name": "S&M 6510 - Legal Fees",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.0b5bf91e-49aa-420a-81bd-b2edb7d890ef",
                "name": "S&M 6530 - Non-Income Tax Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.15e1fb12-0162-4b05-9728-e043647c8bc9",
                "name": "S&M 6540 - Auditing Fees",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.90f22665-9d10-492b-b64a-f792afbc6c35",
                "name": "S&M 6650 - Publisher Integrations",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.811650a8-2371-4aec-9173-3537303df768",
                "name": "S&M 6700 - Employee Food Services",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.f678cf6b-e618-4011-907c-4b6ef90c0ad5",
                "name": "S&M 6710 - Employee social events",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.122dde0f-320d-4251-b735-6a2718aa82a3",
                "name": "S&M 6720 - Employee Offsites",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.9f7b527c-c571-4757-9b46-6d289daf8431",
                "name": "S&M 6820 - Filing Fees",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.22b47094-8a46-455a-94c4-7c12db99e5a7",
                "name": "S&M 6825 - Penalty Fees",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.c322e746-53f5-4dc9-909a-941c9dd02921",
                "name": "S&M 6740 - Recruiting Travel",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.011d287e-a315-4203-a09a-177217e2d95e",
                "name": "S&M 6750 - Employee travel",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.bf6b240f-aead-4de7-a0f6-895abf912971",
                "name": "S&M 6760 - Gifts",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.f23f06e2-249d-4b1c-9c37-cde86025c744",
                "name": "S&M 6800 - Office Expenses",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.e549d58f-3b2a-4fd6-a6f9-12e27f18659a",
                "name": "S&M 6810 - Bank Charges",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.3420f3b9-3416-4c3b-974c-2770d0af00c2",
                "name": "S&M 6815 - Sales and Use Tax - Goods & Services",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.4efec0dd-da2e-42fe-a08a-591213cdafcf",
                "name": "S&M 6816 - VAT / GST Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.a479d3c0-2286-4ec6-8f7e-dca0465f9385",
                "name": "S&M 6819 - Sales and Use Tax Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.c2b06dc5-7f1b-4d74-aae1-b4caf34a5c9d",
                "name": "S&M 6830 - Insurance",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.af23d34c-622a-46ed-a14a-805b5d94ab52",
                "name": "S&M 6835 - Shipping & Handling",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.c192db11-ea62-4641-a17e-18fd1434faa4",
                "name": "S&M 6840 - Payroll Processing Fees",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.1bebb8b9-5901-4b13-88c7-bb37144284f3",
                "name": "S&M 6850 - Charitable Donations",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.9616adf0-ad7b-46fb-a926-085818653b5f",
                "name": "S&M 6855 - Meals Reserve",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.b3e29e50-37c3-4611-8584-31a661048a92",
                "name": "S&M 6860 - Other Expenses",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.72a5c6d1-0a0e-4d75-a1be-3c93c912124b",
                "name": "S&M 6870 - Credit Card Processing Fees",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.815fb2ec-ecfd-45d0-a868-f0a735e5966f",
                "name": "S&M 6900 - Bad Debt Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.cee642ff-3e25-49ff-9fac-4f5ac09647f0",
                "name": "S&M 8100 - Income Tax Expense - Federal",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.1802fd19-4408-4315-a9ad-2d4037bf91a1",
                "name": "S&M 8300 - Depreciation Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.f3005d39-6978-4433-b62a-2497d10e1fef",
                "name": "S&M 8305 - Impairment",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.46e8709e-5004-48bb-acb4-349d59056234",
                "name": "S&M 8350 - Amortization Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.a6c2e668-006a-4173-a059-4bee261a6e8b",
                "name": "S&M 8350-01 - Amortization of Acquired Intangibles",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.7e871f75-371b-48ae-8d95-0bd0d811b71b",
                "name": "S&M 6880 - Collection Fees",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.8824bced-b131-4e5e-bbce-2e96c37c2a82",
                "name": "S&M 6891 - Earnout - Unvested Portion",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.1ac22e72-3294-4b42-9173-70990f22f220",
                "name": "S&M 6735 - Entertainment",
                "level": 4
              },
              {
                "id": "root-s-m-commissions-expense",
                "name": "S&M Commissions Expense",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.093d885d-8bb8-4c0e-b27e-5562bf03841d.5a3ea853-b17f-4b1c-b29c-0235fe25ebf4",
                    "name": "S&M 6040 - Commissions",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.093d885d-8bb8-4c0e-b27e-5562bf03841d.a224cf7f-4576-4c0a-a6d6-0844838d0923",
                    "name": "S&M 6021 - Contra Payroll Tax Expense - 606",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.093d885d-8bb8-4c0e-b27e-5562bf03841d.ddc20080-6276-4671-97b3-64973987885c",
                    "name": "6041 - Contra Commission Expense",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.093d885d-8bb8-4c0e-b27e-5562bf03841d.01c280cf-e72d-4f66-93d3-a76ddb540a5a",
                    "name": "S&M 6045 - Deferred Commission Expense Reclass",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.093d885d-8bb8-4c0e-b27e-5562bf03841d.a6f0e20c-c974-4cd4-bf14-a361233c38f9",
                    "name": "S&M 6043 - Contra Commission Expense - 606",
                    "level": 5
                  }
                ]
              },
              {
                "id": "root-s-m-payroll-taxes",
                "name": "S&M Payroll Taxes",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.50ae5ba4-4115-4f35-8d25-7a421a17da81.69d6da67-708f-4d90-8367-009d47b7d2df",
                    "name": "S&M 6020 - Payroll Taxes",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.50ae5ba4-4115-4f35-8d25-7a421a17da81.d852989f-bfc4-41ba-ab15-cd6dba769ce8",
                    "name": "S&M 6025 - Payroll Tax Accrual",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.50ae5ba4-4115-4f35-8d25-7a421a17da81.f11781c9-6600-4f67-af46-b53f52bffb15",
                    "name": "S&M 6027 - Transaction Payroll Taxes",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.50ae5ba4-4115-4f35-8d25-7a421a17da81.af74c6da-3221-46c7-88f1-94cb3a8b5c33",
                    "name": "S&M 6028 - Payroll Taxes Settlement",
                    "level": 5
                  }
                ]
              },
              {
                "id": "root-s-m-salaries-and-wages",
                "name": "S&M Salaries and Wages",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.ec814333-f6a0-45fc-942e-e98592c0ebda.bbf2b441-094b-4cd3-b76e-f15b119f7d2e",
                    "name": "S&M 6010 - Salaries & Wages",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.ec814333-f6a0-45fc-942e-e98592c0ebda.49f17a55-c02c-4a67-989f-bdf1ea093b0d",
                    "name": "S&M 6012 - Salaries & Wages Accrual",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.ec814333-f6a0-45fc-942e-e98592c0ebda.a0f6f254-e44a-460e-b652-0b26135f0aa8",
                    "name": "S&M 6013 - Salaries & Wages - Overtime",
                    "level": 5
                  }
                ]
              },
              {
                "id": "root-s-m-deferred-commission-amortization",
                "name": "S&M Deferred Commission Amortization",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.9be3d0eb-4f48-42e7-8d8a-3fda914b5bc2.9d431ea9-0b67-4f86-8a91-661ce7005369",
                    "name": "S&M 6022 - Deferred Payroll Taxes Amortization - 606",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.9be3d0eb-4f48-42e7-8d8a-3fda914b5bc2.41e5f948-4aab-4a0f-a0cd-2e1704d5a19b",
                    "name": "S&M 6023 - Deferred Payroll Tax Reclass",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.9be3d0eb-4f48-42e7-8d8a-3fda914b5bc2.a8e0895c-932d-4bb0-91c1-3867f1c1edab",
                    "name": "S&M 6024 - Deferred Payroll Tax Amortization Reclass",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.9be3d0eb-4f48-42e7-8d8a-3fda914b5bc2.a4ffb8f9-fa18-4849-a437-cb54800f7e02",
                    "name": "S&M 6042 - Deferred Commission Amortization",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.9be3d0eb-4f48-42e7-8d8a-3fda914b5bc2.51456c80-996e-4507-b815-d8619fd307ac",
                    "name": "S&M 6044 - Deferred Commission Amortization - 606",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.9be3d0eb-4f48-42e7-8d8a-3fda914b5bc2.e3cf4293-b5db-4da1-b315-c174865b9d1c",
                    "name": "S&M 6046 - Deferred Commission Amortization Expense Reclass",
                    "level": 5
                  }
                ]
              },
              {
                "id": "root-s-m-bonuses",
                "name": "S&M Bonuses",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.359b15b3-4bfa-4bd0-9dd0-43b3aaee2b1b.70957803-ccc0-4e8e-9061-9dede70f5a34",
                    "name": "S&M 6050-01 - Bonus: Executive",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.359b15b3-4bfa-4bd0-9dd0-43b3aaee2b1b.99a00f0e-42a2-45b9-8c1f-f88a26c43d3e",
                    "name": "S&M 6050-02 - Bonus: Non-Executive",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.359b15b3-4bfa-4bd0-9dd0-43b3aaee2b1b.40db3463-828b-4747-aa08-c65545b8dd8a",
                    "name": "S&M 6050-03 - Bonus: One-time",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.359b15b3-4bfa-4bd0-9dd0-43b3aaee2b1b.94192b66-d400-48df-b946-a976280dc0a5",
                    "name": "S&M 6050-04 - Bonus: Referral",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.359b15b3-4bfa-4bd0-9dd0-43b3aaee2b1b.84bfed7d-7680-4aba-89df-28a2deecbb21",
                    "name": "S&M 6050-05 - Bonus: Other",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.359b15b3-4bfa-4bd0-9dd0-43b3aaee2b1b.242713a8-4d84-4ce5-9912-14894caea495",
                    "name": "S&M 6050-06 - Bonus: Transaction",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.359b15b3-4bfa-4bd0-9dd0-43b3aaee2b1b.2dc07f29-150b-4119-a1ff-451bce732cd0",
                    "name": "S&M 6050-07 - Bonus: Transaction - Retention",
                    "level": 5
                  }
                ]
              },
              {
                "id": "root-s-m-stock-comp",
                "name": "S&M Stock Comp",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.8a05eb7c-88b1-4166-806e-6f81ef317056.a11b7005-7102-4b5b-9cad-1ce78ec330c1",
                    "name": "S&M 6060 - Stock compensation",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.8a05eb7c-88b1-4166-806e-6f81ef317056.8188bc86-e09f-4812-b439-5a145b2fa54f",
                    "name": "S&M 6064 - Stock Compensation ESPP",
                    "level": 5
                  }
                ]
              },
              {
                "id": "root-s-m-rent-or-lease",
                "name": "S&M Rent or Lease",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.90577301-99de-4aa1-adf1-a3450b5bd3c4.1221ac5b-403b-464d-a0e0-29ec2ab55f09",
                    "name": "S&M 6443 - Rent or Lease (Short Term)",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.90577301-99de-4aa1-adf1-a3450b5bd3c4.6686383c-f441-417f-b46e-bf74d3bf1cf9",
                    "name": "S&M 6444 - Rent or Lease - Variable CPI/Other",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.90577301-99de-4aa1-adf1-a3450b5bd3c4.289dccfb-ca10-415c-8f37-6d4593a04d4c",
                    "name": "S&M 6441 - Rent or Lease (842) Amortization",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.90577301-99de-4aa1-adf1-a3450b5bd3c4.50154831-c380-43d6-a4e6-9266c83e5d95",
                    "name": "S&M 6442 - Rent or Lease (842) Other",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.90577301-99de-4aa1-adf1-a3450b5bd3c4.c28f727a-9de2-4406-8872-cd6ba22ddfc9",
                    "name": "S&M 6450 - Rent or Lease (842)",
                    "level": 5
                  }
                ]
              },
              {
                "id": "root-s-m-professional-fees",
                "name": "S&M Professional Fees",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.896b9092-469a-49eb-897a-0716de088e6f.5a945f14-1d06-4e9f-821e-4dd1bf95fb53",
                    "name": "S&M 6506 - Professional Fees - Transaction",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.896b9092-469a-49eb-897a-0716de088e6f.6a22b6d0-8aeb-4971-b07b-ad22c66aa5c0",
                    "name": "S&M 6500 - Professional Fees",
                    "level": 5
                  }
                ]
              },
              {
                "id": "root-s-m-facilities",
                "name": "S&M Facilities",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.28c38d19-4450-4151-809c-5c21c51a84ff.4fb91c34-67c1-4f2e-be44-0dd783587411",
                    "name": "S&M 6445 - Facilities - Cleaning",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.28c38d19-4450-4151-809c-5c21c51a84ff.7559326b-5b48-43cf-8582-837cd6505e2d",
                    "name": "S&M 6446 - Facilities - CAM",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.28c38d19-4450-4151-809c-5c21c51a84ff.f5f419d0-1ecb-49b2-b42f-5677b46b4487",
                    "name": "S&M 6447 - Facilities - Food Services",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.ba91ba84-865a-44bc-8e32-2a00f9a781ad.28c38d19-4450-4151-809c-5c21c51a84ff.6af9efa3-8fb9-4e30-82d4-483bad5b3c41",
                    "name": "S&M 6451 - Facilities",
                    "level": 5
                  }
                ]
              }
            ]
          },
          {
            "id": "root-research-and-development",
            "name": "Research and Development",
            "level": 3,
            "children": [
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.d09393a3-0529-4f1b-8b79-4eccce596ad1",
                "name": "R&D 5030 - Intercompany Remittance Fee Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.3d49ed1b-35f1-4032-b777-cf44b8753e88",
                "name": "R&D 5020 - Intercompany Royalty Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.668ebfe5-6656-497f-b3a6-d97de0048b8e",
                "name": "R&D 6005 - Contra Comp Expense - SIP - Cap SW/IT",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.d68ba088-afb3-40f0-a41d-085c00683d45",
                "name": "R&D 6006 - Contra Comp Expense - SIP - CCA",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.f58aa4ef-bb83-4546-b977-87e66c940c8d",
                "name": "R&D 6011 - Vacation Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.e1bf5111-eb0a-4e1a-a495-e72ce3f0aac4",
                "name": "R&D 6030 - Benefits",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.aed936af-6ac5-4cba-97a0-0dc910657ed5",
                "name": "R&D 6031 - 401K Matching Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.f417de72-4e22-4582-bf16-c99e7bf620e2",
                "name": "R&D 6040 - Commissions",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.5287f559-3a50-42c2-a07c-b71c310399da",
                "name": "R&D 6042 - Deferred Commission Amortization",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.e9ab6a5f-8f58-4a4e-bffb-c3480cdf11f4",
                "name": "R&D 6401 - Data Centers (Non COS)",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.bc2f8c54-62cf-4465-986d-15ff97fed033",
                "name": "R&D 6062 - Contra Comp Expense - SIP SBC - Cap SW/IT",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.9a257f7a-1f38-4b2b-b45b-170b2a42c49a",
                "name": "R&D 6063 - Contra Comp Expense - SIP SBC - CCA",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.57f48d69-c469-40ea-816c-40affd174ff3",
                "name": "R&D 6125 - Affiliates",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.45afe542-96cf-4c85-85f7-8774caff71f5",
                "name": "R&D 6130 - Conferences/Events",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.60fbdb28-9c78-4a13-8dd2-0c77ecfcc01d",
                "name": "R&D 6070 - Temp and contractor costs",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.2d31c209-d035-4b54-8004-3e2de2e53f26",
                "name": "R&D 6071 - Contra Temp and contractor costs - SIP",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.bfe1e16d-c759-4d5f-8995-0126d5cd6e1d",
                "name": "R&D 6080 - Severance",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.afd8a7a8-d816-4082-a860-198bc2509008",
                "name": "R&D 6090 - Relocation Cost",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.dca09858-99ee-4c5e-ad53-1d21cadabc16",
                "name": "R&D 6135 - Branded marketing materials",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.35f8b02f-7bc5-492d-9709-b656690b7348",
                "name": "R&D 6140 - Other sales materials",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.80c3bbe3-275c-4774-8a48-0200b81f069e",
                "name": "R&D 6145 - Public relations",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.6590a47a-6257-4034-b6bc-445ec13c98e3",
                "name": "R&D 6150 - Other Marketing",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.b7db2997-5cbb-48de-bc48-680a27a720b3",
                "name": "R&D 6300 - Recruiting and referral fees",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.d99e7c0f-7325-4508-9f49-cd8b28d092fc",
                "name": "R&D 6310 - Training",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.a0ebb068-de06-48b1-ab58-36a29d414685",
                "name": "R&D 6400 - Software",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.4f369b2a-c2d8-4e10-9d64-e99100737c24",
                "name": "R&D 6816 - VAT / GST Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.0fffe78e-c31a-40e9-adcd-32661eb7d88e",
                "name": "R&D 6410 - Corporate Internet",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.4054b95c-b448-42fb-8032-c4be52c8f01d",
                "name": "R&D 6420 - Telecom",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.79e85e8f-cdce-4fef-b5f8-e76599c17145",
                "name": "R&D 6430 - Office Technology",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.55f7e7c4-5c2c-4fec-b62d-fc84480f09a2",
                "name": "R&D 6440 - Domains expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.ad3582ba-9cf6-44aa-b40f-6e0a1db8451d",
                "name": "R&D 6452 - Real Estate Taxes",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.fb9d5fdf-eebc-4fc2-9f09-05796477e32b",
                "name": "R&D 6455 - Repair & Maintenance",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.98641274-50a6-4ebf-aa26-8c6804390812",
                "name": "R&D 6460 - Utilities",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.97e46151-40d6-4d45-9282-9c2ac5afd1a8",
                "name": "R&D 6505 - Contra Professional Fees - SIP",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.2f073be2-31b5-4381-9c9a-ed8c81a91407",
                "name": "R&D 6510 - Legal Fees",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.3072d205-f683-4d93-add4-a5a6162532f3",
                "name": "R&D 6530 - Non-Income Tax Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.732b0269-787b-48a2-bb16-53adbe5774bc",
                "name": "R&D 6540 - Auditing Fees",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.d9bb21c9-d9e2-477a-b857-22e10905bad8",
                "name": "R&D 6650 - Publisher Integrations",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.c6828fd1-7591-4288-8a2a-0c699670621b",
                "name": "R&D 6700 - Employee Food Services",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.327ad41f-6083-4daf-9e1d-5b72e462cdf5",
                "name": "R&D 6710 - Employee social events",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.e770dc27-d5d7-477f-b47b-d29c566ff53a",
                "name": "R&D 6730 - Business meals",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.18318063-6ec7-4b1d-b93a-d6514f5f08f7",
                "name": "R&D 6735 - Entertainment",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.1c260b66-4076-4a6f-8e7d-aa1043a73d73",
                "name": "R&D 6740 - Recruiting Travel",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.5cf14f10-cafa-42ed-a18a-77102f7310b3",
                "name": "R&D 6750 - Employee travel",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.112ec8c0-3895-4e53-ba83-7feb32c8b8ac",
                "name": "R&D 6760 - Gifts",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.dacfab09-26c8-4102-ab2b-434d721bfd31",
                "name": "R&D 6800 - Office Expenses",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.660a7973-6e17-4e5a-8940-c00248c62b6d",
                "name": "R&D 6810 - Bank Charges",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.ede26f3f-0222-418a-a22f-72c38d83501a",
                "name": "R&D 6815 - Sales and Use Tax - Goods & Services",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.775af413-a5eb-44a9-94f4-7360f46ca2dc",
                "name": "R&D 6819 - Sales and Use Tax Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.5e20ae40-1d80-4ec9-85e0-c6a0987a7126",
                "name": "R&D 6820 - Filing Fees",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.b066d67e-53d3-4147-88cc-fe8378b512d5",
                "name": "R&D 6825 - Penalty Fees",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.da7f5f43-db55-405a-bfd4-f493af655850",
                "name": "R&D 6830 - Insurance",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.dd03b299-04b2-4335-a47c-a6eb24178e0c",
                "name": "R&D 6835 - Shipping & Handling",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.111c566d-bf45-46b7-9dc0-0b19171f5170",
                "name": "R&D 6840 - Payroll Processing Fees",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.eae75fb1-22ed-4dda-a91b-00c536e11e0d",
                "name": "R&D 6850 - Charitable Donations",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.2eda6056-eed8-4f4a-b85f-2dc16a54730a",
                "name": "R&D 6855 - Meals Reserve",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.390a0edd-a090-4050-834d-45e60f04bcde",
                "name": "R&D 6860 - Other Expenses",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.2a11be72-0128-4a43-9218-b1dc825e03d3",
                "name": "R&D 6870 - Credit Card Processing Fees",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.da001558-7267-43d9-a6cd-6f7347a25179",
                "name": "R&D 6880 - Collection Fees",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.7b3fb21a-6a7f-4e66-ba89-9d37859e9ecd",
                "name": "R&D 6891 - Earnout - Unvested Portion",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.f8750275-888e-4de9-8f7e-f46d7edfbdea",
                "name": "R&D 6900 - Bad Debt Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.12cc9cf9-25a5-40e2-8d42-a92f756f85f0",
                "name": "R&D 8100 - Income Tax Expense - Federal",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.49d3f390-cda8-4f3f-b721-c7415b1500cd",
                "name": "R&D 8300 - Depreciation Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.772e0dfa-b123-43b8-975f-f4979e1d56ce",
                "name": "R&D 8305 - Impairment",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.9393ff26-e87f-4eaa-9b2c-df50eb24d098",
                "name": "R&D 8350 - Amortization Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.1574aefa-6674-4620-87b5-7e06e6491428",
                "name": "R&D 6720 - Employee Offsites",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.9736f291-4e40-4154-8d94-b1b561b5b4d0",
                "name": "R&D 6405 - Amortization - Cloud Computing Implementation",
                "level": 4
              },
              {
                "id": "root-r-d-stock-comp",
                "name": "R&D Stock Comp",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.ee01bcfe-11f1-423b-b89a-b614a3938cb2.e9dbd886-0602-4f7f-9178-d956623e67be",
                    "name": "R&D 6060 - Stock compensation",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.ee01bcfe-11f1-423b-b89a-b614a3938cb2.c6c42adf-b9b8-4758-af4e-be5db999f4bc",
                    "name": "R&D 6064 - Stock Compensation ESPP",
                    "level": 5
                  }
                ]
              },
              {
                "id": "root-r-d-payroll-taxes",
                "name": "R&D Payroll Taxes",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.432aebc2-9dc6-44ae-939f-4daaa0556d31.72d08274-78a9-4fde-ab09-07e57d2791f0",
                    "name": "R&D 6020 - Payroll Taxes",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.432aebc2-9dc6-44ae-939f-4daaa0556d31.3d4404e1-16bc-4b3f-9d47-787fa6ba83c5",
                    "name": "R&D 6025 - Payroll Tax Accrual",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.432aebc2-9dc6-44ae-939f-4daaa0556d31.04d64a25-fca9-451e-8787-aa6185f1cf76",
                    "name": "R&D 6027 - Transaction Payroll Taxes",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.432aebc2-9dc6-44ae-939f-4daaa0556d31.d2556ae0-f5c0-4052-8611-84e5c00deca7",
                    "name": "R&D 6028 - Payroll Taxes Settlement",
                    "level": 5
                  }
                ]
              },
              {
                "id": "root-r-d-salaries-and-wages",
                "name": "R&D Salaries and Wages",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.4ae412a1-6730-4cca-9298-dff4af097ca9.14e968a0-34f3-43c4-846f-0b01e4e5aa3c",
                    "name": "R&D 6010 - Salaries & Wages",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.4ae412a1-6730-4cca-9298-dff4af097ca9.45506b5c-6ab7-46fc-8a7c-279ccbb412db",
                    "name": "R&D 6012 - Salaries & Wages Accrual",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.4ae412a1-6730-4cca-9298-dff4af097ca9.20a086c7-ad1c-4667-a595-488ef72a08d6",
                    "name": "R&D 6013 - Salaries & Wages - Overtime",
                    "level": 5
                  }
                ]
              },
              {
                "id": "root-r-d-bonuses",
                "name": "R&D Bonuses",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.b8992b02-720a-4be8-9e47-70c9bbb5989f.24991bfd-d499-4528-80a6-c5822a603582",
                    "name": "R&D 6050-02 - Bonus: Non-Executive",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.b8992b02-720a-4be8-9e47-70c9bbb5989f.7589c3ff-dd2f-4361-9233-e1d7865631d1",
                    "name": "R&D 6050-03 - Bonus: One-time",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.b8992b02-720a-4be8-9e47-70c9bbb5989f.6a260405-ee80-442a-9b41-ae79dcf5a00b",
                    "name": "R&D 6050-01 - Bonus: Executive",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.b8992b02-720a-4be8-9e47-70c9bbb5989f.57048917-3109-415e-87d3-46dbbffdfb45",
                    "name": "R&D 6050-04 - Bonus: Referral",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.b8992b02-720a-4be8-9e47-70c9bbb5989f.f3f34d9f-539f-4f71-80ad-e6d3fb395858",
                    "name": "R&D 6050-05 - Bonus: Other",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.b8992b02-720a-4be8-9e47-70c9bbb5989f.387a6281-d72b-4613-acd4-d495720b4809",
                    "name": "R&D 6050-06 - Bonus: Transaction",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.b8992b02-720a-4be8-9e47-70c9bbb5989f.155483e1-654c-41be-ab83-295b23007207",
                    "name": "R&D 6050-07 - Bonus: Transaction - Retention",
                    "level": 5
                  }
                ]
              },
              {
                "id": "root-r-d-paid-media",
                "name": "R&D Paid Media",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.7154a6e2-0f1d-4b19-acb2-4a9553fab5f3.6d25471c-362b-480d-831c-d0b83a43d86a",
                    "name": "R&D 6110 - Paid Search",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.7154a6e2-0f1d-4b19-acb2-4a9553fab5f3.62f04313-a73f-487a-a9fd-26f61081bceb",
                    "name": "R&D 6115 - Syndication",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.7154a6e2-0f1d-4b19-acb2-4a9553fab5f3.5732e4c1-6f42-48f5-b29d-b3126a5fa9fd",
                    "name": "R&D 6120 - Email",
                    "level": 5
                  }
                ]
              },
              {
                "id": "root-r-d-rent-or-lease",
                "name": "R&D Rent or Lease",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.82f765c2-64eb-4795-ab31-096bc4ea7de9.b22d549e-1a84-4638-ac2c-7db67e0a72a2",
                    "name": "R&D 6443 - Rent or Lease (Short Term)",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.82f765c2-64eb-4795-ab31-096bc4ea7de9.2a6849c4-5a79-42fd-9fe0-2ed6e8cd92bd",
                    "name": "R&D 6444 - Rent or Lease - Variable CPI/Other",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.82f765c2-64eb-4795-ab31-096bc4ea7de9.d8f39e5a-72ef-4271-b0f1-ff8141bcc0af",
                    "name": "R&D 6441 - Rent or Lease (842) Amortization",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.82f765c2-64eb-4795-ab31-096bc4ea7de9.a3693178-e9e0-423b-b7b7-43b2dad2ea02",
                    "name": "R&D 6442 - Rent or Lease (842) Other",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.82f765c2-64eb-4795-ab31-096bc4ea7de9.08e10fb2-84eb-41e2-88ba-08cc9a01ed5d",
                    "name": "R&D 6450 - Rent or Lease (842)",
                    "level": 5
                  }
                ]
              },
              {
                "id": "root-r-d-facilities",
                "name": "R&D Facilities",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.521b175a-03bd-4065-8b66-ca11fc5fb47c.49cab956-431f-4620-a796-9a20e34b0d1a",
                    "name": "R&D 6451 - Facilities",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.521b175a-03bd-4065-8b66-ca11fc5fb47c.7a77b193-7d28-48cb-8d31-efec07e060ff",
                    "name": "R&D 6445 - Facilities - Cleaning",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.521b175a-03bd-4065-8b66-ca11fc5fb47c.0a4db2d3-4904-4aaf-a180-9f5315cf9bd4",
                    "name": "R&D 6446 - Facilities - CAM",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.521b175a-03bd-4065-8b66-ca11fc5fb47c.20d296f8-2a89-4653-8f11-1b5c0c1610ab",
                    "name": "R&D 6447 - Facilities - Food Services",
                    "level": 5
                  }
                ]
              },
              {
                "id": "root-r-d-professional-fees",
                "name": "R&D Professional Fees",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.db0790a1-e13a-4011-ad2c-e7af8269554b.b65d0700-79bd-4771-ae8d-944acb56d316",
                    "name": "R&D 6500 - Professional Fees",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.db0790a1-e13a-4011-ad2c-e7af8269554b.db29e756-2988-40ea-ae57-eeffb2c96f4a",
                    "name": "R&D 6506 - Professional Fees - Transaction",
                    "level": 5
                  }
                ]
              }
            ]
          },
          {
            "id": "root-general-and-administration",
            "name": "General and Administration",
            "level": 3,
            "children": [
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.5c1ce7dc-0a6d-4316-b953-f66879f13ac9",
                "name": "G&A 6006 - Contra Comp Expense - SIP - CCA",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.03221e1d-ccb2-4019-8b44-3149f9609ae1",
                "name": "G&A 6505 - Contra Professional Fees - SIP",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.ac96fc70-6eeb-4efe-bee0-dd7cf6510a78",
                "name": "G&A 5020 - Intercompany Royalty Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.825818ef-d136-4cd0-a2d6-9d5b51c5a9a2",
                "name": "G&A 5030 - Intercompany Remittance Fee Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.2ac68429-9202-46cc-a972-babbd95b3d40",
                "name": "5040 - Intercompany Management Fee",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.f62b9a93-cf9d-4991-ae0d-6c660933b076",
                "name": "G&A 5050 - Intercompany Expat Recharge",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.e30064ec-cf74-4eb2-8ce9-93d008eddb61",
                "name": "5060 - Intercompany Reseller Fee",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.59d6ffb2-fbc1-43ea-8f77-9a388ab10123",
                "name": "G&A 6005 - Contra Comp Expense - SIP - Cap SW/IT",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.60e8c6ac-b42f-4fdd-a6d7-649bd441270e",
                "name": "G&A 6011 - Vacation Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.501cbfef-9d4e-430c-93d0-1ec77ef71500",
                "name": "6014 - Pension Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.d9d799a2-8c0b-423a-8be1-7bd1fcbffaa6",
                "name": "G&A 6030 - Benefits",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.0c0ea550-7d59-4d14-9381-a61ad4c06ac9",
                "name": "G&A 6031 - 401K Matching Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.ecc9d802-135a-4537-a539-ec7b431a0f21",
                "name": "G&A 6048 - 3rd Party Commissions",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.d25d07a4-b78b-4b7c-a2f8-d32b10d1f2d6",
                "name": "G&A 6062 - Contra Comp Expense - SIP SBC - Cap SW/IT",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.659e04c0-7d4b-4523-80bd-1f6bd2b021d0",
                "name": "G&A 6063 - Contra Comp Expense - SIP SBC - CCA",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.6c71ebee-1c32-498d-84f2-6aefd16eb7a5",
                "name": "G&A 6070 - Temp and contractor costs",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.ff41c0e1-70cc-4805-848b-b4c106f29f10",
                "name": "G&A 6072 - Delivery Partner Services Costs",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.2370a7db-48c8-4578-943b-6bb65c832ac6",
                "name": "G&A 6080 - Severance",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.32896aae-761e-4c39-952a-8541d850f8b6",
                "name": "G&A 6090 - Relocation Cost",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.f21dfa5e-7b3b-4e88-b7be-7113a318762e",
                "name": "G&A 6125 - Affiliates",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.7c01bee4-f00e-4226-9bbc-57b7cd742bb4",
                "name": "G&A 6130 - Conferences/Events",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.2fe3507d-5491-4188-9718-b812c0c92b1e",
                "name": "G&A 6135 - Branded marketing materials",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.71f65ed0-f5fa-470c-a087-3b44932b3cb1",
                "name": "G&A 6140 - Other sales materials",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.5afca179-4d8c-4f1b-940e-3dd25c403c47",
                "name": "G&A 6145 - Public relations",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.91363619-b6c1-453a-a0a4-c618be49e64a",
                "name": "G&A 6150 - Other Marketing",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.a030dba4-ef80-4d11-ad56-95405d537254",
                "name": "G&A 6300 - Recruiting and referral fees",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.7c8abf70-c80e-4002-872e-64744dc9d586",
                "name": "G&A 6310 - Training",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.f34679a2-7b13-466d-ab0d-f1113221e251",
                "name": "G&A 6400 - Software",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.00b91a18-46cc-47dc-99d6-85d707c07776",
                "name": "G&A 6401 - Data Centers (Non COS)",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.e68df705-c0df-411e-a3a5-9b8c0eb66fae",
                "name": "G&A 6405 - Amortization - Cloud Computing Implementation",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.608dd8e6-4fae-468f-a65f-430d55a26a02",
                "name": "G&A 6410 - Corporate Internet",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.4e7ca10e-7e57-4035-a970-c64e71513036",
                "name": "G&A 6420 - Telecom",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.efec15c3-b7db-453f-ad91-31b6b33d5cb3",
                "name": "G&A 6430 - Office Technology",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.ca9a3da4-b461-4b18-91ed-cc9ea6a72f0b",
                "name": "G&A 6440 - Domains expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.5956a786-fbd0-477f-8042-86a524de90f3",
                "name": "G&A 6452 - Real Estate Taxes",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.e4120a1d-190a-4e82-9daa-946015d559a6",
                "name": "G&A 6455 - Repair & Maintenance",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.cdeb48b7-70b0-4757-bcab-ccea1e275c5c",
                "name": "G&A 6460 - Utilities",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.36804b78-814c-4cad-b206-b71061df5d78",
                "name": "G&A 6710 - Employee social events",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.7429121a-e6f1-4fc3-8fd6-8754734401b3",
                "name": "G&A 6720 - Employee Offsites",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.ca916185-989d-4269-abdb-e51d27858e68",
                "name": "G&A 6530 - Non-Income Tax Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.7e262393-3ee5-4488-803a-2c1080b198b2",
                "name": "G&A 6540 - Auditing Fees",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.24a45192-8741-480b-a943-b62ab1fda440",
                "name": "G&A 6650 - Publisher Integrations",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.6154ab5d-0945-4211-b5ce-71d6292ba087",
                "name": "G&A 6700 - Employee Food Services",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.26e33b41-9686-4883-96d9-b92d2440ed33",
                "name": "G&A 8305 - Impairment",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.e473b8f4-7598-4bd2-910b-71a0bf0bcbbd",
                "name": "G&A 8350 - Amortization Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.912b10a7-db9e-4ce8-bed7-dc69d07afc65",
                "name": "G&A 6730 - Business meals",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.e48f6bae-5b4f-42b9-8b15-0b592d671cc6",
                "name": "G&A 6735 - Entertainment",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.171fe1ff-c11c-4cfe-b43a-41a601ffd3bd",
                "name": "G&A 6740 - Recruiting Travel",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.78e9eaf1-4221-46d2-b1d5-d01603009e3c",
                "name": "G&A 6750 - Employee travel",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.708785fc-0854-4ee1-b1db-c9e442e99444",
                "name": "G&A 6760 - Gifts",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.b4356ae0-7084-4e44-b300-bedcdb8fdb58",
                "name": "G&A 6800 - Office Expenses",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.63538067-85a9-4a56-81e8-7885585faaa0",
                "name": "G&A 6810 - Bank Charges",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.8be6b2b2-4edb-494b-a7f5-d7a312568a2d",
                "name": "G&A 6855 - Meals Reserve",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.bf4fabe9-2d7d-4892-b32a-256c978bcc4a",
                "name": "G&A 6860 - Other Expenses",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.f7e997aa-9a86-4fc4-b79a-025903281a84",
                "name": "6817 - Japanese Consumption Tax Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.86a1f359-c690-4835-8fef-03731d25236b",
                "name": "G&A 6819 - Sales and Use Tax Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.b6afc488-8459-4d29-a873-c3288ffb3c16",
                "name": "G&A 6820 - Filing Fees",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.150eb733-432b-441b-a149-34d9f917e1d7",
                "name": "G&A 6825 - Penalty Fees",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.1a36e1af-c01d-4b93-82fb-e7809da0700b",
                "name": "G&A 6830 - Insurance",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.72e3e888-a58e-458f-9a23-cf27d2f8ab7a",
                "name": "G&A 6835 - Shipping & Handling",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.19bf22a4-45f6-44ea-9d91-286d6feee08d",
                "name": "G&A 6840 - Payroll Processing Fees",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.98203b27-513b-4973-9db5-57d2edafb070",
                "name": "G&A 6850 - Charitable Donations",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.e3ca856f-40c8-4345-a7bf-4a177ebd2809",
                "name": "G&A 6815 - Sales and Use Tax - Goods & Services",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.200d79d6-fc1b-4f4f-bbe8-6283588d831e",
                "name": "G&A 6816 - VAT / GST Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.78c06a7a-52da-49b1-8a5c-6e9aab83d747",
                "name": "G&A 6870 - Credit Card Processing Fees",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.3ecb6e3a-5f17-4f60-9feb-c5a3a970d340",
                "name": "G&A 6880 - Collection Fees",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.db0a5aee-0a46-49d4-9874-26e5a8268a86",
                "name": "6890 - Fair Value of Earnout",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.bdc0edb0-b864-45de-94a5-8c96ccf01644",
                "name": "G&A 6891 - Earnout - Unvested Portion",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.75b4f7cd-3ef6-45c3-a55f-861f1c8897fe",
                "name": "G&A 6900 - Bad Debt Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.6cd8539b-ade6-4689-ac24-5c9190399d68",
                "name": "G&A 8100 - Income Tax Expense - Federal",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.e3cc32d1-f0b1-49c9-9f84-5abc968a48ce",
                "name": "G&A 8300 - Depreciation Expense",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.d17ecec5-bd05-4202-9268-7d998edf3b9e",
                "name": "G&A 8350-01 - Amortization of Acquired Intangibles",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.84f24914-b6fd-4b9b-9576-f3e6f4e02086",
                "name": "G&A 6071 - Contra Temp and contractor costs - SIP",
                "level": 4
              },
              {
                "id": "root-g-a-salaries-and-wages",
                "name": "G&A Salaries and Wages",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.909c2965-8210-42d3-b3dd-469eed1b3970.17823a6a-10fd-4b9e-8cc5-ab38bd4db8e7",
                    "name": "G&A 6010 - Salaries & Wages",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.909c2965-8210-42d3-b3dd-469eed1b3970.c99556c7-b0b3-4cd4-aa1d-5633d591e977",
                    "name": "G&A 6012 - Salaries & Wages Accrual",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.909c2965-8210-42d3-b3dd-469eed1b3970.df2172c9-305c-4d36-9796-86f0984cb0ac",
                    "name": "G&A 6013 - Salaries & Wages - Overtime",
                    "level": 5
                  }
                ]
              },
              {
                "id": "root-g-a-payroll-taxes",
                "name": "G&A Payroll Taxes",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.cebc2389-f9ec-4c63-9ccb-16974a6e765f.3b29f561-d64a-42d3-89f4-ea1383950ac2",
                    "name": "G&A 6020 - Payroll Taxes",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.cebc2389-f9ec-4c63-9ccb-16974a6e765f.fab6de5b-ebbf-439e-9b84-3447a27935d0",
                    "name": "G&A 6025 - Payroll Tax Accrual",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.cebc2389-f9ec-4c63-9ccb-16974a6e765f.6c2fa115-0189-4080-8fbb-43cd25195d2f",
                    "name": "G&A 6027 - Transaction Payroll Taxes",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.cebc2389-f9ec-4c63-9ccb-16974a6e765f.8fb74014-5c34-4af1-9e4b-5d7cf929b292",
                    "name": "G&A 6028 - Payroll Taxes Settlement",
                    "level": 5
                  }
                ]
              },
              {
                "id": "root-g-a-paid-media",
                "name": "G&A Paid Media",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.6a5bad77-8cbe-4f59-8f68-72e8dd9a0d13.1d56c723-ebbe-4bba-920d-7e5c3302184c",
                    "name": "G&A 6115 - Syndication",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.6a5bad77-8cbe-4f59-8f68-72e8dd9a0d13.394fbaba-9ab8-4436-b3ab-95452099e798",
                    "name": "G&A 6110 - Paid Search",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.6a5bad77-8cbe-4f59-8f68-72e8dd9a0d13.12468a6d-39d2-499e-a3ae-37f6e18114c2",
                    "name": "G&A 6112 - Paid Social",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.6a5bad77-8cbe-4f59-8f68-72e8dd9a0d13.77dd4415-c192-40de-85bd-780038fa7fc2",
                    "name": "G&A 6113 - Sponsored Content",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.6a5bad77-8cbe-4f59-8f68-72e8dd9a0d13.71910149-4653-46eb-9727-cf2a783d9115",
                    "name": "G&A 6114 - Advertising",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.6a5bad77-8cbe-4f59-8f68-72e8dd9a0d13.80d4e8d2-f857-4dfb-9836-237e8b2e60e1",
                    "name": "6116 - Contra Marketing Costs",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.6a5bad77-8cbe-4f59-8f68-72e8dd9a0d13.dbc787b7-c78d-4a84-8ac9-d1727fc6bec3",
                    "name": "G&A 6120 - Email",
                    "level": 5
                  }
                ]
              },
              {
                "id": "root-g-a-commissions-expense",
                "name": "G&A Commissions Expense",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.2e59d700-714a-4a0b-aaa4-9d161d832bbf.0aef0db2-26af-46e5-b6f2-194341643224",
                    "name": "G&A 6042 - Deferred Commission Amortization",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.2e59d700-714a-4a0b-aaa4-9d161d832bbf.0aa36528-f2eb-4848-871b-c50e5d6c0f07",
                    "name": "G&A 6043 - Contra Commission Expense - 606",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.2e59d700-714a-4a0b-aaa4-9d161d832bbf.e6f50cec-97ac-4f24-a72f-8f2ea976a405",
                    "name": "G&A 6045 - Deferred Commission Expense Reclass",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.2e59d700-714a-4a0b-aaa4-9d161d832bbf.24533c6c-f81e-47a9-94f9-1ea52da03c92",
                    "name": "G&A 6040 - Commissions",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.2e59d700-714a-4a0b-aaa4-9d161d832bbf.0cd839a7-d18c-4d6e-9383-dd4f46ba3c94",
                    "name": "G&A 6021 - Contra Payroll Tax Expense - 606",
                    "level": 5
                  }
                ]
              },
              {
                "id": "root-g-a-deferred-commission-amortization",
                "name": "G&A Deferred Commission Amortization",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.73f43c6e-8a2a-4b38-97ea-c95f7ecf6f92.a877f5b5-fdd5-4dd4-a0df-c140375cb4b6",
                    "name": "G&A 6022 - Deferred Payroll Taxes Amortization - 606",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.73f43c6e-8a2a-4b38-97ea-c95f7ecf6f92.346a0235-b7ae-4a94-9d8c-8e62119127c7",
                    "name": "G&A 6023 - Deferred Payroll Tax Reclass",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.73f43c6e-8a2a-4b38-97ea-c95f7ecf6f92.9d2450f2-82fa-4e78-9577-6d6f91dc4f2d",
                    "name": "G&A 6024 - Deferred Payroll Tax Amortization Reclass",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.73f43c6e-8a2a-4b38-97ea-c95f7ecf6f92.4911c2fa-b957-459d-ae6f-bc978465f3bc",
                    "name": "G&A 6044 - Deferred Commission Amortization - 606",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.73f43c6e-8a2a-4b38-97ea-c95f7ecf6f92.4653e4db-47d8-47d1-9221-fcdee824cd1f",
                    "name": "G&A 6046 - Deferred Commission Amortization Expense Reclass",
                    "level": 5
                  }
                ]
              },
              {
                "id": "root-g-a-bonuses",
                "name": "G&A Bonuses",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.81d790d8-d16e-49f8-ba3a-6906e2d8d882.ac6f5a5c-ffb1-4a55-a715-6108742dc440",
                    "name": "G&A 6050-01 - Bonus: Executive",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.81d790d8-d16e-49f8-ba3a-6906e2d8d882.75f25d43-22aa-435d-881a-96cbb10e72cd",
                    "name": "G&A 6050-02 - Bonus: Non-Executive",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.81d790d8-d16e-49f8-ba3a-6906e2d8d882.c6b74595-66a2-4c8a-8208-ff81132947c8",
                    "name": "G&A 6050-03 - Bonus: One-time",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.81d790d8-d16e-49f8-ba3a-6906e2d8d882.d21b5a35-4b6d-4bee-b93d-1aba21de0cb8",
                    "name": "G&A 6050-04 - Bonus: Referral",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.81d790d8-d16e-49f8-ba3a-6906e2d8d882.a874fd59-f359-4014-a697-7d845e4b1fed",
                    "name": "G&A 6050-05 - Bonus: Other",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.81d790d8-d16e-49f8-ba3a-6906e2d8d882.4ee0b054-265f-4ff0-819e-ae34135dae44",
                    "name": "G&A 6050-06 - Bonus: Transaction",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.81d790d8-d16e-49f8-ba3a-6906e2d8d882.401770f7-0958-40b8-8f39-70f893bec287",
                    "name": "G&A 6050-07 - Bonus: Transaction - Retention",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.81d790d8-d16e-49f8-ba3a-6906e2d8d882.a1cf55e6-1eaf-4d53-8856-eb2154ee8673",
                    "name": "6050-08 - Bonus: Transaction - Founders",
                    "level": 5
                  }
                ]
              },
              {
                "id": "root-g-a-stock-comp",
                "name": "G&A Stock Comp",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.2ec8abc9-3a4d-4f8d-b041-5da1d6bd6719.3d6e1887-cd70-4118-8a64-b05090edaf30",
                    "name": "G&A 6060 - Stock compensation",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.2ec8abc9-3a4d-4f8d-b041-5da1d6bd6719.4345f5f5-dd3d-4c12-a71b-422b06da0b78",
                    "name": "G&A 6064 - Stock Compensation ESPP",
                    "level": 5
                  }
                ]
              },
              {
                "id": "root-g-a-facilities",
                "name": "G&A Facilities",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.e518960c-dc0c-4ea9-a05f-dd2241868f94.2057be40-708e-4c82-a8d8-93cc70ee2139",
                    "name": "G&A 6447 - Facilities - Food Services",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.e518960c-dc0c-4ea9-a05f-dd2241868f94.783f9769-c0cf-41ac-b4bc-016ea2542bce",
                    "name": "G&A 6451 - Facilities",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.e518960c-dc0c-4ea9-a05f-dd2241868f94.65e40286-402d-4c2a-a8fe-aa1cd30f484c",
                    "name": "G&A 6445 - Facilities - Cleaning",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.e518960c-dc0c-4ea9-a05f-dd2241868f94.e5c47d77-e8cc-41be-b990-dfe3ff1f1151",
                    "name": "G&A 6446 - Facilities - CAM",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.e518960c-dc0c-4ea9-a05f-dd2241868f94.cef1fcd4-f1c4-43fa-8bcd-d8a583c96e63",
                    "name": "6448 - Facilities Contra - Sublease",
                    "level": 5
                  }
                ]
              },
              {
                "id": "root-g-a-rent-or-lease",
                "name": "G&A Rent or Lease",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.556758ee-9635-4e83-ac14-172fd0b5d81c.d05faa7d-2bbe-402c-9504-4285a2f67df4",
                    "name": "G&A 6443 - Rent or Lease (Short Term)",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.556758ee-9635-4e83-ac14-172fd0b5d81c.ebcea5bd-aa69-4d1b-b85a-becabe840eff",
                    "name": "G&A 6444 - Rent or Lease - Variable CPI/Other",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.556758ee-9635-4e83-ac14-172fd0b5d81c.36dd933a-d576-47a1-9989-6b7ffd8320e7",
                    "name": "6449 - Rent or Lease Contra - Sublease",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.556758ee-9635-4e83-ac14-172fd0b5d81c.4940e14e-e1d5-4f5e-901d-56fb38cb2b6f",
                    "name": "G&A 6441 - Rent or Lease (842) Amortization",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.556758ee-9635-4e83-ac14-172fd0b5d81c.eccfd72f-200b-4f44-87a2-8402b2360eb0",
                    "name": "G&A 6442 - Rent or Lease (842) Other",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.556758ee-9635-4e83-ac14-172fd0b5d81c.f6c02544-1e49-4831-900f-d4377213e51e",
                    "name": "G&A 6450 - Rent or Lease (842)",
                    "level": 5
                  }
                ]
              },
              {
                "id": "root-g-a-professional-fees",
                "name": "G&A Professional Fees",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.9c3f54f4-dc05-4392-a9d5-3d6d18ad36da.83b09d63-5644-400e-9763-6da52f8579f1",
                    "name": "G&A 6500 - Professional Fees",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.9c3f54f4-dc05-4392-a9d5-3d6d18ad36da.4bf78db2-f563-4231-a739-78d1606588a7",
                    "name": "G&A 6506 - Professional Fees - Transaction",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.9c3f54f4-dc05-4392-a9d5-3d6d18ad36da.f272b33a-1262-4627-94ce-19b075998ed1",
                    "name": "6507 - Professional Fees - Special Board Matter",
                    "level": 5
                  }
                ]
              },
              {
                "id": "root-g-a-legal-fees",
                "name": "G&A Legal Fees",
                "level": 4,
                "children": [
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.bdb6b52d-1976-4fbc-82ee-48596cb5b142.3a3fe0be-86b0-4cb1-80fa-601f613f39ab",
                    "name": "G&A 6510 - Legal Fees",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.bdb6b52d-1976-4fbc-82ee-48596cb5b142.b7e3f908-76b6-4f21-af99-4635055ede20",
                    "name": "6515 - Legal Fees - Transaction",
                    "level": 5
                  },
                  {
                    "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.bdb6b52d-1976-4fbc-82ee-48596cb5b142.19a79de5-d6a2-4d41-baf4-a4ab695f87ea",
                    "name": "6516 - Legal Fees - Special Board Matter",
                    "level": 5
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "root-non-operating-expenses",
        "name": "Non-Operating Expenses",
        "level": 2,
        "children": [
          {
            "id": "root-other-income-expense",
            "name": "Other Income Expense",
            "level": 3,
            "children": [
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.58687705-81bb-4066-96d4-d85f254f3dfe.981df063-8c9d-46b1-ab54-e9a1c318c59b.ead6dfc2-2ac3-4a76-9f5d-94ccd738150e",
                "name": "Interest Income",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.58687705-81bb-4066-96d4-d85f254f3dfe.981df063-8c9d-46b1-ab54-e9a1c318c59b.0dea1322-41c4-4ea2-bbf6-13957e1b7cbc",
                "name": "Other Income (Expense), net",
                "level": 4
              }
            ]
          },
          {
            "id": "root-other",
            "name": "Other",
            "level": 3,
            "children": [
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.58687705-81bb-4066-96d4-d85f254f3dfe.3160feb2-6dd0-4673-91cd-d37918af64a1.c03653e3-d192-477a-945d-1e5d74ac5107",
                "name": "Income Tax benefit (expense)",
                "level": 4
              },
              {
                "id": "d6e59fd0-a55a-4d5a-884e-437832ee2019.58687705-81bb-4066-96d4-d85f254f3dfe.3160feb2-6dd0-4673-91cd-d37918af64a1.57b28eb0-b175-45eb-968f-00a8b6310809",
                "name": "Income Statement Inactive",
                "level": 4
              }
            ]
          }
        ]
      }
    ]
  }
]
