/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// Data
// const marketData = {
//   global_market_size_2023: '$31B',
//   projected_2032: '$58B',
//   cagr: '11.04%',
//   leading_destinations: ['Thailand', 'India', 'Turkey'],
//   emerging_destinations: ['Costa Rica', 'UAE', 'Brazil'],
// }

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
    market_value: '$2.57B',
    tourists_annually: '2.4M',
  },
  costa_rica: {
    healthcare_infrastructure: 7,
    international_accreditation: 8,
    cost_advantage: 8,
    governance_framework: 7,
    environmental_sustainability: 9,
    social_impact: 8,
    economic_contribution: 6,
    ethical_oversight: 8,
    brain_drain_risk: 7,
    local_healthcare_access: 9,
    market_value: 'Growing',
    tourists_annually: '70K',
  },
}

const sustainabilityFramework = [
  {
    principle: 'Ethical Governance',
    actions: ['JCI/GHA accreditation', 'Patient rights charter', 'Informed consent protocols'],
    kpis: ['Patient satisfaction scores', 'Accreditation status', 'Complaint resolution time'],
  },
  {
    principle: 'Environmental Sustainability',
    actions: ['Carbon offset programs', 'Green certifications', 'Waste management'],
    kpis: ['Carbon footprint per patient', 'Waste recycling rate', 'Energy efficiency'],
  },
  {
    principle: 'Social Responsibility',
    actions: ['Cross-subsidization', 'Workforce development', 'Community health'],
    kpis: ['Public hospital staffing', 'Local employment rate', 'Healthcare access index'],
  },
  {
    principle: 'Economic Viability',
    actions: ['Transparent pricing', 'Insurance partnerships', 'PPP structures'],
    kpis: ['Revenue growth', 'ROI', 'Economic multiplier effect'],
  },
  {
    principle: 'Clinical Excellence',
    actions: ['Quality standards', 'Medical education', 'Outcome tracking'],
    kpis: ['Clinical outcomes', 'Readmission rates', 'Patient safety incidents'],
  },
  {
    principle: 'Stakeholder Engagement',
    actions: ['Government forums', 'Stakeholder consultations', 'Transparent reporting'],
    kpis: ['Stakeholder satisfaction', 'Community engagement', 'Public trust index'],
  },
]

const investmentRecommendations = [
  {
    name: 'ESG Scorecard & Accreditation Program',
    roi_range: '1.5-1.8x',
    payback_years: '3-4',
    initial_investment: '$500K-$2M per facility',
    ongoing_investment: '$200K annually',
    risk_mitigation: '40% reduction in liability',
  },
  {
    name: 'Public-Private Partnership Model',
    roi_range: '1.2-1.4x',
    payback_years: '5-7',
    initial_investment: '10-15% of tourism revenue',
    ongoing_investment: '$5-10M annually',
    risk_mitigation: 'Prevents social backlash',
  },
  {
    name: 'Medical Tourism Regulatory Authority',
    roi_range: '1.1-1.3x',
    payback_years: '6-9',
    initial_investment: '$3-5M',
    ongoing_investment: '$2-3M annually',
    risk_mitigation: '50% reduction in regulatory violations',
  },
]

const keyRisks = [
  {
    risk: 'Brain Drain',
    level: 'High',
    mitigation: 'Cross-subsidization programs, dual practice policies',
  },
  {
    risk: 'Ethical Challenges',
    level: 'Medium',
    mitigation: 'JCI accreditation, regulatory oversight, patient protection funds',
  },
  {
    risk: 'Environmental Impact',
    level: 'Medium',
    mitigation: 'Carbon offset programs, green certifications, sustainable practices',
  },
  {
    risk: 'Local Healthcare Disruption',
    level: 'High',
    mitigation: 'Revenue sharing, public sector investment, workforce retention',
  },
]

const criteriaInsights = {
  healthcare_infrastructure: 'Quality and capacity of medical facilities and technology',
  international_accreditation: 'JCI, GHA, and ISO certifications for quality assurance',
  cost_advantage: 'Price competitiveness compared to developed markets (30-70% savings)',
  governance_framework: 'Regulatory oversight, licensing, and legal protections',
  environmental_sustainability: 'Carbon footprint, waste management, and green initiatives',
  social_impact: 'Effects on local communities and healthcare equity',
  economic_contribution: 'Revenue generation, employment, and GDP contribution',
  ethical_oversight: 'Patient rights, informed consent, and ethical standards',
  brain_drain_risk: 'Healthcare worker migration from public to private sector (lower is better)',
  local_healthcare_access: 'Preservation of healthcare services for local population',
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  initializeNavigation()
  initializeComparison()
  initializeFramework()
  initializeRecommendations()
  initializeRiskAssessment()
  updateRiskMeter()
})

