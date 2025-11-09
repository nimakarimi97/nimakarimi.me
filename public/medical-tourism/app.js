// ============================================
// CORRECTED: Medical Tourism Investment Dashboard
// Thailand (Established) vs Turkey (Emerging)
// WITH INTERACTIVE ROI CALCULATOR
// Data Verified Against Strategic Report
// ============================================

// DATA CONFIGURATION - VERIFIED FROM REPORT
// ==========================================

const destinationComparison = {
    thailand: {
        healthcare_infrastructure: 9,
        international_accreditation: 8,
        cost_advantage: 7,
        governance_framework: 8,
        environmental_sustainability: 5,
        social_impact: 4,
        economic_contribution: 9,
        ethical_oversight: 7,
        brain_drain_risk: 3,
        local_healthcare_access: 4,
        market_share: '24.40%',
        annual_patients: '3 million',
        annual_revenue: '$9 billion',
        jci_hospitals: '17',
        cost_savings: '76% vs USA',
    },
    turkey: {
        healthcare_infrastructure: 8,
        international_accreditation: 8,
        cost_advantage: 8,
        governance_framework: 9,
        environmental_sustainability: 9,
        social_impact: 8,
        economic_contribution: 7,
        ethical_oversight: 8,
        brain_drain_risk: 7,
        local_healthcare_access: 8,
        medical_tourists_2023: '1.8 million',
        growth_rate: '170%',
        projected_2028: '$20 billion',
        jci_hospitals: '40',
        cagr: '14.5%',
        cost_savings: '50-70% vs USA',
    },
}

const sustainabilityFramework = [
    {
        principle: 'Ethical Governance',
        color: '#2180D5',
        actions: ['JCI/GHA accreditation', 'Patient rights charter', 'Informed consent protocols'],
        kpis: ['Patient satisfaction scores', 'Accreditation status', 'Complaint resolution time'],
    },
    {
        principle: 'Environmental Sustainability',
        color: '#2CA02C',
        actions: ['Carbon offset programs', 'Green certifications', 'Waste management (50%+ diversion)'],
        kpis: ['Carbon footprint per patient', 'Waste recycling rate', 'Energy efficiency'],
    },
    {
        principle: 'Social Responsibility',
        color: '#FF7F0E',
        actions: ['Cross-subsidization (10-15%)', 'Workforce development', 'Community health (20% capacity)'],
        kpis: ['Public hospital staffing', 'Local employment rate', 'Healthcare access index'],
    },
    {
        principle: 'Economic Viability',
        color: '#9467BD',
        actions: ['Transparent pricing', 'Insurance partnerships', 'PPP structures'],
        kpis: ['Revenue growth', 'IRR 12-32%', 'Economic multiplier $2-3'],
    },
    {
        principle: 'Clinical Excellence',
        color: '#17BECF',
        actions: ['Quality standards', 'Medical education', 'Outcome tracking'],
        kpis: ['Clinical outcomes', 'Success rates', 'Patient safety incidents'],
    },
    {
        principle: 'Stakeholder Engagement',
        color: '#8C564B',
        actions: ['Government forums', 'Stakeholder consultations', 'Transparent reporting'],
        kpis: ['Stakeholder satisfaction', 'Community engagement', 'Public trust index'],
    },
]

