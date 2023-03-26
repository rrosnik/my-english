import { EnglishCard } from "../types";


export const sortCards = (cards: Array<EnglishCard>): Array<EnglishCard> => {
    const date = new Date(Date.now());
    const fiveDaysAgo = date.setDate(date.getDate() - 5);
    // get all data within 5 day
    let fiveDayCards = cards.filter((card: EnglishCard) => {
        return card.updated_at > fiveDaysAgo && card.reviewedNumber < 4;
    });
    fiveDayCards = fiveDayCards.sort((a, b) => a.reviewedNumber - b.reviewedNumber);

    // older than 5 days
    let oldCards = cards.filter((card: EnglishCard) => {
        return card.updated_at <= fiveDaysAgo;
    });
    oldCards = oldCards.sort((a, b) => b.updated_at - a.updated_at || a.reviewedNumber - b.reviewedNumber);


    return fiveDayCards.concat(oldCards);
    // return cards.sort((a, b) => a.reviewedNumber - b.reviewedNumber || b.updated_at - a.updated_at);
}