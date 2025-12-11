import { describe, it, expect, beforeEach, vi } from "vitest";
import contractManager from "../../src/services/contractManager";
import { supabase } from "../../src/database";

describe("contractManager", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("getAllContracts", () => {
        it("should fetch all contracts successfully", async () => {
            const mockContracts = [
                { id: 1, company: "Netflix", amount: 15.99 },
                { id: 2, company: "Spotify", amount: 9.99 }
            ];

            supabase.from().select.mockResolvedValue({
                data: mockContracts,
                error: null
            });

            const result = await contractManager.getAllContracts();

            expect(result).toEqual(mockContracts);
            expect(supabase.from).toHaveBeenCalledWith("contracts");
        });

        it("should throw error when fetch fails", async () => {
            const mockError = new Error("Database error");
      
            supabase.from().select.mockResolvedValue({
                data: null,
                error: mockError
            });

            await expect(contractManager.getAllContracts()).rejects.toThrow("Database error");
        });

        it("should return empty array when no contracts exist", async () => {
            supabase.from().select.mockResolvedValue({
                data: null,
                error: null
            });

            const result = await contractManager.getAllContracts();

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

            supabase.from().insert().select().single.mockResolvedValue({
                data: mockResponse,
                error: null
            });

            const result = await contractManager.createContract(newContract);

            expect(result).toEqual(mockResponse);
            expect(supabase.from).toHaveBeenCalledWith("contracts");
        });

        it("should throw error when creation fails", async () => {
            const mockError = new Error("Insert failed");
      
            supabase.from().insert().select().single.mockResolvedValue({
                data: null,
                error: mockError
            });

            await expect(contractManager.createContract({})).rejects.toThrow("Insert failed");
        });
    });

    describe("updateContract", () => {
        it("should update contract successfully", async () => {
            const updates = { amount: 19.99 };
            const mockUpdated = { id: 1, company: "Netflix", amount: 19.99 };

            supabase.from().update().eq().select().single.mockResolvedValue({
                data: mockUpdated,
                error: null
            });

            const result = await contractManager.updateContract(1, updates);

            expect(result).toEqual(mockUpdated);
        });
    });

    describe("deleteContract", () => {
        it("should delete contract successfully", async () => {
            supabase.from().delete().eq.mockResolvedValue({
                error: null
            });

            const result = await contractManager.deleteContract(1);

            expect(result).toBe(true);
        });

        it("should throw error when deletion fails", async () => {
            const mockError = new Error("Delete failed");
      
            supabase.from().delete().eq.mockResolvedValue({
                error: mockError
            });

            await expect(contractManager.deleteContract(1)).rejects.toThrow("Delete failed");
        });
    });
});
