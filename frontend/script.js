// AgentShield v6.4 - Registry + CRL + Challenge-Response

const API_BASE = '';  // Relative URLs via Netlify proxy

let registryData = [];
let filteredData = [];

function initAgentShield() {
    console.log("AgentShield v6.4 Initializing...");
}

// ========== KOSTENLOS TESTEN SCROLL ==========
function scrollToDemo(tab = 'token') {
    const demoSection = document.getElementById('demo');
    if (demoSection) {
        demoSection.scrollIntoView({ behavior: 'smooth' });
        // Automatically switch to specified tab
        setTimeout(() => switchDemoTab(tab), 500);
    }
}

// ========== FLOATING CTA BUTTON ==========
function initFloatingCTA() {
    const floatingCTA = document.createElement('div');
    floatingCTA.id = 'floating-cta';
    floatingCTA.innerHTML = `
        <button onclick="showAssessmentPopup()" style="
            background: linear-gradient(135deg, var(--primary) 0%, #00cc66 100%);
            color: #000;
            border: none;
            padding: 1rem 1.5rem;
            border-radius: 50px;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(0,255,136,0.4);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.3s;
        ">
            🚀 Try Free
        </button>
    `;
    floatingCTA.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        z-index: 9998;
        display: none;
    `;
    document.body.appendChild(floatingCTA);

    // Show after scrolling past hero
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero');
        if (hero) {
            const heroBottom = hero.getBoundingClientRect().bottom;
            floatingCTA.style.display = heroBottom < 0 ? 'block' : 'none';
        }
    });
}

// Initialize floating CTA when DOM is ready
document.addEventListener('DOMContentLoaded', initFloatingCTA);

// ========== INSTANT DEMO ==========
function openInstantDemo() {
    const modal = document.getElementById('instant-demo-modal');
    modal.style.display = 'flex';
    // Reset to step 1
    document.getElementById('demo-step-1').style.display = 'block';
    document.getElementById('demo-step-2').style.display = 'none';
    document.getElementById('demo-step-3').style.display = 'none';
}

function closeInstantDemo() {
    const modal = document.getElementById('instant-demo-modal');
    modal.style.display = 'none';
}

async function startInstantScan() {
    // Show loading
    document.getElementById('demo-step-1').style.display = 'none';
    document.getElementById('demo-step-2').style.display = 'block';
    
    const steps = [
        document.getElementById('scan-step-1'),
        document.getElementById('scan-step-2'),
        document.getElementById('scan-step-3'),
        document.getElementById('scan-step-4')
    ];
    const progress = document.getElementById('scan-progress');
    
    // Animate through steps
    for (let i = 0; i < steps.length; i++) {
        steps.forEach((step, idx) => {
            step.style.color = idx <= i ? 'var(--primary)' : 'var(--text-muted)';
            step.parentElement.style.opacity = idx <= i ? 1 : 0.5;
        });
        progress.style.width = ((i + 1) / steps.length * 100) + '%';
        await new Promise(r => setTimeout(r, 600));
    }
    
    // Show results
    setTimeout(() => {
        document.getElementById('demo-step-2').style.display = 'none';
        document.getElementById('demo-step-3').style.display = 'block';
    }, 500);
}

// ========== SECURITY ASSESSMENT POPUP ==========
function showAssessmentPopup(type) {
    const popup = document.getElementById('assessment-popup');
    popup.style.display = 'flex';
}

function closeAssessmentPopup() {
    const popup = document.getElementById('assessment-popup');
    popup.style.display = 'none';
}

function copyAssessmentPrompt() {
    const textarea = document.getElementById('assessment-prompt');
    const text = textarea.value;
    
    // Modern clipboard API (primary method)
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            const btn = event.target;
            const originalText = btn.innerHTML;
            btn.innerHTML = '✅ Copied!';
            btn.style.background = 'var(--primary)';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '#ff6b6b';
            }, 2000);
        }).catch(err => {
            console.error('Clipboard write failed:', err);
            fallbackCopy(textarea);
        });
    } else {
        // Fallback for older browsers
        fallbackCopy(textarea);
    }
}

function fallbackCopy(textarea) {
    try {
        textarea.select();
        textarea.setSelectionRange(0, 99999);
        const success = document.execCommand('copy');
        if (success) {
            const btn = event.target;
            const originalText = btn.innerHTML;
            btn.innerHTML = '✅ Copied!';
            btn.style.background = 'var(--primary)';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '#ff6b6b';
            }, 2000);
        } else {
            throw new Error('execCommand failed');
        }
    } catch (err) {
        console.error('Fallback copy failed:', err);
        alert('Copy failed. Please select the text and copy manually (Ctrl+C or Cmd+C).');
    }
}

// ========== DEMO TAB SWITCHING ==========
function switchDemoTab(tab) {
    // Update tab buttons
    const tokenTab = document.getElementById('tab-token');
    const codeTab = document.getElementById('tab-code');
    const registryTab = document.getElementById('tab-registry');
    
    // Reset all tabs (with null checks)
    if (tokenTab) {
        tokenTab.classList.remove('active');
        tokenTab.style.borderColor = 'rgba(255,255,255,0.1)';
        tokenTab.style.color = 'var(--text-muted)';
    }
    if (codeTab) {
        codeTab.classList.remove('active');
        codeTab.style.borderColor = 'rgba(255,255,255,0.1)';
        codeTab.style.color = 'var(--text-muted)';
    }
    if (registryTab) {
        registryTab.classList.remove('active');
        registryTab.style.borderColor = 'rgba(255,255,255,0.1)';
        registryTab.style.color = 'var(--text-muted)';
    }
    
    const demoToken = document.getElementById('demo-token');
    const demoCode = document.getElementById('demo-code');
    const demoRegistry = document.getElementById('demo-registry');
    
    if (demoToken) demoToken.style.display = 'none';
    if (demoCode) demoCode.style.display = 'none';
    if (demoRegistry) demoRegistry.style.display = 'none';
    
    // Activate selected tab
    if (tab === 'token' && tokenTab && demoToken) {
        tokenTab.classList.add('active');
        tokenTab.style.borderColor = 'var(--gold)';
        tokenTab.style.color = 'var(--gold)';
        demoToken.style.display = 'block';
    } else if (tab === 'code' && codeTab && demoCode) {
        codeTab.classList.add('active');
        codeTab.style.borderColor = 'var(--primary)';
        codeTab.style.color = 'var(--primary)';
        demoCode.style.display = 'block';
    } else if (tab === 'registry' && registryTab && demoRegistry) {
        registryTab.classList.add('active');
        registryTab.style.borderColor = '#3498db';
        registryTab.style.color = '#3498db';
        demoRegistry.style.display = 'block';
        loadRegistry(); // Load registry when tab is opened
    }
}

// ========== AGENT REGISTRY ==========
async function loadRegistry() {
    const loadingDiv = document.getElementById('registry-loading');
    const listDiv = document.getElementById('registry-list');
    const errorDiv = document.getElementById('registry-error');
    
    loadingDiv.style.display = 'block';
    listDiv.style.display = 'none';
    errorDiv.style.display = 'none';
    
    try {
        const response = await fetch(`${API_BASE}/api/registry`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        registryData = data.agents || [];
        filteredData = [...registryData];
        
        loadingDiv.style.display = 'none';
        displayRegistry(filteredData);
        
    } catch (error) {
        console.error('Registry load error:', error);
        loadingDiv.style.display = 'none';
        showRegistryError(error.message || 'Failed to load agent registry');
    }
}

function displayRegistry(agents) {
    const listDiv = document.getElementById('registry-list');
    listDiv.style.display = 'block';
    
    // If no real agents, show demo agents
    if (agents.length === 0) {
        const demoAgents = [
            {
                agent_id: 'demo_trustbot_alpha_12345678901234567890',
                agent_name: '🤖 TrustBot Alpha',
                trust_score: 85,
                tier: 'TRUSTED',
                status: 'active',
                registered_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days ago
            },
            {
                agent_id: 'demo_verifyagent_beta_09876543210987654321',
                agent_name: '🔍 VerifyAgent Beta',
                trust_score: 60,
                tier: 'VERIFIED',
                status: 'active',
                registered_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
            },
            {
                agent_id: 'demo_newagent_gamma_11223344556677889900',
                agent_name: '🆕 NewAgent Gamma',
                trust_score: 20,
                tier: 'UNVERIFIED',
                status: 'active',
                registered_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
            }
        ];
        
        let html = `
            <div style="margin-bottom: 1.5rem; padding: 1rem; background: rgba(241,196,15,0.1); border-left: 3px solid var(--gold); border-radius: 4px;">
                <strong style="color: var(--gold);">ℹ️ Demo Agents</strong>
                <div style="margin-top: 0.5rem; color: var(--text-muted); font-size: 0.9rem;">
                    These are example agents. Your agent will appear here after the first audit.
                </div>
            </div>
            <div style="display: grid; gap: 1rem;">
        `;
        
        demoAgents.forEach(agent => {
            const tierColor = getTierColor(agent.tier);
            const tierBg = getTierBg(agent.tier);
            const statusIcon = '✅';
            
            html += `
                <div style="padding: 1.5rem; background: rgba(0,0,0,0.2); border-left: 4px solid ${tierColor}; border-radius: 8px; opacity: 0.8;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
                        <div>
                            <div style="font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 0.25rem;">
                                ${agent.agent_name}
                            </div>
                            <div style="font-size: 0.85rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace;">
                                ${agent.agent_id.substring(0, 16)}...
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="background: ${tierBg}; color: ${tierColor}; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 800; margin-bottom: 0.5rem;">
                                ${agent.tier}
                            </div>
                            <div style="font-size: 0.85rem; color: var(--text-muted);">
                                ${statusIcon} ${agent.status}
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 2rem; font-size: 0.9rem;">
                        <div>
                            <span style="color: var(--text-muted);">Trust Score:</span>
                            <span style="color: ${tierColor}; font-weight: 700; margin-left: 0.5rem;">${agent.trust_score}/100</span>
                        </div>
                        <div>
                            <span style="color: var(--text-muted);">Registered:</span>
                            <span style="color: #fff; margin-left: 0.5rem;">${formatDate(agent.registered_at)}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
        listDiv.innerHTML = html;
        return;
    }
    
    let html = `
        <div style="margin-bottom: 1rem; color: var(--text-muted); font-size: 0.9rem;">
            Found ${agents.length} agent(s) in registry
        </div>
        <div style="display: grid; gap: 1rem;">
    `;
    
    agents.forEach(agent => {
        const tierColor = getTierColor(agent.tier);
        const tierBg = getTierBg(agent.tier);
        const statusIcon = agent.status === 'active' ? '✅' : '⏸️';
        
        html += `
            <div onclick="showAgentDetail('${agent.agent_id}')" style="padding: 1.5rem; background: rgba(0,0,0,0.2); border-left: 4px solid ${tierColor}; border-radius: 8px; cursor: pointer; transition: all 0.3s;" onmouseover="this.style.background='rgba(0,0,0,0.4)'" onmouseout="this.style.background='rgba(0,0,0,0.2)'">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
                    <div>
                        <div style="font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 0.25rem;">
                            ${agent.agent_name}
                        </div>
                        <div style="font-size: 0.85rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace;">
                            ${agent.agent_id.substring(0, 16)}...
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="background: ${tierBg}; color: ${tierColor}; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 800; margin-bottom: 0.5rem;">
                            ${agent.tier}
                        </div>
                        <div style="font-size: 0.85rem; color: var(--text-muted);">
                            ${statusIcon} ${agent.status}
                        </div>
                    </div>
                </div>
                <div style="display: flex; gap: 2rem; font-size: 0.9rem;">
                    <div>
                        <span style="color: var(--text-muted);">Trust Score:</span>
                        <span style="color: ${tierColor}; font-weight: 700; margin-left: 0.5rem;">${agent.trust_score}/100</span>
                    </div>
                    <div>
                        <span style="color: var(--text-muted);">Registered:</span>
                        <span style="color: #fff; margin-left: 0.5rem;">${formatDate(agent.registered_at)}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    listDiv.innerHTML = html;
}

function filterRegistry() {
    const searchTerm = document.getElementById('registry-search').value.toLowerCase().trim();
    
    if (!searchTerm) {
        filteredData = [...registryData];
    } else {
        filteredData = registryData.filter(agent => 
            agent.agent_name.toLowerCase().includes(searchTerm) ||
            agent.agent_id.toLowerCase().includes(searchTerm)
        );
    }
    
    displayRegistry(filteredData);
}

function getTierColor(tier) {
    const colors = {
        'UNVERIFIED': '#e74c3c',
        'BASIC': '#f39c12',
        'VERIFIED': '#2ecc71',
        'TRUSTED': '#27ae60'
    };
    return colors[tier] || '#95a5a6';
}

function getTierBg(tier) {
    const colors = {
        'UNVERIFIED': 'rgba(231,76,60,0.1)',
        'BASIC': 'rgba(243,156,18,0.1)',
        'VERIFIED': 'rgba(46,204,113,0.1)',
        'TRUSTED': 'rgba(39,174,96,0.1)'
    };
    return colors[tier] || 'rgba(149,165,166,0.1)';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
}

function showRegistryError(message) {
    const errorDiv = document.getElementById('registry-error');
    const errorMsg = document.getElementById('registry-error-message');
    errorMsg.textContent = message;
    errorDiv.style.display = 'block';
}

// ========== AGENT DETAIL VIEW ==========
async function showAgentDetail(agentId) {
    const modal = document.getElementById('agent-detail-modal');
    const content = document.getElementById('agent-detail-content');
    
    modal.style.display = 'flex';
    content.innerHTML = `
        <div style="text-align: center; padding: 3rem;">
            <div style="font-size: 3rem; animation: spin 2s linear infinite;">⚙️</div>
            <div style="margin-top: 1rem; color: var(--text-muted);">Loading agent details...</div>
        </div>
    `;
    
    try {
        const response = await fetch(`${API_BASE}/api/verify/${agentId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        displayAgentDetail(data);
        
    } catch (error) {
        console.error('Agent detail error:', error);
        content.innerHTML = `
            <div style="padding: 2rem; text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
                <div style="color: #e74c3c; font-weight: 700; margin-bottom: 0.5rem;">Failed to load agent details</div>
                <div style="color: var(--text-muted); font-size: 0.9rem;">${error.message}</div>
            </div>
        `;
    }
}

function displayAgentDetail(data) {
    const content = document.getElementById('agent-detail-content');
    const agent = data.agent;
    const cert = data.certificate;
    
    const tierColor = getTierColor(agent.tier);
    const tierBg = getTierBg(agent.tier);
    
    // Check CRL status
    const isRevoked = cert && cert.revoked;
    const revocationBadge = isRevoked 
        ? `<div style="background: rgba(231,76,60,0.1); border: 2px solid #e74c3c; border-radius: 8px; padding: 1rem; margin-top: 1rem;">
               <div style="color: #e74c3c; font-weight: 700; font-size: 1.1rem; margin-bottom: 0.5rem;">❌ Certificate Revoked</div>
               <div style="color: var(--text-muted); font-size: 0.9rem;">Reason: ${cert.revocation_reason || 'Not specified'}</div>
               <div style="color: var(--text-muted); font-size: 0.9rem;">Date: ${formatDate(cert.revoked_at)}</div>
           </div>`
        : `<div style="background: rgba(46,204,113,0.05); border: 2px solid #2ecc71; border-radius: 8px; padding: 1rem; margin-top: 1rem; text-align: center;">
               <div style="color: #2ecc71; font-weight: 700; font-size: 1.1rem;">✅ Certificate Valid</div>
           </div>`;
    
    let html = `
        <div style="text-align: center; margin-bottom: 2rem;">
            <h2 style="color: #fff; margin-bottom: 0.5rem;">${agent.agent_name}</h2>
            <div style="font-family: 'JetBrains Mono', monospace; color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1rem;">
                ${agent.agent_id}
            </div>
            <div style="display: inline-block; background: ${tierBg}; color: ${tierColor}; padding: 0.5rem 1.5rem; border-radius: 20px; font-size: 1rem; font-weight: 800;">
                ${agent.tier}
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
            <div style="padding: 1rem; background: rgba(0,0,0,0.2); border-radius: 8px; text-align: center;">
                <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">Trust Score</div>
                <div style="font-size: 1.8rem; font-weight: 700; color: ${tierColor};">${agent.trust_score}/100</div>
            </div>
            <div style="padding: 1rem; background: rgba(0,0,0,0.2); border-radius: 8px; text-align: center;">
                <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">Status</div>
                <div style="font-size: 1.2rem; font-weight: 700; color: #fff;">${agent.status === 'active' ? '✅ Active' : '⏸️ Inactive'}</div>
            </div>
            <div style="padding: 1rem; background: rgba(0,0,0,0.2); border-radius: 8px; text-align: center;">
                <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">Registered</div>
                <div style="font-size: 1rem; font-weight: 700; color: #fff;">${formatDate(agent.registered_at)}</div>
            </div>
        </div>
        
        ${revocationBadge}
    `;
    
    if (cert && !isRevoked) {
        html += `
            <div style="margin-top: 2rem; padding: 1.5rem; background: rgba(0,255,136,0.05); border: 1px solid var(--primary); border-radius: 8px;">
                <h3 style="color: var(--primary); margin-top: 0; margin-bottom: 1rem;">🛡️ Certificate Details</h3>
                <div style="display: grid; gap: 0.75rem; font-size: 0.9rem;">
                    <div><span style="color: var(--text-muted);">Issued:</span> <span style="color: #fff; margin-left: 0.5rem;">${formatDate(cert.issued_at)}</span></div>
                    <div><span style="color: var(--text-muted);">Expires:</span> <span style="color: #fff; margin-left: 0.5rem;">${formatDate(cert.expires_at)}</span></div>
                    <div><span style="color: var(--text-muted);">Public Key:</span> <code style="font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: var(--primary); word-break: break-all;">${cert.public_key ? cert.public_key.substring(0, 32) + '...' : 'N/A'}</code></div>
                </div>
            </div>
        `;
    }
    
    html += `
        <div style="margin-top: 2rem; text-align: center;">
            <button onclick="initChallenge('${agent.agent_id}')" class="btn btn-gold" style="margin-right: 1rem; padding: 0.875rem 1.5rem;">🔐 Verify Agent</button>
            <button onclick="closeAgentDetail()" class="btn btn-secondary" style="padding: 0.875rem 1.5rem;">Close</button>
        </div>
    `;
    
    content.innerHTML = html;
}

function closeAgentDetail() {
    const modal = document.getElementById('agent-detail-modal');
    modal.style.display = 'none';
}

// ========== CHALLENGE-RESPONSE FLOW ==========
async function initChallenge(agentId) {
    const modal = document.getElementById('challenge-modal');
    const content = document.getElementById('challenge-content');
    
    closeAgentDetail();
    modal.style.display = 'flex';
    
    content.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 3rem; animation: spin 2s linear infinite;">⚙️</div>
            <div style="margin-top: 1rem; color: var(--text-muted);">Generating challenge...</div>
        </div>
    `;
    
    try {
        const response = await fetch(`${API_BASE}/api/challenge/${agentId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        displayChallenge(data, agentId);
        
    } catch (error) {
        console.error('Challenge error:', error);
        content.innerHTML = `
            <div style="padding: 2rem; text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
                <div style="color: #e74c3c; font-weight: 700; margin-bottom: 0.5rem;">Failed to generate challenge</div>
                <div style="color: var(--text-muted); font-size: 0.9rem;">${error.message}</div>
                <button onclick="closeChallengeModal()" class="btn btn-secondary" style="margin-top: 1.5rem;">Close</button>
            </div>
        `;
    }
}

function displayChallenge(data, agentId) {
    const content = document.getElementById('challenge-content');
    
    const challengeCode = data.challenge;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(challengeCode)}`;
    
    let html = `
        <div style="margin-bottom: 2rem;">
            <div style="background: rgba(241,196,15,0.05); border: 1px solid var(--gold); border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;">
                <div style="color: var(--gold); font-weight: 700; margin-bottom: 0.75rem;">Challenge Code</div>
                <code style="display: block; background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 4px; font-family: 'JetBrains Mono', monospace; color: #fff; word-break: break-all; font-size: 0.85rem;">${challengeCode}</code>
                <button onclick="copyToClipboard('${challengeCode}')" style="margin-top: 0.75rem; padding: 0.5rem 1rem; background: rgba(241,196,15,0.2); color: var(--gold); border: 1px solid var(--gold); border-radius: 4px; cursor: pointer; font-size: 0.9rem;">📋 Copy</button>
            </div>
            
            <div style="text-align: center; margin-bottom: 1.5rem;">
                <img src="${qrCodeUrl}" alt="Challenge QR Code" style="border-radius: 8px; border: 2px solid var(--gold);">
                <div style="margin-top: 0.5rem; color: var(--text-muted); font-size: 0.85rem;">Scan with agent to respond</div>
            </div>
        </div>
        
        <div style="margin-bottom: 2rem;">
            <label style="display: block; margin-bottom: 0.5rem; color: var(--text-muted); font-size: 0.9rem;">Agent's Signed Response</label>
            <textarea id="challenge-response" rows="4" placeholder="Paste the signed response from the agent here..." style="width: 100%; padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; font-family: 'JetBrains Mono', monospace; resize: vertical;"></textarea>
        </div>
        
        <div style="text-align: center;">
            <button onclick="submitChallengeResponse('${agentId}', '${challengeCode}')" class="btn btn-gold" style="margin-right: 1rem; padding: 0.875rem 1.5rem;">✓ Verify Response</button>
            <button onclick="closeChallengeModal()" class="btn btn-secondary" style="padding: 0.875rem 1.5rem;">Cancel</button>
        </div>
        
        <div id="challenge-result" style="margin-top: 1.5rem; display: none;"></div>
    `;
    
    content.innerHTML = html;
}

async function submitChallengeResponse(agentId, challenge) {
    const responseText = document.getElementById('challenge-response').value.trim();
    const resultDiv = document.getElementById('challenge-result');
    
    if (!responseText) {
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <div style="padding: 1rem; background: rgba(231,76,60,0.1); border-left: 3px solid #e74c3c; border-radius: 4px;">
                <strong style="color: #e74c3c;">Error:</strong> Please paste the agent's response
            </div>
        `;
        return;
    }
    
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <div style="text-align: center; padding: 1rem;">
            <div style="font-size: 2rem; animation: spin 2s linear infinite;">⚙️</div>
            <div style="margin-top: 0.5rem; color: var(--text-muted);">Verifying response...</div>
        </div>
    `;
    
    try {
        const response = await fetch(`${API_BASE}/api/challenge/${agentId}/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                challenge: challenge,
                response: responseText
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.verified) {
            resultDiv.innerHTML = `
                <div style="padding: 1.5rem; background: rgba(46,204,113,0.1); border: 2px solid #2ecc71; border-radius: 8px; text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 0.5rem;">✅</div>
                    <div style="color: #2ecc71; font-weight: 700; font-size: 1.2rem; margin-bottom: 0.5rem;">Verification Successful!</div>
                    <div style="color: var(--text-muted); font-size: 0.9rem;">Agent identity confirmed via Ed25519 signature</div>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `
                <div style="padding: 1.5rem; background: rgba(231,76,60,0.1); border: 2px solid #e74c3c; border-radius: 8px; text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 0.5rem;">❌</div>
                    <div style="color: #e74c3c; font-weight: 700; font-size: 1.2rem; margin-bottom: 0.5rem;">Verification Failed</div>
                    <div style="color: var(--text-muted); font-size: 0.9rem;">${data.error || 'Invalid signature'}</div>
                </div>
            `;
        }
        
    } catch (error) {
        console.error('Verify error:', error);
        resultDiv.innerHTML = `
            <div style="padding: 1rem; background: rgba(231,76,60,0.1); border-left: 3px solid #e74c3c; border-radius: 4px;">
                <strong style="color: #e74c3c;">Error:</strong> ${error.message}
            </div>
        `;
    }
}

function closeChallengeModal() {
    const modal = document.getElementById('challenge-modal');
    modal.style.display = 'none';
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    }).catch(err => {
        console.error('Copy failed:', err);
    });
}

// ========== QUICK START MODAL ==========
function openQuickStart(productType) {
    // For token and code, jump directly to the demo tab
    if (productType === 'token') {
        switchDemoTab('token');
        document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
        return;
    }
    
    if (productType === 'code') {
        switchDemoTab('code');
        document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
        return;
    }
    
    // For payment and other types, show modal
    const modal = document.getElementById('quickstart-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    
    modal.style.display = 'flex';
    
    if (productType === 'payment') {
        modalTitle.innerHTML = '💳 Payment Options';
        modalContent.innerHTML = `
            <h3 style="color: var(--primary); margin-bottom: 1rem;">Cryptocurrency Payments</h3>
            
            <div style="margin-bottom: 2rem; padding: 1.5rem; background: rgba(0,255,136,0.05); border: 1px solid var(--primary); border-radius: 8px;">
                <h4 style="color: var(--primary); margin-top: 0;">USDC (Base Network)</h4>
                <code style="color: var(--text-muted); word-break: break-all; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem;">0x1cC0H36042377H01L9deA83E9HF3c258U61024E1</code>
            </div>

            <div style="margin-bottom: 2rem; padding: 1.5rem; background: rgba(0,255,136,0.05); border: 1px solid var(--primary); border-radius: 8px;">
                <h4 style="color: var(--primary); margin-top: 0;">USDC (Solana)</h4>
                <code style="color: var(--text-muted); word-break: break-all; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem;">3D2PMNyok6PkFKm3jU33oYsNQxgJouKyLqiC8A9q5Cjq</code>
            </div>

            <div style="margin-bottom: 2rem; padding: 1.5rem; background: rgba(0,255,136,0.05); border: 1px solid var(--primary); border-radius: 8px;">
                <h4 style="color: var(--primary); margin-top: 0;">Lightning Network</h4>
                <code style="color: var(--text-muted); word-break: break-all; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem;">collaborationfeisty290710@getalby.com</code>
            </div>

            <div style="padding: 1rem; background: rgba(241,196,15,0.05); border-left: 3px solid var(--gold); border-radius: 4px;">
                <p style="margin: 0; color: var(--text-muted); font-size: 0.9rem;">
                    After payment, include the transaction hash in the <code style="background: rgba(0,255,136,0.1); padding: 0.2rem 0.4rem; border-radius: 4px;">X-Payment-ID</code> header or <code style="background: rgba(0,255,136,0.1); padding: 0.2rem 0.4rem; border-radius: 4px;">payment_id</code> field when calling the API.
                </p>
            </div>
        `;
    } else if (productType === 'token_api') {
        modalTitle.innerHTML = '💰 Token Optimizer - API Integration';
        modalContent.innerHTML = `
            <h3 style="color: var(--gold); margin-bottom: 1rem;">API Integration</h3>
            
            <div style="margin-bottom: 2rem;">
                <h4 style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 0.5rem;">cURL</h4>
                <pre style="background: rgba(0,0,0,0.5); padding: 1rem; border-radius: 8px; overflow-x: auto; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem;"><code>curl -X POST ${API_BASE}/api/token-optimizer \\
  -H "Content-Type: application/json" \\
  -d '{
    "code": "BETA5",
    "system_prompt": "Your agent prompt here..."
  }'</code></pre>
            </div>

            <div style="margin-bottom: 2rem;">
                <h4 style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 0.5rem;">Python</h4>
                <pre style="background: rgba(0,0,0,0.5); padding: 1rem; border-radius: 8px; overflow-x: auto; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem;"><code>import requests