const investmentRecommendations = [
    {
        name: 'Integrated ESG-PPP Investment Model',
        roi_range: '1.24-1.80x',
        payback_years: '5-9',
        initial_investment: '$10-15M pilot',
        ongoing_investment: '$5-10M annually',
        risk_mitigation: '40% reduction in liability',
        timeline: 'Months 1-36',
        outcomes: [
            'BCR: 1.24-1.80',
            'IRR: 12-32%',
            '20-30% community healthcare capacity',
            '200-500 direct jobs',
        ],
    },
    {
        name: 'Technology-Enabled Ethical Infrastructure',
        roi_range: '1.5-1.8x',
        payback_years: '2-3',
        initial_investment: '$500K-$1M',
        ongoing_investment: '$100K annually',
        risk_mitigation: '15-25% complication reduction',
        timeline: 'Months 1-24',
        outcomes: [
            '15-25% complication reduction',
            '10-20% success improvement',
            '40-50 tons annual carbon reduction',
            '20-30% NPS increase',
        ],
    },
    {
        name: 'Regional ESG Center of Excellence',
        roi_range: '1.1-1.3x',
        payback_years: '6-9',
        initial_investment: '$3-5M',
        ongoing_investment: '$2-3M annually',
        risk_mitigation: '50% reduction in violations',
        timeline: 'Months 1-48',
        outcomes: [
            '10-15% premium pricing',
            '25-35% higher patient volume',
            'Access to $35T ESG capital',
            '20-30% valuation premium',
        ],
    },
]

const keyRisks = [
    {
        risk: 'Brain Drain (Healthcare Workers)',
        level: 'High',
        mitigation: 'Dual-practice policies, competitive compensation, workforce retention programs',
    },
    {
        risk: 'Healthcare Equity Challenges',
        level: 'High',
        mitigation: 'Cross-subsidization (10-15%), public sector support, 20% community capacity allocation',
    },
    {
        risk: 'Environmental Impact',
        level: 'Medium',
        mitigation: 'Carbon offset programs, green certifications, 30%+ renewable energy targets',
    },
    {
        risk: 'Regulatory & Compliance',
        level: 'Medium',
        mitigation: 'JCI accreditation, dual standards (international+national), ESG monitoring',
    },
]

const criteriaInsights = {
    healthcare_infrastructure: 'Quality, capacity, and technology infrastructure of medical facilities',
    international_accreditation: 'JCI, GHA, ISO certifications ensuring international quality',
    cost_advantage: 'Cost savings vs developed markets (USD 19,000 vs 80,000+ for heart surgery)',
    governance_framework: 'Regulatory oversight, licensing, legal protections, dual accreditation',
    environmental_sustainability: 'Carbon management, waste handling, energy efficiency, green initiatives',
    social_impact: 'Local healthcare access, workforce development, community integration',
    economic_contribution: 'Revenue generation, employment creation, GDP contribution, multiplier effect',
    ethical_oversight: 'Patient rights, informed consent, ethical standards, accountability',
    brain_drain_risk: 'Healthcare worker migration from public to private (lower score is better)',
    local_healthcare_access: 'Preservation and improvement of healthcare for local populations',
}

const detailedComparison = [
    {
        criterion: 'healthcare_infrastructure',
        label: 'Healthcare Infrastructure',
        thailand: 9,
        turkey: 8,
        insight: 'Thailand has 17 JCI hospitals; Turkey has 40 JCI hospitals with rapid expansion'
    },
    {
        criterion: 'international_accreditation',
        label: 'International Accreditation',
        thailand: 8,
        turkey: 8,
        insight: 'Both countries maintain high JCI standards; Turkey adds TÜSKA national accreditation'
    },
    {
        criterion: 'cost_advantage',
        label: 'Cost Advantage vs USA',
        thailand: 7,
        turkey: 8,
        insight: 'Thailand: 76% savings; Turkey: 50-70% savings with projected cost improvements'
    },
    {
        criterion: 'governance_framework',
        label: 'Governance & Regulation',
        thailand: 8,
        turkey: 9,
        insight: 'Thailand: Established system; Turkey: Proactive 2025 reforms (USHAS, HealthTürkiye cert)'
    },
    {
        criterion: 'environmental_sustainability',
        label: 'Environmental Sustainability',
        thailand: 5,
        turkey: 9,
        insight: 'Thailand: <1% meet standards; Turkey: 30% energy reduction, renewable focus'
    },
    {
        criterion: 'social_impact',
        label: 'Social Impact & Equity',
        thailand: 4,
        turkey: 8,
        insight: 'Thailand: 82% on public healthcare; Turkey: Balanced PPP approach with community integration'
    },
    {
        criterion: 'economic_contribution',
        label: 'Economic Contribution',
        thailand: 9,
        turkey: 7,
        insight: 'Thailand: $9B revenue, 24.4% global share; Turkey: $10-20B projected by 2028'
    },
    {
        criterion: 'ethical_oversight',
        label: 'Ethical Oversight',
        thailand: 7,
        turkey: 8,
        insight: 'Thailand: Established standards; Turkey: Mandatory complication insurance, 24/7 multilingual'
    },
    {
        criterion: 'brain_drain_risk',
        label: 'Brain Drain Risk (Lower=Better)',
        thailand: 3,
        turkey: 7,
        insight: 'Thailand: Severe brain drain documented; Turkey: Dual-practice policies help retain talent'
    },
    {
        criterion: 'local_healthcare_access',
        label: 'Local Healthcare Access',
        thailand: 4,
        turkey: 8,
        insight: 'Thailand: Significant inequality; Turkey: Focus on local healthcare preservation & PPP'
    },
]