// Navigation
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
  // Hide all sections
  document.querySelectorAll('.content-section').forEach((section) => {
    section.classList.remove('active')
  })

  // Remove active class from all buttons
  document.querySelectorAll('.section-btn').forEach((btn) => {
    btn.classList.remove('active')
  })

  // Show selected section
  document.getElementById(sectionId).classList.add('active')

  // Add active class to clicked button
  document.querySelector(`[data-section="${sectionId}"]`).classList.add('active')

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Comparison Section
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
  // Hide all views
  document.querySelectorAll('.comparison-view').forEach((view) => {
    view.classList.remove('active')
  })

  // Remove active class from all tabs
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.classList.remove('active')
  })

  // Show selected view
  document.getElementById(`${viewType}-view`).classList.add('active')

  // Add active class to clicked tab
  document.querySelector(`[data-view="${viewType}"]`).classList.add('active')
}

function populateComparisonTable() {
  const tableBody = document.getElementById('comparisonTableBody')
  const criteria = [
    { key: 'healthcare_infrastructure', label: 'Healthcare Infrastructure' },
    { key: 'international_accreditation', label: 'International Accreditation' },
    { key: 'cost_advantage', label: 'Cost Advantage' },
    { key: 'governance_framework', label: 'Governance Framework' },
    { key: 'environmental_sustainability', label: 'Environmental Sustainability' },
    { key: 'social_impact', label: 'Social Impact' },
    { key: 'economic_contribution', label: 'Economic Contribution' },
    { key: 'ethical_oversight', label: 'Ethical Oversight' },
    { key: 'brain_drain_risk', label: 'Brain Drain Risk (Lower = Better)' },
    { key: 'local_healthcare_access', label: 'Local Healthcare Access' },
  ]

  criteria.forEach((criterion) => {
    const row = document.createElement('tr')
    const thailandScore = destinationComparison.thailand[criterion.key]
    const costaRicaScore = destinationComparison.costa_rica[criterion.key]

    row.innerHTML = `
      <td><strong>${criterion.label}</strong></td>
      <td>${getScoreIndicator(thailandScore)}</td>
      <td>${getScoreIndicator(costaRicaScore)}</td>
      <td>${criteriaInsights[criterion.key]}</td>
    `

    tableBody.appendChild(row)
  })
}

function getScoreIndicator(score) {
  let className = 'score-medium'
  if (score >= 8)
    className = 'score-high'
  else if (score <= 5)
    className = 'score-low'

  return `<span class="score-indicator ${className}">${score}/10</span>`
}

// Framework Section
function initializeFramework() {
  const frameworkGrid = document.getElementById('frameworkGrid')

  sustainabilityFramework.forEach((item) => {
    const card = document.createElement('div')
    card.className = 'framework-card'
    card.innerHTML = `
      <div class="framework-header">
        <h4 class="framework-title">${item.principle}</h4>
        <span class="expand-icon">▼</span>
      </div>
      <div class="framework-details">
        <div class="framework-section">
          <h5>Implementation Actions</h5>
          <ul class="framework-list">
            ${item.actions.map(action => `<li>${action}</li>`).join('')}
          </ul>
        </div>
        <div class="framework-section">
          <h5>Key Performance Indicators</h5>
          <ul class="framework-list">
            ${item.kpis.map(kpi => `<li>${kpi}</li>`).join('')}
          </ul>
        </div>
      </div>
    `

    card.addEventListener('click', () => {
      card.classList.toggle('expanded')
    })

    frameworkGrid.appendChild(card)
  })
}

// Recommendations Section
function initializeRecommendations() {
  const grid = document.getElementById('recommendationsGrid')

  investmentRecommendations.forEach((rec) => {
    const card = document.createElement('div')
    card.className = 'recommendation-card'
    card.innerHTML = `
      <div class="recommendation-header">
        <h4 class="recommendation-title">${rec.name}</h4>
        <span class="roi-badge">ROI: ${rec.roi_range}</span>
      </div>
      <div class="recommendation-details">
        <div class="detail-item">
          <span class="detail-label">Payback Period</span>
          <span class="detail-value">${rec.payback_years} years</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Initial Investment</span>
          <span class="detail-value">${rec.initial_investment}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Ongoing Investment</span>
          <span class="detail-value">${rec.ongoing_investment}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Risk Mitigation</span>
          <span class="detail-value">${rec.risk_mitigation}</span>
        </div>
      </div>
    `

    grid.appendChild(card)
  })
}

