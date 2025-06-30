// Learning difficulty levels for spaced repetition algorithm
export enum DifficultyLevel {
    BEGINNER = "beginner",
    ELEMENTARY = "elementary", 
    INTERMEDIATE = "intermediate",
    UPPER_INTERMEDIATE = "upper_intermediate",
    ADVANCED = "advanced",
    PROFICIENT = "proficient"
}

// Card types for different learning content
export enum CardTypeEnum {
    WORD = "word",
    IDIOM = "idiom", 
    PHRASE = "phrase",
    SENTENCE = "sentence",
    GRAMMAR = "grammar",
    PRONUNCIATION = "pronunciation",
    CONVERSATION = "conversation",
    STANCE_MARKER = "stance_marker",
    COLLOCATION = "collocation",
    SLANG = "slang"
}

// Learning status for progress tracking
export enum LearningStatus {
    NEW = "new",
    LEARNING = "learning", 
    REVIEWING = "reviewing",
    MASTERED = "mastered",
    FORGOTTEN = "forgotten"
}

// Confidence level after each review
export enum ConfidenceLevel {
    VERY_HARD = 1,
    HARD = 2,
    GOOD = 3,
    EASY = 4,
    VERY_EASY = 5
}

// Part of speech for words
export enum PartOfSpeech {
    NOUN = "noun",
    VERB = "verb",
    ADJECTIVE = "adjective",
    ADVERB = "adverb",
    PREPOSITION = "preposition",
    CONJUNCTION = "conjunction",
    INTERJECTION = "interjection",
    PRONOUN = "pronoun",
    DETERMINER = "determiner"
}

// Review statistics for spaced repetition
export type ReviewStats = {
    totalReviews: number;
    correctAnswers: number;
    incorrectAnswers: number;
    averageResponseTime: number; // in milliseconds
    lastConfidenceLevel?: ConfidenceLevel;
    streakCount: number; // consecutive correct answers
    lapses: number; // times the card was forgotten
};

// Spaced repetition intervals (in days)
export type SpacedRepetitionData = {
    interval: number; // days until next review
    easeFactor: number; // multiplier for interval calculation (SuperMemo algorithm)
    nextReviewDate: number; // timestamp
    repetitions: number; // number of successful reviews
};

// Audio pronunciation data
export type AudioData = {
    audioUrl?: string;
    phoneticTranscription?: string; // IPA transcription
    accentType?: 'american' | 'british' | 'australian' | 'canadian';
    syllableStress?: string; // marked syllables
};

// Context and usage examples
export type UsageExample = {
    example: string;
    translation: string;
    context?: string; // formal, informal, business, etc.
    audioUrl?: string;
};

// Tags for categorization and filtering
export type CardTags = {
    topics?: string[]; // e.g., ["business", "travel", "food"]
    level?: DifficultyLevel;
    frequency?: 'common' | 'uncommon' | 'rare'; // word frequency
    origin?: string; // etymology or word origin
    register?: 'formal' | 'informal' | 'neutral' | 'academic' | 'colloquial';
};

// Main EnglishCard type with comprehensive learning features
export type EnglishCard = {
    // Basic identification
    id?: string;
    created_at: number;
    updated_at: number;
    
    // Core content
    english: string; // main English content
    englishCore: string; // key word/phrase
    persian: string; // Persian translation/meaning
    persianCore: string; // core Persian meaning
    
    // Card classification
    cardType: CardTypeEnum;
    partOfSpeech?: PartOfSpeech;
    
    // Learning progress
    learningStatus: LearningStatus;
    reviewedNumber: number;
    reviewStats: ReviewStats;
    spacedRepetition: SpacedRepetitionData;
    
    // Content enrichment
    definition?: string; // English definition
    synonyms?: string[]; // English synonyms
    antonyms?: string[]; // English antonyms
    usageExamples: UsageExample[]; // multiple examples with context
    
    // Multimedia
    imageUrl?: string;
    audioData?: AudioData;
    
    // Metadata and organization
    tags: CardTags;
    notes?: string; // personal notes
    mnemonics?: string; // memory aids
    relatedCards?: string[]; // IDs of related cards
    
    // Analytics
    firstLearnedDate?: number; // when first marked as learned
    lastReviewDate?: number; // timestamp of last review
    totalStudyTime?: number; // cumulative time spent (milliseconds)
    
    // PWA offline support
    isOfflineAvailable?: boolean;
    lastSyncDate?: number;
};

