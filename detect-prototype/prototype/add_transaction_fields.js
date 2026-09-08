const fs = require('fs');
const filePath = 'src/app/App.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Default transaction fields to add
const defaultFields = `,
    transactionId: 'BILL-XXXXX',
    postingPeriod: 'April 2026',
    currency: 'USD',
    type: 'Vendor Bill',
    subsidiary: 'FloQast Inc',
    account: '5000-General',
    name: 'Vendor Name',
    memo: 'Transaction memo',
    department: 'Finance',
    class: 'Operations',
    location: 'Headquarters',
    createdDate: '2026-04-21',
    createdBy: 'Unknown'`;

// Find all transaction objects that don't have transactionId
const transactionPattern = /(\s+comments: \[[^\]]*\])\n(\s+\}),\n(\s+\{[\s\S]*?id: 'at-\d+',)/g;

let count = 3; // Start from transaction 3
content = content.replace(transactionPattern, (match, comments, closeBrace, nextTx) => {
  if (match.includes('transactionId:')) {
    return match; // Skip if already has transactionId
  }
  const txId = `BILL-440${count + 20}`;
  count++;
  return `${comments}${defaultFields.replace('BILL-XXXXX', txId)}\n${closeBrace},\n${nextTx}`;
});

fs.writeFileSync(filePath, content);
console.log('Done adding fields');