response = requests.post(
    "${API_BASE}/api/token-optimizer",
    json={
        "code": "BETA5",
        "system_prompt": "Your agent prompt here..."
    }
)

data = response.json()
print(f"Monthly Savings: ${data['efficiency']['monthly_savings']}")</code></pre>
            </div>

            <div style="padding: 1rem; background: rgba(0,255,136,0.05); border-left: 3px solid var(--primary); border-radius: 4px;">
                <strong style="color: var(--primary);">Response Format:</strong>
                <pre style="margin-top: 0.5rem; color: var(--text-muted); font-size: 0.85rem; font-family: 'JetBrains Mono', monospace;">{
  "efficiency": {
    "current_tokens": 150,
    "optimized_tokens": 95,
    "monthly_savings": "$2,400",
    "redundancies_found": [...]
  },
  "pdf_url": "/reports/agentshield-report-abc123.pdf"
}</pre>
            </div>
        `;
    } else if (productType === 'code') {
        modalTitle.innerHTML = '🔍 Code Security Scan - Quick Start';
        modalContent.innerHTML = `
            <h3 style="color: var(--primary); margin-bottom: 1rem;">API Integration</h3>
            
            <div style="margin-bottom: 2rem;">
                <h4 style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 0.5rem;">cURL</h4>
                <pre style="background: rgba(0,0,0,0.5); padding: 1rem; border-radius: 8px; overflow-x: auto; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem;"><code>curl -X POST ${API_BASE}/api/code-scan \\
  -H "Content-Type: application/json" \\
  -d '{
    "code": "BETA5",
    "code_content": "import os\\nsubprocess.run(...)"
  }'</code></pre>
            </div>

            <div style="margin-bottom: 2rem;">
                <h4 style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 0.5rem;">Python</h4>
                <pre style="background: rgba(0,0,0,0.5); padding: 1rem; border-radius: 8px; overflow-x: auto; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem;"><code>import requests