// Collection/Set metadata for organizing cards
export type CardCollection = {
    id: string;
    name: string;
    description?: string;
    created_at: number;
    updated_at: number;
    cardCount: number;
    level: DifficultyLevel;
    isPublic: boolean;
    tags: string[];
    authorId: string;
    language: 'english' | 'persian'; // source language
    targetLanguage: 'persian' | 'english'; // learning target
};

// Study session data for tracking learning progress
export type StudySession = {
    id: string;
    userId: string;
    collectionId: string;
    startTime: number;
    endTime?: number;
    cardsStudied: number;
    correctAnswers: number;
    incorrectAnswers: number;
    averageResponseTime: number;
    sessionType: 'review' | 'learn' | 'test' | 'practice';
    completed: boolean;
};

// User progress tracking
export type UserProgress = {
    userId: string;
    totalCardsLearned: number;
    totalStudyTime: number; // in milliseconds
    dailyGoal: number; // cards per day
    currentStreak: number; // consecutive days studied
    longestStreak: number;
    level: DifficultyLevel;
    xpPoints: number;
    achievements: string[];
    lastStudyDate: number;
};

// Achievement system
export type Achievement = {
    id: string;
    name: string;
    description: string;
    icon: string;
    xpReward: number;
    condition: string; // JSON string describing achievement condition
    isUnlocked: boolean;
    unlockedDate?: number;
};

// Study mode configurations
export type StudyMode = {
    name: string;
    showPersian: boolean;
    showEnglish: boolean;
    showImages: boolean;
    playAudio: boolean;
    requireTyping: boolean;
    showHints: boolean;
    timeLimit?: number; // seconds
    cardOrder: 'random' | 'alphabetical' | 'difficulty' | 'spaced_repetition';
};

// Card filtering options
export type CardFilter = {
    cardTypes?: CardTypeEnum[];
    learningStatus?: LearningStatus[];
    difficultyLevels?: DifficultyLevel[];
    tags?: string[];
    partOfSpeech?: PartOfSpeech[];
    dateRange?: {
        from: number;
        to: number;
    };
    reviewedCount?: {
        min: number;
        max: number;
    };
};

// Statistics for analytics dashboard
export type LearningStatistics = {
    totalCards: number;
    cardsByStatus: Record<LearningStatus, number>;
    cardsByType: Record<CardTypeEnum, number>;
    cardsByDifficulty: Record<DifficultyLevel, number>;
    averageAccuracy: number;
    studyTimeThisWeek: number;
    studyTimeThisMonth: number;
    reviewsDue: number;
    newCardsToday: number;
    cardsReviewedToday: number;
};

// Notification settings for spaced repetition
export type NotificationSettings = {
    enableReminders: boolean;
    reminderTime: string; // HH:MM format
    reminderDays: number[]; // 0-6 (Sunday-Saturday)
    enableStreakReminders: boolean;
    enableAchievementNotifications: boolean;
};

// Export/Import data structure
export type ExportData = {
    version: string;
    exportDate: number;
    collections: CardCollection[];
    cards: EnglishCard[];
    userProgress: UserProgress;
    studySessions: StudySession[];
};

// Card creation/update form data
export type CardFormData = Omit<EnglishCard, 
    'id' | 'created_at' | 'updated_at' | 'reviewStats' | 'spacedRepetition' | 'lastReviewDate' | 'firstLearnedDate'
> & {
    id?: string;
};

// Helper function types for card operations
export type CardOperations = {
    createCard: (data: CardFormData) => Promise<EnglishCard>;
    updateCard: (id: string, data: Partial<CardFormData>) => Promise<EnglishCard>;
    deleteCard: (id: string) => Promise<void>;
    reviewCard: (id: string, confidence: ConfidenceLevel, responseTime: number) => Promise<EnglishCard>;
    getCardsDueForReview: (collectionId?: string) => Promise<EnglishCard[]>;
    searchCards: (query: string, filter?: CardFilter) => Promise<EnglishCard[]>;
};

// Spaced repetition algorithm configuration
export type SpacedRepetitionConfig = {
    initialInterval: number; // days
    minEaseFactor: number;
    maxEaseFactor: number;
    easeFactorChange: {
        veryHard: number;
        hard: number;
        good: number;
        easy: number;
        veryEasy: number;
    };
    intervalMultipliers: {
        veryHard: number;
        hard: number;
        good: number;
        easy: number;
        veryEasy: number;
    };
    lapseThreshold: number; // days without review before considering "forgotten"
};

export type CardType = `${CardTypeEnum}`;