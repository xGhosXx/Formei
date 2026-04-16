
    // ==================== STATE ====================
    const state = {
      forms: [],
      currentFormId: null,
      fields: [],
      selectedFieldId: null,
      viewMode: 'grid',
      formTitle: 'Formulário sem título',
      formDesc: '',
      responses: {},
      notifications: [],
      unreadCount: 0,
      conditionalRules: [],
      webhookUrl: '',
      activeSettingsTab: 'content',
      activeBuilderTab: 'build',
      formDesign: {
        primaryColor: '#7c3aed',
        bgColor: '#0d0d14',
        cardBg: '#15151e',
        textColor: '#ffffff',
        labelColor: '#c4c4cc',
        inputBg: '#1c1c28',
        inputBorder: '#2a2a3a',
        fontFamily: 'Inter',
        fontSize: '15',
        borderRadius: '12',
        buttonStyle: 'filled',
        buttonRadius: '10',
        coverImage: '',
        logo: '',
        fieldSpacing: '16',
        cardPadding: '40',
        cardBorder: true,
        cardShadow: true,
        bgGradient: '',
        inputStyle: 'outlined'
      }
    };

    // ==================== TEMPLATE DATA ====================
    const TEMPLATES = [
      { id: 't1', title: 'Feedback de Evento', cat: 'Feedback', emoji: '🎤', fields: [
        { type: 'short_text', label: 'Qual o seu nome?', required: true, options: [] },
        { type: 'email', label: 'E-mail para contato', required: true, options: [] },
        { type: 'rating', label: 'Como você avalia o evento no geral?', required: true, options: [] },
        { type: 'multiple_choice', label: 'Você participaria novamente?', required: false, options: ['Com certeza!', 'Talvez', 'Provavelmente não'] },
        { type: 'long_text', label: 'Sugestões de melhoria', required: false, options: [] }
      ]},
      { id: 't2', title: 'Formulário de Contato', cat: 'Contato', emoji: '💬', fields: [
        { type: 'short_text', label: 'Nome completo', required: true, options: [] },
        { type: 'email', label: 'Endereço de e-mail', required: true, options: [] },
        { type: 'phone', label: 'Telefone', required: false, options: [] },
        { type: 'dropdown', label: 'Assunto', required: true, options: ['Dúvida', 'Suporte', 'Parceria', 'Outro'] },
        { type: 'long_text', label: 'Mensagem', required: true, options: [] }
      ]},
      { id: 't3', title: 'Inscrição para Evento', cat: 'Inscrição', emoji: '🎫', fields: [
        { type: 'short_text', label: 'Nome completo', required: true, options: [] },
        { type: 'email', label: 'E-mail', required: true, options: [] },
        { type: 'phone', label: 'Telefone / WhatsApp', required: false, options: [] },
        { type: 'short_text', label: 'Empresa / Organização', required: false, options: [] },
        { type: 'multiple_choice', label: 'Tamanho da camiseta', required: true, options: ['P', 'M', 'G', 'GG'] },
        { type: 'checkboxes', label: 'Restrições alimentares', required: false, options: ['Vegetariano', 'Vegano', 'Sem glúten', 'Sem lactose', 'Nenhuma'] }
      ]},
      { id: 't4', title: 'Pesquisa de Satisfação', cat: 'Pesquisa', emoji: '📊', fields: [
        { type: 'scale', label: 'De 0 a 10, o quanto você nos recomendaria?', required: true, options: [] },
        { type: 'rating', label: 'Qualidade do atendimento', required: true, options: [] },
        { type: 'rating', label: 'Qualidade do produto/serviço', required: true, options: [] },
        { type: 'multiple_choice', label: 'Você usaria nosso serviço novamente?', required: true, options: ['Definitivamente sim', 'Provavelmente sim', 'Não tenho certeza', 'Provavelmente não'] },
        { type: 'long_text', label: 'O que podemos melhorar?', required: false, options: [] }
      ]},
      { id: 't5', title: 'Pedido de Orçamento', cat: 'Vendas', emoji: '💰', fields: [
        { type: 'short_text', label: 'Nome / Empresa', required: true, options: [] },
        { type: 'email', label: 'E-mail', required: true, options: [] },
        { type: 'phone', label: 'Telefone', required: true, options: [] },
        { type: 'dropdown', label: 'Tipo de serviço', required: true, options: ['Consultoria', 'Desenvolvimento', 'Design', 'Marketing', 'Outro'] },
        { type: 'long_text', label: 'Descreva o que você precisa', required: true, options: [] },
        { type: 'multiple_choice', label: 'Prazo estimado', required: false, options: ['Urgente (7 dias)', 'Próximo mês', 'Sem pressa'] }
      ]},
      { id: 't6', title: 'Candidatura de Emprego', cat: 'RH', emoji: '💼', fields: [
        { type: 'short_text', label: 'Nome completo', required: true, options: [] },
        { type: 'email', label: 'E-mail', required: true, options: [] },
        { type: 'phone', label: 'Telefone', required: true, options: [] },
        { type: 'dropdown', label: 'Vaga desejada', required: true, options: ['Desenvolvedor Frontend', 'Desenvolvedor Backend', 'Designer UX/UI', 'Product Manager', 'Outro'] },
        { type: 'long_text', label: 'Conte sobre sua experiência', required: true, options: [] },
        { type: 'file_upload', label: 'Envie seu currículo', required: true, options: [] }
      ]},
      { id: 't7', title: 'Quiz Rápido', cat: 'Quiz', emoji: '🧠', fields: [
        { type: 'short_text', label: 'Seu nome ou apelido', required: true, options: [] },
        { type: 'multiple_choice', label: 'Qual é a capital do Brasil?', required: true, options: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'] },
        { type: 'multiple_choice', label: 'Quantos planetas existem no sistema solar?', required: true, options: ['7', '8', '9', '10'] },
        { type: 'multiple_choice', label: 'Quem pintou a Mona Lisa?', required: true, options: ['Michelangelo', 'Leonardo da Vinci', 'Rafael', 'Donatello'] }
      ]},
      { id: 't8', title: 'Enquete Rápida', cat: 'Enquete', emoji: '📋', fields: [
        { type: 'multiple_choice', label: 'Qual sua rede social favorita?', required: true, options: ['Instagram', 'TikTok', 'Twitter/X', 'YouTube', 'LinkedIn'] },
        { type: 'checkboxes', label: 'Quais dispositivos você usa?', required: false, options: ['Smartphone', 'Notebook', 'Desktop', 'Tablet', 'Smart TV'] },
        { type: 'scale', label: 'De 0 a 10, qual seu nível de satisfação com a tecnologia atual?', required: true, options: [] }
      ]},
      { id: 't9', title: 'Formulário de Pagamento', cat: 'Pagamento', emoji: '💳', fields: [
        { type: 'short_text', label: 'Nome completo', required: true, options: [] },
        { type: 'email', label: 'E-mail', required: true, options: [] },
        { type: 'dropdown', label: 'Produto / Serviço', required: true, options: ['Plano Básico - R$29', 'Plano Pro - R$79', 'Plano Enterprise - R$199'] },
        { type: 'multiple_choice', label: 'Forma de pagamento', required: true, options: ['Cartão de crédito', 'PIX', 'Boleto'] },
        { type: 'long_text', label: 'Observações', required: false, options: [] }
      ]},
      { id: 't10', title: 'Reserva de Agenda', cat: 'Agendamento', emoji: '📅', fields: [
        { type: 'short_text', label: 'Nome completo', required: true, options: [] },
        { type: 'email', label: 'E-mail', required: true, options: [] },
        { type: 'phone', label: 'Telefone', required: true, options: [] },
        { type: 'date', label: 'Data desejada', required: true, options: [] },
        { type: 'dropdown', label: 'Horário preferido', required: true, options: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
        { type: 'long_text', label: 'Observações', required: false, options: [] }
      ]},
      { id: 't11', title: 'Feedback de Produto', cat: 'Feedback', emoji: '📦', fields: [
        { type: 'short_text', label: 'Nome', required: false, options: [] },
        { type: 'rating', label: 'Avalie o produto (1-5 estrelas)', required: true, options: [] },
        { type: 'multiple_choice', label: 'Você recomendaria este produto?', required: true, options: ['Sim, com certeza!', 'Talvez', 'Não'] },
        { type: 'long_text', label: 'O que mais gostou?', required: false, options: [] },
        { type: 'long_text', label: 'O que podemos melhorar?', required: false, options: [] }
      ]},
      { id: 't12', title: 'Cadastro de Newsletter', cat: 'Marketing', emoji: '📧', fields: [
        { type: 'short_text', label: 'Primeiro nome', required: true, options: [] },
        { type: 'email', label: 'Seu melhor e-mail', required: true, options: [] },
        { type: 'checkboxes', label: 'Interesses', required: false, options: ['Tecnologia', 'Design', 'Marketing', 'Negócios', 'Produtividade'] }
      ]}
    ];

    const TEMPLATE_CATS = ['Todos', ...new Set(TEMPLATES.map(t => t.cat))];

    // ==================== NAVIGATION ====================
    function hideAllViews() {
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    }

    function goToDashboard() {
      hideAllViews();
      document.getElementById('view-dashboard').classList.add('active');
      renderDashboard();
    }

    function switchNav(el, type) {
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      el.classList.add('active');
    }

    // ==================== MODALS ====================
    function openCreateModal() {
      document.getElementById('create-modal').classList.add('active');
    }

    function closeModal(id, e) {
      if (e && e.target !== e.currentTarget) return;
      document.getElementById(id).classList.remove('active');
    }

    function openTemplatesModal() {
      renderTemplates('Todos');
      document.getElementById('templates-modal').classList.add('active');
    }

    // ==================== TOAST ====================
    function showToast(msg, type = 'info') {
      const container = document.getElementById('toast-container');
      const toast = document.createElement('div');
      const icons = { success: '✓', error: '✕', info: 'ℹ' };
      toast.className = `toast ${type}`;
      toast.innerHTML = `<span class="toast-icon">${icons[type]}</span>${msg}`;
      container.appendChild(toast);
      setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3500);
    }

    // ==================== TEMPLATES ====================
    function renderTemplates(cat) {
      // Tabs
      const tabsEl = document.getElementById('template-tabs');
      tabsEl.innerHTML = TEMPLATE_CATS.map(c => 
        `<button class="template-tab ${c === cat ? 'active' : ''}" onclick="renderTemplates('${c}')">${c}</button>`
      ).join('');
      
      // Grid
      const gridEl = document.getElementById('templates-grid');
      const filtered = cat === 'Todos' ? TEMPLATES : TEMPLATES.filter(t => t.cat === cat);
      
      const bgColors = [
        'linear-gradient(135deg, #1e1b4b, #312e81)',
        'linear-gradient(135deg, #1a2e05, #365314)',
        'linear-gradient(135deg, #2d1b0e, #78350f)',
        'linear-gradient(135deg, #1e1b33, #3b1d6e)',
        'linear-gradient(135deg, #0c2233, #0c4a6e)',
        'linear-gradient(135deg, #2d0f23, #831843)'
      ];
      
      gridEl.innerHTML = filtered.map((t, i) => `
        <div class="template-card" onclick="useTemplate('${t.id}')">
          <div class="template-preview" style="background: ${bgColors[i % bgColors.length]}">${t.emoji}</div>
          <div class="template-card-body">
            <div class="template-card-title">${t.title}</div>
            <div class="template-card-cat">${t.cat} • ${t.fields.length} campos</div>
          </div>
        </div>
      `).join('');
    }

    function useTemplate(templateId) {
      const template = TEMPLATES.find(t => t.id === templateId);
      if (!template) return;
      
      closeModal('templates-modal');
      closeModal('create-modal');
      hideAllViews();
      document.getElementById('view-builder').classList.add('active');
      
      state.formTitle = template.title;
      state.formDesc = '';
      state.fields = template.fields.map(f => ({
        id: 'field_' + Math.random().toString(36).substr(2, 9),
        type: f.type,
        label: f.label,
        required: f.required,
        options: [...(f.options || [])],
        placeholder: ''
      }));
      state.selectedFieldId = null;
      
      document.getElementById('builder-form-title').value = template.title;
      document.getElementById('canvas-form-title').value = template.title;
      document.getElementById('canvas-form-desc').value = '';
      closeSettingsPanel();
      renderCanvas();
      showToast(`Template "${template.title}" carregado!`, 'success');
    }
    function applyThemePreset(preset) {
      const presets = {
        'midnight': {
          primaryColor: '#7c3aed', bgColor: '#0d0d14', cardBg: '#15151e',
          textColor: '#ffffff', labelColor: '#c4c4cc', inputBg: '#1c1c28',
          inputBorder: '#2a2a3a', bgGradient: 'linear-gradient(135deg, #0d0d14 0%, #1a0a2e 100%)',
          buttonStyle: 'gradient'
        },
        'ocean': {
          primaryColor: '#3b82f6', bgColor: '#06101c', cardBg: '#0f172a',
          textColor: '#f8fafc', labelColor: '#94a3b8', inputBg: '#1e293b',
          inputBorder: '#334155', bgGradient: 'linear-gradient(135deg, #0a1628 0%, #0d2137 100%)',
          buttonStyle: 'gradient'
        },
        'emerald': {
          primaryColor: '#10b981', bgColor: '#061c10', cardBg: '#064e3b',
          textColor: '#f8fafc', labelColor: '#a7f3d0', inputBg: '#065f46',
          inputBorder: '#047857', bgGradient: 'linear-gradient(135deg, #0a1a0a 0%, #0d2d15 100%)',
          buttonStyle: 'pill'
        },
        'rose': {
          primaryColor: '#ec4899', bgColor: '#1c0612', cardBg: '#4c0519',
          textColor: '#fdf2f8', labelColor: '#fbcfe8', inputBg: '#831843',
          inputBorder: '#be185d', bgGradient: 'linear-gradient(135deg, #1a0a14 0%, #2d0a1a 100%)',
          buttonStyle: 'filled'
        },
        'sunset': {
          primaryColor: '#f59e0b', bgColor: '#1c1006', cardBg: '#451a03',
          textColor: '#fffbeb', labelColor: '#fde68a', inputBg: '#78350f',
          inputBorder: '#b45309', bgGradient: 'linear-gradient(135deg, #1a1005 0%, #2d1a08 100%)',
          buttonStyle: 'filled'
        },
        'light': {
          primaryColor: '#6366f1', bgColor: '#f8f9fa', cardBg: '#ffffff',
          textColor: '#1f2937', labelColor: '#4b5563', inputBg: '#f3f4f6',
          inputBorder: '#e5e7eb', bgGradient: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          buttonStyle: 'filled'
        }
      };
      
      const theme = presets[preset];
      if (!theme) return;
      
      state.formDesign = { ...state.formDesign, ...theme };
      syncDesignPanel();
      applyDesignToCanvas();
      showToast('Tema "' + preset + '" aplicado!', 'success');
    }

    // ==================== AI ====================
    function goToAI() {
      closeModal('create-modal');
      hideAllViews();
      document.getElementById('view-ai').classList.add('active');
      document.getElementById('ai-form-area').style.display = 'block';
      document.getElementById('ai-loading').classList.remove('active');
    }

    function setAIPrompt(text) {
      document.getElementById('ai-prompt').value = text;
    }

    function generateWithAI() {
      const prompt = document.getElementById('ai-prompt').value.trim();
      if (!prompt) { showToast('Descreva o formulário que você precisa.', 'error'); return; }
      
      document.getElementById('ai-form-area').style.display = 'none';
      document.getElementById('ai-loading').classList.add('active');
      
      // AI generation simulation with smart field parsing
      setTimeout(() => {
        const generated = parseAIPrompt(prompt);
        
        hideAllViews();
        document.getElementById('view-builder').classList.add('active');
        
        state.formTitle = generated.title;
        state.formDesc = generated.desc;
        state.fields = generated.fields;
        state.selectedFieldId = null;
        
        document.getElementById('builder-form-title').value = generated.title;
        document.getElementById('canvas-form-title').value = generated.title;
        document.getElementById('canvas-form-desc').value = generated.desc;
        document.getElementById('ai-prompt').value = '';
        closeSettingsPanel();
        renderCanvas();
        showToast('Formulário gerado com IA! ✨', 'success');
      }, 2000);
    }

    function parseAIPrompt(prompt) {
      const lower = prompt.toLowerCase();
      let title = 'Formulário Inteligente';
      let desc = '';
      const fields = [];

      const mkField = (type, label, req = false, opts = []) => ({
        id: 'field_' + Math.random().toString(36).substr(2, 9),
        type, label, required: req, options: [...opts], placeholder: ''
      });

      // Detect type
      if (lower.includes('feedback') || lower.includes('satisfação') || lower.includes('satisfacao')) {
        title = 'Feedback & Satisfação';
        desc = 'Compartilhe sua opinião para nos ajudar a melhorar.';
        fields.push(mkField('text', 'Qual o seu nome?', true));
        fields.push(mkField('email', 'E-mail para contato', true));
        fields.push(mkField('rating', 'Como você avalia sua experiência?', true));
        fields.push(mkField('scale', 'De 0 a 10, o quanto nos recomendaria?', true));
        fields.push(mkField('textarea', 'Comentários e sugestões', false));
      } else if (lower.includes('inscri') || lower.includes('evento') || lower.includes('registro')) {
        title = 'Inscrição para Evento';
        desc = 'Preencha seus dados para confirmar participação.';
        fields.push(mkField('text', 'Nome completo', true));
        fields.push(mkField('email', 'E-mail', true));
        fields.push(mkField('phone', 'Telefone / WhatsApp', false));
        if (lower.includes('empresa') || lower.includes('companhia')) {
          fields.push(mkField('text', 'Empresa', false));
        }
        if (lower.includes('camiseta')) {
          fields.push(mkField('radio', 'Tamanho da camiseta', true, ['P', 'M', 'G', 'GG']));
        }
        fields.push(mkField('textarea', 'Observações', false));
      } else if (lower.includes('contato') || lower.includes('mensagem')) {
        title = 'Formulário de Contato';
        desc = 'Entre em contato conosco. Responderemos o mais breve possível.';
        fields.push(mkField('text', 'Nome completo', true));
        fields.push(mkField('email', 'E-mail', true));
        if (lower.includes('telefone') || lower.includes('celular')) {
          fields.push(mkField('phone', 'Telefone', false));
        }
        fields.push(mkField('dropdown', 'Assunto', true, ['Dúvida', 'Suporte', 'Parceria', 'Outro']));
        fields.push(mkField('textarea', 'Mensagem', true));
      } else if (lower.includes('orçamento') || lower.includes('orcamento') || lower.includes('budget')) {
        title = 'Pedido de Orçamento';
        desc = 'Preencha os dados abaixo para solicitar um orçamento.';
        fields.push(mkField('text', 'Nome / Empresa', true));
        fields.push(mkField('email', 'E-mail', true));
        fields.push(mkField('phone', 'Telefone', true));
        fields.push(mkField('dropdown', 'Tipo de serviço', true, ['Consultoria', 'Desenvolvimento', 'Design', 'Marketing', 'Outro']));
        fields.push(mkField('textarea', 'Descreva o que você precisa', true));
        fields.push(mkField('radio', 'Prazo desejado', false, ['Urgente', 'Até 30 dias', 'Sem pressa']));
      } else if (lower.includes('pesquisa') || lower.includes('survey')) {
        title = 'Pesquisa de Opinião';
        desc = 'Ajude-nos a entender melhor suas necessidades.';
        fields.push(mkField('text', 'Nome (opcional)', false));
        fields.push(mkField('radio', 'Como você conheceu nosso serviço?', true, ['Redes sociais', 'Google', 'Indicação', 'Anúncio', 'Outro']));
        fields.push(mkField('rating', 'Avaliação geral', true));
        fields.push(mkField('scale', 'Probabilidade de recomendar (0-10)', true));
        fields.push(mkField('checkbox', 'O que é mais importante para você?', false, ['Qualidade', 'Preço', 'Atendimento', 'Rapidez', 'Inovação']));
        fields.push(mkField('textarea', 'Sugestões', false));
      } else {
        // Generic
        title = prompt.slice(0, 50);
        desc = 'Formulário criado com IA baseado na sua descrição.';
        fields.push(mkField('text', 'Nome', true));
        fields.push(mkField('email', 'E-mail', true));
        if (lower.includes('nome') || lower.includes('email') || lower.includes('telefone')) {
          fields.push(mkField('phone', 'Telefone', false));
        }
        fields.push(mkField('textarea', 'Sua resposta', true));
      }

      return { title, desc, fields };
    }

    // ==================== BUILDER ====================
    function goToBuilder(fromPreview) {
      if (!fromPreview) {
        closeModal('create-modal');
        state.currentFormId = null;
        state.fields = [];
        state.selectedFieldId = null;
        state.formTitle = 'Novo Formulário';
        state.formDesc = '';
        document.getElementById('builder-form-title').value = 'Novo Formulário';
        document.getElementById('canvas-form-title').value = 'Novo Formulário';
        document.getElementById('canvas-form-desc').value = '';
        updateBreadcrumb('Novo Formulário');
        closeSettingsPanel();
        // Reset to build tab
        document.querySelectorAll('.builder-tab').forEach(t => t.classList.remove('active'));
        const buildTab = document.querySelector('.builder-tab');
        if (buildTab) buildTab.classList.add('active');
        switchIconBar('elements');
      }
      hideAllViews();
      document.getElementById('view-builder').classList.add('active');
      renderCanvas();
    }

    function switchBuilderTab(el, tab) {
      document.querySelectorAll('.builder-tab').forEach(t => t.classList.remove('active'));
      el.classList.add('active');
      state.activeBuilderTab = tab;

      const fieldsPanel = document.getElementById('builder-fields-panel');
      const designPanel = document.getElementById('builder-panel-design');
      const iconBar = document.querySelector('.builder-icon-bar');
      const canvas = document.querySelector('.builder-canvas');
      const settingsPanel = document.getElementById('settings-panel');

      // Hide all side panels first
      if (fieldsPanel) fieldsPanel.style.display = 'none';
      if (designPanel) designPanel.style.display = 'none';

      if (tab === 'build') {
        if (iconBar) iconBar.style.display = 'flex';
        fieldsPanel.style.display = 'flex';
        if (canvas) canvas.style.display = 'flex';
      } else if (tab === 'design') {
        if (iconBar) iconBar.style.display = 'flex';
        designPanel.style.display = 'flex';
        if (canvas) canvas.style.display = 'flex';
        syncDesignPanel();
        // Set design icon active
        switchIconBar('design');
      } else if (tab === 'connect') {
        if (iconBar) iconBar.style.display = 'none';
        if (canvas) canvas.style.display = 'flex';
        openWebhookConfig();
      } else if (tab === 'share') {
        if (iconBar) iconBar.style.display = 'none';
        if (canvas) canvas.style.display = 'flex';
        openShareModal();
      } else if (tab === 'results') {
        if (iconBar) iconBar.style.display = 'none';
        if (canvas) canvas.style.display = 'flex';
        if (state.currentFormId) {
          viewResponses(state.currentFormId);
        } else {
          showToast('Salve o formulário primeiro para ver resultados', 'info');
        }
      }
    }

    // ==================== ICON BAR ====================
    function switchIconBar(panel) {
      document.querySelectorAll('.icon-bar-btn').forEach(b => b.classList.remove('active'));
      const btn = document.getElementById('iconbar-' + panel);
      if (btn) btn.classList.add('active');

      const fieldsPanel = document.getElementById('builder-fields-panel');
      const designPanel = document.getElementById('builder-panel-design');

      if (panel === 'elements') {
        fieldsPanel.style.display = 'flex';
        designPanel.style.display = 'none';
        if (window.innerWidth <= 768) toggleMobileFields(true);
      } else if (panel === 'design') {
        fieldsPanel.style.display = 'none';
        designPanel.style.display = 'flex';
        syncDesignPanel();
        if (window.innerWidth <= 768) {
          designPanel.classList.add('mobile-open');
        }
      } else if (panel === 'logic') {
        fieldsPanel.style.display = 'none'; // hide others
        designPanel.style.display = 'none';
        showToast('Selecione um campo no canvas para configurar lógica condicional', 'info');
      }
    }

    function toggleMobileFields(forceOpen = false) {
      const panel = document.getElementById('builder-fields-panel');
      if (!panel) return;
      if (forceOpen === true) {
        panel.classList.add('mobile-open');
      } else {
        panel.classList.toggle('mobile-open');
      }
    }

    // ==================== CATEGORY TOGGLE ====================
    function toggleCategory(categoryId) {
      const el = document.getElementById(categoryId);
      if (el) el.classList.toggle('collapsed');
    }

    // ==================== FIELD SEARCH ====================
    function filterFieldList(query) {
      const q = query.toLowerCase().trim();
      const items = document.querySelectorAll('.field-list-item');
      const categories = document.querySelectorAll('.field-category');

      items.forEach(item => {
        const name = (item.getAttribute('data-field-name') || '').toLowerCase();
        const label = (item.querySelector('span')?.textContent || '').toLowerCase();
        const match = !q || name.includes(q) || label.includes(q);
        item.style.display = match ? 'flex' : 'none';
      });

      // Hide empty categories
      categories.forEach(cat => {
        const visibleItems = cat.querySelectorAll('.field-list-item[style*="flex"], .field-list-item:not([style])');
        const hasVisible = Array.from(cat.querySelectorAll('.field-list-item')).some(i => i.style.display !== 'none');
        cat.style.display = hasVisible ? 'block' : 'none';
        // Expand categories when searching
        if (q) cat.classList.remove('collapsed');
      });
    }

    // ==================== BREADCRUMB SYNC ====================
    function updateBreadcrumb(title) {
      const el = document.getElementById('builder-breadcrumb-title');
      if (el) el.textContent = title || 'Formulário sem título';
    }

    function syncDesignPanel() {
      const d = state.formDesign;
      // Sync color inputs
      const colorFields = ['primaryColor','bgColor','cardBg','textColor','labelColor','inputBg','inputBorder'];
      colorFields.forEach(key => {
        const el = document.querySelector(`#builder-panel-design input[type=color][onchange*="${key}"]`);
        if (el) el.value = d[key];
        const hex = document.getElementById('dsg-' + key);
        if (hex) hex.textContent = d[key];
      });
      // Sync selects
      const fontSel = document.getElementById('dsg-fontFamily');
      if (fontSel) fontSel.value = d.fontFamily;
      const bgGrad = document.getElementById('dsg-bgGradient');
      if (bgGrad) bgGrad.value = d.bgGradient;
      // Sync text inputs
      const coverImg = document.getElementById('dsg-coverImage');
      if (coverImg) coverImg.value = d.coverImage || '';
      const logoImg = document.getElementById('dsg-logo');
      if (logoImg) logoImg.value = d.logo || '';
      // Sync sliders
      const sliders = document.querySelectorAll('#builder-panel-design .design-slider');
      sliders.forEach(sl => {
        const onChange = sl.getAttribute('oninput');
        if (onChange.includes('fontSize')) { sl.value = d.fontSize; sl.nextElementSibling.textContent = d.fontSize + 'px'; }
        if (onChange.includes('borderRadius')) { sl.value = d.borderRadius; sl.nextElementSibling.textContent = d.borderRadius + 'px'; }
        if (onChange.includes('fieldSpacing')) { sl.value = d.fieldSpacing; sl.nextElementSibling.textContent = d.fieldSpacing + 'px'; }
        if (onChange.includes('cardPadding')) { sl.value = d.cardPadding; sl.nextElementSibling.textContent = d.cardPadding + 'px'; }
        if (onChange.includes('buttonRadius')) { sl.value = d.buttonRadius; sl.nextElementSibling.textContent = d.buttonRadius + 'px'; }
      });
      // Sync selects for inputStyle and buttonStyle
      const selects = document.querySelectorAll('#builder-panel-design .design-select');
      selects.forEach(sel => {
        const onChange = sel.getAttribute('onchange');
        if (onChange && onChange.includes('inputStyle')) sel.value = d.inputStyle;
        if (onChange && onChange.includes('buttonStyle')) sel.value = d.buttonStyle;
      });
      // Sync toggles
      const toggles = document.querySelectorAll('#builder-panel-design .toggle-switch');
      toggles.forEach(t => {
        const onclick = t.getAttribute('onclick');
        if (onclick && onclick.includes('cardBorder')) t.classList.toggle('on', d.cardBorder);
        if (onclick && onclick.includes('cardShadow')) t.classList.toggle('on', d.cardShadow);
      });
    }

    function updateDesign(key, value) {
      state.formDesign[key] = value;
      const hex = document.getElementById('dsg-' + key);
      if (hex && typeof value === 'string' && value.startsWith('#')) hex.textContent = value;
      applyDesignToCanvas();
    }

    function resetDesign() {
      state.formDesign = {
        primaryColor: '#7c3aed', bgColor: '#0d0d14', cardBg: '#15151e',
        textColor: '#ffffff', labelColor: '#c4c4cc', inputBg: '#1c1c28',
        inputBorder: '#2a2a3a', fontFamily: 'Inter', fontSize: '15',
        borderRadius: '12', buttonStyle: 'filled', buttonRadius: '10',
        coverImage: '', logo: '', fieldSpacing: '16', cardPadding: '40',
        cardBorder: true, cardShadow: true, bgGradient: '', inputStyle: 'outlined'
      };
      syncDesignPanel();
      applyDesignToCanvas();
      showToast('Design restaurado ao padrão', 'success');
    }

    function applyDesignToCanvas() {
      const d = state.formDesign;
      const canvas = document.querySelector('.builder-canvas');
      const paper = document.querySelector('.canvas-paper');
      if (!canvas || !paper) return;

      // Load font dynamically
      if (d.fontFamily && d.fontFamily !== 'Inter') {
        const fontLink = document.getElementById('dynamic-font-link');
        const fontUrl = `https://fonts.googleapis.com/css2?family=${d.fontFamily.replace(/ /g, '+')}:wght@400;500;600;700;800&display=swap`;
        if (fontLink) { fontLink.href = fontUrl; } else {
          const link = document.createElement('link');
          link.id = 'dynamic-font-link'; link.rel = 'stylesheet'; link.href = fontUrl;
          document.head.appendChild(link);
        }
      }

      // Apply background
      if (d.bgGradient) {
        canvas.style.background = d.bgGradient;
      } else {
        canvas.style.background = d.bgColor;
      }

      // Apply card
      paper.style.background = d.cardBg;
      paper.style.borderRadius = d.borderRadius + 'px';
      paper.style.padding = d.cardPadding + 'px';
      paper.style.border = d.cardBorder ? `1px solid ${d.inputBorder}` : 'none';
      paper.style.boxShadow = d.cardShadow ? '0 20px 60px rgba(0,0,0,0.4)' : 'none';
      paper.style.fontFamily = `'${d.fontFamily}', sans-serif`;

      // Cover image
      let coverEl = paper.querySelector('.canvas-cover-image');
      if (d.coverImage) {
        if (!coverEl) {
          coverEl = document.createElement('div');
          coverEl.className = 'canvas-cover-image';
          paper.insertBefore(coverEl, paper.firstChild);
        }
        coverEl.style.cssText = `width:100%;height:160px;border-radius:${Math.max(0, d.borderRadius-8)}px;background:url('${d.coverImage}') center/cover;margin-bottom:20px;`;
      } else if (coverEl) { coverEl.remove(); }

      // Logo
      let logoEl = paper.querySelector('.canvas-logo');
      if (d.logo) {
        if (!logoEl) {
          logoEl = document.createElement('img');
          logoEl.className = 'canvas-logo';
          const header = paper.querySelector('.canvas-form-header');
          if (header) header.insertBefore(logoEl, header.firstChild);
        }
        logoEl.src = d.logo;
        logoEl.style.cssText = 'max-width:120px;max-height:60px;margin-bottom:16px;border-radius:8px;display:block;';
      } else if (logoEl) { logoEl.remove(); }

      // Title color
      const titleEl = document.getElementById('canvas-form-title');
      if (titleEl) titleEl.style.color = d.textColor;

      // Desc color
      const descEl = document.getElementById('canvas-form-desc');
      if (descEl) descEl.style.color = d.labelColor;

      // Field items
      const fieldItems = paper.querySelectorAll('.field-item');
      fieldItems.forEach(fi => {
        fi.style.borderColor = d.inputBorder;
        fi.style.fontFamily = `'${d.fontFamily}', sans-serif`;
      });

      // Field spacing
      const fieldsContainer = document.getElementById('canvas-fields');
      if (fieldsContainer) fieldsContainer.style.gap = d.fieldSpacing + 'px';

      // Mock inputs
      const mockInputs = paper.querySelectorAll('.field-mock-input, .field-mock-select, .field-mock-date, .field-mock-file');
      mockInputs.forEach(inp => {
        inp.style.background = d.inputBg;
        inp.style.borderColor = d.inputBorder;
        inp.style.fontSize = d.fontSize + 'px';
        if (d.inputStyle === 'underline') {
          inp.style.border = 'none';
          inp.style.borderBottom = `2px solid ${d.inputBorder}`;
          inp.style.borderRadius = '0';
        } else if (d.inputStyle === 'filled') {
          inp.style.border = 'none';
        }
      });

      // Labels
      const labels = paper.querySelectorAll('.field-item-label');
      labels.forEach(l => {
        l.style.color = d.textColor;
        l.style.fontSize = d.fontSize + 'px';
      });
    }

    function addField(type) {
      // Mapping for backward compatibility or direct calls
      const typeMap = { 'text': 'short_text', 'textarea': 'long_text', 'radio': 'multiple_choice', 'checkbox': 'checkboxes', 'file': 'file_upload' };
      if (typeMap[type]) type = typeMap[type];

      const id = 'field_' + Math.random().toString(36).substr(2, 9);
      const typeLabels = {
        short_text: 'Pergunta de Texto Curto',
        long_text: 'Pergunta Longa',
        email: 'Endereço de E-mail',
        number: 'Insira um Número',
        phone: 'Telefone de Contato',
        date: 'Selecione uma Data',
        multiple_choice: 'Escolha uma opção',
        checkboxes: 'Selecione as opções',
        dropdown: 'Selecione uma opção',
        rating: 'Avaliação',
        scale: 'Escala de Opinião',
        file_upload: 'Envie um arquivo'
      };
      const defaultOptions = {
        multiple_choice: ['Opção 1', 'Opção 2', 'Opção 3'],
        checkboxes: ['Opção 1', 'Opção 2', 'Opção 3'],
        dropdown: ['Opção 1', 'Opção 2', 'Opção 3']
      };

      const newField = {
        id,
        type,
        label: typeLabels[type] || 'Nova Pergunta',
        required: false,
        options: defaultOptions[type] || [],
        placeholder: ''
      };
      state.fields.push(newField);
      const panel = document.getElementById('builder-fields-panel');
      if (panel) panel.classList.remove('mobile-open');
      selectField(id);
      renderCanvas();
    }

    function selectField(id) {
      state.selectedFieldId = id;
      openSettingsPanel(id);
      renderCanvas();
    }

    function deselectField(e) {
      state.selectedFieldId = null;
      closeSettingsPanel();
      const panel = document.getElementById('builder-fields-panel');
      if (panel) panel.classList.remove('mobile-open');
      renderCanvas();
    }

    function deleteSelectedField() {
      if (!state.selectedFieldId) return;
      state.fields = state.fields.filter(f => f.id !== state.selectedFieldId);
      state.selectedFieldId = null;
      closeSettingsPanel();
      renderCanvas();
      showToast('Campo removido', 'success');
    }

    function duplicateSelectedField() {
      const field = state.fields.find(f => f.id === state.selectedFieldId);
      if (!field) return;
      const newField = {
        ...field,
        id: 'field_' + Math.random().toString(36).substr(2, 9),
        label: field.label + ' (cópia)',
        options: [...(field.options || [])]
      };
      const idx = state.fields.findIndex(f => f.id === field.id);
      state.fields.splice(idx + 1, 0, newField);
      selectField(newField.id);
      renderCanvas();
      showToast('Campo duplicado', 'success');
    }

    function moveField(id, dir) {
      const idx = state.fields.findIndex(f => f.id === id);
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= state.fields.length) return;
      [state.fields[idx], state.fields[newIdx]] = [state.fields[newIdx], state.fields[idx]];
      renderCanvas();
    }

    function openSettingsPanel(id) {
      const panel = document.getElementById('settings-panel');
      panel.classList.add('active');
      const field = state.fields.find(f => f.id === id);
      if (!field) return;
      renderSettings(field);
    }

    function switchSettingsTab(tab) {
      state.activeSettingsTab = tab;
      const field = state.fields.find(f => f.id === state.selectedFieldId);
      if (field) renderSettings(field);
    }

    function addRule() {
      if (!state.selectedFieldId) return;
      const rule = {
        id: 'rule_' + Math.random().toString(36).substr(2, 9),
        sourceFieldId: '',
        operator: 'equals',
        value: '',
        action: 'show',
        targetFieldId: state.selectedFieldId
      };
      state.conditionalRules.push(rule);
      const field = state.fields.find(f => f.id === state.selectedFieldId);
      renderSettings(field);
    }

    function removeRule(ruleId) {
      state.conditionalRules = state.conditionalRules.filter(r => r.id !== ruleId);
      const field = state.fields.find(f => f.id === state.selectedFieldId);
      renderSettings(field);
    }

    function updateRule(ruleId, prop, value) {
      const rule = state.conditionalRules.find(r => r.id === ruleId);
      if (rule) {
        rule[prop] = value;
        const field = state.fields.find(f => f.id === state.selectedFieldId);
        renderSettings(field);
      }
    }

    function closeSettingsPanel() {
      document.getElementById('settings-panel').classList.remove('active');
    }

    function renderSettings(field) {
      const body = document.getElementById('settings-body');
      
      const tabsHtml = `
        <div class="settings-tabs" style="margin: -20px -20px 20px -20px;">
          <div class="settings-tab ${state.activeSettingsTab === 'content' ? 'active' : ''}" onclick="switchSettingsTab('content')">Conteúdo</div>
          <div class="settings-tab ${state.activeSettingsTab === 'logic' ? 'active' : ''}" onclick="switchSettingsTab('logic')">Lógica</div>
        </div>
      `;

      if (state.activeSettingsTab === 'logic') {
        const fieldRules = state.conditionalRules.filter(r => r.targetFieldId === field.id);
        const sourceFields = state.fields.filter(f => f.id !== field.id);
        
        const rulesHtml = fieldRules.map(rule => {
          return `
            <div class="rule-item">
              <div class="rule-header">
                <span>Regra</span>
                <button onclick="removeRule('${rule.id}')" style="color:var(--red); font-size:10px; background:none; border:none; cursor:pointer;">Remover</button>
              </div>
              <div class="rule-edit-box">
                <label class="setting-label">Se o campo...</label>
                <select class="rule-select" onchange="updateRule('${rule.id}', 'sourceFieldId', this.value)">
                  <option value="">Selecione um campo</option>
                  ${sourceFields.map(f => `<option value="${f.id}" ${f.id === rule.sourceFieldId ? 'selected' : ''}>${f.label}</option>`).join('')}
                </select>
                
                <label class="setting-label">for...</label>
                <select class="rule-select" onchange="updateRule('${rule.id}', 'operator', this.value)">
                  <option value="equals" ${rule.operator === 'equals' ? 'selected' : ''}>Igual a</option>
                  <option value="not_equals" ${rule.operator === 'not_equals' ? 'selected' : ''}>Diferente de</option>
                  <option value="contains" ${rule.operator === 'contains' ? 'selected' : ''}>Contém</option>
                  <option value="not_empty" ${rule.operator === 'not_empty' ? 'selected' : ''}>Não está vazio</option>
                </select>
                
                ${rule.operator !== 'not_empty' ? `
                  <input type="text" class="setting-input" placeholder="Valor" value="${rule.value}" oninput="updateRule('${rule.id}', 'value', this.value)">
                ` : ''}

                <label class="setting-label">então...</label>
                <select class="rule-select" onchange="updateRule('${rule.id}', 'action', this.value)">
                  <option value="show" ${rule.action === 'show' ? 'selected' : ''}>Mostrar este campo</option>
                  <option value="hide" ${rule.action === 'hide' ? 'selected' : ''}>Esconder este campo</option>
                </select>
              </div>
            </div>
          `;
        }).join('');

        body.innerHTML = `
          ${tabsHtml}
          <div class="setting-group">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <label class="setting-label">Regras de Exibição</label>
              <button class="btn-add-option" onclick="addRule()" style="padding:0; border:none; background:none; cursor:pointer;">+ Adicionar</button>
            </div>
            ${rulesHtml || '<p style="font-size:12px; color:var(--text-muted); text-align:center; padding:20px 0;">Nenhuma regra definida.</p>'}
          </div>
        `;
        return;
      }

      const hasOptions = ['multiple_choice', 'checkboxes', 'dropdown'].includes(field.type);
      
      let optionsHtml = '';
      if (hasOptions) {
        optionsHtml = `
          <div class="setting-divider"></div>
          <div class="setting-group">
            <label class="setting-label">Opções</label>
            <div class="options-editor">
              ${(field.options || []).map((opt, i) => `
                <div class="option-edit-row">
                  <input type="text" value="${opt}" oninput="updateOption(${i}, this.value)">
                  <button onclick="removeOption(${i})" title="Remover">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
              `).join('')}
              <button class="btn-add-option" onclick="addOption()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Adicionar opção
              </button>
            </div>
          </div>
        `;
      }

      body.innerHTML = `
        ${tabsHtml}
        <div class="setting-group">
          <label class="setting-label">Título da Pergunta</label>
          <input type="text" class="setting-input" value="${field.label}" oninput="updateFieldProp('label', this.value)">
        </div>
        <div class="setting-group">
          <label class="setting-label">Texto de Apoio (Placeholder)</label>
          <input type="text" class="setting-input" value="${field.placeholder || ''}" placeholder="Opcional" oninput="updateFieldProp('placeholder', this.value)">
        </div>
        ${optionsHtml}
        <div class="setting-divider"></div>
        <div class="toggle-row">
          <span class="toggle-row-label">Obrigatório</span>
          <div class="toggle-switch ${field.required ? 'on' : ''}" onclick="toggleRequired(this)"></div>
        </div>
        <div class="setting-divider"></div>
        <div style="display:flex; gap:8px;">
          <button class="btn-icon-sm" onclick="moveField('${field.id}', -1)" title="Mover para cima" style="flex:1; justify-content:center; background: var(--bg-surface-2); border-radius: var(--radius-sm);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"></polyline></svg>
          </button>
          <button class="btn-icon-sm" onclick="moveField('${field.id}', 1)" title="Mover para baixo" style="flex:1; justify-content:center; background: var(--bg-surface-2); border-radius: var(--radius-sm);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
        </div>
      `;
    }

    function updateFieldProp(prop, value) {
      const field = state.fields.find(f => f.id === state.selectedFieldId);
      if (field) { field[prop] = value; renderCanvas(); }
    }

    function toggleRequired(el) {
      el.classList.toggle('on');
      const field = state.fields.find(f => f.id === state.selectedFieldId);
      if (field) { field.required = el.classList.contains('on'); renderCanvas(); }
    }

    function updateOption(idx, value) {
      const field = state.fields.find(f => f.id === state.selectedFieldId);
      if (field && field.options) { field.options[idx] = value; renderCanvas(); }
    }

    function removeOption(idx) {
      const field = state.fields.find(f => f.id === state.selectedFieldId);
      if (field && field.options) {
        field.options.splice(idx, 1);
        renderSettings(field);
        renderCanvas();
      }
    }

    function addOption() {
      const field = state.fields.find(f => f.id === state.selectedFieldId);
      if (field) {
        if (!field.options) field.options = [];
        field.options.push(`Opção ${field.options.length + 1}`);
        renderSettings(field);
        renderCanvas();
      }
    }

    // ==================== CANVAS RENDER ====================
    function renderCanvas() {
      const container = document.getElementById('canvas-fields');
      const placeholder = document.getElementById('canvas-placeholder');

      if (state.fields.length === 0) {
        placeholder.style.display = 'flex';
        Array.from(container.children).forEach(c => { if (c.id !== 'canvas-placeholder') c.remove(); });
        return;
      }
      placeholder.style.display = 'none';
      const toRemove = Array.from(container.children).filter(c => c.id !== 'canvas-placeholder');
      toRemove.forEach(c => c.remove());

      state.fields.forEach((field, idx) => {
        const item = document.createElement('div');
        item.className = `field-item ${field.id === state.selectedFieldId ? 'selected' : ''}`;
        item.style.animationDelay = `${idx * 0.05}s`;
        item.onclick = (e) => { e.stopPropagation(); selectField(field.id); };

        const reqSpan = field.required ? '<span class="required-dot">*</span>' : '';
        let mockHtml = '';

        switch (field.type) {
          case 'short_text':
          case 'email':
          case 'number':
          case 'phone':
            const ph = { short_text: 'Sua resposta...', email: 'exemplo@email.com', number: '0', phone: '(00) 00000-0000' };
            mockHtml = `<input class="field-mock-input" type="text" placeholder="${field.placeholder || ph[field.type]}" readonly>`;
            break;
          case 'long_text':
            mockHtml = `<textarea class="field-mock-input" rows="2" placeholder="${field.placeholder || 'Sua resposta longa...'}" readonly></textarea>`;
            break;
          case 'date':
            mockHtml = `<div class="field-mock-date"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> dd/mm/aaaa</div>`;
            break;
          case 'multiple_choice':
            mockHtml = `<div class="field-mock-options">${(field.options || []).map(o => `<div class="field-mock-option"><div class="option-circle"></div>${o}</div>`).join('')}</div>`;
            break;
          case 'checkboxes':
            mockHtml = `<div class="field-mock-options">${(field.options || []).map(o => `<div class="field-mock-option"><div class="option-square"></div>${o}</div>`).join('')}</div>`;
            break;
          case 'dropdown':
            mockHtml = `<div class="field-mock-select"><span>Selecione...</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg></div>`;
            break;
          case 'rating':
            mockHtml = `<div class="field-mock-rating">${[1,2,3,4,5].map(() => '<span class="field-mock-star">★</span>').join('')}</div>`;
            break;
          case 'scale':
            mockHtml = `<div class="field-mock-scale">${[0,1,2,3,4,5,6,7,8,9,10].map(n => `<div class="scale-num">${n}</div>`).join('')}</div>`;
            break;
          case 'file_upload':
            mockHtml = `<div class="field-mock-file"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg><span style="font-size:13px;">Arraste ou clique para enviar arquivo</span></div>`;
            break;
          default:
            mockHtml = `<div class="field-mock-input" style="color:var(--text-muted); font-style:italic;">Tipo de campo: ${field.type}</div>`;
        }

        item.innerHTML = `
          <div class="field-item-header">
            <span class="field-item-label">${field.label}${reqSpan}</span>
            <div class="field-item-drag" title="Arrastar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"></circle><circle cx="15" cy="5" r="1"></circle><circle cx="9" cy="12" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="9" cy="19" r="1"></circle><circle cx="15" cy="19" r="1"></circle></svg>
            </div>
          </div>
          ${mockHtml}
        `;
        container.appendChild(item);
      });
    }

    // ==================== SHARE ====================
    function switchShareTab(tab, el) {
      document.querySelectorAll('.share-tab').forEach(t => t.classList.remove('active'));
      el.classList.add('active');
      document.querySelectorAll('.share-content').forEach(c => c.classList.remove('active'));
      document.getElementById('share-' + tab).classList.add('active');
    }

    function openShareModal() {
      const formId = state.currentFormId || (state.forms.length > 0 ? state.forms[0].id : '');
      const link = window.location.origin + '/form/' + formId;
      const linkInput = document.getElementById('share-link-input');
      if (linkInput) linkInput.value = link;
      const embedEl = document.querySelector('.embed-code');
      if (embedEl) embedEl.value = `<iframe src="${link}" width="100%" height="600px" style="border:none; border-radius:12px; background:transparent;" allowfullscreen></iframe>`;
      document.getElementById('share-modal').classList.add('active');
      generateQR();
    }

    function copyShareLink() {
      const input = document.getElementById('share-link-input');
      navigator.clipboard?.writeText(input.value);
      showToast('Link copiado! 📋', 'success');
    }

    function copyEmbed() {
      const el = document.querySelector('.embed-code');
      navigator.clipboard?.writeText(el.value);
      showToast('Código embed copiado!', 'success');
    }

    function generateQR() {
      const grid = document.getElementById('qr-grid');
      if (!grid) return;
      const pattern = [];
      for (let i = 0; i < 49; i++) {
        const row = Math.floor(i / 7);
        const col = i % 7;
        const isCorner = (row < 3 && col < 3) || (row < 3 && col > 3) || (row > 3 && col < 3);
        const isDark = isCorner || Math.random() > 0.5;
        pattern.push(isDark);
      }
      grid.innerHTML = pattern.map(dark => `<div class="qr-cell ${dark ? 'dark' : 'light'}"></div>`).join('');
    }

    // ==================== NAVIGATION ====================
    function goToPreview() {
      hideAllViews();
      document.getElementById('view-preview').classList.add('active');
      document.getElementById('success-screen').classList.remove('active');
      document.getElementById('preview-card').style.display = 'block';
      renderPreview();
    }

    function setDevice(size, el) {
      document.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
      el.classList.add('active');
      const frame = document.getElementById('preview-frame');
      frame.className = 'preview-frame';
      if (size !== 'desktop') frame.classList.add(size);
    }

    const previewValues = {};

    function renderPreview() {
      const card = document.getElementById('preview-card');
      const title = document.getElementById('canvas-form-title')?.value || state.formTitle;
      const desc = document.getElementById('canvas-form-desc')?.value || state.formDesc;

      let fieldsHtml = state.fields.map(field => {
        const req = field.required ? '<span class="required">*</span>' : '';
        let inputHtml = '';

        const onInput = `oninput="previewValues['${field.id}'] = this.value; applyPreviewRules();"`;

        switch (field.type) {
          case 'short_text': case 'email': case 'number': case 'phone':
            const types = { short_text: 'text', email: 'email', number: 'number', phone: 'tel' };
            const phs = { short_text: 'Sua resposta...', email: 'exemplo@email.com', number: '0', phone: '(00) 00000-0000' };
            inputHtml = `<input class="preview-input" type="${types[field.type]}" placeholder="${field.placeholder || phs[field.type]}" ${onInput}>`;
            break;
          case 'long_text':
            inputHtml = `<textarea class="preview-input" placeholder="${field.placeholder || 'Sua resposta...'}" rows="3" ${onInput}></textarea>`;
            break;
          case 'date':
            inputHtml = `<input class="preview-input" type="date" ${onInput}>`;
            break;
          case 'multiple_choice':
            inputHtml = `<div class="preview-option-group">${(field.options || []).map(o => `
              <div class="preview-option" onclick="previewValues['${field.id}']='${o}'; selectPreviewOption(this); applyPreviewRules();">
                <div class="option-circle"></div>${o}
              </div>`).join('')}</div>`;
            break;
          case 'checkboxes':
            inputHtml = `<div class="preview-option-group">${(field.options || []).map(o => `
              <div class="preview-option" onclick="this.classList.toggle('selected'); updatePreviewCheck('${field.id}'); applyPreviewRules();">
                <div class="option-square"></div>${o}
              </div>`).join('')}</div>`;
            break;
          case 'dropdown':
            inputHtml = `<select class="preview-input" style="appearance: auto;" onchange="previewValues['${field.id}'] = this.value; applyPreviewRules();">
              <option value="">Selecione...</option>
              ${(field.options || []).map(o => `<option>${o}</option>`).join('')}
            </select>`;
            break;
          case 'rating':
            inputHtml = `<div style="display:flex; gap:4px;">${[1,2,3,4,5].map(n => `<span class="preview-star" onclick="previewValues['${field.id}']='${n}'; setRating(this, ${n}); applyPreviewRules();">★</span>`).join('')}</div>`;
            break;
          case 'scale':
            inputHtml = `<div class="preview-scale-group">${Array.from({length: 11}, (_, i) => `
              <button class="preview-scale-btn" onclick="previewValues['${field.id}']='${i}'; selectScale(this); applyPreviewRules();">${i}</button>`).join('')}</div>`;
            break;
          case 'file_upload':
            inputHtml = `<div class="field-mock-file" style="cursor:pointer;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg><span style="font-size:13px;">Clique para enviar arquivo</span></div>`;
            break;
        }

        return `<div class="preview-field-group" data-field-id="${field.id}"><label class="preview-label">${field.label} ${req}</label>${inputHtml}</div>`;
      }).join('');

      card.innerHTML = `
        <h1 class="preview-title">${title}</h1>
        ${desc ? `<p class="preview-desc">${desc}</p>` : ''}
        <div class="preview-fields">${fieldsHtml}</div>
        <button class="preview-submit" onclick="submitPreview()">Enviar</button>
      `;
      applyPreviewRules();
      applyDesignToPreview();
    }

    function applyPreviewRules() {
      state.fields.forEach(field => {
        const rules = state.conditionalRules.filter(r => r.targetFieldId === field.id);
        const el = document.querySelector(`[data-field-id="${field.id}"]`);
        if (!el) return;

        let shouldShow = true;
        if (rules.length > 0) {
          shouldShow = rules.some(rule => {
            const val = previewValues[rule.sourceFieldId] || '';
            const targetVal = rule.value || '';
            
            switch (rule.operator) {
              case 'equals': return String(val).toLowerCase() === String(targetVal).toLowerCase();
              case 'not_equals': return String(val).toLowerCase() !== String(targetVal).toLowerCase();
              case 'contains': return String(val).toLowerCase().includes(String(targetVal).toLowerCase());
              case 'not_empty': return String(val).trim().length > 0;
              default: return true;
            }
          });
          
          // If any show/hide action is different, we handle it
          const action = rules[0].action; // Assume same action for all rules on one field for simplicity
          if (action === 'hide') shouldShow = !shouldShow;
        }

        el.style.display = shouldShow ? 'block' : 'none';
      });
    }

    function selectPreviewOption(el) {
      el.parentElement.querySelectorAll('.preview-option').forEach(o => o.classList.remove('selected'));
      el.classList.add('selected');
    }
    function updatePreviewCheck(fieldId) {
      const container = document.querySelector(`[data-field-id="${fieldId}"]`);
      const selected = Array.from(container.querySelectorAll('.preview-option.selected')).map(o => o.textContent.trim());
      previewValues[fieldId] = selected.join(', ');
    }
    function setRating(el, val) {
      const stars = el.parentElement.querySelectorAll('.preview-star');
      stars.forEach((s, i) => { s.classList.toggle('active', i < val); });
    }
    function selectScale(el) {
      el.parentElement.querySelectorAll('.preview-scale-btn').forEach(b => b.classList.remove('selected'));
      el.classList.add('selected');
    }
    function submitPreview() {
      document.getElementById('preview-card').style.display = 'none';
      document.getElementById('success-screen').classList.add('active');
    }

    function applyDesignToPreview() {
      const d = state.formDesign;
      if (!d) return;
      const card = document.getElementById('preview-card');
      const frame = document.getElementById('preview-frame');
      if (!card || !frame) return;

      if (d.bgGradient) { frame.parentElement.style.background = d.bgGradient; } 
      else { frame.parentElement.style.background = d.bgColor; }

      card.style.background = d.cardBg;
      card.style.borderRadius = d.borderRadius + 'px';
      card.style.padding = d.cardPadding + 'px';
      card.style.border = d.cardBorder ? `1px solid ${d.inputBorder}` : 'none';
      card.style.boxShadow = d.cardShadow ? '0 20px 60px rgba(0,0,0,0.4)' : 'none';
      card.style.fontFamily = `'${d.fontFamily}', sans-serif`;

      let coverEl = card.querySelector('.preview-cover-image');
      if (d.coverImage) {
        if (!coverEl) { coverEl = document.createElement('div'); coverEl.className = 'preview-cover-image'; card.insertBefore(coverEl, card.firstChild); }
        coverEl.style.cssText = `width:100%;height:160px;border-radius:${Math.max(0, d.borderRadius-8)}px;background:url('${d.coverImage}') center/cover;margin-bottom:20px;`;
      } else if (coverEl) { coverEl.remove(); }

      let logoEl = card.querySelector('.preview-logo');
      if (d.logo) {
        if (!logoEl) { logoEl = document.createElement('img'); logoEl.className = 'preview-logo'; const title = card.querySelector('.preview-title'); if (title) card.insertBefore(logoEl, title); }
        logoEl.src = d.logo; logoEl.style.cssText = 'max-width:120px;max-height:60px;margin-bottom:16px;border-radius:8px;display:block;';
      } else if (logoEl) { logoEl.remove(); }

      const titleEl = card.querySelector('.preview-title'); if (titleEl) titleEl.style.color = d.textColor;
      const descEl = card.querySelector('.preview-desc'); if (descEl) descEl.style.color = d.labelColor;

      const fieldsContainer = card.querySelector('.preview-fields');
      if (fieldsContainer) fieldsContainer.style.gap = d.fieldSpacing + 'px';

      const inputs = card.querySelectorAll('.preview-input');
      inputs.forEach(inp => {
        inp.style.background = d.inputBg; inp.style.borderColor = d.inputBorder; inp.style.fontSize = d.fontSize + 'px';
        inp.style.color = d.textColor;
        if (d.inputStyle === 'underline') { inp.style.border = 'none'; inp.style.borderBottom = `2px solid ${d.inputBorder}`; inp.style.borderRadius = '0'; }
        else if (d.inputStyle === 'filled') { inp.style.border = 'none'; }
      });

      const options = card.querySelectorAll('.preview-option');
      options.forEach(opt => {
        opt.style.background = d.inputBg; opt.style.borderColor = d.inputBorder; opt.style.color = d.textColor; opt.style.fontSize = d.fontSize + 'px';
      });

      const labels = card.querySelectorAll('.preview-label');
      labels.forEach(l => { l.style.color = d.textColor; l.style.fontSize = d.fontSize + 'px'; });

      const btn = card.querySelector('.preview-submit');
      if (btn) {
        btn.style.borderRadius = (d.buttonRadius || 10) + 'px';
        btn.style.fontFamily = `'${d.fontFamily}', sans-serif`;
        const adjustColor = (hex, amount) => {
          if (!hex || !hex.startsWith('#')) return '#ffffff';
          hex = hex.replace('#', '');
          const r = Math.max(0, Math.min(255, parseInt(hex.substring(0,2),16) + amount));
          const g = Math.max(0, Math.min(255, parseInt(hex.substring(2,4),16) + amount));
          const b = Math.max(0, Math.min(255, parseInt(hex.substring(4,6),16) + amount));
          return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
        };
        const color = d.primaryColor || '#7c3aed';
        
        btn.style.background = ''; btn.style.border = 'none'; btn.style.boxShadow = 'none'; btn.style.color = 'white';
        
        if (d.buttonStyle === 'filled') {
          btn.style.background = color;
          btn.style.boxShadow = `0 4px 16px ${color}40`;
        } else if (d.buttonStyle === 'outline') {
          btn.style.background = 'transparent';
          btn.style.border = `2px solid ${color}`;
          btn.style.color = color;
        } else if (d.buttonStyle === 'gradient') {
          btn.style.background = `linear-gradient(135deg, ${color}, ${adjustColor(color, -30)})`;
          btn.style.boxShadow = `0 4px 16px ${color}40`;
        } else if (d.buttonStyle === 'pill') {
          btn.style.borderRadius = '50px';
          btn.style.background = color;
          btn.style.boxShadow = `0 4px 16px ${color}40`;
        } else {
          btn.style.background = color;
        }
      }
    }


    // ==================== RESPONSES ====================
    let currentResponseFormId = null;

    async function viewResponses(formId) {
      if (!formId && state.forms.length > 0) formId = state.forms[0].id;
      if (!formId) { showToast('Nenhum formulário para mostrar respostas.', 'info'); return; }

      // Standardize formId to string for comparison if needed
      const form = state.forms.find(f => String(f.id) === String(formId));
      if (!form) return;
      
      currentResponseFormId = formId;
      hideAllViews();
      document.getElementById('view-responses').classList.add('active');
      
      // Update selector
      const select = document.getElementById('responses-form-select');
      select.innerHTML = state.forms.map(f => `<option value="${f.id}" ${String(f.id) === String(formId) ? 'selected' : ''}>${f.title}</option>`).join('');
      
      const body = document.getElementById('responses-body');
      
      // Fetch fresh responses if connected to server
      let responses = [];
      try {
        const res = await fetch(`/api/responses?form_id=${formId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('formei_token')}` }
        });
        const data = await res.json();
        responses = data.responses || [];
        state.responses[formId] = responses;
      } catch (err) {
        responses = state.responses[formId] || [];
      }

      const rate = form.views > 0 ? Math.round((responses.length / form.views) * 100) : 0;

      if (responses.length === 0) {
        body.innerHTML = `
          <div class="responses-stats">
            <div class="response-stat-card"><div class="response-stat-value">0</div><div class="response-stat-label">Respostas</div></div>
            <div class="response-stat-card"><div class="response-stat-value">${form.views}</div><div class="response-stat-label">Visualizações</div></div>
            <div class="response-stat-card"><div class="response-stat-value">0%</div><div class="response-stat-label">Taxa de conversão</div></div>
            <div class="response-stat-card"><div class="response-stat-value">—</div><div class="response-stat-label">Tempo médio</div></div>
          </div>
          <div class="responses-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <h3>Nenhuma resposta ainda</h3>
            <p>Compartilhe seu formulário para começar a receber respostas.</p>
          </div>
        `;
        return;
      }

      // Dynamic table headers based on form fields
      const fields = form.fields || [];
      const tableHeaders = fields.slice(0, 5).map(f => `<th>${(f.label || 'Campo').slice(0, 25)}${f.label && f.label.length > 25 ? '...' : ''}</th>`).join('');
      
      const tableRows = responses.map(r => {
        const d = r.data || {};
        const cells = fields.slice(0, 5).map(f => {
          let val = d[f.id] || '—';
          if (Array.isArray(val)) val = val.join(', ');
          return `<td>${String(val).slice(0, 40)}${String(val).length > 40 ? '...' : ''}</td>`;
        }).join('');
        const date = new Date(r.submitted_at || r.submittedAt).toLocaleString('pt-BR');
        return `<tr>${cells}<td style="color:var(--text-muted)">${date}</td></tr>`;
      }).join('');

      body.innerHTML = `
        <div class="responses-stats">
          <div class="response-stat-card"><div class="response-stat-value" style="color: var(--accent-light)">${responses.length}</div><div class="response-stat-label">Respostas</div></div>
          <div class="response-stat-card"><div class="response-stat-value">${form.views}</div><div class="response-stat-label">Visualizações</div></div>
          <div class="response-stat-card"><div class="response-stat-value">${rate}%</div><div class="response-stat-label">Taxa de conversão</div></div>
          <div class="response-stat-card"><div class="response-stat-value">1m 24s</div><div class="response-stat-label">Tempo médio</div></div>
        </div>
        <div class="responses-table-container">
          <table class="responses-table">
            <thead>
              <tr>${tableHeaders}<th>Data</th></tr>
            </thead>
            <tbody>${tableRows}</tbody>
          </table>
        </div>
      `;
    }

    // ==================== SHARE ====================
    function switchShareTab(tab, el) {
      document.querySelectorAll('.share-tab').forEach(t => t.classList.remove('active'));
      el.classList.add('active');
      document.querySelectorAll('.share-content').forEach(c => c.classList.remove('active'));
      document.getElementById('share-' + tab).classList.add('active');
    }

    function openShareModal() {
      const formId = state.currentFormId || (state.forms.length > 0 ? state.forms[0].id : '');
      const link = window.location.origin + '/form/' + formId;
      const linkInput = document.getElementById('share-link-input');
      if (linkInput) linkInput.value = link;
      const embedEl = document.querySelector('.embed-code');
      if (embedEl) embedEl.value = `<iframe src="${link}" width="100%" height="600px" style="border:none; border-radius:12px; background:transparent;" allowfullscreen></iframe>`;
      document.getElementById('share-modal').classList.add('active');
      generateQR();
    }

    function copyShareLink() {
      const input = document.getElementById('share-link-input');
      navigator.clipboard?.writeText(input.value);
      showToast('Link copiado! 📋', 'success');
    }

    function copyEmbed() {
      const el = document.querySelector('.embed-code');
      navigator.clipboard?.writeText(el.value);
      showToast('Código embed copiado!', 'success');
    }

    function generateQR() {
      const grid = document.getElementById('qr-grid');
      if (!grid) return;
      const pattern = [];
      for (let i = 0; i < 49; i++) {
        const row = Math.floor(i / 7);
        const col = i % 7;
        const isCorner = (row < 3 && col < 3) || (row < 3 && col > 3) || (row > 3 && col < 3);
        const isDark = isCorner || Math.random() > 0.5;
        pattern.push(isDark);
      }
      grid.innerHTML = pattern.map(dark => `<div class="qr-cell ${dark ? 'dark' : 'light'}"></div>`).join('');
    }

    // ==================== DUPLICATE FORM ====================
    async function duplicateForm(formId, e) {
      if (e) e.stopPropagation();
      try {
        await apiCall(`/api/forms/${formId}/duplicate`, { method: 'POST' });
        showToast('Formulário duplicado! 📋', 'success');
        await loadFormsFromAPI();
      } catch (err) {
        showToast('Erro ao duplicar: ' + err.message, 'error');
      }
    }

    // ==================== CSV EXPORT ====================
    function exportCSV(formId) {
      const token = getToken();
      const a = document.createElement('a');
      a.href = `/api/forms/${formId}/export/csv?token=${token}`;
      a.download = 'respostas.csv';
      // Use fetch with auth header
      fetch(`/api/forms/${formId}/export/csv`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(r => r.blob()).then(blob => {
        const url = URL.createObjectURL(blob);
        a.href = url;
        a.click();
        URL.revokeObjectURL(url);
      }).catch(() => showToast('Erro ao exportar CSV', 'error'));
    }

    // ==================== NOTIFICATIONS ====================
    async function loadNotifications() {
      try {
        const data = await apiCall('/api/notifications');
        state.notifications = data.notifications || [];
        state.unreadCount = data.unreadCount || 0;
        updateNotifBadge();
      } catch {}
    }

    function updateNotifBadge() {
      const badge = document.getElementById('notif-badge');
      if (badge) {
        badge.textContent = state.unreadCount;
        badge.style.display = state.unreadCount > 0 ? 'flex' : 'none';
      }
    }

    function toggleNotifPanel() {
      const panel = document.getElementById('notif-panel');
      if (!panel) return;
      const isVisible = panel.style.display === 'block';
      panel.style.display = isVisible ? 'none' : 'block';
      if (!isVisible) renderNotifications();
    }

    function renderNotifications() {
      const list = document.getElementById('notif-list');
      if (!list) return;
      if (state.notifications.length === 0) {
        list.innerHTML = '<div style="text-align:center;padding:32px;color:var(--text-muted);font-size:13px;">Nenhuma notificação</div>';
        return;
      }
      list.innerHTML = state.notifications.slice(0, 20).map(n => `
        <div style="padding:12px 16px;border-bottom:1px solid var(--border-color);cursor:pointer;opacity:${n.read?'0.6':'1'}" 
             onclick="markNotifRead(${n.id}); viewResponses(${n.form_id})">
          <div style="font-size:13px;font-weight:${n.read?'400':'600'}">${n.message}</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:4px">${new Date(n.created_at).toLocaleString('pt-BR')}</div>
        </div>
      `).join('');
    }

    async function markNotifRead(id) {
      try {
        await apiCall(`/api/notifications/${id}/read`, { method: 'PUT' });
        await loadNotifications();
      } catch {}
    }

    async function markAllNotifsRead() {
      try {
        await apiCall('/api/notifications/read-all', { method: 'PUT' });
        state.unreadCount = 0;
        updateNotifBadge();
        renderNotifications();
        showToast('Todas marcadas como lidas', 'success');
      } catch {}
    }

    // ==================== USER SETTINGS ====================
    function openSettings() {
      const user = getUser();
      if (!user) return;
      document.getElementById('settings-name').value = user.name || '';
      document.getElementById('settings-email').value = user.email || '';
      document.getElementById('modal-settings').classList.add('active');
    }

    async function saveSettings() {
      const name = document.getElementById('settings-name').value;
      const email = document.getElementById('settings-email').value;
      try {
        const data = await apiCall('/api/auth/me', {
          method: 'PUT',
          body: JSON.stringify({ name, email })
        });
        setUser(data.user);
        updateUserUI(data.user);
        showToast('Perfil atualizado! ✅', 'success');
        closeModal('modal-settings');
      } catch (err) {
        showToast('Erro: ' + err.message, 'error');
      }
    }

    async function changePassword() {
      const current = document.getElementById('settings-current-pw').value;
      const newPw = document.getElementById('settings-new-pw').value;
      if (!current || !newPw) { showToast('Preencha ambas as senhas', 'error'); return; }
      try {
        await apiCall('/api/auth/password', {
          method: 'PUT',
          body: JSON.stringify({ currentPassword: current, newPassword: newPw })
        });
        showToast('Senha alterada com sucesso! 🔒', 'success');
        document.getElementById('settings-current-pw').value = '';
        document.getElementById('settings-new-pw').value = '';
      } catch (err) {
        showToast('Erro: ' + err.message, 'error');
      }
    }

    async function deleteAccount() {
      if (!confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível.')) return;
      if (!confirm('ÚLTIMA CHANCE: Todos os seus formulários e respostas serão apagados permanentemente.')) return;
      try {
        await apiCall('/api/auth/me', { method: 'DELETE' });
        clearToken();
        location.reload();
      } catch (err) {
        showToast('Erro: ' + err.message, 'error');
      }
    }

    // ==================== PLANS ====================
    function openPlans() {
      document.getElementById('modal-plans').classList.add('active');
    }

    async function upgradePlan(plan) {
      try {
        const data = await apiCall('/api/plans/upgrade', {
          method: 'POST',
          body: JSON.stringify({ plan })
        });
        setUser(data.user);
        updateUserUI(data.user);
        showToast(`Upgrade para ${plan === 'pro' ? 'Pro' : 'Business'} realizado! 🚀`, 'success');
        closeModal('modal-plans');
      } catch (err) {
        showToast('Erro: ' + err.message, 'error');
      }
    }

    // ==================== FORGOT PASSWORD ====================
    function showForgotPassword() {
      document.getElementById('auth-login').classList.remove('active');
      document.getElementById('auth-forgot').classList.add('active');
    }

    async function handleForgotPassword(e) {
      e.preventDefault();
      const email = document.getElementById('forgot-email').value;
      const btn = document.getElementById('forgot-btn');
      btn.disabled = true;
      btn.textContent = 'Enviando...';
      try {
        const data = await apiCall('/api/auth/forgot-password', {
          method: 'POST',
          body: JSON.stringify({ email })
        });
        if (data._devToken) {
          // For demo, show the token and allow reset
          document.getElementById('forgot-form-section').style.display = 'none';
          document.getElementById('reset-form-section').style.display = 'block';
          document.getElementById('reset-token').value = data._devToken;
        }
        showToast('Verifique seu email para o link de recuperação', 'success');
      } catch (err) {
        showToast('Erro: ' + err.message, 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Enviar link de recuperação';
      }
    }

    async function handleResetPassword(e) {
      e.preventDefault();
      const token = document.getElementById('reset-token').value;
      const newPw = document.getElementById('reset-new-pw').value;
      try {
        await apiCall('/api/auth/reset-password', {
          method: 'POST',
          body: JSON.stringify({ token, newPassword: newPw })
        });
        showToast('Senha redefinida com sucesso! Faça login.', 'success');
        showLogin();
      } catch (err) {
        showToast('Erro: ' + err.message, 'error');
      }
    }

    // ==================== DRAG & DROP ====================
    let draggedFieldId = null;

    function handleDragStart(e, fieldId) {
      draggedFieldId = fieldId;
      e.target.style.opacity = '0.4';
      e.dataTransfer.effectAllowed = 'move';
    }

    function handleDragOver(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      e.currentTarget.style.borderTop = '2px solid var(--accent)';
    }

    function handleDragLeave(e) {
      e.currentTarget.style.borderTop = 'none';
    }

    function handleDrop(e, targetFieldId) {
      e.preventDefault();
      e.currentTarget.style.borderTop = 'none';
      if (!draggedFieldId || draggedFieldId === targetFieldId) return;

      const fromIdx = state.fields.findIndex(f => f.id === draggedFieldId);
      const toIdx = state.fields.findIndex(f => f.id === targetFieldId);
      if (fromIdx === -1 || toIdx === -1) return;

      const [moved] = state.fields.splice(fromIdx, 1);
      state.fields.splice(toIdx, 0, moved);
      renderCanvas();
    }

    function handleDragEnd(e) {
      e.target.style.opacity = '1';
      draggedFieldId = null;
    }

    // ==================== WEBHOOK CONFIG ====================
    function openWebhookConfig() {
      document.getElementById('webhook-url-input').value = state.webhookUrl || '';
      document.getElementById('modal-webhook').classList.add('active');
    }

    async function saveWebhook() {
      const url = document.getElementById('webhook-url-input').value;
      state.webhookUrl = url;
      if (state.currentFormId) {
        try {
          await apiCall(`/api/forms/${state.currentFormId}`, {
            method: 'PUT',
            body: JSON.stringify({ webhook_url: url })
          });
          showToast('Webhook salvo! 🔗', 'success');
        } catch (err) {
          showToast('Erro: ' + err.message, 'error');
        }
      }
      closeModal('modal-webhook');
    }

    // ==================== DASHBOARD ====================
    function setViewMode(mode) {
      state.viewMode = mode;
      document.getElementById('grid-view-btn').classList.toggle('active', mode === 'grid');
      document.getElementById('list-view-btn').classList.toggle('active', mode === 'list');
      renderDashboard();
    }

    function filterForms() {
      renderDashboard();
    }

    function editForm(formId) {
      const form = state.forms.find(f => f.id === formId);
      if (!form) return;
      
      state.currentFormId = form.id;
      state.fields = JSON.parse(JSON.stringify(form.fields));
      state.formTitle = form.title;
      state.formDesc = form.desc || '';
      state.selectedFieldId = null;
      
      document.getElementById('builder-form-title').value = form.title;
      document.getElementById('canvas-form-title').value = form.title;
      document.getElementById('canvas-form-desc').value = form.desc || '';
      
      hideAllViews();
      document.getElementById('view-builder').classList.add('active');
      closeSettingsPanel();
      renderCanvas();
    }

    function deleteForm(formId, e) {
      e.stopPropagation();
      state.forms = state.forms.filter(f => f.id !== formId);
      delete state.responses[formId];
      renderDashboard();
      showToast('Formulário removido', 'success');
    }

    function renderDashboard() {
      const gridContainer = document.getElementById('forms-grid-container');
      const listContainer = document.getElementById('forms-list-container');
      const empty = document.getElementById('empty-state');
      const statsRow = document.getElementById('stats-row');
      
      const searchQuery = document.getElementById('search-input')?.value?.toLowerCase() || '';
      const filteredForms = state.forms.filter(f => f.title.toLowerCase().includes(searchQuery));

      // Update stats
      const totalResponses = state.forms.reduce((sum, f) => sum + (state.responses[f.id]?.length || 0), 0);
      const totalViews = state.forms.reduce((sum, f) => sum + (f.views || 0), 0);
      const avgRate = totalViews > 0 ? Math.round((totalResponses / totalViews) * 100) : 0;
      document.getElementById('stat-forms').textContent = state.forms.length;
      document.getElementById('stat-responses').textContent = totalResponses;
      document.getElementById('stat-views').textContent = totalViews;
      document.getElementById('stat-rate').textContent = avgRate + '%';

      if (filteredForms.length === 0) {
        gridContainer.style.display = 'none';
        listContainer.style.display = 'none';
        empty.style.display = searchQuery ? 'none' : 'flex';
        statsRow.style.display = state.forms.length > 0 ? 'flex' : 'none';
        if (searchQuery) {
          gridContainer.style.display = 'none';
          empty.style.display = 'flex';
          empty.querySelector('.empty-text').textContent = 'Nenhum formulário encontrado';
          empty.querySelector('.empty-subtext').textContent = 'Tente uma busca diferente.';
        }
        return;
      }

      statsRow.style.display = 'flex';
      empty.style.display = 'none';

      if (state.viewMode === 'grid') {
        gridContainer.style.display = 'grid';
        listContainer.style.display = 'none';
        gridContainer.innerHTML = filteredForms.map((form, i) => `
          <div class="db-form-card" style="animation-delay: ${i * 0.05}s" onclick="editForm('${form.id}')">
            <div class="db-card-top">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </div>
            <div class="db-card-body">
              <div class="db-card-title">${form.title}</div>
            </div>
            <div class="db-card-footer">
              <div class="db-card-responses">Respostas: <b>${state.responses[form.id]?.length || 0}</b></div>
              <button class="db-card-menu-btn" onclick="event.stopPropagation(); deleteForm('${form.id}', event)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
              </button>
            </div>
          </div>
        `).join('');
      }
    }

    // ==================== SYNC TITLE INPUTS ====================
    document.getElementById('builder-form-title').addEventListener('input', (e) => {
      document.getElementById('canvas-form-title').value = e.target.value;
      state.formTitle = e.target.value;
      updateBreadcrumb(e.target.value);
    });
    document.getElementById('canvas-form-title').addEventListener('input', (e) => {
      document.getElementById('builder-form-title').value = e.target.value;
      state.formTitle = e.target.value;
      updateBreadcrumb(e.target.value);
    });
    document.getElementById('canvas-form-desc').addEventListener('input', (e) => {
      state.formDesc = e.target.value;
    });

    // ==================== SUPABASE CONFIG ====================
    const SUPABASE_URL = 'https://rjjsjxzoyxerztxxovjp.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_LtLhUq0cZNG-N49NXpUj2g_Lw9dPQo-';
    let supabaseClient = null;
    try {
      if (!window.supabase) {
        alert("CRITICAL ERROR: Supabase SDK didn't load from CDN. Check your internet connection or adblockers.");
        console.error("Supabase SDK not found.");
      } else {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      }
    } catch (err) {
      console.error("Error creating Supabase client:", err);
      alert("Erro fatal ao inicializar o Supabase: " + err.message);
    }

    // ==================== AUTH HELPERS ====================
    function getUser() { try { return JSON.parse(localStorage.getItem('formei_user')); } catch { return null; } }
    function setUser(user) { localStorage.setItem('formei_user', JSON.stringify(user)); }
    function clearUser() { localStorage.removeItem('formei_user'); }

    function showLogin() {
      document.getElementById('auth-login').classList.add('active');
      document.getElementById('auth-register').classList.remove('active');
      document.getElementById('auth-forgot').classList.remove('active');
      document.getElementById('login-error').classList.remove('visible');
    }

    function showRegister() {
      document.getElementById('auth-login').classList.remove('active');
      document.getElementById('auth-register').classList.add('active');
      document.getElementById('register-error').classList.remove('visible');
    }

    function togglePasswordVisibility(inputId, btn) {
      const input = document.getElementById(inputId);
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.innerHTML = isPassword
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    }

    // ==================== LOGIN ====================
    async function handleLogin(e) {
      e.preventDefault();
      const btn = document.getElementById('login-btn');
      const errEl = document.getElementById('login-error');
      const errText = document.getElementById('login-error-text');
      errEl.classList.remove('visible');

      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      btn.disabled = true;
      btn.innerHTML = '<div class="spinner"></div> Entrando...';

      try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Load profile with fallback
        let profile = null;
        try {
          const { data: p } = await supabaseClient.from('profiles').select('*').eq('id', data.user.id).single();
          profile = p;
        } catch (e) {
          console.warn('Profile not found', e);
        }
        const user = { id: data.user.id, email: data.user.email, name: profile?.name || data.user.user_metadata?.name || '', avatar_color: profile?.avatar_color || '#7c3aed', plan: profile?.plan || 'free' };
        setUser(user);
        enterApp(user);
      } catch (err) {
        errText.textContent = err.message === 'Invalid login credentials' ? 'Email ou senha incorretos' : err.message;
        errEl.classList.add('visible');
      } finally {
        btn.disabled = false;
        btn.innerHTML = 'Entrar';
      }
    }

    // ==================== REGISTER ====================
    async function handleRegister(e) {
      e.preventDefault();
      const btn = document.getElementById('register-btn');
      const errEl = document.getElementById('register-error');
      const errText = document.getElementById('register-error-text');
      errEl.classList.remove('visible');

      const name = document.getElementById('register-name').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;

      btn.disabled = true;
      btn.innerHTML = '<div class="spinner"></div> Criando conta...';

      try {
        const { data, error } = await supabaseClient.auth.signUp({
          email, password,
          options: { data: { name } }
        });
        if (error) throw error;

        // If email confirmation is required, session will be null
        if (!data.session) {
          btn.innerHTML = 'Criar minha conta';
          btn.disabled = false;
          showToast('Conta criada! Por favor, verifique seu e-mail para confirmar seu cadastro.', 'info');
          showLogin();
          return;
        }

        // Profile created automatically via trigger
        const user = { id: data.user.id, email, name, avatar_color: '#7c3aed', plan: 'free' };
        setUser(user);
        showToast(`Bem-vindo, ${name}! 🎉`, 'success');
        enterApp(user);
      } catch (err) {
        errText.textContent = err.message || 'Erro ao criar conta';
        errEl.classList.add('visible');
      } finally {
        if (btn.disabled) {
          btn.disabled = false;
          btn.innerHTML = 'Criar minha conta';
        }
      }
    }

    // ==================== ENTER APP ====================
    function enterApp(user) {
      document.getElementById('auth-login').classList.remove('active');
      document.getElementById('auth-register').classList.remove('active');
      document.getElementById('auth-forgot').classList.remove('active');
      document.getElementById('promo-banner').style.display = 'flex';
      document.getElementById('app-container').style.display = 'flex';
      updateUserUI(user);
      loadFormsFromAPI();
      loadNotifications();
    }

    function updateUserUI(user) {
      const avatarEl = document.querySelector('.user-avatar');
      const nameEl = document.querySelector('.user-name');
      const planEl = document.querySelector('.user-plan');
      if (avatarEl) {
        avatarEl.textContent = user.name?.charAt(0)?.toUpperCase() || 'U';
        avatarEl.style.background = `linear-gradient(135deg, ${user.avatar_color || 'var(--accent)'}, var(--pink))`;
      }
      if (nameEl) nameEl.textContent = user.name || 'Usuário';
      if (planEl) planEl.textContent = user.plan === 'free' ? 'Plano Free' : user.plan === 'pro' ? 'Plano Pro' : 'Plano Business';
    }

    async function logout() {
      await supabaseClient.auth.signOut();
      clearUser();
      state.forms = [];
      state.responses = {};
      document.getElementById('promo-banner').style.display = 'none';
      document.getElementById('app-container').style.display = 'none';
      showLogin();
      showToast('Você saiu da conta.', 'info');
    }

    // ==================== LOAD FORMS (Supabase) ====================
    async function loadFormsFromAPI() {
      try {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) return;

        const { data: forms, error } = await supabaseClient
          .from('forms')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });
        if (error) throw error;

        state.forms = (forms || []).map(f => ({
          id: f.id,
          title: f.title,
          desc: f.description,
          emoji: f.emoji,
          fields: f.fields || [],
          status: f.status,
          views: f.views || 0,
          responseCount: 0,
          createdAt: new Date(f.created_at).toLocaleDateString('pt-BR'),
          updatedAt: new Date(f.updated_at).toLocaleDateString('pt-BR'),
          _dbId: f.id
        }));

        // Load response counts
        state.responses = {};
        for (const form of state.forms) {
          const { data: responses } = await supabaseClient
          .from('responses')
            .select('*')
            .eq('form_id', form.id)
            .order('submitted_at', { ascending: false });
          state.responses[form.id] = responses || [];
          form.responseCount = state.responses[form.id].length;
        }

        // Update stats safely
        const totalForms = state.forms.length;
        const totalResponses = Object.values(state.responses).reduce((sum, r) => sum + r.length, 0);
        
        const sf = document.getElementById('stat-forms');
        if (sf) sf.textContent = totalForms;
        const sr = document.getElementById('stat-responses');
        if (sr) sr.textContent = totalResponses;
        const sv = document.getElementById('stat-views');
        if (sv) sv.textContent = state.forms.reduce((sum, f) => sum + (f.views || 0), 0);
        
        const badge = document.getElementById('nav-forms-count');
        if (badge) badge.textContent = `(${totalForms})`;

        renderDashboard();

        // Populate responses seletor
        const select = document.getElementById('responses-form-select');
        if (select) {
          select.innerHTML = state.forms.map(f => `<option value="${f.id}">${f.title}</option>`).join('');
        }
      } catch (err) {
        console.error('Error loading forms:', err);
        showToast('Erro ao carregar formulários', 'error');
      }
    }

    // ==================== PUBLISH FORM (Supabase) ====================
    publishForm = async function() {
      if (!supabaseClient) return showToast('Supabase não configurado!', 'error');
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) return;

      const title = document.getElementById('builder-form-title').value || 'Formulário sem título';
      const desc = document.getElementById('canvas-form-desc').value || '';
      const emojis = ['📋', '📝', '📊', '📎', '📌', '✏️', '📑', '🗒️'];
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];

      try {
        if (state.currentFormId && typeof state.currentFormId === 'number') {
          const { error } = await supabaseClient
            .from('forms')
            .update({ 
              title, 
              description: desc, 
              fields: state.fields, 
              conditional_rules: state.conditionalRules,
              theme_color: JSON.stringify(state.formDesign),
              status: 'published', 
              updated_at: new Date().toISOString() 
            })
            .eq('id', state.currentFormId)
            .eq('user_id', user.id);
          if (error) throw error;
        } else {
          const { data, error } = await supabaseClient
            .from('forms')
            .insert({ 
              user_id: user.id, 
              title, 
              description: desc, 
              emoji, 
              fields: state.fields, 
              conditional_rules: state.conditionalRules,
              theme_color: JSON.stringify(state.formDesign),
              status: 'published' 
            })
            .select()
            .single();
          if (error) throw error;
          state.currentFormId = data.id;
        }
        showToast('Formulário publicado com sucesso! 🎉', 'success');
        state.currentFormId = null;
        await loadFormsFromAPI();
        goToDashboard();
      } catch (err) {
        showToast('Erro ao publicar: ' + err.message, 'error');
      }
    };

    // ==================== DELETE FORM (Supabase) ====================
    const _origDeleteForm = deleteForm;
    deleteForm = async function(formId, e) {
      if (e) e.stopPropagation();
      try {
        const { error } = await supabaseClient.from('forms').delete().eq('id', formId);
        if (error) throw error;
        showToast('Formulário removido', 'success');
        await loadFormsFromAPI();
      } catch (err) {
        showToast('Erro ao remover: ' + err.message, 'error');
      }
    };

    // ==================== EDIT FORM (Supabase) ====================
    const _origEditForm = editForm;
    editForm = async function(formId) {
      if (!formId) return showToast('ID do formulário inválido', 'error');
      try {
        const { data, error } = await supabaseClient.from('forms').select('*').eq('id', Number(formId));
        if (error) throw error;

        if (!data || data.length === 0) {
          showToast('Formulário não encontrado ou você não tem permissão para editá-lo.', 'error');
          return;
        }
        const form = data[0];

        state.currentFormId = form.id;
        state.fields = form.fields || [];
        state.conditionalRules = form.conditional_rules || [];
        
        // Load design settings
        try {
          if (form.theme_color && form.theme_color.startsWith('{')) {
            state.formDesign = { ...state.formDesign, ...JSON.parse(form.theme_color) };
          }
        } catch(e) { console.warn('Could not parse design:', e); }
        
        state.formTitle = form.title;
        state.formDesc = form.description || '';
        state.selectedFieldId = null;

        document.getElementById('builder-form-title').value = form.title;
        document.getElementById('canvas-form-title').value = form.title;
        document.getElementById('canvas-form-desc').value = form.description || '';
        updateBreadcrumb(form.title);

        hideAllViews();
        document.getElementById('view-builder').classList.add('active');
        closeSettingsPanel();
        renderCanvas();
        applyDesignToCanvas();
      } catch (err) {
        showToast('Erro ao abrir formulário: ' + err.message, 'error');
      }
    };

    // ==================== VIEW RESPONSES (Supabase) ====================
    const _origViewResponses = viewResponses;
    viewResponses = async function(formId) {
      if (!formId) return showToast('ID do formulário inválido', 'error');
      try {
        const { data, error } = await supabaseClient.from('forms').select('*').eq('id', Number(formId));
        if (error || !data || data.length === 0) {
          showToast('Não foi possível carregar os dados do formulário.', 'error');
          return;
        }
        const form = data[0];
        const { data: responses } = await supabaseClient.from('responses').select('*').eq('form_id', formId).order('submitted_at', { ascending: false });

        hideAllViews();
        document.getElementById('view-responses').classList.add('active');
        
        // Update selector value
        const select = document.getElementById('responses-form-select');
        if (select) select.value = formId;

        const body = document.getElementById('responses-body');
        const rate = form.views > 0 ? Math.round(((responses||[]).length / form.views) * 100) : 0;

        if (!responses || responses.length === 0) {
          body.innerHTML = `
            <div class="responses-stats">
              <div class="response-stat-card"><div class="response-stat-value">0</div><div class="response-stat-label">Respostas</div></div>
              <div class="response-stat-card"><div class="response-stat-value">${form.views||0}</div><div class="response-stat-label">Visualizações</div></div>
              <div class="response-stat-card"><div class="response-stat-value">0%</div><div class="response-stat-label">Taxa de conversão</div></div>
              <div class="response-stat-card"><div class="response-stat-value">—</div><div class="response-stat-label">Tempo médio</div></div>
            </div>
            <div class="responses-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <h3>Nenhuma resposta ainda</h3>
              <p>Compartilhe seu formulário para começar a receber respostas.</p>
            </div>`;
          return;
        }

        const fields = form.fields || [];
        const tableHeaders = fields.slice(0, 5).map(f => `<th>${(f.label || '').slice(0, 25)}</th>`).join('');
        const tableRows = responses.map(r => {
          const d = r.data || {};
          const cells = fields.slice(0, 5).map(f => {
            const val = d[f.id] || '—';
            return `<td>${String(val).slice(0, 40)}</td>`;
          }).join('');
          return `<tr>${cells}<td style="color:var(--text-muted)">${new Date(r.submitted_at).toLocaleDateString('pt-BR')}</td></tr>`;
        }).join('');

        body.innerHTML = `
          <div class="responses-stats">
            <div class="response-stat-card"><div class="response-stat-value" style="color: var(--accent-light)">${responses.length}</div><div class="response-stat-label">Respostas</div></div>
            <div class="response-stat-card"><div class="response-stat-value">${form.views||0}</div><div class="response-stat-label">Visualizações</div></div>
            <div class="response-stat-card"><div class="response-stat-value">${rate}%</div><div class="response-stat-label">Taxa de conversão</div></div>
            <div class="response-stat-card"><div class="response-stat-value">2m 30s</div><div class="response-stat-label">Tempo médio</div></div>
          </div>
          <div style="margin-bottom:16px;text-align:right">
            <button onclick="exportCSV(${formId})" style="background:var(--green);color:white;padding:10px 20px;border-radius:var(--radius-md);font-weight:600;font-size:13px;cursor:pointer;border:none;font-family:inherit;display:inline-flex;align-items:center;gap:8px">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Exportar CSV
            </button>
          </div>
          <div class="responses-table-container">
            <table class="responses-table">
              <thead><tr>${tableHeaders}<th>Data</th></tr></thead>
              <tbody>${tableRows}</tbody>
            </table>
          </div>`;
      } catch (err) {
        showToast('Erro ao carregar respostas: ' + err.message, 'error');
      }
    };

    // ==================== DUPLICATE FORM (Supabase) ====================
    duplicateForm = async function(formId, e) {
      if (e) e.stopPropagation();
      if (typeof supabaseClient === 'undefined') return showToast('Supabase não configurado!', 'error');
      
      try {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) return;

        const { data: original, error: fetchErr } = await supabaseClient
          .from('forms')
          .select('*')
          .eq('id', formId)
          .single();
        if (fetchErr) throw fetchErr;

        const { error } = await supabaseClient.from('forms').insert({
          user_id: user.id,
          title: original.title + ' (Cópia)',
          description: original.description,
          emoji: original.emoji,
          fields: original.fields,
          status: 'draft',
          theme_color: original.theme_color,
          webhook_url: original.webhook_url || '',
          conditional_rules: original.conditional_rules || []
        });
        if (error) throw error;
        showToast('Formulário duplicado! 📋', 'success');
        await loadFormsFromAPI();
      } catch (err) {
        showToast('Erro ao duplicar: ' + err.message, 'error');
      }
    };

    // ==================== CSV EXPORT (Client-side) ====================
    exportCSV = async function(formId) {
      if (!formId) return showToast('ID do formulário inválido', 'error');
      try {
        const { data: forms } = await supabaseClient.from('forms').select('*').eq('id', Number(formId));
        if (!forms || forms.length === 0) throw new Error('Formulário não encontrado');
        const form = forms[0];
        const { data: responses } = await supabaseClient.from('responses').select('*').eq('form_id', formId).order('submitted_at', { ascending: false });
        const fields = form.fields || [];
        const headers = fields.map(f => `"${(f.label || '').replace(/"/g, '""')}"`).concat(['"Data"']);
        const rows = (responses || []).map(r => {
          const d = r.data || {};
          const cells = fields.map(f => {
            let val = d[f.id] || '';
            if (Array.isArray(val)) val = val.join('; ');
            return `"${String(val).replace(/"/g, '""')}"`;
          });
          cells.push(`"${new Date(r.submitted_at).toLocaleString('pt-BR')}"`);
          return cells.join(',');
        });
        const csv = '\uFEFF' + headers.join(',') + '\n' + rows.join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${form.title.replace(/[^a-zA-Z0-9]/g, '_')}_respostas.csv`;
        a.click();
        URL.revokeObjectURL(url);
      } catch (err) {
        showToast('Erro ao exportar CSV', 'error');
      }
    };

    // ==================== SETTINGS (Supabase) ====================
    saveSettings = async function() {
      const name = document.getElementById('settings-name').value;
      const email = document.getElementById('settings-email').value;
      try {
        const { data: { user } } = await supabaseClient.auth.getUser();
        // Update profile
        const { error } = await supabaseClient.from('profiles').update({ name }).eq('id', user.id);
        if (error) throw error;
        // Update email if changed
        if (email !== user.email) {
          const { error: emailErr } = await supabaseClient.auth.updateUser({ email });
          if (emailErr) throw emailErr;
        }
        const localUser = getUser();
        localUser.name = name;
        localUser.email = email;
        setUser(localUser);
        updateUserUI(localUser);
        showToast('Perfil atualizado! ✅', 'success');
        closeModal('modal-settings');
      } catch (err) {
        showToast('Erro: ' + err.message, 'error');
      }
    };

    changePassword = async function() {
      const newPw = document.getElementById('settings-new-pw').value;
      if (!newPw || newPw.length < 6) { showToast('Nova senha deve ter pelo menos 6 caracteres', 'error'); return; }
      try {
        const { error } = await supabaseClient.auth.updateUser({ password: newPw });
        if (error) throw error;
        showToast('Senha alterada com sucesso! 🔒', 'success');
        document.getElementById('settings-current-pw').value = '';
        document.getElementById('settings-new-pw').value = '';
      } catch (err) {
        showToast('Erro: ' + err.message, 'error');
      }
    };

    deleteAccount = async function() {
      if (!confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível.')) return;
      showToast('Para excluir a conta, entre em contato com o suporte.', 'info');
    };

    // ==================== PLANS (Supabase) ====================
    upgradePlan = async function(plan) {
      try {
        const { data: { user } } = await supabaseClient.auth.getUser();
        const { error } = await supabaseClient.from('profiles').update({ plan }).eq('id', user.id);
        if (error) throw error;
        const localUser = getUser();
        localUser.plan = plan;
        setUser(localUser);
        updateUserUI(localUser);
        showToast(`Upgrade para ${plan === 'pro' ? 'Pro' : 'Business'} realizado! 🚀`, 'success');
        closeModal('modal-plans');
      } catch (err) {
        showToast('Erro: ' + err.message, 'error');
      }
    };

    // ==================== FORGOT PASSWORD (Supabase) ====================
    handleForgotPassword = async function(e) {
      e.preventDefault();
      const email = document.getElementById('forgot-email').value;
      const btn = document.getElementById('forgot-btn');
      btn.disabled = true;
      btn.textContent = 'Enviando...';
      try {
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin
        });
        if (error) throw error;
        showToast('Email de recuperação enviado! Verifique sua caixa de entrada.', 'success');
      } catch (err) {
        showToast('Erro: ' + err.message, 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Enviar link de recuperação';
      }
    };

    // ==================== WEBHOOK (Supabase) ====================
    saveWebhook = async function() {
      const url = document.getElementById('webhook-url-input').value;
      state.webhookUrl = url;
      if (state.currentFormId) {
        try {
          const { error } = await supabaseClient.from('forms').update({ webhook_url: url }).eq('id', state.currentFormId);
          if (error) throw error;
          showToast('Webhook salvo! 🔗', 'success');
        } catch (err) {
          showToast('Erro: ' + err.message, 'error');
        }
      }
      closeModal('modal-webhook');
    };

    // ==================== NOTIFICATIONS (Supabase) ====================
    loadNotifications = async function() {
      try {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) return;
        const { data: notifications } = await supabaseClient
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);
        state.notifications = notifications || [];
        state.unreadCount = state.notifications.filter(n => !n.read).length;
        updateNotifBadge();
      } catch {}
    };

    markNotifRead = async function(id) {
      try {
        await supabaseClient.from('notifications').update({ read: true }).eq('id', id);
        await loadNotifications();
      } catch {}
    };

    markAllNotifsRead = async function() {
      try {
        const { data: { user } } = await supabaseClient.auth.getUser();
        await supabaseClient.from('notifications').update({ read: true }).eq('user_id', user.id);
        state.unreadCount = 0;
        updateNotifBadge();
        state.notifications.forEach(n => n.read = true);
        renderNotifications();
        showToast('Todas marcadas como lidas', 'success');
      } catch {}
    };

    // ==================== INIT (Supabase) ====================
    (async function init() {
      if (!supabaseClient) return showLogin();
      try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session?.user) {
          try {
            const { data: profiles } = await supabaseClient.from('profiles').select('*').eq('id', session.user.id);
            const profile = profiles && profiles.length > 0 ? profiles[0] : null;
            const user = {
              id: session.user.id,
              email: session.user.email,
              name: profile?.name || '',
              avatar_color: profile?.avatar_color || '#7c3aed',
              plan: profile?.plan || 'free'
            };
            setUser(user);
            enterApp(user);
          } catch {
            showLogin();
          }
        } else {
          showLogin();
        }
      } catch(err) {
        console.error("Init fallback:", err);
        showLogin();
      }
    })();

    // Listen for auth state changes
    if (supabaseClient) {
      supabaseClient.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') {
          clearUser();
          document.getElementById('promo-banner').style.display = 'none';
          document.getElementById('app-container').style.display = 'none';
          showLogin();
        }
      });
    }

    // Poll notifications every 30s
    if (supabaseClient) {
      setInterval(async () => {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session) loadNotifications();
      }, 30000);
    }

  
