/**
 * Módulo de Cache para otimização de performance do Dashboard
 * Implementa cache com TTL (Time To Live) para reduzir chamadas à API
 * 
 * @author Sistema Psyclin - Análise de Sistemas
 * @version 1.0
 * @since 2025-06-28
 */

class DashboardCache {
    constructor() {
        this.cache = new Map();
        this.TTL_1_HOUR = 1 * 60 * 60 * 1000;   // 1 hora em millisegundos
        this.TTL_4_HOURS = 4 * 60 * 60 * 1000;  // 4 horas em millisegundos (para anamneses)
        this.TTL_6_HOURS = 6 * 60 * 60 * 1000;  // 6 horas em millisegundos (para histórico)
        this.TTL_8_HOURS = 8 * 60 * 60 * 1000;  // 8 horas em millisegundos
        this.TTL_24_HOURS = 24 * 60 * 60 * 1000; // 24 horas em millisegundos (para procedimentos)
    }

    /**
     * Gera chave única para o cache
     * @param {string} type - Tipo de dados (profissionais, pacientes, etc.)
     * @param {string} operation - Operação (contar-ativos, listar, etc.)
     * @returns {string} Chave única
     */
    generateKey(type, operation) {
        return `${type}_${operation}`;
    }

    /**
     * Armazena dados no cache com TTL
     * @param {string} key - Chave do cache
     * @param {any} data - Dados a serem armazenados
     * @param {number} ttl - Time to live em millisegundos
     */
    set(key, data, ttl = this.TTL_8_HOURS) {
        const expiresAt = Date.now() + ttl;
        this.cache.set(key, {
            data,
            expiresAt,
            createdAt: Date.now()
        });
        
        console.log(`📦 Cache armazenado: ${key} (expira em ${new Date(expiresAt).toLocaleString()})`);
    }

    /**
     * Recupera dados do cache se ainda válidos
     * @param {string} key - Chave do cache
     * @returns {any|null} Dados do cache ou null se expirado/inexistente
     */
    get(key) {
        const cached = this.cache.get(key);
        
        if (!cached) {
            console.log(`🔍 Cache miss: ${key}`);
            return null;
        }

        if (Date.now() > cached.expiresAt) {
            console.log(`⏰ Cache expirado: ${key}`);
            this.cache.delete(key);
            return null;
        }

        const ageMinutes = Math.floor((Date.now() - cached.createdAt) / (1000 * 60));
        console.log(`✅ Cache hit: ${key} (idade: ${ageMinutes} minutos)`);
        return cached.data;
    }

    /**
     * Remove entrada específica do cache
     * @param {string} key - Chave do cache
     */
    delete(key) {
        const deleted = this.cache.delete(key);
        if (deleted) {
            console.log(`🗑️ Cache removido: ${key}`);
        }
        return deleted;
    }

    /**
     * Limpa todo o cache
     */
    clear() {
        const size = this.cache.size;
        this.cache.clear();
        console.log(`🧹 Cache limpo: ${size} entradas removidas`);
    }

    /**
     * Remove entradas expiradas
     */
    cleanup() {
        const now = Date.now();
        let removedCount = 0;
        
        for (const [key, value] of this.cache.entries()) {
            if (now > value.expiresAt) {
                this.cache.delete(key);
                removedCount++;
            }
        }
        
        if (removedCount > 0) {
            console.log(`🧽 Limpeza automática: ${removedCount} entradas expiradas removidas`);
        }
    }

    /**
     * Obtém estatísticas do cache
     * @returns {object} Estatísticas do cache
     */
    getStats() {
        const now = Date.now();
        let validEntries = 0;
        let expiredEntries = 0;
        
        for (const [key, value] of this.cache.entries()) {
            if (now > value.expiresAt) {
                expiredEntries++;
            } else {
                validEntries++;
            }
        }
        
        return {
            totalEntries: this.cache.size,
            validEntries,
            expiredEntries,
            memoryUsage: this.estimateMemoryUsage()
        };
    }

    /**
     * Estima uso de memória do cache (aproximado)
     * @returns {string} Estimativa de uso de memória
     */
    estimateMemoryUsage() {
        const sizeInBytes = JSON.stringify([...this.cache.entries()]).length;
        return sizeInBytes > 1024 ? `${(sizeInBytes / 1024).toFixed(2)} KB` : `${sizeInBytes} bytes`;
    }
}

// Instância singleton do cache
const dashboardCache = new DashboardCache();

// Limpeza automática a cada 30 minutos
setInterval(() => {
    dashboardCache.cleanup();
}, 30 * 60 * 1000);

export { dashboardCache, DashboardCache };
