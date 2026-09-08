const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const defaults = jsonServer.defaults();

server.use(defaults);

// Use json-server's render hook to enrich transaction responses
router.render = (req, res) => {
  if (req.path.startsWith('/transactions')) {
    const db = router.db.getState();
    const vendors = db.vendors || [];
    const periods = db.periods || [];
    let data = res.locals.data;

    if (Array.isArray(data)) {
      data = data.map(t => enrichTransaction(t, vendors, periods));
    } else if (data && data.id) {
      data = enrichTransaction(data, vendors, periods);
    }
    res.jsonp(data);
  } else {
    res.jsonp(res.locals.data);
  }
};

function enrichTransaction(t, vendors, periods) {
  const amount = Number(t.amount) || 0;
  const enteredDate = t.enteredDate ? new Date(t.enteredDate) : null;
  const glDate = t.glDate ? new Date(t.glDate) : null;

  const isRoundNumber = amount >= 5000 && amount % 1000 === 0;
  const dayOfWeek = enteredDate ? enteredDate.getUTCDay() : null;
  const hourOfDay = enteredDate ? enteredDate.getUTCHours() : null;

  let vendorAgeAtTransaction = null;
  if (t.vendorId && enteredDate) {
    const vendor = vendors.find(v => v.id === t.vendorId);
    if (vendor && vendor.createdDate) {
      const vendorCreated = new Date(vendor.createdDate);
      vendorAgeAtTransaction = Math.floor(
        (enteredDate.getTime() - vendorCreated.getTime()) / (1000 * 60 * 60 * 24)
      );
    }
  }

  let isPostClose = t.isPostClose || false;
  let isPeriodEnd = false;
  if (t.postingPeriod) {
    const period = periods.find(p => p.name === t.postingPeriod);
    if (period) {
      if (period.isClosed && period.closeDate && enteredDate) {
        isPostClose = isPostClose || (enteredDate > new Date(period.closeDate));
      }
      if (period.closeDate && glDate) {
        const closeDate = new Date(period.closeDate);
        const threeDaysBefore = new Date(closeDate);
        threeDaysBefore.setDate(threeDaysBefore.getDate() - 3);
        isPeriodEnd = glDate >= threeDaysBefore && glDate <= closeDate;
      }
    }
  }

  return {
    ...t,
    isRoundNumber,
    dayOfWeek,
    hourOfDay,
    vendorAgeAtTransaction,
    isPostClose,
    isPeriodEnd
  };
}

server.use(router);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Defender API running on http://localhost:${PORT}`);
});