response = requests.post(
    "${API_BASE}/api/code-scan",
    json={
        "code": "BETA5",
        "code_content": open("agent.py").read()
    }
)

data = response.json()
print(f"Risk Score: {data['results']['risk_score']}/100")</code></pre>
            </div>
        `;
    }
}

function closeQuickStart() {
    document.getElementById('quickstart-modal').style.display = 'none';
}

// Close modal on background click
window.addEventListener('click', function(e) {
    const modal = document.getElementById('quickstart-modal');
    const assessmentPopup = document.getElementById('assessment-popup');
    const agentDetailModal = document.getElementById('agent-detail-modal');
    const challengeModal = document.getElementById('challenge-modal');
    
    if (e.target === modal) closeQuickStart();
    if (e.target === assessmentPopup) closeAssessmentPopup();
    if (e.target === agentDetailModal) closeAgentDetail();
    if (e.target === challengeModal) closeChallengeModal();
});

// ========== TOKEN OPTIMIZER ==========
async function runTokenOptimizer(e) {
    e.preventDefault();
    
    const promoCode = document.getElementById('token-promo-code').value.trim();
    const systemPrompt = document.getElementById('token-prompt').value.trim();
    
    const resultsDiv = document.getElementById('token-results');
    const errorDiv = document.getElementById('token-error');
    const loadingDiv = document.getElementById('token-loading');
    
    // Reset UI
    resultsDiv.style.display = 'none';
    errorDiv.style.display = 'none';
    loadingDiv.style.display = 'none';
    
    if (!promoCode) {
        showTokenError('Please enter a promo code (BETA5)');
        return;
    }
    
    if (!systemPrompt) {
        showTokenError('Please enter your system prompt');
        return;
    }
    
    // Show loading
    loadingDiv.style.display = 'block';
    
    try {
        const response = await fetch(`${API_BASE}/api/token-optimizer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                code: promoCode,
                system_prompt: systemPrompt
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        loadingDiv.style.display = 'none';
        displayTokenResults(data);
        
    } catch (error) {
        console.error('Token optimizer error:', error);
        loadingDiv.style.display = 'none';
        showTokenError(error.message || 'Network error. Please try again.');
    }
}