// ============================================
// APPLICATION INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation()
    initializeComparison()
    initializeFramework()
    initializeRecommendations()
    initializeRiskAssessment()
    updateRiskMeter()
    initializeROICalculator()
})

// ============================================
// NAVIGATION FUNCTIONALITY
// ============================================

function initializeNavigation() {
    const sectionButtons = document.querySelectorAll('.section-btn')
    sectionButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const sectionId = button.getAttribute('data-section')
            showSection(sectionId)
        })
    })
}

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach((section) => {
        section.classList.remove('active')
    })

    document.querySelectorAll('.section-btn').forEach((btn) => {
        btn.classList.remove('active')
    })

    const targetSection = document.getElementById(sectionId)
    if (targetSection) {
        targetSection.classList.add('active')
    }

    const activeButton = document.querySelector(`[data-section="${sectionId}"]`)
    if (activeButton) {
        activeButton.classList.add('active')
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ============================================
// COMPARISON SECTION
// ============================================

function initializeComparison() {
    const tabButtons = document.querySelectorAll('.tab-btn')
    tabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const viewType = button.getAttribute('data-view')
            switchComparisonView(viewType)
        })
    })
    populateComparisonTable()
}

function switchComparisonView(viewType) {
    document.querySelectorAll('.comparison-view').forEach((view) => {
        view.classList.remove('active')
    })

    document.querySelectorAll('.tab-btn').forEach((btn) => {
        btn.classList.remove('active')
    })

    const targetView = document.getElementById(`${viewType}-view`)
    if (targetView) {
        targetView.classList.add('active')
    }

    const activeTab = document.querySelector(`[data-view="${viewType}"]`)
    if (activeTab) {
        activeTab.classList.add('active')
    }
}

function populateComparisonTable() {
    const tableBody = document.getElementById('comparisonTableBody')
    if (!tableBody) return

    detailedComparison.forEach((item) => {
        const row = document.createElement('tr')
        const getScoreClass = (score) => {
            if (score >= 8) return 'score-high'
            if (score >= 6) return 'score-medium'
            return 'score-low'
        }

        row.innerHTML = `
            <td><strong>${item.label}</strong></td>
            <td><span class="score-indicator ${getScoreClass(item.thailand)}">${item.thailand}/10</span></td>
            <td><span class="score-indicator ${getScoreClass(item.turkey)}">${item.turkey}/10</span></td>
            <td>${item.insight}</td>
        `
        tableBody.appendChild(row)
    })
}

// ============================================
// FRAMEWORK SECTION
// ============================================

function initializeFramework() {
    populateFrameworkPrinciples()
}

