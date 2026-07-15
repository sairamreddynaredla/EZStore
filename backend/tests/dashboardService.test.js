import test from 'node:test';
import assert from 'node:assert/strict';
import { getDashboardSummary } from '../src/services/admin/dashboardService.js';

test('dashboard summary returns analytics payload fields', async () => {
  const summary = await getDashboardSummary();

  assert.ok(summary);
  assert.ok(Object.prototype.hasOwnProperty.call(summary, 'totalProducts'));
  assert.ok(Object.prototype.hasOwnProperty.call(summary, 'recentOrders'));
  assert.ok(Object.prototype.hasOwnProperty.call(summary, 'orderStatusBreakdown'));
  assert.ok(Object.prototype.hasOwnProperty.call(summary, 'customerBreakdown'));
  assert.ok(Object.prototype.hasOwnProperty.call(summary, 'topProducts'));
  assert.ok(Object.prototype.hasOwnProperty.call(summary, 'revenueSeries'));
  assert.ok(Object.prototype.hasOwnProperty.call(summary, 'recentActivities'));
});
