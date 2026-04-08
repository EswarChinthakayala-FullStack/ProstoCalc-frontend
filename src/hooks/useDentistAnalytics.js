import { useState, useEffect, useCallback } from 'react'
import { getDentistAnalytics, getConsultationRequests } from '@/services/api'
import { useAuth } from '@/context/AuthContext'

export const useDentistAnalytics = (timeframe = '6months', mode = 'full') => {
    const { user } = useAuth()
    const [stats, setStats] = useState({
        totalPatients: 0,
        pendingRequests: 0,
        treatmentPlans: 0,
        revenue: 0,
        calculations: 0
    })
    const [monthlyData, setMonthlyData] = useState([])
    const [procedures, setProcedures] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchStats = useCallback(async () => {
        if (!user?.id) return

        setIsLoading(true)
        setError(null)
        try {
            // Fetch both in parallel to ensure we have fallback data
            const [res, requestsRes] = await Promise.all([
                getDentistAnalytics(user.id, timeframe),
                getConsultationRequests('DENTIST', user.id)
            ])
            
            let finalStats = {
                totalPatients: 0,
                pendingRequests: 0,
                treatmentPlans: 0,
                revenue: 0,
                calculations: 0
            }

            let finalMonthly = []
            let finalProcedures = []

            // 1. Process primary analytics if successful
            if (res.status === 'success' && res.data) {
                finalStats = { ...res.data.stats }
                finalMonthly = [...(res.data.monthlyData || [])]
                finalProcedures = [...(res.data.procedures || [])]
            }

            // 2. Frontend "Healing" Logic: 
            // If revenue is 0 but we have consultation requests with costs, aggregate them manually.
            // This fixes the issue where mobile-signup patients don't show up in strict backend stats.
            if (requestsRes.status === 'success' && requestsRes.data) {
                const requests = requestsRes.data
                
                // Aggregate counts
                const uniquePatients = new Set(requests.map(r => r.patient_id)).size
                const pendingCount = requests.filter(r => r.status === 'PENDING').length
                const planCount = requests.filter(r => r.estimated_cost && r.estimated_cost > 0).length
                const totalRev = requests.reduce((sum, r) => sum + (parseFloat(r.estimated_cost) || 0), 0)

                // Only override if backend returned 0 but we found data in requests
                if (finalStats.revenue === 0 && totalRev > 0) {
                    finalStats.revenue = totalRev
                    finalStats.totalPatients = Math.max(finalStats.totalPatients, uniquePatients)
                    finalStats.treatmentPlans = Math.max(finalStats.treatmentPlans, planCount)
                    finalStats.calculations = Math.max(finalStats.calculations, requests.length)
                }
                
                finalStats.pendingRequests = pendingCount // Always trust the live requests count

                // --- 3. Heal Monthly History (Chart Fallback) ---
                if (finalMonthly.length === 0 && requests.length > 0) {
                    const monthsLimit = timeframe === 'year' ? 12 : 6;
                    const monthMap = {};
                    const today = new Date();

                    // Pre-fill with empty months to keep chart structure
                    for (let i = monthsLimit - 1; i >= 0; i--) {
                        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
                        const name = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                        const sort_key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                        monthMap[sort_key] = { name, sort_key, revenue: 0, patients: 0, calculations: 0 };
                    }

                    // Populate from requests
                    requests.forEach(r => {
                        const date = r.requested_at ? new Date(r.requested_at) : new Date();
                        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                        if (monthMap[key]) {
                            monthMap[key].revenue += (parseFloat(r.estimated_cost) || 0);
                            monthMap[key].calculations += 1;
                            // Patients count is approximated locally for the chart
                            monthMap[key].patients += 1; 
                        }
                    });
                    finalMonthly = Object.values(monthMap).sort((a, b) => a.sort_key.localeCompare(b.sort_key));
                }

                // --- 4. Heal Procedure Distribution (Pie Fallback) ---
                if (finalProcedures.length === 0 && requests.length > 0) {
                    const procMap = {}
                    requests.forEach(r => {
                        if (r.treatment_name) {
                            r.treatment_name.split(',').forEach(p => {
                                const name = p.trim()
                                if (name) procMap[name] = (procMap[name] || 0) + 1
                            })
                        }
                    })
                    finalProcedures = Object.entries(procMap).map(([name, count]) => ({
                        name,
                        value: count
                    })).sort((a, b) => b.value - a.value).slice(0, 5)
                }
            }

            setStats(finalStats)
            setMonthlyData(finalMonthly)
            setProcedures(finalProcedures)
            
        } catch (e) {
            console.error("Failed to fetch analytics summary", e)
            setError(e.message || 'Failed to fetch analytics')
        } finally {
            setIsLoading(false)
        }
    }, [user?.id, timeframe])

    useEffect(() => {
        fetchStats()
    }, [fetchStats])

    return {
        stats,
        monthlyData,
        procedures,
        isLoading,
        error,
        refetch: fetchStats
    }
}