function populateFrameworkPrinciples() {
    const frameworkGrid = document.getElementById('frameworkGrid')
    if (!frameworkGrid) return

    sustainabilityFramework.forEach((framework) => {
        const card = document.createElement('div')
        card.className = 'framework-card'
        card.style.borderLeftColor = framework.color

        const actionsHtml = framework.actions.map((action) => `<li>${action}</li>`).join('')
        const kpisHtml = framework.kpis.map((kpi) => `<li>${kpi}</li>`).join('')

        card.innerHTML = `
            <h4 style="color: ${framework.color}; margin-bottom: 12px;">${framework.principle}</h4>
            <div style="margin-bottom: 16px;">
                <strong>Key Actions:</strong>
                <ul style="list-style: none; padding-left: 0;">
                    ${actionsHtml}
                </ul>
            </div>
            <div>
                <strong>Key Metrics:</strong>
                <ul style="list-style: none; padding-left: 0;">
                    ${kpisHtml}
                </ul>
            </div>
        `
        frameworkGrid.appendChild(card)
    })
}

// ============================================
// RECOMMENDATIONS SECTION
// ============================================

function initializeRecommendations() {
    populateRecommendations()
}

function populateRecommendations() {
    const recommendationsGrid = document.getElementById('recommendationsGrid')
    if (!recommendationsGrid) return

    investmentRecommendations.forEach((rec) => {
        const card = document.createElement('div')
        card.className = 'card'

        const outcomesHtml = rec.outcomes.map((outcome) => `<li>${outcome}</li>`).join('')

        card.innerHTML = `
            <div class="card__header">
                <h3>${rec.name}</h3>
            </div>
            <div class="card__body">
                <div style="margin-bottom: 16px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                        <div>
                            <div style="font-size: 12px; color: #666; text-transform: uppercase;">ROI Range</div>
                            <div style="font-size: 18px; font-weight: bold; color: #2180D5;">${rec.roi_range}</div>
                        </div>
                        <div>
                            <div style="font-size: 12px; color: #666; text-transform: uppercase;">Payback</div>
                            <div style="font-size: 18px; font-weight: bold; color: #2CA02C;">${rec.payback_years} yrs</div>
                        </div>
                    </div>
                </div>

                <div style="margin-bottom: 16px;">
                    <strong>Investment:</strong>
                    <ul class="value-list">
                        <li><strong>Initial:</strong> ${rec.initial_investment}</li>
                        <li><strong>Ongoing:</strong> ${rec.ongoing_investment}</li>
                    </ul>
                </div>

                <div style="margin-bottom: 16px;">
                    <strong>Risk Mitigation:</strong>
                    <p style="margin: 8px 0; color: #333;">${rec.risk_mitigation}</p>
                </div>

                <div>
                    <strong>Expected Outcomes:</strong>
                    <ul class="value-list">
                        ${outcomesHtml}
                    </ul>
                </div>
            </div>
        `
        recommendationsGrid.appendChild(card)
    })
}

// ============================================
// ROI CALCULATOR FUNCTIONALITY
// ============================================

function initializeROICalculator() {
    const investmentSlider = document.getElementById('initialInvestment')
    const returnSlider = document.getElementById('annualReturn')
    const yearsSlider = document.getElementById('investmentYears')
    const costsSlider = document.getElementById('operatingCosts')

    if (investmentSlider && returnSlider && yearsSlider && costsSlider) {
        investmentSlider.addEventListener('input', calculateROI)
        returnSlider.addEventListener('input', calculateROI)
        yearsSlider.addEventListener('input', calculateROI)
        costsSlider.addEventListener('input', calculateROI)

        calculateROI()
    }
}

