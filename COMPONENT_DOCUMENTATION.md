# English Learning App - Component Documentation

This document provides an overview of all the components and pages created for the English learning PWA application.

## 📁 Components Overview

### 🔧 Core Components

#### 1. **Speaker Component** (`src/components/molecules/Speaker`)

**Purpose**: Text-to-speech functionality with visual feedback

- **Props**: `text: string`, `lang: string`
- **Features**:
  - Multi-language support (English/Persian)
  - Visual play/stop indicators
  - Error handling for unsupported browsers
  - Customizable speech rate and settings

#### 2. **ReviewStatsPanel** (`src/components/organisms/ReviewStatsPanel`)

**Purpose**: Real-time session statistics display

- **Features**:
  - Accuracy tracking with visual progress bars
  - Time tracking (total and average)
  - Correct/incorrect answer counts
  - Responsive design with icons

#### 3. **CardActionsModal** (`src/components/organisms/CardActionsModal`)

**Purpose**: Comprehensive card details and actions

- **Features**:
  - Tabbed interface (Details, Examples, Statistics, Audio)
  - Complete card information display
  - Edit/delete actions
  - Audio pronunciation with multiple options
  - Usage examples with context
  - Learning statistics and progress

#### 4. **EnhancedAddEnglishCardForm** (`src/components/organisms/forms/EnhancedAddEnglishCardForm`)

**Purpose**: Advanced card creation/editing with comprehensive fields

- **Features**:
  - Multi-tab interface (Basic Info, Additional Info, Examples, Synonyms & Antonyms)
  - Real-time validation
  - Dynamic example management
  - Synonym/antonym addition
  - Rich metadata support
  - Audio integration

---

### 📄 Pages

#### 1. **TabularReviewPage** (`src/pages/TabularReviewPage`)

**Purpose**: Table-based review interface for efficient bulk review

- **Features**:
  - Sortable table with card information
  - Hide/reveal functionality
  - Confidence level rating (1-5 scale)
  - Filter by card type
  - Session statistics tracking
  - Responsive design for mobile

#### 2. **CardByCardReviewPage** (`src/pages/CardByCardReviewPage`)

**Purpose**: Focus-mode review with spaced repetition

- **Features**:
  - Single card focus with beautiful gradients
  - Confidence-based progression
  - Response time tracking
  - Progress indicators
  - Navigation controls (previous/next/random)
  - Session completion summary
  - Auto-advance functionality

#### 3. **Enhanced ReviewPage** (`src/pages/ReviewPage`)

**Purpose**: Review mode selector and traditional grid view

- **Features**:
  - Review mode selection cards
  - Navigation to specialized review modes
  - Traditional grid view with filtering
  - Card type filtering
  - Quick edit functionality

---

## 🎯 Review Modes Comparison

| Feature | Grid View | Table View | Card-by-Card |
|---------|-----------|------------|--------------|
| **Best for** | Quick overview | Bulk review | Deep learning |
| **Focus Level** | Medium | Low | High |
| **Efficiency** | Medium | High | Medium |
| **Learning Depth** | Medium | Low | High |
| **Mobile Friendly** | Good | Fair | Excellent |
| **Statistics** | Basic | Advanced | Comprehensive |

---

## 🔧 Technical Features

### Type System Enhancements

- **Comprehensive EnglishCard type** with 20+ fields
- **Spaced repetition data structure**
- **Learning progress tracking**
- **Audio and multimedia support**
- **Rich metadata and tagging**

### Learning Algorithm Features

- **Confidence-based intervals** (SuperMemo-inspired)
- **Response time tracking**
- **Streak and lapse counting**
- **Difficulty level assessment**
- **Usage context tracking**

### PWA Features

- **Offline capability indicators**
- **Sync status tracking**
- **Touch-friendly interfaces**
- **Responsive design system**
- **Performance optimizations**

---

## 🎨 Design System

### Color Scheme

```scss
:root {
  --clr-word: #ff758f;      // Word cards
  --clr-phrase: #eb9486;    // Phrase cards  
  --clr-cont: #e8b16a;      // Context cards
  --clr-idiom: #ff9500;     // Idiom cards
  --clr-SM: #e8b16a;        // Stance markers
}
```

### Component Patterns

- **Gradient backgrounds** for interactive elements
- **Card-based layouts** with shadows and rounded corners
- **Icon integration** with consistent sizing
- **Responsive typography** with proper scaling
- **Accessibility-first** design approach

---

## 🚀 Usage Examples

### Basic Card Creation

```typescript
const newCard: CardFormData = {
  english: "I'm over the moon about my promotion",
  englishCore: "over the moon",
  persian: "از ترفیع‌ام خیلی خوشحالم",
  persianCore: "خیلی خوشحال",
  cardType: CardTypeEnum.IDIOM,
  partOfSpeech: PartOfSpeech.ADJECTIVE,
  usageExamples: [{
    example: "She was over the moon when she got the job",
    translation: "وقتی شغل را گرفت خیلی خوشحال بود"
  }]
};
```

### Review Session Setup

```typescript
const sessionConfig: StudyMode = {
  name: "Intensive Review",
  showPersian: true,
  showEnglish: false,
  playAudio: true,
  requireTyping: false,
  timeLimit: 30,
  cardOrder: 'spaced_repetition'
};
```

---

## 📱 Responsive Breakpoints

- **Mobile**: < 576px (Single column, touch-optimized)
- **Tablet**: 576px - 768px (Adapted layouts)
- **Desktop**: > 768px (Full features, multi-column)

---

## 🔮 Future Enhancements

### Planned Features

1. **Voice Recognition** - Speaking practice with pronunciation scoring
2. **Collaborative Learning** - Shared card sets and progress
3. **Gamification** - Achievements, leaderboards, streaks
4. **AI Integration** - Smart card generation and difficulty adjustment
5. **Analytics Dashboard** - Detailed progress analytics
6. **Export/Import** - Backup and sharing capabilities

### Technical Improvements

1. **Performance Optimization** - Virtual scrolling for large datasets
2. **Offline-First Architecture** - Better PWA capabilities
3. **Real-time Sync** - Multi-device synchronization
4. **Advanced Search** - Full-text search with filters
5. **Accessibility** - Screen reader support and keyboard navigation

---

## 🛠️ Development Notes

### Component Architecture

- **Atomic Design** principles with molecules/organisms
- **TypeScript-first** approach with comprehensive typing
- **Modular SCSS** with component-specific stylesheets
- **React Hooks** for state management
- **Error Boundaries** for graceful error handling

### Performance Considerations

- **Lazy loading** for large card sets
- **Memoization** for expensive calculations
- **Optimistic updates** for better UX
- **Efficient re-rendering** with React.memo
- **Bundle splitting** for faster initial loads

---

*This documentation serves as both a guide for developers and a showcase of the comprehensive English learning system we've built.*
