import { describe, it, expect, beforeEach, vi } from "vitest";
import contractManager from "../../src/services/contractManager";
import { supabase } from "../../src/database";

// Mock Datenbank-Modul
vi.mock("../../src/database", () => ({
    supabase: {
        from: vi.fn()
    }
}));

describe("contractManager", () => {
    beforeEach(() => {
        // Setze alle Mocks vor jedem Test zurück
        vi.clearAllMocks();
    });

    describe("getAllContracts", () => {
        it("should fetch all contracts successfully", async () => {
            const mockContracts = [
                { id: 1, company: "Netflix", amount: 15.99 },
                { id: 2, company: "Spotify", amount: 9.99 }
            ];

            // from("contracts").select("*")
            const mockSelect = vi.fn().mockResolvedValue({
                data: mockContracts,
                error: null
            });

            supabase.from.mockReturnValue({
                select: mockSelect
            });

            const result = await contractManager.getAllContracts();

            // Prüfe, ob die Verträge korrekt zurückgegeben werden
            expect(result).toEqual(mockContracts);
            expect(supabase.from).toHaveBeenCalledWith("contracts");
            expect(mockSelect).toHaveBeenCalledWith("*");
        });

        it("should throw error when fetch fails", async () => {
            const mockError = new Error("Database error");
            
            const mockSelect = vi.fn().mockResolvedValue({
                data: null,
                error: mockError
            });

            supabase.from.mockReturnValue({
                select: mockSelect
            });

            // Erwarte, dass ein Fehler geworfen wird
            await expect(contractManager.getAllContracts()).rejects.toThrow("Database error");
        });

        it("should return empty array when no contracts exist", async () => {
            const mockSelect = vi.fn().mockResolvedValue({
                data: null,
                error: null
            });

            supabase.from.mockReturnValue({
                select: mockSelect
            });

            const result = await contractManager.getAllContracts();

            // Wenn keine Daten vorhanden, sollte ein leeres Array zurückgegeben werden
            expect(result).toEqual([]);
        });
    });

    describe("createContract", () => {
        it("should create a new contract successfully", async () => {
            const newContract = {
                company: "Disney+",
                amount: 8.99,
                start_date: "2024-01-01",
                user_id: "user-123"
            };

            const mockResponse = { ...newContract, id: 3 };

            // Baue die Mock-Kette: from().insert().select().single()
            const mockSingle = vi.fn().mockResolvedValue({
                data: mockResponse,
                error: null
            });

            const mockSelect = vi.fn().mockReturnValue({
                single: mockSingle
            });

            const mockInsert = vi.fn().mockReturnValue({
                select: mockSelect
            });

            supabase.from.mockReturnValue({
                insert: mockInsert
            });

            const result = await contractManager.createContract(newContract);

            // Prüfe, ob der erstellte Vertrag zurückgegeben wird
            expect(result).toEqual(mockResponse);
            expect(supabase.from).toHaveBeenCalledWith("contracts");
            expect(mockInsert).toHaveBeenCalledWith(newContract);
        });

        it("should throw error when creation fails", async () => {
            const mockError = new Error("Insert failed");
            
            const mockSingle = vi.fn().mockResolvedValue({
                data: null,
                error: mockError
            });

            const mockSelect = vi.fn().mockReturnValue({
                single: mockSingle
            });

            const mockInsert = vi.fn().mockReturnValue({
                select: mockSelect
            });

            supabase.from.mockReturnValue({
                insert: mockInsert
            });

            await expect(contractManager.createContract({})).rejects.toThrow("Insert failed");
        });
    });

    describe("updateContract", () => {
        it("should update contract successfully", async () => {
            const updates = { amount: 19.99 };
            const mockUpdated = { id: 1, company: "Netflix", amount: 19.99 };

            // from().update().eq().select().single()
            const mockSingle = vi.fn().mockResolvedValue({
                data: mockUpdated,
                error: null
            });

            const mockSelect = vi.fn().mockReturnValue({
                single: mockSingle
            });

            const mockEq = vi.fn().mockReturnValue({
                select: mockSelect
            });

            const mockUpdate = vi.fn().mockReturnValue({
                eq: mockEq
            });

            supabase.from.mockReturnValue({
                update: mockUpdate
            });

            const result = await contractManager.updateContract(1, updates);

            expect(result).toEqual(mockUpdated);
            expect(mockUpdate).toHaveBeenCalledWith(updates);
            expect(mockEq).toHaveBeenCalledWith("id", 1);
        });
    });

    describe("deleteContract", () => {
        it("should delete contract successfully", async () => {
            // from().delete().eq()
            const mockEq = vi.fn().mockResolvedValue({
                error: null
            });

            const mockDelete = vi.fn().mockReturnValue({
                eq: mockEq
            });

            supabase.from.mockReturnValue({
                delete: mockDelete
            });

            const result = await contractManager.deleteContract(1);

            // Prüfe, ob die Löschung erfolgreich war
            expect(result).toBe(true);
            expect(mockDelete).toHaveBeenCalled();
            expect(mockEq).toHaveBeenCalledWith("id", 1);
        });

        it("should throw error when deletion fails", async () => {
            const mockError = new Error("Delete failed");
            
            const mockEq = vi.fn().mockResolvedValue({
                error: mockError
            });

            const mockDelete = vi.fn().mockReturnValue({
                eq: mockEq
            });

            supabase.from.mockReturnValue({
                delete: mockDelete
            });

            await expect(contractManager.deleteContract(1)).rejects.toThrow("Delete failed");
        });
    });
});