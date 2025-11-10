import { describe, it, expect } from 'vitest';
import { BankSurplus } from '../../src/core/application/BankSurplus';
import { ApplyBanked } from '../../src/core/application/ApplyBanked';
class InMemComplianceRepo {
    map = new Map();
    async upsertSnapshot(shipId, year, cb) { const v = { id: 1, shipId, year, cb }; this.map.set(shipId + year, v); return v; }
    async getSnapshot(shipId, year) { return this.map.get(shipId + year) ?? null; }
}
class InMemBankingRepo {
    list = [];
    async getEntries(shipId, year) { return this.list.filter(e => e.shipId === shipId && e.year === year); }
    async addEntry(shipId, year, amount) { const e = { id: this.list.length + 1, shipId, year, amount, createdAt: new Date() }; this.list.push(e); return e; }
}
describe('Banking', () => {
    it('banks positive CB and applies to deficit', async () => {
        const comp = new InMemComplianceRepo();
        const bank = new InMemBankingRepo();
        await comp.upsertSnapshot('S1', 2024, 100);
        const banked = await new BankSurplus(comp, bank).exec({ shipId: 'S1', year: 2024 });
        expect(banked.applied).toBe(100);
        await comp.upsertSnapshot('S1', 2025, -50);
        const applied = await new ApplyBanked(comp, bank).exec({ shipId: 'S1', year: 2025, amount: 50 });
        expect(applied.cb_after).toBe(0);
    });
});