function displayTokenResults(data) {
    const resultsDiv = document.getElementById('token-results');
    resultsDiv.style.display = 'block';
    
    const eff = data.efficiency || {};
    
    let html = `
        <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem;">
            <h4 style="color: var(--gold); margin-bottom: 1.5rem;">💰 Optimization Results</h4>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                <div style="padding: 1rem; background: rgba(241,196,15,0.05); border: 1px solid rgba(241,196,15,0.2); border-radius: 8px; text-align: center;">
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">Current Tokens</div>
                    <div style="font-size: 1.8rem; font-weight: 700; color: var(--gold);">${eff.current_tokens || 'N/A'}</div>
                </div>
                <div style="padding: 1rem; background: rgba(0,255,136,0.05); border: 1px solid rgba(0,255,136,0.2); border-radius: 8px; text-align: center;">
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">Optimized</div>
                    <div style="font-size: 1.8rem; font-weight: 700; color: var(--primary);">${eff.optimized_tokens || 'N/A'}</div>
                </div>
                <div style="padding: 1rem; background: rgba(0,255,136,0.05); border: 1px solid rgba(0,255,136,0.2); border-radius: 8px; text-align: center;">
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">Monthly Savings</div>
                    <div style="font-size: 1.8rem; font-weight: 700; color: var(--primary);">$${eff.monthly_savings || '0'}</div>
                </div>
            </div>
    `;
    
    if (eff.redundancies_found && eff.redundancies_found.length > 0) {
        html += `
            <div style="padding: 1rem; background: rgba(241,196,15,0.05); border-left: 3px solid var(--gold); border-radius: 4px; margin-bottom: 1.5rem;">
                <strong style="color: var(--gold);">Redundancies Found:</strong>
                <ul style="margin: 0.5rem 0 0 1.5rem; color: var(--text-muted); font-size: 0.9rem;">
                    ${eff.redundancies_found.map(r => `<li>${r}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    if (data.pdf_url) {
        html += `
            <div style="padding: 1rem; background: rgba(0,255,136,0.05); border: 2px solid var(--primary); border-radius: 8px; text-align: center;">
                <strong style="color: var(--primary);">📄 PDF Report Generated</strong>
                <div style="margin-top: 0.5rem;"><a href="${data.pdf_url}" class="btn btn-primary" style="display: inline-block; padding: 0.75rem 1.5rem; margin-top: 0.5rem;">Download Report</a></div>
            </div>
        `;
    }
    
    html += `</div>`;
    
    resultsDiv.innerHTML = html;
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showTokenError(message) {
    const errorDiv = document.getElementById('token-error');
    const errorMsg = document.getElementById('token-error-message');
    errorMsg.textContent = message;
    errorDiv.style.display = 'block';
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ========== CODE SCAN ==========
async function runCodeScan(e) {
    e.preventDefault();
    
    const promoCode = document.getElementById('code-promo-code').value.trim();
    const codeContent = document.getElementById('code-content').value.trim();
    
    const resultsDiv = document.getElementById('code-results');
    const errorDiv = document.getElementById('code-error');
    const loadingDiv = document.getElementById('code-loading');
    
    // Reset UI
    resultsDiv.style.display = 'none';
    errorDiv.style.display = 'none';
    loadingDiv.style.display = 'none';
    
    if (!promoCode) {
        showCodeError('Please enter a promo code (BETA5)');
        return;
    }
    
    if (!codeContent) {
        showCodeError('Please enter code to scan');
        return;
    }
    
    // Show loading
    loadingDiv.style.display = 'block';
    
    try {
        const response = await fetch(`${API_BASE}/api/code-scan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                code: promoCode,
                code_content: codeContent
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        loadingDiv.style.display = 'none';
        displayCodeResults(data);
        
    } catch (error) {
        console.error('Code scan error:', error);
        loadingDiv.style.display = 'none';
        showCodeError(error.message || 'Network error. Please try again.');
    }
}

function displayCodeResults(data) {
    const resultsDiv = document.getElementById('code-results');
    resultsDiv.style.display = 'block';
    
    const results = data.results || {};
    const securityScore = results.security_score !== undefined ? results.security_score : 
                         (results.risk_score !== undefined ? (100 - results.risk_score) : 100);
    const status = results.status || results.tier || 'UNKNOWN';
    const findings = results.findings || [];
    
    const statusColors = {
        'SAFE': 'var(--primary)',
        'HARDENED': 'var(--primary)',
        'PROTECTED': '#3498db',
        'LOW_RISK': '#3498db',
        'STANDARD': '#f39c12',
        'MEDIUM_RISK': '#f39c12',
        'WARNING': '#e74c3c',
        'VULNERABLE': '#c0392b',
        'CRITICAL': '#c0392b',
        'HIGH_RISK': '#c0392b'
    };
    
    const statusColor = statusColors[status] || 'var(--text-muted)';
    
    let html = `
        <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem;">
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="font-size: 3rem; font-weight: 800; color: ${statusColor}; margin-bottom: 0.5rem;">${securityScore}/100</div>
                <div style="display: inline-block; padding: 0.5rem 1.5rem; background: rgba(0,0,0,0.3); border: 2px solid ${statusColor}; border-radius: 20px; font-weight: 700; font-size: 1.1rem; color: ${statusColor};">
                    ${status.replace('_', ' ')}
                </div>
            </div>
    `;
    
    if (findings.length > 0) {
        html += `
            <div style="margin-bottom: 2rem;">
                <h4 style="color: var(--primary); margin-bottom: 1rem;">🔍 Findings</h4>
        `;
        
        findings.forEach(finding => {
            html += `
                <div style="padding: 1rem; margin-bottom: 0.75rem; background: rgba(0,0,0,0.2); border-left: 3px solid ${statusColor}; border-radius: 4px;">
                    <div style="color: ${statusColor}; font-size: 0.9rem;">⚠️ ${finding}</div>
                </div>
            `;
        });
        
        html += `</div>`;
    } else {
        html += `
            <div style="padding: 1rem; background: rgba(0,255,136,0.05); border-left: 3px solid var(--primary); border-radius: 4px; margin-bottom: 2rem;">
                <strong style="color: var(--primary);">✅ No security issues detected</strong>
            </div>
        `;
    }
    
    if (data.pdf_url) {
        html += `
            <div style="padding: 1rem; background: rgba(0,255,136,0.05); border: 2px solid var(--primary); border-radius: 8px; text-align: center;">
                <strong style="color: var(--primary);">📄 PDF Report Generated</strong>
                <div style="margin-top: 0.5rem;"><a href="${data.pdf_url}" class="btn btn-primary" style="display: inline-block; padding: 0.75rem 1.5rem; margin-top: 0.5rem;">Download Report</a></div>
            </div>
        `;
    }
    
    html += `</div>`;
    
    resultsDiv.innerHTML = html;
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showCodeError(message) {
    const errorDiv = document.getElementById('code-error');
    const errorMsg = document.getElementById('code-error-message');
    errorMsg.textContent = message;
    errorDiv.style.display = 'block';
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAgentShield);
} else {
    initAgentShield();
}
