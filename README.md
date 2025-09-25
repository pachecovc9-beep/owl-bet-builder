# 🦉 OwlClub - Gerador de Boletins de Apostas Desportivas

Uma aplicação web moderna e responsiva para criar boletins de apostas profissionais com design premium, desenvolvida em React com Tailwind CSS e integração com TheSportsDB API.

![OwlClub Banner](src/assets/hero-bg.png)

## 🚀 Funcionalidades

### ✨ Tipos de Boletim Disponíveis

- **Aposta Simples**: Um único jogo para iniciantes
- **Aposta Múltipla**: Combina até 10 jogos para maiores ganhos
- **Live Simples**: Apostas em tempo real com badge especial
- **Live Múltipla**: Múltiplas apostas ao vivo para especialistas

### 🎨 Design Premium

- **Interface Escura Elegante**: Cores #1A1A1A com acentos dourados #FFD700
- **Mobile-First**: Design responsivo otimizado para todos os dispositivos
- **Animações Suaves**: Transições e efeitos premium
- **Gradientes Premium**: Backgrounds elegantes e efeitos visuais

### ⚽ Integração com Dados Reais

- **TheSportsDB API**: Dados atualizados de equipas e competições
- **Ligas Suportadas**: Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Champions League, etc.
- **Rate Limiting**: Sistema inteligente que respeita limites da API
- **Fallback Local**: Dados de equipas guardados localmente como backup

### 💾 Funcionalidades Avançadas

- **Histórico Local**: Boletins guardados no localStorage do browser
- **Geração de Imagens**: Export para PNG 1080x1080px (ideal para Instagram/Facebook)
- **Wizard Intuitivo**: Processo passo-a-passo para criar boletins
- **Validação Inteligente**: Verificação de dados e alertas para odds baixas

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS com design system personalizado
- **UI Components**: Shadcn UI customizado
- **Build Tool**: Vite para desenvolvimento rápido
- **API Integration**: TheSportsDB (chave gratuita)
- **Image Generation**: html2canvas para export de boletins
- **State Management**: React Hooks + localStorage
- **Icons**: Lucide React
- **Notifications**: Sonner para toasts elegantes

## 🚦 Como Usar

### 1️⃣ Instalação e Configuração

```bash
# Clonar o repositório
git clone <URL_DO_REPOSITORIO>

# Navegar para o diretório
cd owl-bet-builder

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

### 2️⃣ Criando um Boletim

1. **Escolher Tipo**: Seleciona um dos 4 tipos de boletim na página inicial
2. **Definir Jogos**: Usa o slider para escolher quantos jogos (1-10 para múltiplas)
3. **Adicionar Detalhes**: Preenche equipas, mercados e odds para cada jogo
4. **Revisão**: Confirma todos os dados e define stake (se múltipla)
5. **Gerar**: Cria o boletim e guarda no histórico local

## 🎯 Ligas Suportadas

| Liga             | ID   | País       | Endpoint                 |
| ---------------- | ---- | ---------- | ------------------------ |
| Premier League   | 4328 | Inglaterra | `English Premier League` |
| La Liga          | 4335 | Espanha    | `Spanish La Liga`        |
| Serie A          | 4332 | Itália     | `Italian Serie A`        |
| Bundesliga       | 4331 | Alemanha   | `German Bundesliga`      |
| Ligue 1          | 4334 | França     | `French Ligue 1`         |
| Champions League | 4480 | Europa     | `UEFA Champions League`  |
| Europa League    | 4481 | Europa     | `UEFA Europa League`     |

## 📱 Design Responsivo

### Breakpoints Tailwind

- `sm: 640px` - Tablets pequenos
- `md: 768px` - Tablets
- `lg: 1024px` - Desktops pequenos
- `xl: 1280px` - Desktops grandes
- `2xl: 1400px` - Monitores ultra-wide

## 🚀 Próximas Funcionalidades

### Versão 2.0 (Roadmap)

- [x] **Geração de Imagens**: Export PNG com html2canvas
- [ ] **Templates**: Múltiplos designs de boletim
- [ ] **Histórico Avançado**: Filtros, pesquisa, estatísticas
- [ ] **Partilha Social**: Direct share para Telegram/Instagram
- [ ] **Validações Avançadas**: Zod schemas para forms
- [ ] **PWA**: Instalação como app móvel

## ⚠️ Disclaimer Obrigatório

**Importante**: Esta aplicação é apenas para fins educativos e de entretenimento.

- +18 anos, apostas envolvem risco
- Nunca apostes mais do que podes perder
- Procura ajuda se tens problemas com jogos
- Telegram: t.me/owlclubfree

## 📄 Licença

Este projeto está sob licença MIT.

---

Desenvolvido com ❤️ pela equipa OwlClub
