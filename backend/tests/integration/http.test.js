import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/adapters/inbound/http/app';
// In-memory adapters for integration without DB
function makeApp() {
    const routes = [
        { id: 1, routeId: 'R001', vesselType: 'Container', fuelType: 'HFO', year: 2024, ghgIntensity: 91, fuelConsumption: 5000, distance: 0, totalEmissions: 0, isBaseline: true },
        { id: 2, routeId: 'R002', vesselType: 'BulkCarrier', fuelType: 'LNG', year: 2024, ghgIntensity: 88, fuelConsumption: 4800, distance: 0, totalEmissions: 0, isBaseline: false },
    ];
    const routesRepo = {
        getAll: async () => routes,
        setBaseline: async (id) => { routes.forEach(r => r.isBaseline = false); const r = routes.find(r => r.id === id); if (r)
            r.isBaseline = true; },
        getBaseline: async () => routes.find(r => r.isBaseline) ?? null,
    };
    const routesReadRepo = { findByShipAndYear: async (id, year) => routes.find(r => r.routeId === id && r.year === year) ?? null };
    const compRepo = { map: new Map(), upsertSnapshot: async (s, y, cb) => { const v = { id: 1, shipId: s, year: y, cb }; compRepo.map.set(s + y, v); return v; }, getSnapshot: async (s, y) => compRepo.map.get(s + y) ?? null };
    const bankRepo = { list: [], getEntries: async (s, y) => bankRepo.list.filter((e) => e.shipId === s && e.year === y), addEntry: async (s, y, a) => { const e = { id: bankRepo.list.length + 1, shipId: s, year: y, amount: a, createdAt: new Date() }; bankRepo.list.push(e); return e; } };
    return createApp({ routesRepo, routesReadRepo, complianceRepo: compRepo, bankingRepo: bankRepo });
}
describe('HTTP', () => {
    it('serves routes and comparison', async () => {
        const app = makeApp();
        const r = await request(app).get('/routes');
        expect(r.status).toBe(200);
        const c = await request(app).get('/routes/comparison');
        expect(c.status).toBe(200);
        expect(Array.isArray(c.body)).toBe(true);
    });
});