function calculateROI() {
    const investment = parseFloat(document.getElementById('initialInvestment').value)
    const returnRate = parseFloat(document.getElementById('annualReturn').value) / 100
    const years = parseFloat(document.getElementById('investmentYears').value)
    const costs = parseFloat(document.getElementById('operatingCosts').value)

    // Update display values
    document.getElementById('investmentValue').textContent = `$${investment}M`
    document.getElementById('returnValue').textContent = `${parseFloat(document.getElementById('annualReturn').value)}%`
    document.getElementById('yearsValue').textContent = `${years} years`
    document.getElementById('costsValue').textContent = `$${costs}M`

    // Calculate values
    const annualRevenue = investment * returnRate
    const totalRevenue = annualRevenue * years
    const totalCosts = costs * years
    const netProfit = totalRevenue - investment - totalCosts
    const roiMultiple = (netProfit + investment) / investment
    const paybackPeriod = investment / (annualRevenue - costs)

    // Update results
    document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(1)}M`
    document.getElementById('totalCosts').textContent = `$${totalCosts.toFixed(1)}M`
    document.getElementById('netProfit').textContent = `$${netProfit.toFixed(1)}M`
    document.getElementById('roiMultiple').textContent = `${roiMultiple.toFixed(2)}x`
    document.getElementById('paybackPeriod').textContent = `${paybackPeriod.toFixed(2)} years`

    // Update comparison table
    document.getElementById('calcROIMultiple').textContent = `${roiMultiple.toFixed(2)}x`
    document.getElementById('calcPayback').textContent = `${paybackPeriod.toFixed(2)} years`
    document.getElementById('calcAnnualReturn').textContent = `${(returnRate * 100).toFixed(0)}%`
    document.getElementById('calcNetProfit').textContent = `$${netProfit.toFixed(1)}M`
}

// ============================================
// RISK ASSESSMENT SECTION
// ============================================

function initializeRiskAssessment() {
    populateRiskCards()
}

function populateRiskCards() {
    const riskGrid = document.getElementById('riskGrid')
    if (!riskGrid) return

    keyRisks.forEach((riskItem) => {
        const card = document.createElement('div')
        card.className = 'card'

        const riskBgColor = riskItem.level === 'High' ? '#FFE5E5' : '#FFF8E5'
        const riskBorderColor = riskItem.level === 'High' ? '#FF6B6B' : '#FFA500'

        card.style.borderLeft = `4px solid ${riskBorderColor}`
        card.style.backgroundColor = riskBgColor

        card.innerHTML = `
            <div class="card__header">
                <h4 style="margin: 0;">${riskItem.risk}</h4>
                <span class="status ${riskItem.level === 'High' ? 'status--error' : 'status--warning'}" 
                      style="font-size: 12px; padding: 4px 8px; border-radius: 4px; background: ${riskBorderColor}; color: white;">
                    ${riskItem.level} Risk
                </span>
            </div>
            <div class="card__body">
                <strong>Mitigation Strategy:</strong>
                <p style="margin: 8px 0; color: #333;">${riskItem.mitigation}</p>
            </div>
        `
        riskGrid.appendChild(card)
    })
}

function updateRiskMeter() {
    const highRisks = keyRisks.filter((r) => r.level === 'High').length
    const mediumRisks = keyRisks.filter((r) => r.level === 'Medium').length
    const totalRisks = keyRisks.length

    const riskScore = (highRisks * 3 + mediumRisks * 2) / (totalRisks * 3)
    const riskPercentage = riskScore * 100

    const meterFill = document.getElementById('riskMeterFill')
    if (meterFill) {
        meterFill.style.width = `${riskPercentage}%`
    }

    let description = ''
    if (riskPercentage < 40) {
        description = 'Overall risk profile is <strong style="color: #2CA02C;">LOW</strong>. Strong mitigation framework in place.'
    } else if (riskPercentage < 70) {
        description = 'Overall risk profile is <strong style="color: #FFA500;">MEDIUM</strong>. Comprehensive mitigation strategies required.'
    } else {
        description = 'Overall risk profile is <strong style="color: #FF6B6B;">HIGH</strong>. Immediate mitigation actions needed.'
    }

    const descriptionEl = document.getElementById('riskDescription')
    if (descriptionEl) {
        descriptionEl.innerHTML = description
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

window.dashboardAPI = {
    showSection,
}