// Financial Calculator
function _calculateROI() {
  const strategy = document.getElementById('strategySelect').value
  const investment = Number.parseFloat(document.getElementById('investmentAmount').value)
  // const revenue = Number.parseFloat(document.getElementById('revenueAmount').value)
  const riskTolerance = document.getElementById('riskTolerance').value

  let roiMultiplier, paybackYears

  if (strategy === 'esg') {
    roiMultiplier = 1.65
    paybackYears = 3.5
  } else if (strategy === 'ppp') {
    roiMultiplier = 1.3
    paybackYears = 6
  } else {
    roiMultiplier = 1.2
    paybackYears = 7.5
  }

  // Adjust for risk tolerance
  if (riskTolerance === 'conservative') {
    roiMultiplier *= 0.9
  } else if (riskTolerance === 'aggressive') {
    roiMultiplier *= 1.1
  }

  const totalReturn = investment * roiMultiplier
  const profit = totalReturn - investment
  const annualCashFlow = profit / paybackYears
  const riskAdjustedReturn = profit * 0.85
  const breakEvenYear = Math.ceil(paybackYears * 0.7)

  // Update display
  document.getElementById('totalReturn').textContent = `$${(totalReturn / 1000000).toFixed(2)}M`
  document.getElementById('roiMultiple').textContent = `${roiMultiplier.toFixed(2)}x`
  document.getElementById('paybackPeriod').textContent = `${paybackYears.toFixed(1)} years`
  document.getElementById('annualCashFlow').textContent = `$${(annualCashFlow / 1000000).toFixed(2)}M`
  document.getElementById('riskAdjusted').textContent = `$${(riskAdjustedReturn / 1000000).toFixed(2)}M`
  document.getElementById('breakEven').textContent = `Year ${breakEvenYear}`

  // Generate sensitivity chart
  generateSensitivityChart(investment, roiMultiplier, paybackYears)
}

function generateSensitivityChart(investment, baseROI, _basePayback) {
  const canvas = document.getElementById('sensitivityCanvas')
  const placeholder = document.getElementById('sensitivityChart')

  // Show canvas, hide placeholder
  canvas.style.display = 'block'
  placeholder.style.display = 'none'

  const ctx = canvas.getContext('2d')

  // Destroy existing chart if it exists
  if (window.sensitivityChart) {
    window.sensitivityChart.destroy()
  }

  const scenarios = ['Conservative\n(-20%)', 'Base Case', 'Optimistic\n(+20%)']
  const returns = [
    (investment * baseROI * 0.8) / 1000000,
    (investment * baseROI) / 1000000,
    (investment * baseROI * 1.2) / 1000000,
  ]

  window.sensitivityChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: scenarios,
      datasets: [{
        label: 'Expected Return ($M)',
        data: returns,
        backgroundColor: ['#E68161', '#21808D', '#32B8C6'],
        borderColor: ['#A84B2F', '#1A6873', '#2DA6B2'],
        borderWidth: 1,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        title: {
          display: true,
          text: 'ROI Sensitivity Analysis',
          font: {
            size: 16,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Return ($M)',
          },
        },
      },
    },
  })
}

// Risk Assessment
function initializeRiskAssessment() {
  const riskGrid = document.getElementById('riskGrid')

  keyRisks.forEach((risk) => {
    const card = document.createElement('div')
    card.className = 'risk-card'
    card.innerHTML = `
      <div class="risk-header">
        <h4 class="risk-title">${risk.risk}</h4>
        <span class="risk-level risk-${risk.level.toLowerCase()}">${risk.level}</span>
      </div>
      <p class="risk-mitigation"><strong>Mitigation:</strong> ${risk.mitigation}</p>
    `

    riskGrid.appendChild(card)
  })
}

function updateRiskMeter() {
  const highRisks = keyRisks.filter(r => r.level === 'High').length
  const mediumRisks = keyRisks.filter(r => r.level === 'Medium').length
  const totalRisks = keyRisks.length

  const riskScore = (highRisks * 3 + mediumRisks * 2) / (totalRisks * 3)
  const riskPercentage = riskScore * 100

  document.getElementById('riskMeterFill').style.width = `${riskPercentage}%`

  let description = ''
  if (riskPercentage < 40) {
    description = 'Overall risk profile is <strong>LOW</strong>. The investment has strong mitigation strategies in place and regulatory frameworks are well-established.'
  } else if (riskPercentage < 70) {
    description = 'Overall risk profile is <strong>MEDIUM</strong>. Implementation of recommended mitigation strategies is essential to maintain acceptable risk levels. Close monitoring required.'
  } else {
    description = 'Overall risk profile is <strong>HIGH</strong>. Immediate action required to implement comprehensive mitigation strategies. Consider phased implementation approach to manage exposure.'
  }

  document.getElementById('riskDescription').innerHTML = description
}

// Export functionality
function _exportReport() {
  document.getElementById('exportModal').classList.add('active')
}

function closeExportModal() {
  document.getElementById('exportModal').classList.remove('active')
}

function _confirmExport() {
  const checkboxes = document.querySelectorAll('.export-options input[type="checkbox"]')
  const selectedSections = []

  checkboxes.forEach((checkbox, index) => {
    if (checkbox.checked) {
      const labels = ['Executive Summary', 'Destination Comparison', 'Sustainability Framework', 'Investment Recommendations', 'Financial Projections', 'Risk Assessment']
      selectedSections.push(labels[index])
    }
  })

  // Simulate export
  alert(`Report generated successfully!\n\nIncluded sections:\n${selectedSections.join('\n')}\n\nIn a production environment, this would generate a downloadable PDF report with all selected sections.`)

  closeExportModal()
}
