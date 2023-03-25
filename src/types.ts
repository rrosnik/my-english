export type EnglishCard = {
    id?: string,
    created_at: number,
    updated_at: number,
    english: string;
    englishCore: string;
    persian: string,
    persianCore: string,
    reviewedNumber: number,
    cardType?: CardType
};

export enum CardTypeEnum {
    word = "word",
    idiom = "idiom",
    phrase = "phrase",
    cont = "cont",
}

export type CardType = `${CardTypeEnum}`;