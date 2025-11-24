import axios from 'axios'

const API_BASE_URL = 'https://api.example.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Basis-Klassenfunktion für CRUD

export class ApiManager {
    constructor(resource) {
        this.resource = resource // z.B. 'users' oder 'contracts'
    }

    async getAll(params = {}) {
        const response = await api.get(`/${this.resource}`, { params })
        return response.data
    }

    async getById(id) {
        const response = await api.get(`/${this.resource}/${id}`)
        return response.data
    }

    async create(data) {
        const response = await api.post(`/${this.resource}`, data)
        return response.data
    }

    async update(id, data) {
        const response = await api.put(`/${this.resource}/${id}`, data)
        return response.data
    }

    async delete(id) {
        const response = await api.delete(`/${this.resource}/${id}`)
        return response.data
    }
}